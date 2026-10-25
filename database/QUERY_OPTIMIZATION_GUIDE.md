# PostgreSQL Performance & Query Optimization Engineering Guide

Tài liệu hướng dẫn chuyên sâu về kỹ thuật tối ưu hóa tầng Cơ sở dữ liệu PostgreSQL 16 dành cho hệ thống Kietfolio.

---

## 1. Phân Tích Execution Plan với `EXPLAIN (ANALYZE, BUFFERS)`

Khi một truy vấn chạy chậm, không nên đoán mò mà cần phân tích cây thực thi chi tiết của PostgreSQL Planner:

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS, TIMING)
SELECT id, name, message, created_at
FROM guestbook_entries
WHERE is_approved = true
ORDER BY is_pinned DESC, created_at DESC
LIMIT 10;
```

### Các chỉ số then chốt cần quan sát:
1. **Node Type**:
   - `Seq Scan`: Quét tuần tự toàn bộ bảng từ đầu đến cuối (O(N)). Tốn I/O nếu bảng lớn.
   - `Index Scan`: Đọc cây B-Tree index và lấy trực tiếp row từ Heap block.
   - `Index Only Scan`: Rất nhanh vì toàn bộ cột trong `SELECT` và `WHERE` đều nằm ngay trong Index (Visibility Map), không cần chạm vào Table Heap.
   - `Bitmap Heap Scan`: Dùng khi có nhiều Index hoặc điều kiện `OR`/`AND`, tạo bitmap các trang đĩa trước khi đọc.
2. **Buffers**:
   - `shared hit`: Dữ liệu có sẵn trong RAM Buffer Pool (0ms disk I/O).
   - `shared read`: Dữ liệu phải đọc trực tiếp từ ổ cứng SSD (I/O penalty).
   - `shared dirtied/written`: Khối lượng đĩa phải ghi.
3. **Planning Time vs Execution Time**: Thời gian lập kế hoạch thực thi so với thời gian chạy thực tế của bộ máy PostgreSQL.

---

## 2. Chi Phí Đánh Đổi của Index (Trade-off: Read vs Write & Maintenance)

> [!WARNING]
> **Index KHÔNG MIỄN PHÍ**. Index giúp tăng tốc các truy vấn `SELECT` nhưng tạo gánh nặng trực tiếp lên các thao tác `INSERT`, `UPDATE`, `DELETE` và bảo trì:
> 1. Mỗi lần `INSERT`, database phải cập nhật cây B-Tree của **tất cả** các Index trên bảng.
> 2. Mỗi lần `UPDATE` các cột có Index, PostgreSQL phải ghi thêm tuple mới và trỏ lại Index entries, làm phình to bảng (Table Bloat) và tăng tần suất chạy `VACUUM`.
> 3. Tăng dung lượng RAM yêu cầu để cache các index (`shared_buffers`).

### Giải pháp tối ưu: Partial & Composite Indexes thực tế
Thay vì tạo index tràn lan trên từng cột, hãy dùng **Partial Index** chỉ lọc các bản ghi cần hiển thị công khai:

```sql
-- Migration 006: Chỉ index các bản ghi đã duyệt (is_approved = true)
CREATE INDEX IF NOT EXISTS idx_guestbook_approved_pinned_created 
ON guestbook_entries (is_pinned DESC, created_at DESC) 
WHERE is_approved = true;
```
*Lợi ích:* Kích thước Index giảm 70-90%, các thao tác thêm sửa bản ghi nháp không làm cập nhật index này.

---

## 3. Tránh Lỗi N+1 Query (Batch Queries & JOIN)

### ❌ Lỗi N+1 Query:
```ts
// 1 query lấy danh sách 20 user
const users = await db.query('SELECT id, name FROM users LIMIT 20');
// 20 query riêng lẻ để lấy tin nhắn của từng user -> Tổng cộng 21 queries!
for (const user of users) {
  user.messages = await db.query('SELECT * FROM guestbook_entries WHERE user_uid = $1', [user.id]);
}
```

### ✅ Giải pháp Batching bằng `ANY($1)` hoặc `JOIN`:
```sql
-- Cách 1: LEFT JOIN hoặc JSON Aggregation trong 1 query duy nhất:
SELECT 
    u.id, 
    u.display_name, 
    COALESCE(json_agg(g.*) FILTER (WHERE g.id IS NOT NULL), '[]') AS entries
FROM users u
LEFT JOIN guestbook_entries g ON u.id = g.user_uid
GROUP BY u.id, u.display_name;

-- Cách 2: Batching với toán tử ANY:
SELECT id, user_uid, message 
FROM guestbook_entries 
WHERE user_uid = ANY($1::varchar[]);
```

---

## 4. Keyset Pagination (Cursor-based) vs Offset Pagination

### ❌ Vấn đề của `OFFSET`:
```sql
SELECT * FROM guestbook_entries ORDER BY created_at DESC LIMIT 10 OFFSET 50000;
```
PostgreSQL buộc phải duyệt và phân tích cú pháp 50,000 dòng trước đó rồi vứt bỏ, làm thời gian truy vấn tăng tuyến tính theo số trang (O(N)).

### ✅ Giải pháp Keyset Pagination (O(1)):
Sử dụng giá trị của dòng cuối cùng đã xem (`cursor`) làm mốc lọc:
```sql
SELECT id, name, message, created_at
FROM guestbook_entries
WHERE created_at < $1 -- Cursor: timestamp của bản ghi cuối trang trước
ORDER BY created_at DESC
LIMIT 10;
```
Truy vấn này nhảy thẳng tới vị trí cần đọc trên B-Tree Index trong 0.05ms bất kể trang thứ 1 hay trang thứ 10,000.

---

## 5. Khóa Lạc Quan (Optimistic Locking) Chống Race Condition

Để tránh tranh chấp ghi (Lock contention) khi nhiều transaction cập nhật cùng một bản ghi (ví dụ: cập nhật trạng thái đơn thanh toán donate), sử dụng cột `version`:

```sql
-- Giả định bảng payments có cột version INT DEFAULT 1:
UPDATE payments
SET status = 'success', 
    version = version + 1, 
    updated_at = NOW()
WHERE id = $1 AND version = $current_version;
```
Nếu `rowCount === 0`, có nghĩa là một transaction khác vừa sửa đổi dữ liệu trước đó. Ứng dụng sẽ ném lỗi Conflict và yêu cầu thử lại thay vì ghi đè dữ liệu cũ.

---

## 6. Bảo Vệ Toàn Vẹn với ACID Transactions

Mọi thao tác ghi dữ liệu liên quan đến nhiều bảng hoặc bước logic tài chính phải được bọc trong `withTransaction`:

```ts
import { withTransaction } from '../resilience/transaction'

await withTransaction(async (client) => {
  // Bước 1: Khởi tạo thanh toán
  await client.query(
    'INSERT INTO payments (id, order_id, amount, status) VALUES ($1, $2, $3, $4)',
    [id, orderId, amount, 'pending']
  )
  
  // Bước 2: Ghi nhận lịch sử audit trail
  await client.query(
    'INSERT INTO audit_logs (id, entity_type, action) VALUES ($1, $2, $3)',
    [logId, 'payment', 'create_order']
  )
})
```
Nếu bước 2 xảy ra sự cố, toàn bộ bước 1 sẽ tự động `ROLLBACK` an toàn, không để lại dữ liệu "mồ côi" trong database.

