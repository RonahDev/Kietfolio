import type { ExperienceItem } from '../types'

export const experienceData: ExperienceItem[] = [
  {
    id: 'spx-express-hub',
    company: 'SPX Express',
    hub: 'Hub Thủ Dầu Một (Mã trạm: 63BDG02)',
    location: 'Binh Duong, Vietnam',
    period: {
      en: '2 Years Operational Experience (Ongoing)',
      vi: '2 Năm Kinh Nghiệm Vận Hành (Đang công tác)',
    },
    role: {
      en: 'Senior Analyst (Warehouse Operations)',
      vi: 'Senior Analyst (Vận hành Kho vận)',
    },
    previousRole: {
      en: 'Operations Staff (2 Years Experience)',
      vi: 'Nhân viên Vận hành (2 Năm kinh nghiệm)',
    },
    summary: {
      en: 'Transitioned from ground-level warehouse operations staff across 2 years into a Senior Analyst position at Hub Thủ Dầu Một (Station Code: 63BDG02). Coordinated daily delivery routes for nearly 50 drivers, navigated high-pressure parcel surges during Mega Sale campaigns, and connected ground logistics realities with software systems thinking.',
      vi: 'Phát triển từ vị trí nhân viên vận hành kho mặt đất trong 2 năm lên vai trò Senior Analyst tại Hub Thủ Dầu Một (Mã trạm: 63BDG02). Trực tiếp điều phối gần 50 tài xế giao nhận, xử lý tình huống linh hoạt trong các đợt bùng nổ hàng ngày sale và kết nối bài toán vận hành thực tế với tư duy kỹ thuật phần mềm.',
    },
    highlights: {
      en: [
        'Fleet & Driver Dispatch: Coordinated daily delivery routes and managed parcel turnaround for ~50 delivery drivers per shift under strict SLA targets.',
        'Peak Sale Crisis Resolution: Resolved physical bottleneck overflows, conveyor jams, and sorting exceptions during high-volume Mega Sale campaigns.',
        'Root-Cause Analytics: Applied structured critical thinking under high pressure to diagnose dispatch delays and inventory discrepancies.',
        'Systems Mindset: Transformed ground operational logistics experience into scalable software engineering intuition and resilient architecture design.',
      ],
      vi: [
        'Điều phối đội ngũ ~50 tài xế giao nhận mỗi ca làm việc, giám sát lộ trình và đảm bảo tỷ lệ hoàn thành chỉ tiêu giao hàng (SLA).',
        'Xử lý tình huống linh hoạt vào các đợt cao điểm quá tải bưu kiện và các chiến dịch Mega Sale bùng nổ sản lượng.',
        'Tư duy phản biện và chịu áp lực cao: bình tĩnh phân tích nguyên nhân gốc rễ (root-cause) của sự cố trễ tuyến thay vì giải quyết tạm thời.',
        'Tinh thần học hỏi và cống hiến: chuyển hóa kỷ luật vận hành kho vận thành tư duy thiết kế hệ thống phần mềm chịu tải cao.',
      ],
    },
    skillsApplied: [
      'Operational Workflow Analysis',
      'Data & Volume Analytics',
      'Process Bottleneck Elimination',
      'Warehouse Systems Thinking',
      'Cross-Team Coordination',
    ],
    operationalInsights: {
      en: 'Hands-on operational experience taught me that software is only as good as the physical reality it mirrors. Handling real-time parcel streams develops an intuition for system throughput, failover handling, and user-centric ergonomics.',
      vi: 'Trải nghiệm vận hành thực tế rèn luyện cho tôi nhận thức rằng phần mềm chỉ thực sự giá trị khi giải quyết đúng bài toán đời thực. Làm việc với dòng dữ liệu và hàng hóa thời gian thực giúp hình thành trực giác về lưu lượng hệ thống, xử lý ngoại lệ và trải nghiệm người dùng.',
    },
  },
]

export interface CorrelationItem {
  id: string
  logistics: { en: string; vi: string }
  software: { en: string; vi: string }
  iconType: 'queues' | 'validation' | 'throughput'
}

export const LOGISTICS_SOFTWARE_CORRELATIONS: CorrelationItem[] = [
  {
    id: 'queues',
    logistics: {
      en: 'Parcel Intake & Dispatch Queues',
      vi: 'Hàng đợi Tiếp nhận & Xuất kho',
    },
    software: {
      en: 'Asynchronous Message Queues & Event Loops',
      vi: 'Hàng đợi Bất đồng bộ & Event Loops',
    },
    iconType: 'queues',
  },
  {
    id: 'validation',
    logistics: {
      en: 'Sorting Misroutes & Bin Conflicts',
      vi: 'Sai tuyến phân loại & Xung đột vị trí',
    },
    software: {
      en: 'Defensive Type Validation & Schema Constraints',
      vi: 'Xác thực Kiểu phòng thủ & Ràng buộc CSDL',
    },
    iconType: 'validation',
  },
  {
    id: 'throughput',
    logistics: {
      en: 'Peak Season Volume Spikes',
      vi: 'Đỉnh tải lưu lượng mùa cao điểm',
    },
    software: {
      en: 'Throughput Benchmarking & Backpressure Handling',
      vi: 'Đo lường Thông lượng & Cơ chế Backpressure',
    },
    iconType: 'throughput',
  },
]

