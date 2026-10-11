import type { SkillCategoryGroup } from '../types'

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

