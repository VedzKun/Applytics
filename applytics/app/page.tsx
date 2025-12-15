import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold">Applytics</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="#features" className="text-[var(--muted)] hover:text-[var(--foreground)] transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-[var(--muted)] hover:text-[var(--foreground)] transition">
              How it works
            </Link>
            <Link href="/dashboard" className="btn btn-primary">
              Try Now →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse"></span>
            AI-Powered Resume Intelligence
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
            Match <span className="gradient-text">Talent</span> to<br />
            Opportunity Instantly
          </h1>
          
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 animate-fade-in" style={{animationDelay: '0.1s'}}>
            Parse resumes intelligently, extract key skills, and match candidates to job 
            descriptions with our advanced matching algorithm. Get actionable insights in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-4">
              Start Matching Free
            </Link>
            <Link href="#how-it-works" className="btn btn-secondary text-lg px-8 py-4">
              See How It Works
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="absolute inset-0 gradient-bg-animated opacity-20 blur-3xl rounded-full"></div>
            <div className="relative card max-w-4xl mx-auto overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-left">
                  <div className="text-sm text-[var(--muted)] mb-2">Resume Input</div>
                  <div className="bg-[var(--background)] rounded-lg p-4 text-sm font-mono">
                    <div className="text-[var(--primary)]">John Smith</div>
                    <div className="text-[var(--muted)]">john@email.com</div>
                    <div className="mt-2 text-[var(--secondary)]">Skills: React, Node.js, AWS</div>
                    <div className="text-[var(--muted)]">5+ years experience</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-[var(--muted)] mb-2">Match Result</div>
                  <div className="bg-[var(--background)] rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="score-badge score-a">92</div>
                      <div>
                        <div className="font-semibold">Excellent Match</div>
                        <div className="text-sm text-[var(--muted)]">Grade: A</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="skill-tag skill-matched">✓ React</span>
                      <span className="skill-tag skill-matched">✓ Node.js</span>
                      <span className="skill-tag skill-missing">✗ Python</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
              Everything you need to streamline your hiring process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📄",
                title: "Smart Parsing",
                description: "Extract names, emails, skills, education, and work history automatically from any resume format."
              },
              {
                icon: "🎯",
                title: "Intelligent Matching",
                description: "Advanced algorithm matches candidates to job requirements with detailed scoring breakdown."
              },
              {
                icon: "💪",
                title: "Resume Strength",
                description: "Analyze resume quality and get actionable tips to improve candidate profiles."
              },
              {
                icon: "📊",
                title: "Skills Gap Analysis",
                description: "Identify missing skills and get curated learning resources for career growth."
              },
              {
                icon: "🔌",
                title: "REST API",
                description: "Easy-to-use APIs for parsing, matching, and analysis. Integrate anywhere."
              },
              {
                icon: "⚡",
                title: "Real-time Results",
                description: "Get instant results with our optimized processing engine. No waiting."
              }
            ].map((feature, i) => (
              <div key={i} className="card animate-fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-[var(--muted)] text-lg">Three simple steps to better hiring</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Paste Resume", desc: "Copy and paste resume text into the dashboard" },
              { step: "2", title: "Add Job Description", desc: "Enter the job requirements you're hiring for" },
              { step: "3", title: "Get Insights", desc: "Receive match score, skill analysis, and recommendations" },
            ].map((item, i) => (
              <div key={i} className="text-center animate-fade-in" style={{animationDelay: `${i * 0.15}s`}}>
                <div className="w-16 h-16 rounded-full gradient-bg text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card gradient-bg-animated text-white text-center py-16 px-8">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
            <p className="text-xl opacity-90 mb-8">Start matching candidates to opportunities in seconds.</p>
            <Link href="/dashboard" className="btn bg-white text-[var(--primary)] text-lg px-8 py-4 hover:bg-gray-100">
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-semibold">Applytics</span>
          </div>
          <div className="text-[var(--muted)] text-sm">
            © 2024 Applytics. Intelligent Resume Matching Platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
