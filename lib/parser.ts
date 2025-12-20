export type ParsedResume = {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  summary?: string;
  experienceYears?: number;
  education?: string[];
  jobs?: Array<{ title?: string; company?: string; startDate?: string; endDate?: string }>;
};

function extractEmail(text: string) {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : undefined;
}

function extractPhone(text: string) {
  const m = text.match(/(\+?\d{1,3}[ \-\.]?)?(\(?\d{3}\)?[ \-\.]?)?\d{3}[ \-\.]?\d{4}/);
  return m ? m[0].trim() : undefined;
}

function guessName(text: string) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return undefined;
  const first = lines[0];
  if (/^[A-Za-z ,.'-]{2,}$/i.test(first) && first.split(/\s+/).length <= 4) return first;
  const m = text.match(/name[:\-]\s*([A-Za-z ,.'-]+)/i);
  return m ? m[1].trim() : undefined;
}

function extractSkills(text: string) {
  const skills: string[] = [];
  const skillsSection = text.match(/(?:skills|technical skills|technologies)[\s:]*([\s\S]{0,300})/i);
  if (skillsSection) {
    const block = skillsSection[1].split(/\n/)[0];
    block.split(/[;,|·•]/).forEach(s => {
      const t = s.trim();
      if (t) skills.push(t);
    });
  }
  if (skills.length === 0) {
    const known = ['javascript','typescript','react','node','python','java','sql','aws','docker','kubernetes','html','css','next.js','next','git','c#','c++','go','ruby'];
    const lowered = text.toLowerCase();
    known.forEach(k => { if (lowered.includes(k)) skills.push(k); });
  }
  return Array.from(new Set(skills.map(s => s.replace(/\s+/g,' ').trim())));
}

function extractExperienceYears(text: string) {
  const m = text.match(/(\d+)\+?\s+years?/i);
  if (m) return parseInt(m[1], 10);
  return undefined;
}

export function parseResumeFromText(raw: string): ParsedResume {
  const text = raw.replace(/\r/g,'');
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const name = guessName(text);
  const skills = extractSkills(text);
  const experienceYears = extractExperienceYears(text);
  const summaryMatch = text.match(/(?:summary|profile|about me)[:\-]?\s*([\s\S]{0,300})/i);
  const summary = summaryMatch ? summaryMatch[1].split('\n')[0].trim() : undefined;

  return {
    name,
    email,
    phone,
    skills,
    summary,
    experienceYears,
  } as ParsedResume;
}

export default parseResumeFromText;
