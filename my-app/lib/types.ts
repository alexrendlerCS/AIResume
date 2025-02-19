export interface JobPosting {
  description: string
  title: string
  company?: string
}

export interface SkillMatch {
  skill: string
  found: boolean
  importance: number // 1-10
  context?: string
}

export interface JobMatch {
  matchPercentage: number
  missingSkills: string[]
  foundSkills: string[]
  suggestions: string[]
}

