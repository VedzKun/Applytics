import { NextResponse } from 'next/server';
import { parseResumeFromText } from '../../../lib/parser';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;
    if (!text) return NextResponse.json({ error: 'Provide resume text in `text` field' }, { status: 400 });
    const parsed = parseResumeFromText(String(text));
    return NextResponse.json({ parsed });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON or server error', details: String(err) }, { status: 500 });
  }
}
