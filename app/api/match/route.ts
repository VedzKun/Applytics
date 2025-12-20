import { NextResponse } from 'next/server';
import { parseResumeFromText } from '../../../lib/parser';
import { matchResumeToJob } from '../../../lib/matcher';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body;
    if (!resumeText || !jobDescription) return NextResponse.json({ error: 'Provide `resumeText` and `jobDescription`' }, { status: 400 });
    const parsed = parseResumeFromText(String(resumeText));
    const result = matchResumeToJob(parsed, String(jobDescription));
    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON or server error', details: String(err) }, { status: 500 });
  }
}
