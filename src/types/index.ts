export type Language = 'en' | 'vi'

export interface PersonalProfile {
  fullName: string
  roleTitle: {
    en: string
    vi: string
  }
  tagline: {
    en: string
    vi: string
  }
  bio: {
    en: string
    vi: string
  }
  education: {
    institution: string
    campus: string
    major: {
      en: string
      vi: string
    }
    status: {
      en: string
      vi: string
    }
  }
  location: {
    city: string
    country: string
  }
  dateOfBirth?: string // Optional/configurable
  showDateOfBirth: boolean
  interests: {
    en: string[]
    vi: string[]
  }
  contactLinks: {
    email: string
    github: string
    linkedin: string
    locationLabel: string
  }
}

export interface ExperienceItem {
  id: string
  company: string
  hub: string
  location: string
  period: {
    en: string
    vi: string
  }
  role: {
    en: string
    vi: string
  }
  previousRole?: {
    en: string
    vi: string
  }
  summary: {
    en: string
    vi: string
  }
  highlights: {
    en: string[]
    vi: string[]
  }
  skillsApplied: string[]
  operationalInsights: {
    en: string
    vi: string
  }
}

export interface SkillItem {
  name: string
  category: 'frontend' | 'backend' | 'languages' | 'database' | 'tools' | 'creative'
  badge?: string
}

export interface SkillCategoryGroup {
  id: 'frontend' | 'backend' | 'languages' | 'database' | 'tools' | 'creative'
  title: {
    en: string
    vi: string
  }
  subtitle: {
    en: string
    vi: string
  }
  skills: SkillItem[]
}

export interface ProjectItem {
  id: string
  title: string
  subtitle: {
    en: string
    vi: string
  }
  category: 'fullstack' | 'creative' | 'systems' | 'backend'
  statusBadge: {
    en: string
    vi: string
  }
  isFeatured?: boolean
  problemStatement: {
    en: string
    vi: string
  }
  solutionArchitecture: {
    en: string
    vi: string
  }
  keyEngineeringDecisions: {
    en: string[]
    vi: string[]
  }
  techStack: string[]
  githubUrl: string
  liveUrl?: string
  isPlaceholder?: boolean
}

export interface EngineeringPrinciple {
  id: string
  index: string
  title: {
    en: string
    vi: string
  }
  tag: string
  description: {
    en: string
    vi: string
  }
  practicalApplication: {
    en: string
    vi: string
  }
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  honeypot: string // Anti-spam trap
}

export interface FormValidationErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

