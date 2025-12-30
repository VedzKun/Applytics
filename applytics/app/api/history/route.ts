import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'history.json');

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(FILE_PATH);
  } catch (err) {
    await fs.writeFile(FILE_PATH, '[]', 'utf8');
  }
}

async function readAll() {
  await ensureFile();
  const raw = await fs.readFile(FILE_PATH, 'utf8');
  try { return JSON.parse(raw || '[]'); } catch { return []; }
}

async function writeAll(items: any[]) {
  await ensureFile();
  await fs.writeFile(FILE_PATH, JSON.stringify(items, null, 2), 'utf8');
}

export async function GET() {
  try {
    const items = await readAll();
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read history' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = await readAll();
    // ensure id
    if (!body.id) body.id = Math.random().toString(36).substring(2, 12);
    body.date = body.date || new Date().toLocaleString();
    const updated = [body, ...items.filter((i: any) => i.id !== body.id)].slice(0, 50);
    await writeAll(updated);
    return NextResponse.json({ ok: true, item: body });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const items = await readAll();
    const updated = items.map((it: any) => it.id === body.id ? { ...it, ...body } : it);
    await writeAll(updated);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update history' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const items = await readAll();
    const updated = items.filter((it: any) => it.id !== id);
    await writeAll(updated);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 });
  }
}
