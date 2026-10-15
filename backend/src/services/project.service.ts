import { pool } from '../db/pool'

export interface ProjectRecord {
  id: string
  title: string
  subtitle: {
    en: string
    vi: string
  }
  category: string
  statusBadge: {
    en: string
    vi: string
  }
  isFeatured: boolean
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
}

const defaultProjects: ProjectRecord[] = [
  {
    id: 'kietfolio-core',
    title: 'Kietfolio Architecture',
    subtitle: {
      en: 'High-Performance 3D Full-Stack Cyber Portfolio',
      vi: 'Portfolio Công Nghệ Cao 3D Full-Stack',
    },
    category: 'creative',
    statusBadge: {
      en: 'Production Live',
      vi: 'Trực Tuyến Sẵn Sàng',
    },
    isFeatured: true,
    problemStatement: {
      en: 'Standard web portfolios lack distinctive visual identity and fail to communicate technical depth in real-time graphics and operational logistics.',
      vi: 'Các trang portfolio truyền thống thiếu cá tính kỹ thuật và không làm nổi bật được năng lực đồ họa 3D cùng tư duy vận hành chuỗi cung ứng thực chiến.',
    },
    solutionArchitecture: {
      en: 'Custom Three.js procedural shaders, GSAP motion choreography, and React 19 architecture with strict TypeScript contracts.',
      vi: 'Tùy biến shader Three.js theo thời gian thực, điều phối chuyển động GSAP và kiến trúc React 19 trên nền TypeScript chặt chẽ.',
    },
    keyEngineeringDecisions: {
      en: [
        'Domain-Driven Modular Folders with 0 barrel bundling penalties',
        'Capped WebGL pixel ratio at 1.5 to eliminate GPU throttling',
        'Offline fallback simulation for resilient auth and guestbook interactions',
      ],
      vi: [
        'Phân tách thư mục theo Domain-Driven Design không gây nghẽn bundle',
        'Giới hạn pixel ratio WebGL ở 1.5 để tối ưu hóa triệt để GPU',
        'Cơ chế fallback offline đảm bảo xác thực và lưu bút luôn mượt mà',
      ],
    },
    techStack: ['React 19', 'Three.js', 'GSAP', 'TypeScript', 'Tailwind CSS', 'Docker', 'PostgreSQL'],
    githubUrl: 'https://github.com/RonahDev/Kietfolio',
    liveUrl: 'https://ronahdev.github.io/Kietfolio/',
  },
]

export class ProjectService {
  public static async getAll(): Promise<ProjectRecord[]> {
    try {
      const res = await pool.query(
        `SELECT id, title, subtitle, category, status_badge as "statusBadge", 
                is_featured as "isFeatured", problem_statement as "problemStatement", 
                solution_architecture as "solutionArchitecture", 
                key_engineering_decisions as "keyEngineeringDecisions", 
                tech_stack as "techStack", github_url as "githubUrl", live_url as "liveUrl"
         FROM projects
         ORDER BY is_featured DESC, created_at DESC`
      )
      if (res.rows.length > 0) {
        return res.rows
      }
      return defaultProjects
    } catch {
      return defaultProjects
    }
  }

  public static async getById(id: string): Promise<ProjectRecord | null> {
    const list = await this.getAll()
    return list.find((p) => p.id === id) || null
  }
}
