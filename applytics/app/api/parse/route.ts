import { NextResponse } from 'next/server';
import { parseResumeFromText } from '@/lib/parser';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Please provide resume text in the `text` field' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Resume text is too short. Please provide more content.' },
        { status: 400 }
      );
    }

    const parsed = parseResumeFromText(text);

    return NextResponse.json({
      success: true,
      parsed,
      meta: {
        skillCount: parsed.skills.length,
        experienceYears: parsed.experienceYears,
        educationCount: parsed.education.length,
        workHistoryCount: parsed.workExperience.length,
      },
    });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume', details: String(error) },
      { status: 500 }
    );
  }
}
