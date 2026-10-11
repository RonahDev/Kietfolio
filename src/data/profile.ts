import type { PersonalProfile } from '../types'

export const profileData: PersonalProfile = {
  fullName: 'Mai Anh Kiệt',
  roleTitle: {
    en: 'Full-Stack Developer | Creative Developer | Software Engineering Student',
    vi: 'Lập trình viên Full-Stack | Creative Developer | Sinh viên Kỹ thuật Phần mềm',
  },
  tagline: {
    en: 'Building digital experiences. Engineering solutions that matter.',
    vi: 'Kiến tạo trải nghiệm số. Xây dựng giải pháp kỹ thuật thiết thực.',
  },
  bio: {
    en: 'Software Engineering student at FPT University (HCMC Campus) with 2 years of operational ground experience at SPX Express (Hub Thủ Dầu Một, Station Code: 63BDG02), currently serving as Senior Analyst at the warehouse. Driven by the convergence of robust full-stack architecture, creative WebGL/motion interactions, and practical workflow optimization.',
    vi: 'Sinh viên chuyên ngành Kỹ thuật Phần mềm tại Đại học FPT (Cơ sở TP.HCM) với 2 năm kinh nghiệm thực tế tại SPX Express (Hub Thủ Dầu Một, Mã trạm: 63BDG02), hiện là Senior Analyst tại kho vận. Đam mê sự kết hợp giữa kiến trúc full-stack vững chắc, tương tác WebGL/motion sáng tạo và tối ưu hóa quy trình vận hành thực tế.',
  },
  education: {
    institution: 'FPT University',
    campus: 'Ho Chi Minh City Campus',
    major: {
      en: 'Software Engineering',
      vi: 'Kỹ thuật Phần mềm',
    },
    status: {
      en: 'Undergraduate Student',
      vi: 'Sinh viên Đại học',
    },
  },
  location: {
    city: 'Ho Chi Minh City / Binh Duong',
    country: 'Vietnam',
  },
  dateOfBirth: '22 October 2005',
  showDateOfBirth: false, // Configurable toggle: kept respectful and non-prominent
  interests: {
    en: [
      'Full-Stack Web Development',
      'Creative Coding & 3D Web Experiences',
      'Logistics Technology & Workflow Optimization',
      'Software Architecture & Clean Code',
      'Interactive Motion Design',
    ],
    vi: [
      'Phát triển Web Full-Stack',
      'Creative Coding & Trải nghiệm Web 3D',
      'Công nghệ Logistics & Tối ưu Quy trình',
      'Kiến trúc Phần mềm & Mã nguồn sạch',
      'Thiết kế Chuyển động Tương tác',
    ],
  },
  contactLinks: {
    email: 'kietteve22102005@gmail.com', // Verified contact email
    github: 'https://github.com/RonahDev',
    linkedin: 'https://linkedin.com/in/maianhkiet',
    locationLabel: 'Ho Chi Minh City, VN',
  },
}

