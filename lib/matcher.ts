import type { ParsedResume } from './parser';

export type MatchResult = {
  score: number; // 0-100
  matchedSkills: string[];
  requiredSkills: string[];
  resume: ParsedResume;
};

function extractSkillsFromJob(text: string) {
  const skills: string[] = [];
  const m = text.match(/(?:skills required|requirements|must have|requirements:)[\s:]*([\s\S]{0,300})/i);
  if (m) {
    const block = m[1].split(/\n/)[0];
    block.split(/[;,|·•]/).forEach(s => { const t = s.trim(); if (t) skills.push(t.toLowerCase()); });
  }
  // fallback: split by whitespace and pick words that look like keywords (short list)
  if (skills.length === 0) {
    const tokens = text.toLowerCase().split(/[^a-z0-9+.#-]+/).filter(Boolean);
    const common = ['javascript','typescript','react','node','python','java','sql','aws','docker','kubernetes','html','css','next','git','c#','c++','go','ruby'];
    common.forEach(k => { if (tokens.includes(k)) skills.push(k); });
  }
  return Array.from(new Set(skills));
}

export function matchResumeToJob(resume: ParsedResume, jobDescription: string): MatchResult {
  const required = extractSkillsFromJob(jobDescription);
  const resumeSkillsLower = (resume.skills || []).map(s => s.toLowerCase());
  const matched = required.filter(r => resumeSkillsLower.some(rs => rs.includes(r) || r.includes(rs)));
  const baseScore = required.length === 0 ? 0 : Math.round((matched.length / required.length) * 100);
  let score = baseScore;
  if (resume.experienceYears && resume.experienceYears >= 5) score = Math.min(100, score + 10);
  return {
    score,
    matchedSkills: matched,
    requiredSkills: required,
    resume,
  } as MatchResult;
}

export default matchResumeToJob;
