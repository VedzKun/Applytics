# Resume Parser & Matcher (prototype)

This repository has a minimal prototype for parsing resume text and matching candidates to job descriptions.

APIs added:

- `POST /api/parse` — JSON body `{ "text": "<resume plain text>" }` → returns parsed fields (name, email, phone, skills, summary, experienceYears).
- `POST /api/match` — JSON body `{ "resumeText": "...", "jobDescription": "..." }` → returns a match score and matched skills.

Quick curl examples (run after `npm run dev`):

```bash
curl -s -X POST http://localhost:3000/api/parse -H 'Content-Type: application/json' -d '{"text":"John Doe\nEmail: john@example.com\nSkills: React, Node, AWS\n5 years"}'

curl -s -X POST http://localhost:3000/api/match -H 'Content-Type: application/json' -d '{"resumeText":"John Doe\nSkills: React, Node","jobDescription":"Looking for React, TypeScript, Node"}'
```

Interactive UI:

- Visit `/dashboard` to paste resume text and a job description and see parse + match results.

Notes:

- The parser is intentionally simple — it expects plain text input. For production, add PDF/DOCX extractors and improve NER.
- The matcher uses keyword overlap heuristics. Consider embedding-based semantic matching (e.g., using sentence embeddings) for better results.
