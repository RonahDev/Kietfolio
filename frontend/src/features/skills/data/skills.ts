import type { SkillCategoryGroup, SoftSkillItem } from '@/types'

export const skillCategories: SkillCategoryGroup[] = [
  {
    id: 'frontend',
    title: {
      en: 'Frontend Engineering',
      vi: 'Kỹ Thuật Frontend',
    },
    subtitle: {
      en: 'Building responsive, accessible, and structured web interfaces.',
      vi: 'Xây dựng giao diện web chuẩn responsive, dễ tiếp cận và có cấu trúc chặt chẽ.',
    },
    skills: [
      { name: 'TypeScript', category: 'frontend', badge: 'Primary' },
      { name: 'React', category: 'frontend', badge: 'Core' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'JavaScript (ES6+)', category: 'frontend' },
      { name: 'HTML5 Semantic', category: 'frontend' },
      { name: 'CSS3 Modern', category: 'frontend' },
    ],
  },
  {
    id: 'backend',
    title: {
      en: 'Backend & APIs',
      vi: 'Backend & Dịch Vụ API',
    },
    subtitle: {
      en: 'Constructing robust server endpoints, data validation, and logic.',
      vi: 'Xây dựng endpoint máy chủ, xác thực dữ liệu và logic xử lý chuẩn xác.',
    },
    skills: [
      { name: 'Node.js', category: 'backend', badge: 'Runtime' },
      { name: 'Express.js', category: 'backend', badge: 'Framework' },
      { name: 'Basic Java Web', category: 'backend', badge: 'Academic' },
      { name: 'RESTful API Design', category: 'backend' },
      { name: 'Authentication & Middleware', category: 'backend' },
    ],
  },
  {
    id: 'languages',
    title: {
      en: 'Programming Languages',
      vi: 'Ngôn Ngữ Lập Trình',
    },
    subtitle: {
      en: 'Strong algorithmic foundation and type-safe computation.',
      vi: 'Nền tảng thuật toán vững vàng và xử lý tính toán an toàn kiểu dữ liệu.',
    },
    skills: [
      { name: 'TypeScript', category: 'languages', badge: 'Active' },
      { name: 'JavaScript', category: 'languages', badge: 'Active' },
      { name: 'Java', category: 'languages', badge: 'FPT Curriculum' },
      { name: 'C++', category: 'languages', badge: 'Algorithms' },
    ],
  },
  {
    id: 'database',
    title: {
      en: 'Databases & Storage',
      vi: 'Cơ Sở Dữ Liệu & Lưu Trữ',
    },
    subtitle: {
      en: 'Relational data modeling, querying, and integrity constraints.',
      vi: 'Mô hình hóa dữ liệu quan hệ, truy vấn tối ưu và toàn vẹn ràng buộc.',
    },
    skills: [
      { name: 'PostgreSQL', category: 'database', badge: 'Relational' },
      { name: 'Microsoft SQL Server', category: 'database', badge: 'Relational' },
      { name: 'Relational Schema Design', category: 'database' },
      { name: 'SQL Query Optimization', category: 'database' },
    ],
  },
  {
    id: 'tools',
    title: {
      en: 'Tools & DevOps',
      vi: 'Công Cụ & Môi Trường',
    },
    subtitle: {
      en: 'Reproducible development environments and version control.',
      vi: 'Môi trường phát triển nhất quán và kiểm soát phiên bản hiệu quả.',
    },
    skills: [
      { name: 'Docker', category: 'tools', badge: 'Containers' },
      { name: 'Git', category: 'tools', badge: 'VCS' },
      { name: 'GitHub', category: 'tools', badge: 'Collaboration' },
      { name: 'Vite & Modern Tooling', category: 'tools' },
      { name: 'Linux CLI Basics', category: 'tools' },
    ],
  },
  {
    id: 'creative',
    title: {
      en: 'Creative Development',
      vi: 'Công Nghệ Sáng Tạo & 3D',
    },
    subtitle: {
      en: 'Crafting fluid motion and interactive 3D spatial web scenes.',
      vi: 'Tạo hiệu ứng chuyển động mượt mà và không gian tương tác WebGL 3D.',
    },
    skills: [
      { name: 'GSAP (GreenSock)', category: 'creative', badge: 'Motion' },
      { name: 'Three.js / WebGL', category: 'creative', badge: '3D Graphics' },
      { name: 'Scroll-Triggered Motion', category: 'creative' },
      { name: 'CSS Micro-Interactions', category: 'creative' },
      { name: 'Canvas Shaders & Particles', category: 'creative' },
    ],
  },
]

export const softSkillsData: SoftSkillItem[] = [
  {
    id: 'driver-coordination',
    title: {
      en: 'Fleet Dispatch & Driver Coordination (~50 Drivers)',
      vi: 'Điều Phối Đội Ngũ Gần 50 Tài Xế Giao Nhận',
    },
    tag: {
      en: 'FLEET_LEADERSHIP',
      vi: 'ĐIỀU_PHỐI_ĐỘI_NGŨ',
    },
    contextRole: {
      en: 'Staff @ Hub Thủ Dầu Một (63BDG02), SPX Express',
      vi: 'Nhân viên tại Hub Thủ Dầu Một (Mã trạm: 63BDG02), SPX Express',
    },
    metric: '~50 Drivers',
    description: {
      en: 'Directly orchestrated and balanced daily routing and parcel dispatch for a fleet of nearly 50 delivery drivers per shift. Maintained consistent route coverage, balanced workload distributions, and ensured delivery SLA targets were met.',
      vi: 'Trực tiếp phân chia tuyến giao nhận, điều phối và giám sát tiến độ giao hàng của gần 50 tài xế (shipper) mỗi ca làm việc. Đảm bảo tỷ lệ phủ tuyến đồng đều, giải quyết phát sinh tuyến và giữ vững chỉ tiêu thời gian cam kết (SLA).',
    },
    practicalImpact: {
      en: 'Taught me real-time resource allocation, clear cross-functional communication, and how algorithmic routing principles behave when faced with real physical variables.',
      vi: 'Rèn luyện khả năng phân bổ nguồn lực thời gian thực, giao tiếp rõ ràng - dứt khoát và thấu hiểu cách các thuật toán định tuyến vận hành trước biến số đời thực.',
    },
  },
  {
    id: 'peak-sale-crisis',
    title: {
      en: 'High-Volume & Peak Sale Crisis Management',
      vi: 'Xử Lý Tình Huống Cao Điểm Ngày Sale & Quá Tải Hàng',
    },
    tag: {
      en: 'CRISIS_RESOLUTION',
      vi: 'ỨNG_BIẾN_CAO_ĐIỂM',
    },
    contextRole: {
      en: 'Staff @ Hub Thủ Dầu Một (63BDG02), SPX Express',
      vi: 'Nhân viên tại Hub Thủ Dầu Một (Mã trạm: 63BDG02), SPX Express',
    },
    metric: 'Mega Sale Resilient',
    description: {
      en: 'Managed rapid incident resolution during massive parcel surges, Mega Sale promotions, and flash delivery spikes. Quickly resolved conveyor bottlenecks, backlog overflow, sorting exceptions, and transit handoff delays under tight timeframes.',
      vi: 'Chủ động ứng biến và giải quyết sự cố phát sinh vào các đợt bùng nổ bưu kiện trong ngày Mega Sale, Flash Sale và các đợt quá tải hàng hóa. Xử lý nghẽn băng chuyền, tồn ứ khu vực chia chọn và giải phóng lưu lượng thông suốt dưới áp lực thời gian.',
    },
    practicalImpact: {
      en: 'Instills a deep instinct for system throughput, bottleneck relief, failover procedures, and operational load balancing — directly transferable to backend scalability.',
      vi: 'Xây dựng trực giác nhạy bén về lưu lượng dòng chảy, xử lý điểm nghẽn và cơ chế dự phòng quá tải — nền tảng trực tiếp hỗ trợ thiết kế backend chịu tải cao.',
    },
  },
  {
    id: 'critical-thinking-pressure',
    title: {
      en: 'Critical Thinking & High-Pressure Resilience',
      vi: 'Tư Duy Phản Biện & Bản Lĩnh Chịu Áp Lực Cao',
    },
    tag: {
      en: 'CRITICAL_MINDSET',
      vi: 'TƯ_DUY_PHẢN_BIỆN',
    },
    contextRole: {
      en: 'Operational Staff & Senior Analyst, SPX Express',
      vi: 'Nhân viên Vận hành & Senior Analyst, SPX Express',
    },
    metric: 'High Pressure Tolerance',
    description: {
      en: 'Maintains composure and analytical rigor in high-stress, fast-paced logistics environments. Identifies root causes of transit anomalies and sorting errors rather than applying temporary surface fixes, ensuring long-term operational consistency.',
      vi: 'Giữ vững sự bình tĩnh, tỉnh táo và tư duy logic trong môi trường kho vận áp lực cao và nhịp độ dồn dập. Luôn đào sâu tìm kiếm nguyên nhân gốc rễ (root-cause) của sự cố thay vì giải quyết tạm thời, đảm bảo hệ thống vận hành ổn định lâu dài.',
    },
    practicalImpact: {
      en: 'Cultivates an uncompromising debugging mindset: testing hypotheses objectively, measuring edge cases, and executing under demanding production constraints.',
      vi: 'Hình thành tư duy sửa lỗi (debugging) triệt để: kiểm chứng giả thuyết một cách khách quan, lường trước các trường hợp biên và hoàn thành nhiệm vụ trong điều kiện ngặt nghèo.',
    },
  },
  {
    id: 'learning-dedication',
    title: {
      en: 'Continuous Learning & Work Dedication',
      vi: 'Tinh Thần Học Hỏi Không Ngừng & Cống Hiến Trách Nhiệm',
    },
    tag: {
      en: 'GROWTH_MINDSET',
      vi: 'TINH_THẦN_CỐNG_HIẾN',
    },
    contextRole: {
      en: 'FPT University Student & SPX Operations',
      vi: 'Sinh viên ĐH FPT & Nhân sự Trạm SPX Express',
    },
    metric: 'Proactive Growth',
    description: {
      en: 'Demonstrates strong work ethic, personal accountability, and eagerness to acquire new technical and domain expertise. Balanced rigorous software engineering coursework at FPT University with intensive ground operational responsibilities.',
      vi: 'Sở hữu tinh thần trách nhiệm cao, sự cống hiến hết mình và chủ động tiếp thu kiến thức mới cả về kỹ thuật lẫn nghiệp vụ. Cân bằng kỷ luật giữa chương trình Kỹ thuật Phần mềm tại ĐH FPT và trọng trách vận hành thực tế tại trạm.',
    },
    practicalImpact: {
      en: 'Guarantees reliable commitment to team objectives, rapid assimilation of unfamiliar engineering toolchains, and a long-term dedicated growth trajectory.',
      vi: 'Bảo chứng cho tinh thần cam kết cao với mục tiêu tập thể, khả năng thích ứng nhanh với công nghệ mới và ý chí phát triển bền bỉ trong sự nghiệp.',
    },
  },
]


