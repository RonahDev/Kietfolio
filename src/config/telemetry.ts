export interface TelemetryMetric {
  id: string
  label: { en: string; vi: string }
  title: string
  subtitle: { en: string; vi: string }
  iconName: 'academics' | 'operations' | 'tech' | 'reliability'
}

export const HERO_TELEMETRY_METRICS: TelemetryMetric[] = [
  {
    id: 'academics',
    label: { en: 'ACADEMICS', vi: 'HỌC VẤN' },
    title: 'FPT University',
    subtitle: { en: 'BSc Software Engineering', vi: 'Kỹ thuật Phần mềm (TP.HCM)' },
    iconName: 'academics',
  },
  {
    id: 'operations',
    label: { en: 'OPERATIONS', vi: 'VẬN HÀNH' },
    title: 'SPX Express Lead',
    subtitle: { en: 'High-Velocity Sorting Hub', vi: 'Trưởng Ca Điều Phối Hub' },
    iconName: 'operations',
  },
  {
    id: 'tech',
    label: { en: 'TECH CORE', vi: 'CÔNG NGHỆ' },
    title: 'TypeScript & React 19',
    subtitle: { en: 'Three.js, Node.js, Docker', vi: 'Three.js, Node.js, Docker' },
    iconName: 'tech',
  },
  {
    id: 'reliability',
    label: { en: 'RELIABILITY', vi: 'ĐỘ TIN CẬY' },
    title: '100% Type-Safe',
    subtitle: { en: 'Zero Production Defects', vi: 'Kiến trúc Chặt chẽ & An toàn' },
    iconName: 'reliability',
  },
]

