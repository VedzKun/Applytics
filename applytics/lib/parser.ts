export type Education = {
  degree?: string;
  institution?: string;
  year?: string;
  field?: string;
};

export type WorkExperience = {
  title?: string;
  company?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type ParsedResume = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  summary?: string;
  experienceYears: number;
  education: Education[];
  workExperience: WorkExperience[];
  certifications: string[];
  languages: string[];
};

// ─────────────────────────────────────────────────────────────
// Extraction Helpers
// ─────────────────────────────────────────────────────────────

function extractEmail(text: string): string | undefined {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0].toLowerCase() : undefined;
}

function extractPhone(text: string): string | undefined {
  const patterns = [
    /\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  return undefined;
}

function extractLinkedIn(text: string): string | undefined {
  const m = text.match(/linkedin\.com\/in\/[\w-]+/i);
  return m ? `https://${m[0]}` : undefined;
}

function extractGitHub(text: string): string | undefined {
  const m = text.match(/github\.com\/[\w-]+/i);
  return m ? `https://${m[0]}` : undefined;
}

function extractLocation(text: string): string | undefined {
  const patterns = [
    /(?:location|address|city)[:\s]+([A-Za-z\s,]+)/i,
    /([A-Z][a-z]+,\s*[A-Z]{2})/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
  return undefined;
}

function guessName(text: string): string | undefined {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return undefined;
  const first = lines[0];
  // Name is usually 2-4 words, letters only
  if (/^[A-Za-z\s,.'-]{2,50}$/i.test(first) && first.split(/\s+/).length <= 4) {
    return first;
  }
  const m = text.match(/name[:\-]\s*([A-Za-z\s,.'-]+)/i);
  return m ? m[1].trim() : undefined;
}

const KNOWN_SKILLS = [
  'javascript', 'typescript', 'react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'next',
  'node', 'node.js', 'nodejs', 'express', 'express.js',
  'python', 'django', 'flask', 'fastapi',
  'java', 'spring', 'spring boot', 'springboot',
  'c#', '.net', 'asp.net', 'c++', 'c',
  'go', 'golang', 'rust', 'ruby', 'rails', 'ruby on rails',
  'php', 'laravel', 'symfony',
  'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch',
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
  'terraform', 'ansible', 'jenkins', 'ci/cd', 'git', 'github', 'gitlab',
  'html', 'html5', 'css', 'css3', 'sass', 'scss', 'tailwind', 'tailwindcss',
  'vue', 'vue.js', 'vuejs', 'angular', 'svelte',
  'graphql', 'rest', 'restful', 'api',
  'machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence',
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
  'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator',
  'agile', 'scrum', 'jira', 'confluence',
  'linux', 'unix', 'bash', 'shell', 'powershell',
];

function extractSkills(text: string): string[] {
  const skills: string[] = [];
  const lowered = text.toLowerCase();

  // Try to find skills section
  const skillsSection = text.match(/(?:skills|technical skills|technologies|tech stack)[:\s]*([\s\S]{0,500})/i);
  if (skillsSection) {
    const block = skillsSection[1].split(/\n\n/)[0];
    block.split(/[;,|·•\n]/).forEach(s => {
      const t = s.trim().toLowerCase();
      if (t && t.length > 1 && t.length < 40) skills.push(t);
    });
  }

  // Also scan for known skills throughout
  KNOWN_SKILLS.forEach(k => {
    const regex = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowered) && !skills.includes(k)) {
      skills.push(k);
    }
  });

  // Dedupe and clean
  return Array.from(new Set(skills.map(s => s.replace(/\s+/g, ' ').trim()))).filter(Boolean);
}

function extractExperienceYears(text: string): number {
  // Look for explicit mentions
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of)?\s*(?:experience|exp)/i,
    /experience[:\s]*(\d+)\+?\s*years?/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return parseInt(m[1], 10);
  }

  // Try to calculate from work history dates
  const dateRanges = text.matchAll(/(\d{4})\s*[-–]\s*(?:(\d{4})|present|current|now)/gi);
  let totalYears = 0;
  for (const match of dateRanges) {
    const start = parseInt(match[1], 10);
    const end = match[2] ? parseInt(match[2], 10) : new Date().getFullYear();
    totalYears += Math.max(0, end - start);
  }
  return totalYears;
}

function extractEducation(text: string): Education[] {
  const education: Education[] = [];
  const degrees = [
    /(?:bachelor|b\.?s\.?|b\.?a\.?|b\.?sc\.?|b\.?tech)/i,
    /(?:master|m\.?s\.?|m\.?a\.?|m\.?sc\.?|m\.?tech|mba)/i,
    /(?:ph\.?d\.?|doctorate|doctoral)/i,
    /(?:associate|a\.?s\.?|a\.?a\.?)/i,
  ];

  const lines = text.split(/\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const degreePattern of degrees) {
      if (degreePattern.test(line)) {
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        education.push({
          degree: line.trim(),
          year: yearMatch ? yearMatch[0] : undefined,
        });
        break;
      }
    }
  }

  return education;
}

function extractWorkExperience(text: string): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  
  // Look for work experience section
  const expSection = text.match(/(?:experience|work history|employment)[:\s]*([\s\S]*?)(?=(?:education|skills|certifications|$))/i);
  if (!expSection) return experiences;

  const section = expSection[1];
  const blocks = section.split(/\n{2,}/);

  for (const block of blocks) {
    if (block.trim().length < 10) continue;
    const lines = block.split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;

    const dateMatch = block.match(/(\d{4})\s*[-–]\s*(?:(\d{4})|present|current|now)/i);
    experiences.push({
      title: lines[0]?.trim(),
      company: lines[1]?.trim(),
      duration: dateMatch ? dateMatch[0] : undefined,
    });
  }

  return experiences.slice(0, 10); // Limit to prevent noise
}

function extractCertifications(text: string): string[] {
  const certs: string[] = [];
  const certSection = text.match(/(?:certifications?|certificates?|credentials?)[:\s]*([\s\S]{0,500})/i);
  if (certSection) {
    certSection[1].split(/\n/).forEach(line => {
      const t = line.trim();
      if (t && t.length > 3 && t.length < 100) certs.push(t);
    });
  }
  return certs.slice(0, 10);
}

function extractLanguages(text: string): string[] {
  const langs: string[] = [];
  const langSection = text.match(/(?:languages?)[:\s]*([\s\S]{0,200})/i);
  if (langSection) {
    langSection[1].split(/[,;\n]/).forEach(l => {
      const t = l.trim();
      if (t && t.length > 1 && t.length < 30) langs.push(t);
    });
  }
  return langs.slice(0, 10);
}

function extractSummary(text: string): string | undefined {
  const patterns = [
    /(?:summary|profile|about me|objective|professional summary)[:\s]*([\s\S]{0,500})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const summary = m[1].split(/\n\n/)[0].trim();
      if (summary.length > 20) return summary;
    }
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────
// Main Parser
// ─────────────────────────────────────────────────────────────

export function parseResumeFromText(raw: string): ParsedResume {
  const text = raw.replace(/\r/g, '');

  return {
    name: guessName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    linkedin: extractLinkedIn(text),
    github: extractGitHub(text),
    portfolio: undefined,
    skills: extractSkills(text),
    summary: extractSummary(text),
    experienceYears: extractExperienceYears(text),
    education: extractEducation(text),
    workExperience: extractWorkExperience(text),
    certifications: extractCertifications(text),
    languages: extractLanguages(text),
  };
}

export default parseResumeFromText;
