import { NextResponse } from 'next/server';
import { parseResumeFromText } from '@/lib/parser';
import { matchResumeToJob } from '@/lib/matcher';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json(
        { error: 'Please provide resume text in the `resumeText` field' },
        { status: 400 }
      );
    }

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        { error: 'Please provide job description in the `jobDescription` field' },
        { status: 400 }
      );
    }

    if (resumeText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Resume text is too short' },
        { status: 400 }
      );
    }

    const parsed = parseResumeFromText(resumeText);
    const result = matchResumeToJob(parsed, jobDescription);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json(
      { error: 'Failed to match resume to job', details: String(error) },
      { status: 500 }
    );
  }
}
