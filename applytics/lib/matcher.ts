import type { ParsedResume } from './parser';

export type SkillMatch = {
  skill: string;
  matched: boolean;
  importance: 'required' | 'preferred' | 'bonus';
};

export type MatchBreakdown = {
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  overallScore: number;
};

export type LearningResource = {
  skill: string;
  resources: Array<{
    name: string;
    url: string;
    type: 'course' | 'documentation' | 'tutorial' | 'certification';
  }>;
};

export type MatchResult = {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: MatchBreakdown;
  skillMatches: SkillMatch[];
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
  experienceMatch: 'exceeds' | 'meets' | 'below' | 'unknown';
  recommendations: string[];
  learningResources: LearningResource[];
  resume: ParsedResume;
};

// ─────────────────────────────────────────────────────────────
// Skill Extraction from Job Description
// ─────────────────────────────────────────────────────────────

type ExtractedJobData = {
  requiredSkills: string[];
  preferredSkills: string[];
  requiredExperience: number;
  educationRequired: boolean;
};

const KNOWN_SKILLS = [
  'javascript', 'typescript', 'react', 'next.js', 'nextjs', 'next',
  'node', 'node.js', 'nodejs', 'express',
  'python', 'django', 'flask', 'fastapi',
  'java', 'spring', 'spring boot',
  'c#', '.net', 'c++', 'c', 'go', 'golang', 'rust', 'ruby', 'rails',
  'php', 'laravel',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes',
  'terraform', 'jenkins', 'git', 'github', 'gitlab',
  'html', 'css', 'sass', 'tailwind',
  'vue', 'angular', 'svelte',
  'graphql', 'rest', 'api',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch',
  'figma', 'agile', 'scrum', 'linux',
];

function extractJobData(text: string): ExtractedJobData {
  const lowered = text.toLowerCase();
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];

  // Check for required section
  const requiredSection = text.match(/(?:required|must have|requirements)[:\s]*([\s\S]{0,600})/i);
  const preferredSection = text.match(/(?:preferred|nice to have|bonus)[:\s]*([\s\S]{0,400})/i);

  const extractFromSection = (section: string | undefined): string[] => {
    if (!section) return [];
    const skills: string[] = [];
    const sectionLower = section.toLowerCase();
    KNOWN_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(sectionLower)) skills.push(skill);
    });
    return skills;
  };

  // Extract from sections
  const reqFromSection = extractFromSection(requiredSection?.[1]);
  const prefFromSection = extractFromSection(preferredSection?.[1]);

  // Also scan entire text for skills
  KNOWN_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowered)) {
      if (reqFromSection.includes(skill)) {
        if (!requiredSkills.includes(skill)) requiredSkills.push(skill);
      } else if (prefFromSection.includes(skill)) {
        if (!preferredSkills.includes(skill)) preferredSkills.push(skill);
      } else {
        if (!requiredSkills.includes(skill)) requiredSkills.push(skill);
      }
    }
  });

  // Extract experience requirement
  let requiredExperience = 0;
  const expMatch = text.match(/(\d+)\+?\s*years?/i);
  if (expMatch) requiredExperience = parseInt(expMatch[1], 10);

  // Check if education is mentioned
  const educationRequired = /(?:bachelor|master|degree|phd|b\.?s\.?|m\.?s\.?)/i.test(text);

  return { requiredSkills, preferredSkills, requiredExperience, educationRequired };
}

// ─────────────────────────────────────────────────────────────
// Learning Resources Database
// ─────────────────────────────────────────────────────────────

const LEARNING_RESOURCES: Record<string, LearningResource['resources']> = {
  'react': [
    { name: 'React Official Docs', url: 'https://react.dev', type: 'documentation' },
    { name: 'React Course on Udemy', url: 'https://udemy.com/course/react-the-complete-guide', type: 'course' },
  ],
  'typescript': [
    { name: 'TypeScript Handbook', url: 'https://typescriptlang.org/docs', type: 'documentation' },
    { name: 'TypeScript Deep Dive', url: 'https://basarat.gitbook.io/typescript', type: 'tutorial' },
  ],
  'next.js': [
    { name: 'Next.js Learn', url: 'https://nextjs.org/learn', type: 'tutorial' },
    { name: 'Next.js Docs', url: 'https://nextjs.org/docs', type: 'documentation' },
  ],
  'node': [
    { name: 'Node.js Docs', url: 'https://nodejs.org/docs', type: 'documentation' },
    { name: 'The Node.js Handbook', url: 'https://flaviocopes.com/node', type: 'tutorial' },
  ],
  'python': [
    { name: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial', type: 'documentation' },
    { name: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com', type: 'tutorial' },
  ],
  'aws': [
    { name: 'AWS Training', url: 'https://aws.amazon.com/training', type: 'course' },
    { name: 'AWS Certified Solutions Architect', url: 'https://aws.amazon.com/certification', type: 'certification' },
  ],
  'docker': [
    { name: 'Docker Get Started', url: 'https://docs.docker.com/get-started', type: 'tutorial' },
    { name: 'Docker Mastery on Udemy', url: 'https://udemy.com/course/docker-mastery', type: 'course' },
  ],
  'kubernetes': [
    { name: 'Kubernetes Docs', url: 'https://kubernetes.io/docs', type: 'documentation' },
    { name: 'CKAD Certification', url: 'https://training.linuxfoundation.org/certification/ckad', type: 'certification' },
  ],
  'sql': [
    { name: 'SQLBolt Interactive Tutorial', url: 'https://sqlbolt.com', type: 'tutorial' },
    { name: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial', type: 'tutorial' },
  ],
  'graphql': [
    { name: 'GraphQL Learn', url: 'https://graphql.org/learn', type: 'documentation' },
    { name: 'How to GraphQL', url: 'https://howtographql.com', type: 'tutorial' },
  ],
};

function getLearningResources(missingSkills: string[]): LearningResource[] {
  return missingSkills
    .filter(skill => LEARNING_RESOURCES[skill.toLowerCase()])
    .map(skill => ({
      skill,
      resources: LEARNING_RESOURCES[skill.toLowerCase()] || [],
    }));
}

// ─────────────────────────────────────────────────────────────
// Scoring Functions
// ─────────────────────────────────────────────────────────────

function calculateSkillScore(resumeSkills: string[], requiredSkills: string[], preferredSkills: string[]): {
  score: number;
  matched: string[];
  missing: string[];
  bonus: string[];
  skillMatches: SkillMatch[];
} {
  const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
  
  const matchSkill = (skill: string) => {
    const skillLower = skill.toLowerCase();
    return resumeSkillsLower.some(rs => 
      rs.includes(skillLower) || skillLower.includes(rs) || rs === skillLower
    );
  };

  const matchedRequired = requiredSkills.filter(matchSkill);
  const matchedPreferred = preferredSkills.filter(matchSkill);
  const missingRequired = requiredSkills.filter(s => !matchSkill(s));
  const missingPreferred = preferredSkills.filter(s => !matchSkill(s));

  // Bonus skills: skills in resume not in job requirements
  const allJobSkills = [...requiredSkills, ...preferredSkills].map(s => s.toLowerCase());
  const bonusSkills = resumeSkillsLower.filter(s => !allJobSkills.includes(s));

  // Build skill matches array
  const skillMatches: SkillMatch[] = [
    ...requiredSkills.map(s => ({ skill: s, matched: matchSkill(s), importance: 'required' as const })),
    ...preferredSkills.map(s => ({ skill: s, matched: matchSkill(s), importance: 'preferred' as const })),
  ];

  // Calculate score: required skills worth 70%, preferred worth 30%
  const requiredScore = requiredSkills.length > 0 
    ? (matchedRequired.length / requiredSkills.length) * 70 
    : 35;
  const preferredScore = preferredSkills.length > 0 
    ? (matchedPreferred.length / preferredSkills.length) * 30 
    : 15;

  return {
    score: Math.round(requiredScore + preferredScore),
    matched: [...matchedRequired, ...matchedPreferred],
    missing: [...missingRequired, ...missingPreferred],
    bonus: bonusSkills,
    skillMatches,
  };
}

function calculateExperienceScore(candidateYears: number, requiredYears: number): {
  score: number;
  match: 'exceeds' | 'meets' | 'below' | 'unknown';
} {
  if (requiredYears === 0) return { score: 50, match: 'unknown' };
  
  const ratio = candidateYears / requiredYears;
  
  if (ratio >= 1.2) return { score: 100, match: 'exceeds' };
  if (ratio >= 0.8) return { score: 80, match: 'meets' };
  if (ratio >= 0.5) return { score: 50, match: 'below' };
  return { score: 25, match: 'below' };
}

function calculateEducationScore(resume: ParsedResume, educationRequired: boolean): number {
  if (!educationRequired) return 70;
  if (resume.education.length === 0) return 30;
  
  // Check for advanced degrees
  const hasAdvanced = resume.education.some(e => 
    /(?:master|m\.?s\.?|m\.?a\.?|mba|ph\.?d)/i.test(e.degree || '')
  );
  if (hasAdvanced) return 100;
  
  const hasBachelor = resume.education.some(e => 
    /(?:bachelor|b\.?s\.?|b\.?a\.?)/i.test(e.degree || '')
  );
  if (hasBachelor) return 80;
  
  return 50;
}

function getGrade(score: number): MatchResult['grade'] {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function generateRecommendations(result: Partial<MatchResult>, jobData: ExtractedJobData): string[] {
  const recommendations: string[] = [];

  if ((result.missingSkills?.length || 0) > 0) {
    recommendations.push(`Consider learning these in-demand skills: ${result.missingSkills?.slice(0, 3).join(', ')}`);
  }

  if (result.experienceMatch === 'below') {
    recommendations.push('Highlight relevant projects or internships to compensate for experience gap');
  }

  if (result.breakdown?.educationScore && result.breakdown.educationScore < 70) {
    recommendations.push('Consider pursuing relevant certifications to strengthen your education profile');
  }

  if ((result.bonusSkills?.length || 0) > 2) {
    recommendations.push('Great! You have additional skills. Highlight them in your cover letter');
  }

  if (result.score && result.score < 50) {
    recommendations.push('This role may not be the best fit. Consider positions more aligned with your current skillset');
  } else if (result.score && result.score >= 80) {
    recommendations.push('Strong match! Tailor your resume to emphasize the matching skills');
  }

  return recommendations;
}

// ─────────────────────────────────────────────────────────────
// Main Matcher
// ─────────────────────────────────────────────────────────────

export function matchResumeToJob(resume: ParsedResume, jobDescription: string): MatchResult {
  const jobData = extractJobData(jobDescription);

  // Calculate individual scores
  const skillResult = calculateSkillScore(
    resume.skills, 
    jobData.requiredSkills, 
    jobData.preferredSkills
  );
  
  const expResult = calculateExperienceScore(
    resume.experienceYears, 
    jobData.requiredExperience
  );
  
  const eduScore = calculateEducationScore(resume, jobData.educationRequired);

  // Weighted overall score
  const overallScore = Math.round(
    skillResult.score * 0.60 +
    expResult.score * 0.25 +
    eduScore * 0.15
  );

  const breakdown: MatchBreakdown = {
    skillScore: skillResult.score,
    experienceScore: expResult.score,
    educationScore: eduScore,
    overallScore,
  };

  const partialResult = {
    score: overallScore,
    breakdown,
    missingSkills: skillResult.missing,
    bonusSkills: skillResult.bonus,
    experienceMatch: expResult.match,
  };

  const recommendations = generateRecommendations(partialResult, jobData);
  const learningResources = getLearningResources(skillResult.missing);

  return {
    score: overallScore,
    grade: getGrade(overallScore),
    breakdown,
    skillMatches: skillResult.skillMatches,
    matchedSkills: skillResult.matched,
    missingSkills: skillResult.missing,
    bonusSkills: skillResult.bonus,
    experienceMatch: expResult.match,
    recommendations,
    learningResources,
    resume,
  };
}

export default matchResumeToJob;
