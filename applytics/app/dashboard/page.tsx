"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type ParsedResume = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  summary?: string;
  experienceYears: number;
  education: Array<{ degree?: string; year?: string }>;
  workExperience: Array<{ title?: string; company?: string; duration?: string }>;
  certifications: string[];
  languages: string[];
};

type MatchResult = {
  score: number;
  grade: string;
  breakdown: {
    skillScore: number;
    experienceScore: number;
    educationScore: number;
    overallScore: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
  experienceMatch: string;
  recommendations: string[];
  learningResources: Array<{
    skill: string;
    resources: Array<{ name: string; url: string; type: string }>;
  }>;
};

type StrengthResult = {
  overallScore: number;
  grade: string;
  categories: Array<{
    name: string;
    score: number;
    maxScore: number;
    tips: string[];
  }>;
  topStrengths: string[];
  improvements: string[];
  completeness: number;
};

// Sample data for demo
const SAMPLE_RESUME = `John Smith
john.smith@email.com | (555) 123-4567
San Francisco, CA
linkedin.com/in/johnsmith | github.com/johnsmith

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 6+ years of experience building scalable web applications. 
Passionate about clean code, user experience, and mentoring junior developers.

SKILLS
JavaScript, TypeScript, React, Next.js, Node.js, Express, Python, PostgreSQL, MongoDB, 
AWS, Docker, Kubernetes, Git, Agile, Scrum

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2021 - Present
- Led development of microservices architecture serving 1M+ users
- Mentored team of 5 junior developers

Software Engineer | StartupXYZ | 2018 - 2021
- Built React dashboard reducing customer churn by 25%
- Implemented CI/CD pipeline with Jenkins and Docker

EDUCATION
Bachelor of Science in Computer Science | MIT | 2018

CERTIFICATIONS
AWS Solutions Architect Associate
Google Cloud Professional Developer`;

const SAMPLE_JOB = `Senior Full Stack Developer

We're looking for a Senior Full Stack Developer to join our growing team.

Requirements:
- 5+ years of experience in web development
- Strong proficiency in React, TypeScript, and Node.js
- Experience with cloud platforms (AWS preferred)
- Knowledge of Docker and container orchestration
- PostgreSQL or similar relational database experience
- Excellent communication skills

Nice to have:
- Experience with Next.js
- Kubernetes experience
- Python knowledge
- GraphQL experience

Benefits:
- Competitive salary
- Remote work
- Health insurance`;

export default function DashboardPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [activeTab, setActiveTab] = useState<"match" | "parse" | "strength">("match");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [strengthResult, setStrengthResult] = useState<StrengthResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // PDF Upload states
  const [inputMode, setInputMode] = useState<"text" | "pdf">("text");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSampleData = () => {
    setResumeText(SAMPLE_RESUME);
    setJobDesc(SAMPLE_JOB);
    setInputMode("text");
    setUploadedFile(null);
  };

  const clearAll = () => {
    setResumeText("");
    setJobDesc("");
    setParsed(null);
    setMatchResult(null);
    setStrengthResult(null);
    setError(null);
    setUploadedFile(null);
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB");
      return;
    }

    setUploadedFile(file);
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload file");
      }

      setResumeText(data.text);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process PDF");
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  }, []);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResumeText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleParse = async () => {
    if (!resumeText.trim()) {
      setError("Please enter resume text");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: resumeText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setParsed(data.parsed);
      setActiveTab("parse");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse resume");
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!resumeText.trim()) {
      setError("Please enter resume text");
      return;
    }
    if (!jobDesc.trim()) {
      setError("Please enter job description");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription: jobDesc }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMatchResult(data.result);
      setParsed(data.result.resume);
      setActiveTab("match");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to match resume");
    } finally {
      setLoading(false);
    }
  };

  const handleStrength = async () => {
    if (!resumeText.trim()) {
      setError("Please enter resume text");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/strength", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: resumeText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStrengthResult(data.strength);
      setParsed(data.parsed);
      setActiveTab("strength");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze strength");
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 85) return "score-a";
    if (score >= 70) return "score-b";
    if (score >= 55) return "score-c";
    return "score-d";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-500";
    if (grade === "B") return "text-blue-500";
    if (grade === "C") return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="z-50 glass border-[var(--border)]"
        style={{
          position: "fixed",
          left: "50%",
          top: "20px",
          transform: "translateX(-50%)",
          width: "min(96%, 1100px)",
          padding: "8px 18px",
          borderRadius: "9999px",
          boxShadow: "0 8px 24px rgba(2,6,23,0.12)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 50,
        }}
      >
        <div className="max-w-7xl mx-auto px-2 py-0 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold">AT</div>
            <span className="text-xl font-bold">Applytics</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={loadSampleData} className="btn btn-secondary text-sm py-2 px-4">
              Load Sample
            </button>
            <button onClick={clearAll} className="text-[var(--muted)] hover:text-[var(--foreground)] text-sm">
              Clear All
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 animate-fade-in">
            <div className="flex items-center gap-2">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">Close</button>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Resume Input */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">Resume</h2>
              {/* Input Mode Toggle */}
              <div className="flex items-center gap-2 bg-[var(--background)] rounded-lg p-1">
                <button
                  onClick={() => setInputMode("text")}
                  className={`px-3 py-1.5 text-sm rounded-md transition font-medium ${
                    inputMode === "text"
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Text
                </button>
                <button
                  onClick={() => setInputMode("pdf")}
                  className={`px-3 py-1.5 text-sm rounded-md transition font-medium ${
                    inputMode === "pdf"
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  PDF
                </button>
              </div>
            </div>

            {/* Text Input Mode */}
            {inputMode === "text" && (
              <>
                <textarea
                  className="textarea"
                  placeholder="Paste resume text here...&#10;&#10;Include name, contact info, skills, experience, and education."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={12}
                />
                <div className="mt-2 text-sm text-[var(--muted)] text-right">
                  {resumeText.length} characters
                </div>
              </>
            )}

            {/* PDF Upload Mode */}
            {inputMode === "pdf" && (
              <div className="space-y-4">
                {/* Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : uploadedFile
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  {uploading ? (
                    <div className="py-4">
                      <div className="animate-spin text-4xl mb-3"></div>
                      <p className="text-[var(--muted)]">Processing PDF...</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="py-4">
                      <div className="text-4xl mb-3"></div>
                      <p className="font-medium text-green-600 dark:text-green-400 mb-1">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-[var(--muted)]">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • Text extracted successfully
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="mt-3 text-sm text-red-500 hover:text-red-700 underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="text-4xl mb-3"></div>
                      <p className="font-medium mb-1">
                        {dragActive ? "Drop your PDF here!" : "Drag & drop your resume PDF"}
                      </p>
                      <p className="text-sm text-[var(--muted)]">
                        or click to browse • Max 10MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Preview of extracted text */}
                {resumeText && uploadedFile && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[var(--muted)]">Extracted Text Preview</span>
                      <span className="text-xs text-[var(--muted)]">
                        {resumeText.length} chars
                      </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--muted)] whitespace-pre-wrap">
                      {resumeText.slice(0, 1000)}
                      {resumeText.length > 1000 && "..."}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job Description Input */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">Job Description</h2>
              <span className="text-sm text-[var(--muted)]">
                {jobDesc.length} chars
              </span>
            </div>
            <textarea
              className="textarea"
              placeholder="Paste job description here...&#10;&#10;Include requirements, skills needed, and qualifications."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={12}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={handleMatch}
            disabled={loading}
            className="btn btn-primary text-lg px-8 py-4"
          >
              {loading && activeTab === "match" ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin"></span> Matching...
              </span>
            ) : (
              <>Match Resume to Job</>
            )}
          </button>
          <button
            onClick={handleParse}
            disabled={loading}
            className="btn btn-secondary text-lg px-6 py-4"
          >
            {loading && activeTab === "parse" ? "Parsing..." : "Parse Only"}
          </button>
          <button
            onClick={handleStrength}
            disabled={loading}
            className="btn btn-secondary text-lg px-6 py-4"
          >
            {loading && activeTab === "strength" ? "Analyzing..." : "Check Strength"}
          </button>
        </div>

        {/* Results Section */}
        {(matchResult || parsed || strengthResult) && (
          <div className="animate-fade-in">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-[var(--border)]">
              {matchResult && (
                  <button
                  onClick={() => setActiveTab("match")}
                  className={`px-4 py-3 font-medium transition border-b-2 -mb-px ${
                    activeTab === "match"
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Match Results
                </button>
              )}
              {strengthResult && (
                  <button
                  onClick={() => setActiveTab("strength")}
                  className={`px-4 py-3 font-medium transition border-b-2 -mb-px ${
                    activeTab === "strength"
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Resume Strength
                </button>
              )}
              {parsed && (
                  <button
                  onClick={() => setActiveTab("parse")}
                  className={`px-4 py-3 font-medium transition border-b-2 -mb-px ${
                    activeTab === "parse"
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Parsed Data
                </button>
              )}
            </div>

            {/* Match Results Tab */}
            {activeTab === "match" && matchResult && (
              <div className="space-y-6 animate-slide-in">
                {/* Score Card */}
                <div className="card">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center">
                      <div className={`score-badge ${getScoreClass(matchResult.score)} text-4xl w-24 h-24`}>
                        {matchResult.score}
                      </div>
                      <div className={`text-2xl font-bold mt-2 ${getGradeColor(matchResult.grade)}`}>
                        Grade: {matchResult.grade}
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-semibold mb-4">Score Breakdown</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Skills Match", score: matchResult.breakdown.skillScore, weight: "60%" },
                          { label: "Experience", score: matchResult.breakdown.experienceScore, weight: "25%" },
                          { label: "Education", score: matchResult.breakdown.educationScore, weight: "15%" },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.label}</span>
                              <span className="text-[var(--muted)]">{item.score}% ({item.weight})</span>
                            </div>
                            <div className="progress-bar">
                              <div
                                className="progress-fill gradient-bg"
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="card">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-sm mr-1" aria-hidden="true" />
                        Matched Skills
                      </h3>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.matchedSkills.length > 0 ? (
                        matchResult.matchedSkills.map((skill) => (
                          <span key={skill} className="skill-tag skill-matched">{skill}</span>
                        ))
                      ) : (
                        <span className="text-[var(--muted)] text-sm">No matching skills found</span>
                      )}
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-sm mr-1" aria-hidden="true" />
                      Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.missingSkills.length > 0 ? (
                        matchResult.missingSkills.map((skill) => (
                          <span key={skill} className="skill-tag skill-missing">{skill}</span>
                        ))
                      ) : (
                        <span className="text-green-500 text-sm">All required skills matched!</span>
                      )}
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-blue-500 rounded-sm mr-1" aria-hidden="true" />
                      Bonus Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.bonusSkills.slice(0, 10).map((skill) => (
                        <span key={skill} className="skill-tag skill-bonus">{skill}</span>
                      ))}
                      {matchResult.bonusSkills.length === 0 && (
                        <span className="text-[var(--muted)] text-sm">No additional skills detected</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {matchResult.recommendations.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {matchResult.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--muted)]">
                          <span className="result-marker" aria-hidden="true" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Learning Resources */}
                {matchResult.learningResources.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-[var(--muted)] rounded-sm mr-1" aria-hidden="true" />
                      Learning Resources for Missing Skills
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {matchResult.learningResources.slice(0, 4).map((lr) => (
                        <div key={lr.skill} className="p-4 rounded-lg bg-[var(--background)]">
                          <div className="font-medium text-[var(--primary)] mb-2 capitalize">
                            {lr.skill}
                          </div>
                          <ul className="space-y-1">
                            {lr.resources.map((r) => (
                              <li key={r.name}>
                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-[var(--muted)] hover:text-[var(--primary)] flex items-center gap-1"
                                >
                                  <span />
                                  {r.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Strength Results Tab */}
            {activeTab === "strength" && strengthResult && (
              <div className="space-y-6 animate-slide-in">
                {/* Overall Score */}
                <div className="card">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center">
                      <div className={`score-badge ${getScoreClass(strengthResult.overallScore)} text-4xl w-24 h-24`}>
                        {strengthResult.overallScore}
                      </div>
                      <div className={`text-2xl font-bold mt-2 ${getGradeColor(strengthResult.grade)}`}>
                        Grade: {strengthResult.grade}
                      </div>
                      <div className="text-sm text-[var(--muted)] mt-1">
                        {strengthResult.completeness}% Complete
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-semibold mb-4">Category Scores</h3>
                      <div className="space-y-3">
                        {strengthResult.categories.map((cat) => (
                          <div key={cat.name}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{cat.name}</span>
                              <span className="text-[var(--muted)]">{cat.score}/{cat.maxScore}</span>
                            </div>
                            <div className="progress-bar">
                              <div
                                className="progress-fill gradient-bg"
                                style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">Top Strengths</h3>
                    {strengthResult.topStrengths.length > 0 ? (
                      <ul className="space-y-2">
                        {strengthResult.topStrengths.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 bg-green-600 rounded-sm" aria-hidden="true" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[var(--muted)]">Add more content to identify strengths</p>
                    )}
                  </div>
                  <div className="card">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">Improvements Needed</h3>
                    <ul className="space-y-2">
                      {strengthResult.improvements.slice(0, 6).map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--muted)]">
                          <span className="result-marker" aria-hidden="true" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Parsed Data Tab */}
            {activeTab === "parse" && parsed && (
              <div className="space-y-6 animate-slide-in">
                {/* Contact Info */}
                <div className="card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">Contact Information</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Name", value: parsed.name },
                      { label: "Email", value: parsed.email },
                      { label: "Phone", value: parsed.phone },
                      { label: "Location", value: parsed.location },
                      { label: "LinkedIn", value: parsed.linkedin },
                      { label: "GitHub", value: parsed.github },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-lg bg-[var(--background)]">
                        <div className="text-xs text-[var(--muted)] mb-1">{item.label}</div>
                        <div className="font-medium truncate">
                          {item.value || <span className="text-[var(--muted)]">Not found</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {parsed.summary && (
                  <div className="card">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">Professional Summary</h3>
                    <p className="text-[var(--muted)]">{parsed.summary}</p>
                  </div>
                )}

                {/* Skills */}
                <div className="card">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">Skills ({parsed.skills.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsed.skills.map((skill) => (
                      <span key={skill} className="skill-tag skill-bonus">{skill}</span>
                    ))}
                    {parsed.skills.length === 0 && (
                      <span className="text-[var(--muted)]">No skills detected</span>
                    )}
                  </div>
                </div>

                {/* Experience & Education */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">Experience ({parsed.experienceYears} years)</h3>
                    {parsed.workExperience.length > 0 ? (
                      <ul className="space-y-3">
                        {parsed.workExperience.slice(0, 5).map((exp, i) => (
                          <li key={i} className="p-3 rounded-lg bg-[var(--background)]">
                            <div className="font-medium">{exp.title || "Position"}</div>
                            <div className="text-sm text-[var(--muted)]">{exp.company}</div>
                            {exp.duration && (
                              <div className="text-xs text-[var(--primary)] mt-1">{exp.duration}</div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[var(--muted)]">No work experience detected</p>
                    )}
                  </div>
                  <div className="card">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">Education</h3>
                    {parsed.education.length > 0 ? (
                      <ul className="space-y-3">
                        {parsed.education.map((edu, i) => (
                          <li key={i} className="p-3 rounded-lg bg-[var(--background)]">
                            <div className="font-medium">{edu.degree}</div>
                            {edu.year && (
                              <div className="text-sm text-[var(--primary)]">{edu.year}</div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[var(--muted)]">No education detected</p>
                    )}
                  </div>
                </div>

                {/* Certifications & Languages */}
                {(parsed.certifications.length > 0 || parsed.languages.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {parsed.certifications.length > 0 && (
                      <div className="card">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">Certifications</h3>
                        <ul className="space-y-1">
                          {parsed.certifications.map((cert, i) => (
                            <li key={i} className="text-[var(--muted)]">• {cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {parsed.languages.length > 0 && (
                      <div className="card">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {parsed.languages.map((lang) => (
                            <span key={lang} className="skill-tag skill-bonus">{lang}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!matchResult && !parsed && !strengthResult && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-[var(--muted)] mb-6">
              Paste a resume and job description above, then click Match to see the magic!
            </p>
            <button onClick={loadSampleData} className="btn btn-secondary">
              Load Sample Data to Try
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
