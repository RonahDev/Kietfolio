import type { Language } from '../types'

export interface TranslationDictionary {
  nav: {
    home: string
    about: string
    experience: string
    skills: string
    projects: string
    principles: string
    contact: string
    menu: string
    close: string
    statusAvailable: string
  }
  hero: {
    greeting: string
    titleLead: string
    titleEnd: string
    role: string
    description: string
    primaryCta: string
    secondaryCta: string
    scrollDown: string
    telemetryLocation: string
    telemetryEducation: string
    telemetryHub: string
    canvasNote: string
  }
  about: {
    badge: string
    title: string
    lead: string
    dimensionEngineeringTitle: string
    dimensionEngineeringDesc: string
    dimensionCreativityTitle: string
    dimensionCreativityDesc: string
    dimensionOperationsTitle: string
    dimensionOperationsDesc: string
    personalInfoTitle: string
    personalInfoDobLabel: string
    personalInfoDobValue: string
    personalInfoEduLabel: string
    personalInfoEduValue: string
    personalInfoHubLabel: string
    personalInfoHubValue: string
    toggleProfileDetails: string
    hideProfileDetails: string
  }
  experience: {
    badge: string
    title: string
    subtitle: string
    currentRoleBadge: string
    operationalConnectionTitle: string
    appliedDisciplines: string
  }
  skills: {
    badge: string
    title: string
    subtitle: string
    noArbitraryBarNotice: string
  }
  projects: {
    badge: string
    title: string
    subtitle: string
    viewGithub: string
    liveDemo: string
    prototypeNotice: string
    problemLabel: string
    architectureLabel: string
    decisionsLabel: string
    stackLabel: string
  }
  principles: {
    badge: string
    title: string
    subtitle: string
    practicalLabel: string
  }
  contact: {
    badge: string
    title: string
    subtitle: string
    formName: string
    formEmail: string
    formSubject: string
    formMessage: string
    formSubmit: string
    formSending: string
    formSuccess: string
    formError: string
    copyEmail: string
    emailCopied: string
    directChannels: string
    responseGuarantee: string
  }
  footer: {
    rights: string
    tagline: string
    backToTop: string
    builtWith: string
  }
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      principles: 'Architecture',
      contact: 'Contact',
      menu: 'Menu',
      close: 'Close',
      statusAvailable: 'Undergraduate · Open for Collaborations',
    },
    hero: {
      greeting: 'SYS // PORTFOLIO INITIALIZED',
      titleLead: 'MAI ANH',
      titleEnd: 'KIỆT',
      role: 'Full-Stack Developer · Creative Developer · Software Engineering Student',
      description: 'Software Engineering student at FPT University (HCMC), combining robust full-stack systems, creative WebGL & motion interactions, and 2 years of real-world logistics operations experience.',
      primaryCta: 'Explore Selected Work',
      secondaryCta: 'Get in Touch',
      scrollDown: 'Scroll to explore',
      telemetryLocation: 'Ho Chi Minh City, VN',
      telemetryEducation: 'FPT University (HCMC Campus)',
      telemetryHub: 'SPX Express · Thu Dau Mot Hub',
      canvasNote: 'Interactive 3D Network (Drag / Pointer active)',
    },
    about: {
      badge: '01 // BACKGROUND & MINDSET',
      title: 'Bridging Ground Logistics with Systems Engineering',
      lead: 'I approach software not just as code syntax, but as an operational engine built to solve tangible, real-world problems.',
      dimensionEngineeringTitle: '01. Engineering Rigor',
      dimensionEngineeringDesc: 'Developing type-safe, maintainable, and containerized web applications with modular component boundaries and reliable data flow.',
      dimensionCreativityTitle: '02. Creative Expression',
      dimensionCreativityDesc: 'Pushing the boundaries of the browser canvas using GSAP motion choreography and interactive Three.js 3D computational spaces.',
      dimensionOperationsTitle: '03. Operational Intuition',
      dimensionOperationsDesc: 'Two years of ground-level hub logistics at SPX Express developed an analytical instinct for system throughput, bottlenecks, and human workflows.',
      personalInfoTitle: 'Verified Profile Telemetry',
      personalInfoDobLabel: 'Date of Birth',
      personalInfoDobValue: '22 October 2005 (Configurable / Optional)',
      personalInfoEduLabel: 'Academic Foundation',
      personalInfoEduValue: 'FPT University, HCMC Campus · Software Engineering',
      personalInfoHubLabel: 'Logistics Facility',
      personalInfoHubValue: 'SPX Express — Thủ Dầu Một 01 Hub (Senior Analyst)',
      toggleProfileDetails: 'View Verified Telemetry Data',
      hideProfileDetails: 'Collapse Telemetry Data',
    },
    experience: {
      badge: '02 // OPERATIONAL JOURNEY',
      title: 'Real-World Experience',
      subtitle: 'From warehouse operations staff to Senior Analyst: applying process-oriented problem solving to physical and digital workflows.',
      currentRoleBadge: 'Current Position · Verified',
      operationalConnectionTitle: 'Logistics Operations & Software Architecture Correlation',
      appliedDisciplines: 'Core Disciplines Applied',
    },
    skills: {
      badge: '03 // TECHNICAL CAPABILITIES',
      title: 'Engineered Skill Matrix',
      subtitle: 'Curated technical competencies grounded in university curriculum, practical implementation, and continuous creative coding.',
      noArbitraryBarNotice: 'Transparent capability breakdown without inflated progress bars or arbitrary percentages.',
    },
    projects: {
      badge: '04 // SELECTED WORK & CASE STUDIES',
      title: 'Featured Projects & Prototypes',
      subtitle: 'A selection of full-stack applications, creative 3D explorations, and logistics optimization prototypes.',
      viewGithub: 'Inspect Source Code',
      liveDemo: 'Interactive Preview',
      prototypeNotice: 'Clearly marked concept prototype or academic architecture sandbox.',
      problemLabel: 'Problem Context',
      architectureLabel: 'Architecture & Solution',
      decisionsLabel: 'Key Engineering Decisions',
      stackLabel: 'Core Stack',
    },
    principles: {
      badge: '05 // ENGINEERING METHODOLOGY',
      title: 'How I Build Software',
      subtitle: 'Guiding architectural standards for writing maintainable, reliable, and production-ready applications.',
      practicalLabel: 'Practical Implementation',
    },
    contact: {
      badge: '06 // INITIATE DIALOGUE',
      title: 'Have a problem worth solving?',
      subtitle: 'I am always interested in discussing software engineering challenges, creative web projects, or practical logistics tech collaborations.',
      formName: 'Your Name',
      formEmail: 'Email Address',
      formSubject: 'Subject / Project Domain',
      formMessage: 'Message Details',
      formSubmit: 'Transmit Message',
      formSending: 'Validating & Transmitting...',
      formSuccess: 'Message validated and ready. Thank you for reaching out!',
      formError: 'Please correct the highlighted inputs before transmission.',
      copyEmail: 'Copy Direct Email Address',
      emailCopied: 'Copied to clipboard!',
      directChannels: 'Verified Channels',
      responseGuarantee: 'Every message is processed with validated schema standards.',
    },
    footer: {
      rights: 'All rights reserved.',
      tagline: 'Engineering digital systems with operational discipline.',
      backToTop: 'Return to Apex',
      builtWith: 'Engineered with React · TypeScript · Three.js · GSAP · Tailwind CSS',
    },
  },
  vi: {
    nav: {
      home: 'Trang chủ',
      about: 'Giới thiệu',
      experience: 'Kinh nghiệm',
      skills: 'Kỹ năng',
      projects: 'Dự án',
      principles: 'Kiến trúc',
      contact: 'Liên hệ',
      menu: 'Menu',
      close: 'Đóng',
      statusAvailable: 'Sinh viên ĐH · Sẵn sàng hợp tác & Thực tập',
    },
    hero: {
      greeting: 'SYS // KHỞI TẠO HỆ THỐNG',
      titleLead: 'MAI ANH',
      titleEnd: 'KIỆT',
      role: 'Lập trình viên Full-Stack · Creative Developer · Sinh viên Kỹ thuật Phần mềm',
      description: 'Sinh viên Kỹ thuật Phần mềm tại Đại học FPT (TP.HCM), kết hợp kiến trúc hệ thống full-stack, chuyển động WebGL/3D sáng tạo và 2 năm kinh nghiệm thực chiến trong vận hành logistics.',
      primaryCta: 'Khám Phá Dự Án',
      secondaryCta: 'Kết Nối Ngay',
      scrollDown: 'Cuộn để khám phá',
      telemetryLocation: 'TP. Hồ Chí Minh / Bình Dương, VN',
      telemetryEducation: 'Đại học FPT (Cơ sở TP.HCM)',
      telemetryHub: 'SPX Express · Trạm Thủ Dầu Một 01',
      canvasNote: 'Mạng lưới 3D tương tác (Kéo / Di chuyển chuột)',
    },
    about: {
      badge: '01 // HỒ SƠ & TƯ DUY',
      title: 'Kết Nối Thực Tiễn Vận Hành Với Kỹ Thuật Hệ Thống',
      lead: 'Tôi tiếp cận phần mềm không đơn thuần là cú pháp mã nguồn, mà là một cỗ máy vận hành được xây dựng để giải quyết các bài toán đời thực.',
      dimensionEngineeringTitle: '01. Kỷ Luật Kỹ Thuật',
      dimensionEngineeringDesc: 'Xây dựng ứng dụng web an toàn kiểu dữ liệu, dễ bảo trì và đóng gói container với cấu trúc component phân định rõ ràng.',
      dimensionCreativityTitle: '02. Sáng Tạo Tương Tác',
      dimensionCreativityDesc: 'Khai thác tối đa canvas trình duyệt với kỹ thuật điều hướng chuyển động GSAP và không gian 3D tương tác Three.js.',
      dimensionOperationsTitle: '03. Trực Giác Vận Hành',
      dimensionOperationsDesc: 'Hai năm gắn bó với hiện trường kho vận tại SPX Express rèn giũa trực giác phân tích lưu lượng, điểm nghẽn và trải nghiệm người thao tác.',
      personalInfoTitle: 'Thông Tin Hồ Sơ Đã Xác Thực',
      personalInfoDobLabel: 'Ngày sinh',
      personalInfoDobValue: '22/10/2005 (Tùy chọn hiển thị)',
      personalInfoEduLabel: 'Nền tảng Học vấn',
      personalInfoEduValue: 'Đại học FPT, Cơ sở TP.HCM · Kỹ thuật Phần mềm',
      personalInfoHubLabel: 'Cơ sở Kho vận',
      personalInfoHubValue: 'SPX Express — Hub Thủ Dầu Một 01 (Senior Analyst)',
      toggleProfileDetails: 'Xem Chi Tiết Dữ Liệu Hồ Sơ',
      hideProfileDetails: 'Thu Gọn Dữ Liệu',
    },
    experience: {
      badge: '02 // HÀNH TRÌNH VẬN HÀNH',
      title: 'Kinh Nghiệm Thực Chiến',
      subtitle: 'Từ nhân viên vận hành mặt đất trong 2 năm đến Senior Analyst: áp dụng tư duy giải quyết vấn đề định hướng quy trình vào thực tiễn.',
      currentRoleBadge: 'Vị trí Hiện tại · Xác thực',
      operationalConnectionTitle: 'Mối Liên Hệ Giữa Vận Hành Kho Vận Và Kiến Trúc Phần Mềm',
      appliedDisciplines: 'Các Năng Lực Ứng Dụng Chính',
    },
    skills: {
      badge: '03 // NĂNG LỰC CÔNG NGHỆ',
      title: 'Ma Trận Kỹ Năng Kỹ Thuật',
      subtitle: 'Tập hợp các năng lực kỹ thuật vững chắc từ chương trình đào tạo đại học, dự án thực hành và đam mê creative coding.',
      noArbitraryBarNotice: 'Trình bày trung thực năng lực kỹ thuật, không sử dụng thanh phần trăm ảo hay số liệu tự phong.',
    },
    projects: {
      badge: '04 // DỰ ÁN & BÀI TOÁN KỸ THUẬT',
      title: 'Dự Án Chọn Lọc & Nghiên Cứu',
      subtitle: 'Tổng hợp các ứng dụng full-stack, thử nghiệm 3D tương tác và mô hình giải pháp tối ưu hóa logistics.',
      viewGithub: 'Kiểm Tra Mã Nguồn',
      liveDemo: 'Xem Trực Tiếp',
      prototypeNotice: 'Nguyên mẫu ý tưởng hoặc đồ án kiến trúc học thuật được gắn nhãn rõ ràng.',
      problemLabel: 'Bối Cảnh Bài Toán',
      architectureLabel: 'Kiến Trúc & Giải Pháp',
      decisionsLabel: 'Quyết Định Kỹ Thuật Trọng Tâm',
      stackLabel: 'Công Nghệ Sử Dụng',
    },
    principles: {
      badge: '05 // PHƯƠNG CHÂM PHÁT TRIỂN',
      title: 'Cách Tôi Xây Dựng Phần Mềm',
      subtitle: 'Những nguyên tắc kiến trúc dẫn đường nhằm tạo nên ứng dụng ổn định, bảo trì tốt và sẵn sàng cho môi trường thực tế.',
      practicalLabel: 'Ứng Dụng Thực Tiễn',
    },
    contact: {
      badge: '06 // KẾT NỐI VÀ HỢP TÁC',
      title: 'Bạn có bài toán đáng để giải quyết?',
      subtitle: 'Tôi luôn sẵn lòng thảo luận về các thử thách kỹ thuật phần mềm, dự án sáng tạo web hoặc hợp tác công nghệ logistics.',
      formName: 'Họ và Tên',
      formEmail: 'Địa chỉ Email',
      formSubject: 'Chủ đề / Lĩnh vực',
      formMessage: 'Nội dung tin nhắn',
      formSubmit: 'Gửi Tin Nhắn',
      formSending: 'Đang kiểm tra & Gửi...',
      formSuccess: 'Tin nhắn đã được xác thực thành công. Cảm ơn bạn đã liên hệ!',
      formError: 'Vui lòng kiểm tra lại các trường thông tin được đánh dấu.',
      copyEmail: 'Sao Chép Địa Chỉ Email',
      emailCopied: 'Đã sao chép vào bộ nhớ tạm!',
      directChannels: 'Kênh Liên Hệ Chính Thức',
      responseGuarantee: 'Mọi tin nhắn đều được kiểm tra tính hợp lệ theo tiêu chuẩn bảo mật.',
    },
    footer: {
      rights: 'Bảo lưu mọi quyền.',
      tagline: 'Kiến tạo hệ thống số với kỷ luật vận hành thực tế.',
      backToTop: 'Lên Đầu Trang',
      builtWith: 'Phát triển với React · TypeScript · Three.js · GSAP · Tailwind CSS',
    },
  },
}

