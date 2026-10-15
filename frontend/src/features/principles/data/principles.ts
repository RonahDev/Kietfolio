import type { EngineeringPrinciple } from '@/types'

export const engineeringPrinciples: EngineeringPrinciple[] = [
  {
    id: 'type-safety',
    index: '01',
    title: {
      en: 'Type Safety & Explicit Contracts',
      vi: 'An Toàn Kiểu Dữ Liệu & Ràng Buộc Rõ Ràng',
    },
    tag: 'TypeScript / Static Typing',
    description: {
      en: 'Eliminate runtime surprises by designing strict type contracts at system boundaries. Shared interfaces between frontend queries and backend models ensure predictability.',
      vi: 'Loại bỏ lỗi tiềm ẩn tại runtime bằng cách thiết lập kiểu dữ liệu chặt chẽ ở ranh giới hệ thống. Interface đồng bộ giữa frontend và backend đảm bảo tính tin cậy cao.',
    },
    practicalApplication: {
      en: 'Strict TypeScript compiler settings (`strict: true`, `noImplicitAny`), typed API requests and responses, and exhaustive type narrowing.',
      vi: 'Kích hoạt cờ strict trong TypeScript (`strict: true`), định kiểu cho toàn bộ request/response API và kiểm tra kiểu rẽ nhánh chặt chẽ.',
    },
  },
  {
    id: 'separation-of-concerns',
    index: '02',
    title: {
      en: 'Clear Separation of Concerns',
      vi: 'Tách Biệt Trách Nhiệm Rõ Ràng',
    },
    tag: 'Architecture / Clean Code',
    description: {
      en: 'UI components should render state; data hooks should fetch; business services should process logic. Decoupling layers keeps refactoring straightforward.',
      vi: 'Giao diện chỉ hiển thị trạng thái; custom hook đảm nhiệm truy xuất dữ liệu; service xử lý nghiệp vụ. Tách bạch các tầng giúp mã nguồn dễ mở rộng và bảo trì.',
    },
    practicalApplication: {
      en: 'Decoupled presentation from domain logic, modular directory boundaries, and isolated utility helpers.',
      vi: 'Tách rời presentation khỏi domain logic, cấu trúc thư mục module hóa và đóng gói các hàm tiện ích riêng biệt.',
    },
  },
  {
    id: 'defensive-validation',
    index: '03',
    title: {
      en: 'Defensive Input Validation',
      vi: 'Xác Thực Đầu Vào & Phòng Thủ Chủ Động',
    },
    tag: 'Security / Data Integrity',
    description: {
      en: 'Never trust external input. Validate at the client for immediate feedback, and always validate authoritatively on the server before database persistence.',
      vi: 'Không bao giờ tin tưởng dữ liệu ngoại vi. Kiểm tra ngay tại giao diện người dùng để phản hồi tức thì, và bắt buộc xác thực ở máy chủ trước khi lưu vào CSDL.',
    },
    practicalApplication: {
      en: 'Schema-based runtime validation on form inputs and API payloads, sanitized text parameters, and prevention of injection vulnerabilities.',
      vi: 'Xác thực runtime trên form và payload API qua schema, lọc sạch tham số đầu vào và ngăn chặn lỗ hổng injection.',
    },
  },
  {
    id: 'centralized-error-handling',
    index: '04',
    title: {
      en: 'Controlled Error Boundaries',
      vi: 'Xử Lý Ngoại Lệ & Điểm Ngăn Lỗi',
    },
    tag: 'Reliability / Fault Tolerance',
    description: {
      en: 'Fail gracefully without leaving the user with a broken blank screen. Informative fallback states and structured logs make troubleshooting fast.',
      vi: 'Hệ thống cần xử lý lỗi nhẹ nhàng thay vì sập trắng màn hình. Giao diện thay thế rõ ràng cùng nhật ký lỗi có cấu trúc giúp định vị vấn đề nhanh chóng.',
    },
    practicalApplication: {
      en: 'React Error Boundaries, standardized HTTP error status envelopes, and clear contextual feedback during network interruptions.',
      vi: 'Bọc React Error Boundary, chuẩn hóa mã phản hồi HTTP và hiển thị thông báo trực quan khi kết nối mạng gián đoạn.',
    },
  },
  {
    id: 'reproducible-containers',
    index: '05',
    title: {
      en: 'Containerized Environments',
      vi: 'Môi Trường Nhất Quán Với Docker',
    },
    tag: 'DevOps / Portability',
    description: {
      en: '"It works on my machine" is unacceptable in production engineering. Docker standardizes runtimes, databases, and dependencies for reliable collaboration.',
      vi: '"Chạy được trên máy tôi" không phải là tiêu chuẩn kỹ thuật. Docker giúp chuẩn hóa runtime, cơ sở dữ liệu và dependency để đảm bảo tính nhất quán.',
    },
    practicalApplication: {
      en: 'Docker Compose orchestration for multi-container local stacks (Node.js API + PostgreSQL database).',
      vi: 'Sử dụng Docker Compose để đồng bộ môi trường phát triển nhiều container (Node.js API + PostgreSQL).',
    },
  },
  {
    id: 'performance-accessibility',
    index: '06',
    title: {
      en: 'Performance & Inclusive UX',
      vi: 'Tối Ưu Hiệu Năng & Khả Năng Tiếp Cận',
    },
    tag: 'A11y / Web Vitals',
    description: {
      en: 'Visual aesthetics must never compromise usability. High contrast, keyboard focus indicators, screen reader semantics, and reduced-motion support are foundational.',
      vi: 'Tính thẩm mỹ không được làm tổn hại trải nghiệm sử dụng. Độ tương phản cao, điều hướng bàn phím, thẻ ngữ nghĩa ARIA và tôn trọng chế độ giảm chuyển động là yêu cầu bắt buộc.',
    },
    practicalApplication: {
      en: 'Lazy-loading non-critical WebGL canvases, honoring prefers-reduced-motion, and adhering to WCAG AA color standards.',
      vi: 'Lazy load canvas 3D khi cần, hỗ trợ prefers-reduced-motion và tuân thủ tiêu chuẩn tương phản màu sắc WCAG AA.',
    },
  },
]

