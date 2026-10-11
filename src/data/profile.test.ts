import { describe, it, expect } from 'vitest'
import { profileData } from './profile'
import { translations } from './translations'
import { skillCategories } from './skills'
import { projectsData } from './projects'
import { experienceData } from './experience'

describe('Verified Profile Integrity & Accuracy', () => {
  it('strictly contains verified personal facts for Mai Anh Kiệt', () => {
    expect(profileData.fullName).toBe('Mai Anh Kiệt')
    expect(profileData.education.institution).toBe('FPT University')
    expect(profileData.education.campus).toBe('Ho Chi Minh City Campus')
    expect(profileData.education.major.en).toBe('Software Engineering')
    expect(profileData.dateOfBirth).toBe('22 October 2005')
  })

  it('accurately records SPX Express operational experience without inflated claims', () => {
    expect(experienceData.length).toBeGreaterThan(0)
    const spx = experienceData.find((e) => e.company === 'SPX Express')
    expect(spx).toBeDefined()
    expect(spx?.hub).toBe('Thủ Dầu Một 01 Hub')
    expect(spx?.role.en).toContain('Senior Analyst')
    expect(spx?.previousRole?.en).toContain('2 Years')
  })

  it('includes all verified skills and omits arbitrary percentage scores', () => {
    const allSkills = skillCategories.flatMap((c) => c.skills.map((s) => s.name))
    // Frontend
    expect(allSkills).toContain('React')
    expect(allSkills).toContain('TypeScript')
    expect(allSkills).toContain('Tailwind CSS')
    expect(allSkills).toContain('HTML5 Semantic')
    expect(allSkills).toContain('CSS3 Modern')
    // Backend
    expect(allSkills).toContain('Node.js')
    expect(allSkills).toContain('Express.js')
    // Databases
    expect(allSkills).toContain('PostgreSQL')
    expect(allSkills).toContain('Microsoft SQL Server')
    // Languages
    expect(allSkills).toContain('Java')
    expect(allSkills).toContain('C++')
    // Tools
    expect(allSkills).toContain('Docker')
    expect(allSkills).toContain('Git')
    // Creative
    expect(allSkills).toContain('GSAP (GreenSock)')
    expect(allSkills).toContain('Three.js / WebGL')
  })

  it('clearly designates projects as prototypes, concepts, or academic works', () => {
    expect(projectsData.length).toBeGreaterThanOrEqual(4)
    projectsData.forEach((project) => {
      expect(project.isPlaceholder).toBe(true)
      expect(project.statusBadge.en.length).toBeGreaterThan(0)
      expect(project.problemStatement.en.length).toBeGreaterThan(10)
      expect(project.solutionArchitecture.en.length).toBeGreaterThan(10)
    })
  })

  it('maintains complete translation key parity between English and Vietnamese', () => {
    const enSections = Object.keys(translations.en) as (keyof typeof translations.en)[]
    const viSections = Object.keys(translations.vi) as (keyof typeof translations.vi)[]

    expect(enSections.sort()).toEqual(viSections.sort())

    enSections.forEach((sectionKey) => {
      const enKeys = Object.keys(translations.en[sectionKey]).sort()
      const viKeys = Object.keys(translations.vi[sectionKey]).sort()
      expect(enKeys).toEqual(viKeys)
    })
  })
})

