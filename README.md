# ✦ KIETFOLIO — FULL-STACK ARCHITECTURE MATRIX ✦
> **Production-grade Cybernetic Portfolio & Systems Showcase for Mai Anh Kiệt**  
> *Software Engineering @ FPT University (HCMC) • Operations Dispatch Lead @ SPX Express*

---

## 🏗 Fullstack Monorepo Architecture

Kietfolio được cấu trúc theo mô hình **Fullstack Domain Monorepo** đạt tiêu chuẩn công nghiệp, phân tách độc lập và chuyên biệt hóa theo từng phân tầng:

```text
Kietfolio/
├── frontend/                   # React 19 + TypeScript + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── animations/         # GSAP timelines & text scramble choreography
│   │   ├── components/         # Shared UI, layout & atomic primitives
│   │   ├── config/             # Site metadata & telemetry settings
│   │   ├── context/            # Language, Auth & Whale Cinematic contexts
│   │   ├── data/               # Verified profile facts & translations
│   │   ├── features/           # Domain-Driven self-contained feature slices:
│   │   │   ├── about/          # Profile story & telemetry
│   │   │   ├── admin/          # Exclusive Admin Command Center
│   │   │   ├── auth/           # Google & Email authentication gateway
│   │   │   ├── contact/        # Interactive contact form & anti-spam
│   │   │   ├── experience/     # SPX Express logistics operational lead
│   │   │   ├── guestbook/      # Live guestbook signing & moderation
│   │   │   ├── hero/           # Cyber core 3D & interactive terminal
│   │   │   ├── ocean-whale/    # 3D Ocean waves & flying cyber whale
│   │   │   ├── principles/     # Core software engineering paradigms
│   │   │   ├── projects/       # Production case studies
│   │   │   └── skills/         # Technical & operational competencies
│   │   ├── hooks/              # Global & domain custom hooks
│   │   ├── services/           # API integration clients & Firebase SDK
│   │   ├── three/              # Three.js WebGL scenes & GPU performance hooks
│   │   ├── types/              # Type definitions & API contracts
│   │   ├── utils/              # Class merging (cn) & validation utilities
│   │   ├── App.tsx             # Root application orchestrator
│   │   └── main.tsx            # Entry point wrapped with Cyber ErrorBoundary
│   ├── Dockerfile              # Standalone production Dockerfile (Node -> Nginx)
│   ├── nginx.conf              # SPA routing & API reverse proxy configuration
│   ├── package.json            # Frontend dependencies & build scripts
│   └── vite.config.ts          # Rollup chunking & proxy configuration
│
├── backend/                    # Node.js + Express + TypeScript API Server
│   ├── src/
│   │   ├── config/             # Environment variables & constants
│   │   ├── controllers/        # Request handling (Auth, Guestbook, Contact, Projects)
│   │   ├── db/                 # PostgreSQL connection pool & health checks
│   │   ├── middlewares/        # JWT auth, rate limiting, Zod schema validation
│   │   ├── routes/             # RESTful API routing (/api/auth, /api/guestbook, ...)
│   │   ├── services/           # Business logic & persistent storage fallbacks
│   │   ├── types/              # Server-side TypeScript interfaces & payloads
│   │   ├── app.ts              # Express application configuration
│   │   └── server.ts           # Server bootstrap & graceful shutdown handler
│   ├── Dockerfile              # Production multi-stage Dockerfile
│   └── package.json            # Backend dependencies & scripts
│
├── database/                   # PostgreSQL 16 + Migrations + Seeds
│   ├── migrations/             # Sequential DDL migration scripts
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_guestbook_table.sql
│   │   ├── 003_create_contact_messages_table.sql
│   │   └── 004_create_projects_table.sql
│   ├── seeds/                  # Initial baseline & verified mock data
│   │   └── 001_seed_initial_data.sql
│   ├── init.sql                # Automated container entrypoint bootstrapper
│   └── README.md               # Database migration & backup/restore guide
│
├── infra/                      # Docker + Deployment Configuration
│   ├── docker/
│   │   ├── nginx/default.conf  # Production Nginx reverse proxy with gzip & caching
│   │   ├── frontend.Dockerfile # Multi-stage frontend image build
│   │   └── backend.Dockerfile  # Multi-stage backend image build
│   └── scripts/
│       ├── healthcheck.sh      # Service liveness testing script
│       └── init-db.sh          # Database readiness check script
│
├── docker-compose.yml          # One-command fullstack service orchestration
├── .gitignore                  # Fullstack monorepo exclusion rules
└── package.json                # Root monorepo workspace orchestrator
```

---

## ⚡ Quickstart: Khởi chạy bằng Docker Compose

Khởi động toàn bộ cụm dịch vụ (**Database + Backend + Frontend + Reverse Proxy**) chỉ với **1 câu lệnh duy nhất**:

```bash
docker compose up -d --build
```

### Các dịch vụ được khởi tạo tự động:
| Dịch vụ | Công nghệ | Cổng | Mô tả |
| :--- | :--- | :--- | :--- |
| **`frontend`** | React 19 + Nginx | `http://localhost:80` | Giao diện 3D Cybernetic Portfolio |
| **`backend`** | Express + TypeScript | `http://localhost:5000` | REST API Server |
| **`db`** | PostgreSQL 16 Alpine | `localhost:5432` | Cơ sở dữ liệu quan hệ (tự động chạy migration & seed) |

Kiểm tra trạng thái liveness:
```bash
docker compose ps
docker compose logs -f
```

---

## 💻 Phát triển cục bộ (Local Development)

Nếu bạn muốn chạy từng dịch vụ trực tiếp trên máy không dùng Docker:

### 1. Cài đặt Dependencies
```bash
# Cài đặt tại root monorepo
npm install

# Hoặc cài đặt độc lập cho từng module
cd frontend && npm install
cd ../backend && npm install
```

### 2. Khởi chạy Frontend
```bash
npm run dev:frontend
# Trình duyệt: http://localhost:5173
```

### 3. Khởi chạy Backend
```bash
npm run dev:backend
# API Server: http://localhost:5000
# Health Check: http://localhost:5000/api/health
```

### 4. Kiểm thử & Đảm bảo chất lượng (QA)
```bash
# Chạy toàn bộ 26 unit & integration tests
npm run test:frontend

# Kiểm tra cú pháp và code quality siêu tốc với oxlint (0 errors)
npm run lint:frontend

# Build sản phẩm
npm run build
```

---

## 📡 Danh mục API Endpoints

### 1. System Health & Telemetry
- `GET /api/health` — Trả về trạng thái hoạt động, thông số bộ nhớ RAM, uptime và tình trạng kết nối PostgreSQL.

### 2. Authentication & Admin Security
- `POST /api/auth/register` — Đăng ký tài khoản với email & password (mã hóa bcrypt).
- `POST /api/auth/login` — Đăng nhập và nhận JWT token.
- `POST /api/auth/google` — Xác thực tài khoản Google.
- `GET /api/auth/me` — Lấy thông tin user hiện tại (yêu cầu Bearer Token).
> **Admin Clearance:** Tài khoản quản trị viên duy nhất được cấp quyền điều hành là `kiet.maianh@gmail.com`.

### 3. Guestbook (Lưu bút cộng đồng)
- `GET /api/guestbook` — Lấy danh sách lời nhắn được duyệt (sắp xếp theo pinned và thời gian).
- `POST /api/guestbook` — Gửi lời nhắn mới (hỗ trợ xác thực người dùng).
- `DELETE /api/guestbook/:id` — Xóa lời nhắn vi phạm (chỉ dành cho Quản trị viên).

### 4. Contact & Inquiries
- `POST /api/contact` — Gửi tin nhắn liên hệ (tích hợp bẫy chống bot Honeypot và rate limiter).
- `GET /api/contact` — Xem hòm thư liên hệ (chỉ dành cho Quản trị viên).
- `PATCH /api/contact/:id/read` — Đánh dấu tin nhắn đã đọc.

### 5. Projects
- `GET /api/projects` — Truy xuất danh mục dự án kỹ thuật song ngữ.
- `GET /api/projects/:id` — Xem chi tiết kiến trúc và quyết định kỹ thuật của dự án.

---

## 🛡 Tính năng Nổi bật & Tối ưu hóa

- **Zero-Flicker Whale Cinematic**: Trải nghiệm hoạt cảnh cá voi 3D bay vào trung tâm màn hình, tự động ẩn nội dung trang web để tập trung thị giác và phục hồi mượt mà sau khi kết thúc.
- **Hardware Acceleration Safeguards**: Tự động giảm tải GPU khi rời tab (`visibilitychange`), giới hạn `devicePixelRatio` ở mức 1.5 - 1.75 và sử dụng `IntersectionObserver` để tắt vòng lặp render khi cuộn ra ngoài khung nhìn.
- **Cyberpunk Error Boundary**: Bọc toàn bộ ứng dụng bằng cơ chế bắt lỗi trực quan, ngăn chặn sập trắng màn hình và cung cấp nút reboot hệ thống tức thì.
- **High-Availability Fallbacks**: Backend hoạt động ổn định ngay cả khi PostgreSQL đang khởi động nhờ hệ thống bộ nhớ tạm thời tự phục hồi.

---

## 👨‍💻 Thông tin Tác giả

- **Tên:** Mai Anh Kiệt
- **Trường:** Đại học FPT TP.HCM (Kỹ thuật Phần mềm)
- **Kinh nghiệm:** 2 năm Trưởng Ca Điều Phối & Senior Analyst tại Hub SPX Express Thủ Dầu Một (Mã trạm: 63BDG02)
- **Email:** `kiet.maianh@gmail.com`
- **GitHub:** [https://github.com/RonahDev/Kietfolio](https://github.com/RonahDev/Kietfolio)
