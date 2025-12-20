"use client";
import { useState } from 'react';

export default function DashboardPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [parsed, setParsed] = useState(null as any);
  const [match, setMatch] = useState(null as any);
  const [loading, setLoading] = useState(false);

  async function handleParse() {
    setLoading(true);
    const res = await fetch('/api/parse', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: resumeText }) });
    const j = await res.json();
    setParsed(j.parsed || j);
    setLoading(false);
  }

  async function handleMatch() {
    setLoading(true);
    const res = await fetch('/api/match', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ resumeText, jobDescription: jobDesc }) });
    const j = await res.json();
    setMatch(j.result || j);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Resume Parser & Matcher</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label>Paste resume text</label>
          <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={12} style={{ width: '100%' }} />
          <div style={{ marginTop: 8 }}>
            <button onClick={handleParse} disabled={loading}>Parse Resume</button>
          </div>
        </div>
        <div>
          <label>Paste job description</label>
          <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={12} style={{ width: '100%' }} />
          <div style={{ marginTop: 8 }}>
            <button onClick={handleMatch} disabled={loading}>Match Resume</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Parsed Resume</h2>
        <pre style={{ background: '#f6f6f8', padding: 12 }}>{parsed ? JSON.stringify(parsed, null, 2) : '—'}</pre>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Match Result</h2>
        <pre style={{ background: '#f6f6f8', padding: 12 }}>{match ? JSON.stringify(match, null, 2) : '—'}</pre>
      </div>
    </div>
  );
}
