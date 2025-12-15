import type { ParsedResume } from './parser';

export type StrengthCategory = {
  name: string;
  score: number;
  maxScore: number;
  tips: string[];
};

export type ResumeStrengthResult = {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  categories: StrengthCategory[];
  topStrengths: string[];
  improvements: string[];
  completeness: number;
};

// ─────────────────────────────────────────────────────────────
// Strength Calculation
// ─────────────────────────────────────────────────────────────

function evaluateContactInfo(resume: ParsedResume): StrengthCategory {
  let score = 0;
  const tips: string[] = [];

  if (resume.email) score += 3; else tips.push('Add a professional email address');
  if (resume.phone) score += 2; else tips.push('Include a phone number');
  if (resume.linkedin) score += 3; else tips.push('Add your LinkedIn profile URL');
  if (resume.github) score += 2; else tips.push('Include GitHub for technical roles');
  if (resume.location) score += 1;

  return { name: 'Contact Information', score, maxScore: 11, tips };
}

function evaluateSkills(resume: ParsedResume): StrengthCategory {
  const tips: string[] = [];
  let score = Math.min(resume.skills.length * 2, 20);

  if (resume.skills.length < 5) tips.push('Add more relevant technical skills');
  if (resume.skills.length < 10) tips.push('Consider including soft skills like leadership, communication');
  if (resume.skills.length === 0) tips.push('Skills section is critical - add your technical and soft skills');

  // Check for skill variety
  const hasFramework = resume.skills.some(s => /react|vue|angular|django|spring/i.test(s));
  const hasLanguage = resume.skills.some(s => /javascript|python|java|typescript|c#/i.test(s));
  const hasCloud = resume.skills.some(s => /aws|azure|gcp|docker|kubernetes/i.test(s));

  if (!hasFramework) tips.push('Consider adding framework experience');
  if (!hasLanguage) tips.push('List programming languages you know');
  if (!hasCloud) tips.push('Cloud skills (AWS, Azure, Docker) are highly valued');

  return { name: 'Skills', score, maxScore: 20, tips };
}

function evaluateExperience(resume: ParsedResume): StrengthCategory {
  const tips: string[] = [];
  let score = 0;

  // Years of experience
  score += Math.min(resume.experienceYears * 3, 15);

  // Work history entries
  const expCount = resume.workExperience.length;
  score += Math.min(expCount * 2, 10);

  if (expCount === 0) tips.push('Add your work experience with job titles and companies');
  if (resume.experienceYears === 0) tips.push('Include dates for your work experience');
  if (expCount > 0 && expCount < 3) tips.push('Include more relevant work history if available');

  return { name: 'Experience', score, maxScore: 25, tips };
}

function evaluateEducation(resume: ParsedResume): StrengthCategory {
  const tips: string[] = [];
  let score = 0;

  if (resume.education.length > 0) {
    score += 8;
    
    const hasAdvanced = resume.education.some(e => 
      /master|mba|ph\.?d/i.test(e.degree || '')
    );
    if (hasAdvanced) score += 7;
    else score += 3;
  } else {
    tips.push('Add your educational background');
  }

  // Certifications
  const certCount = resume.certifications.length;
  score += Math.min(certCount * 2, 6);
  if (certCount === 0) tips.push('Industry certifications can strengthen your profile');

  return { name: 'Education & Certifications', score, maxScore: 21, tips };
}

function evaluateSummary(resume: ParsedResume): StrengthCategory {
  const tips: string[] = [];
  let score = 0;

  if (resume.summary) {
    const wordCount = resume.summary.split(/\s+/).length;
    if (wordCount >= 30) score += 10;
    else if (wordCount >= 15) score += 6;
    else score += 3;

    if (wordCount < 30) tips.push('Expand your summary to 30-50 words for better impact');
    if (wordCount > 100) tips.push('Consider condensing your summary to be more impactful');
  } else {
    tips.push('Add a professional summary highlighting your key strengths');
  }

  return { name: 'Professional Summary', score, maxScore: 10, tips };
}

function evaluatePresentation(resume: ParsedResume): StrengthCategory {
  const tips: string[] = [];
  let score = 0;

  // Check name format
  if (resume.name) {
    score += 5;
    if (resume.name.split(' ').length >= 2) score += 3;
  } else {
    tips.push('Make sure your full name is prominently displayed');
  }

  // Languages (bonus for multilingual)
  if (resume.languages.length > 1) score += 5;
  else if (resume.languages.length === 0) tips.push('Consider adding language proficiencies');

  return { name: 'Presentation', score, maxScore: 13, tips };
}

function getGrade(score: number): ResumeStrengthResult['grade'] {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

// ─────────────────────────────────────────────────────────────
// Main Function
// ─────────────────────────────────────────────────────────────

export function analyzeResumeStrength(resume: ParsedResume): ResumeStrengthResult {
  const categories = [
    evaluateContactInfo(resume),
    evaluateSkills(resume),
    evaluateExperience(resume),
    evaluateEducation(resume),
    evaluateSummary(resume),
    evaluatePresentation(resume),
  ];

  const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
  const maxScore = categories.reduce((sum, c) => sum + c.maxScore, 0);
  const overallScore = Math.round((totalScore / maxScore) * 100);

  // Calculate completeness (percentage of fields filled)
  let filledFields = 0;
  let totalFields = 10;
  if (resume.name) filledFields++;
  if (resume.email) filledFields++;
  if (resume.phone) filledFields++;
  if (resume.linkedin) filledFields++;
  if (resume.skills.length > 0) filledFields++;
  if (resume.summary) filledFields++;
  if (resume.education.length > 0) filledFields++;
  if (resume.workExperience.length > 0) filledFields++;
  if (resume.certifications.length > 0) filledFields++;
  if (resume.languages.length > 0) filledFields++;

  const completeness = Math.round((filledFields / totalFields) * 100);

  // Identify top strengths
  const topStrengths: string[] = [];
  const sortedCategories = [...categories].sort((a, b) => 
    (b.score / b.maxScore) - (a.score / a.maxScore)
  );
  
  sortedCategories.slice(0, 2).forEach(c => {
    if (c.score / c.maxScore >= 0.6) {
      topStrengths.push(`Strong ${c.name.toLowerCase()}`);
    }
  });

  if (resume.skills.length >= 10) topStrengths.push('Diverse skill set');
  if (resume.experienceYears >= 5) topStrengths.push('Significant experience');

  // Collect all improvement tips
  const improvements = categories
    .flatMap(c => c.tips)
    .slice(0, 8);

  return {
    overallScore,
    grade: getGrade(overallScore),
    categories,
    topStrengths,
    improvements,
    completeness,
  };
}

export default analyzeResumeStrength;
