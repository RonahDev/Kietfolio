import type { ProjectItem } from '@/types'

export const projectsData: ProjectItem[] = [
  {
    id: 'hubflow-logistics-engine',
    title: 'HubFlow — Logistics Hub Flow & Dispatch Engine',
    subtitle: {
      en: 'Real-time sorting bottleneck analysis and warehouse dispatch optimization tool.',
      vi: 'Hệ thống phân tích điểm nghẽn phân loại và tối ưu điều phối vận hành kho.',
    },
    category: 'fullstack',
    statusBadge: {
      en: 'Concept Prototype · In Progress',
      vi: 'Nguyên Mẫu Ý Tưởng · Đang Phát Triển',
    },
    isFeatured: true,
    isPlaceholder: true,
    problemStatement: {
      en: 'In high-velocity parcel sorting hubs, manual dispatch handovers and intake volume spikes create real-time bottlenecks. Supervisors lack unified visibility into sorting throughput, leading to dispatch queue delays.',
      vi: 'Tại các trung tâm phân loại bưu kiện cường độ cao, khâu bàn giao và lưu lượng hàng biến động dễ tạo điểm nghẽn. Quản lý ca thiếu cái nhìn trực quan thời gian thực về thông lượng, dẫn đến ùn ứ xuất kho.',
    },
    solutionArchitecture: {
      en: 'Engineered as a full-stack system: a React + TypeScript operational dashboard communicating with a Node.js/Express service, persistent PostgreSQL state storage with transactional integrity, and containerized Docker development.',
      vi: 'Thiết kế theo kiến trúc full-stack: dashboard vận hành React + TypeScript kết nối dịch vụ Node.js/Express, lưu trữ dữ liệu PostgreSQL đảm bảo toàn vẹn giao dịch và môi trường Docker nhất quán.',
    },
    keyEngineeringDecisions: {
      en: [
        'Relational schema modeling parcels, transit bins, and dispatch bay status transitions.',
        'Strict schema validation using Zod for all incoming payload contracts on the Express backend.',
        'Docker Compose configuration for one-command local reproduction of Node.js and PostgreSQL services.',
        'Optimistic frontend updates with comprehensive error boundaries and loading fallbacks.',
      ],
      vi: [
        'Mô hình dữ liệu quan hệ quản lý bưu kiện, thùng trung chuyển và trạng thái luân chuyển cửa xuất.',
        'Xác thực chặt chẽ đầu vào bằng Zod đối với mọi payload gửi tới backend Express.',
        'Cấu hình Docker Compose giúp khởi chạy tức thì cụm Node.js và PostgreSQL trên máy cục bộ.',
        'Cập nhật giao diện theo mô hình optimistic đi kèm xử lý lỗi và trạng thái chờ toàn diện.',
      ],
    },
    techStack: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
    githubUrl: 'https://github.com/RonahDev/hubflow-logistics-engine',
    liveUrl: '#',
  },
  {
    id: 'kinetics-3d-visualizer',
    title: 'Kinetics — Interactive 3D System Visualizer',
    subtitle: {
      en: 'Procedural WebGL network graph representing node topologies and logistics pipelines.',
      vi: 'Đồ thị mạng WebGL 3D hiển thị cấu trúc nút và luồng vận chuyển dữ liệu.',
    },
    category: 'creative',
    statusBadge: {
      en: 'Creative Lab · Interactive Experience',
      vi: 'Thử Nghiệm Sáng Tạo · Tương Tác 3D',
    },
    isFeatured: false,
    isPlaceholder: true,
    problemStatement: {
      en: '2D network tables fail to communicate the multi-dimensional complexity and fluid connectivity of modern distributed logistics routes and systems architecture.',
      vi: 'Bảng dữ liệu 2D truyền thống không thể hiện được tính đa chiều và mối liên kết luồng linh hoạt của mạng lưới điều phối và kiến trúc hệ thống.',
    },
    solutionArchitecture: {
      en: 'Created an interactive Three.js canvas integrated with GSAP motion hooks. Renders dynamic geometric nodes, pointer parallax physics, and controlled GPU memory disposal upon unmount.',
      vi: 'Xây dựng không gian Three.js kết hợp cùng GSAP motion. Kết xuất các nút hình học động, phản hồi con trỏ mượt mà và giải phóng bộ nhớ GPU an toàn khi hủy component.',
    },
    keyEngineeringDecisions: {
      en: [
        'Low-overhead instanced buffer geometries to maintain 60 FPS across varied screen sizes.',
        'Graceful WebGL context loss recovery and static canvas fallback for unsupported GPUs.',
        'Full compatibility with prefers-reduced-motion accessibility settings.',
      ],
      vi: [
        'Sử dụng instanced buffer geometry tối ưu nhằm duy trì ổn định 60 FPS trên mọi kích thước màn hình.',
        'Cơ chế khôi phục khi mất ngữ cảnh WebGL và hiển thị fallback tĩnh trên thiết bị không hỗ trợ GPU.',
        'Tuân thủ đầy đủ tiêu chuẩn trợ năng cho người dùng bật chế độ giảm chuyển động.',
      ],
    },
    techStack: ['Three.js', 'React', 'TypeScript', 'GSAP', 'WebGL', 'Tailwind CSS'],
    githubUrl: 'https://github.com/RonahDev/kinetics-3d-system',
    liveUrl: '#',
  },
  {
    id: 'core-inventory-task-manager',
    title: 'CoreInventory — Warehouse Task & Bin Dispatcher',
    subtitle: {
      en: 'Role-based warehouse task coordination and inventory bin management system.',
      vi: 'Hệ thống điều phối tác vụ kho và quản lý vị trí lưu trữ phân quyền.',
    },
    category: 'backend',
    statusBadge: {
      en: 'Architecture Project · Academic Work',
      vi: 'Đồ Án Kiến Trúc · Nghiên Cứu Học Thuật',
    },
    isFeatured: false,
    isPlaceholder: true,
    problemStatement: {
      en: 'Warehouse floor pickers frequently encounter bin conflicts and lack atomic verification during stock allocation handoffs, risking inventory drift.',
      vi: 'Nhân sự lấy hàng hiện trường thường gặp xung đột vị trí kệ và thiếu bước xác thực nguyên tử khi bàn giao, gây nguy cơ sai lệch tồn kho.',
    },
    solutionArchitecture: {
      en: 'Constructed an N-tier application structure: modular React presentation layer, decoupled service-layer business logic in Express, and Microsoft SQL Server relational database with strict foreign keys and stored procedures.',
      vi: 'Thiết kế ứng dụng đa tầng (N-tier): tầng giao diện React module hóa, tầng nghiệp vụ Express tách rời và cơ sở dữ liệu Microsoft SQL Server với ràng buộc khóa ngoại chặt chẽ.',
    },
    keyEngineeringDecisions: {
      en: [
        'Role-Based Access Control (RBAC) distinguishing between Warehouse Floor Staff, Analyst, and Admin roles.',
        'ACID-compliant transactional operations for stock decrement and replenishment audits.',
        'Centralized error logging middleware with categorized HTTP status handling.',
      ],
      vi: [
        'Phân quyền theo vai trò (RBAC) rõ ràng giữa Nhân viên hiện trường, Chuyên viên phân tích và Quản trị viên.',
        'Giao dịch chuẩn ACID bảo đảm tính nhất quán khi trừ kho và ghi nhận lịch sử kiểm kê.',
        'Middleware ghi nhận lỗi tập trung với phân loại mã trạng thái HTTP chuẩn mực.',
      ],
    },
    techStack: ['React', 'TypeScript', 'Node.js', 'Express.js', 'Microsoft SQL Server', 'JWT Auth'],
    githubUrl: 'https://github.com/RonahDev/core-inventory-system',
    liveUrl: '#',
  },
  {
    id: 'graph-routing-sandbox',
    title: 'PathRoute — Algorithmic Graph Routing Engine',
    subtitle: {
      en: 'Algorithmic sandbox exploring shortest-path and delivery routing optimization.',
      vi: 'Hộp cát thuật toán tìm đường ngắn nhất và tối ưu hóa lộ trình giao hàng.',
    },
    category: 'systems',
    statusBadge: {
      en: 'Engineering Exploration · C++ & Java',
      vi: 'Thử Nghiệm Thuật Toán · C++ & Java',
    },
    isFeatured: false,
    isPlaceholder: true,
    problemStatement: {
      en: 'Understanding time complexity and memory trade-offs when routing multi-stop logistics paths on large directed road networks.',
      vi: 'Khảo sát độ phức tạp thời gian và bộ nhớ khi tính toán tuyến giao hàng đa điểm trên đồ thị đường đi có hướng quy mô lớn.',
    },
    solutionArchitecture: {
      en: 'Engineered core graph data structures in C++ and Java with adjacency lists, benchmarking Dijkstra vs. A* heuristics. Visualized algorithm execution steps dynamically.',
      vi: 'Hiện thực cấu trúc đồ thị bằng C++ và Java với danh sách kề, đo kiểm hiệu năng Dijkstra và A* heuristic, minh họa trực quan các bước duyệt thuật toán.',
    },
    keyEngineeringDecisions: {
      en: [
        'Min-heap priority queue implementations for O((V + E) log V) Dijkstra traversal.',
        'Detailed step-by-step state recording for algorithm educational visualization.',
        'Memory footprint profiling under large node sets.',
      ],
      vi: [
        'Cài đặt hàng đợi ưu tiên min-heap đạt độ phức tạp O((V + E) log V) cho Dijkstra.',
        'Ghi nhận chi tiết từng bước chuyển trạng thái để minh họa thuật toán trực quan.',
        'Đo đạc mức tiêu thụ bộ nhớ khi số lượng đỉnh và cạnh tăng cao.',
      ],
    },
    techStack: ['C++', 'Java', 'TypeScript', 'Algorithms & Data Structures'],
    githubUrl: 'https://github.com/RonahDev/algorithmic-pathroute',
    liveUrl: '#',
  },
]

