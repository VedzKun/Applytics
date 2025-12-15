import { NextResponse } from 'next/server';
import { parseResumeFromText } from '@/lib/parser';
import { analyzeResumeStrength } from '@/lib/strength';

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
        { error: 'Resume text is too short' },
        { status: 400 }
      );
    }

    const parsed = parseResumeFromText(text);
    const strength = analyzeResumeStrength(parsed);

    return NextResponse.json({
      success: true,
      parsed,
      strength,
    });
  } catch (error) {
    console.error('Strength analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume strength', details: String(error) },
      { status: 500 }
    );
  }
}
