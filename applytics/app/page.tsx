import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav
        className="fixed z-50 glass border-[var(--border)]"
        style={{
          left: "50%",
          top: "24px",
          transform: "translateX(-50%)",
          width: "min(96%, 1100px)",
          padding: "8px 18px",
          borderRadius: "9999px",
          boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-2 py-0 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold">AT</div>
            <span className="text-xl font-bold">Applytics</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[var(--muted)] hover:text-[var(--foreground)] transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-[var(--muted)] hover:text-[var(--foreground)] transition">
              How it works
            </Link>
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Try Now
            </Link>
          </div>

          <div className="md:hidden">
            <Link href="/dashboard" className="btn btn-primary btn-sm px-3 py-2">
              Try
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fade-in uppercase tracking-tight">
            Match <span className="gradient-text">Talent</span> to<br />
            Opportunity Instantly
          </h1>
          
          <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto mb-10 animate-fade-in font-mono leading-relaxed" style={{animationDelay: '0.1s'}}>
            Parse resumes intelligently, extract key skills, and match candidates to job 
            descriptions with our advanced matching algorithm. Get actionable insights in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Link href="/dashboard" className="border-4 border-[var(--primary)] bg-[var(--primary)] text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all hover:bg-[var(--primary-dark)] hover:border-[var(--primary-dark)]">
              Start Matching Free
            </Link>
            <Link href="#how-it-works" className="border-4 border-[var(--primary)] bg-transparent text-[var(--primary)] font-black uppercase tracking-wider text-sm px-8 py-4 transition-all hover:bg-[var(--primary)] hover:text-white">
              See How It Works
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="relative border-4 border-[var(--border)] bg-[var(--background)] max-w-4xl mx-auto overflow-hidden">
              <div className="flex items-center gap-2 mb-4 p-4 bg-[var(--card-bg)] border-b-4 border-[var(--border)]">
                <div className="w-3 h-3 bg-red-400"></div>
                <div className="w-3 h-3 bg-yellow-400"></div>
                <div className="w-3 h-3 bg-green-400"></div>
                <span className="ml-2 text-xs font-black uppercase tracking-wider text-[var(--muted)]">Demo</span>
              </div>
              <div className="grid md:grid-cols-2 gap-0">
                <div className="text-left p-6 border-r-4 border-[var(--border)]">
                  <div className="text-xs font-black uppercase tracking-wider mb-3 text-[var(--primary)]">Resume Input</div>
                  <div className="bg-[var(--card-bg)] border-2 border-[var(--border)] p-4 text-sm font-mono">
                    <div className="text-[var(--primary)]">John Smith</div>
                    <div className="text-[var(--muted)]">john@email.com</div>
                    <div className="mt-2 text-[var(--secondary)]">Skills: React, Node.js, AWS</div>
                    <div className="text-[var(--muted)]">5+ years experience</div>
                  </div>
                </div>
                <div className="text-left p-6">
                  <div className="text-xs font-black uppercase tracking-wider mb-3 text-[var(--primary)]">Match Result</div>
                  <div className="bg-[var(--card-bg)] border-2 border-[var(--border)] p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="score-badge score-a">92</div>
                      <div>
                        <div className="font-black uppercase text-xs tracking-wider">Excellent Match</div>
                        <div className="text-xs text-[var(--muted)] font-mono">Grade: A</div>
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
            <h2 className="text-sm font-black uppercase tracking-wider mb-3 text-[var(--primary)]">Powerful Features</h2>
            <p className="text-[var(--muted)] text-base max-w-2xl mx-auto font-mono">
              Everything you need to streamline your hiring process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "",
                title: "Smart Parsing",
                description: "Extract names, emails, skills, education, and work history automatically from any resume format."
              },
              {
                icon: "",
                title: "Intelligent Matching",
                description: "Advanced algorithm matches candidates to job requirements with detailed scoring breakdown."
              },
              {
                icon: "",
                title: "Resume Strength",
                description: "Analyze resume quality and get actionable tips to improve candidate profiles."
              },
              {
                icon: "",
                title: "Skills Gap Analysis",
                description: "Identify missing skills and get curated learning resources for career growth."
              },
              {
                icon: "",
                title: "REST API",
                description: "Easy-to-use APIs for parsing, matching, and analysis. Integrate anywhere."
              },
              {
                icon: "",
                title: "Real-time Results",
                description: "Get instant results with our optimized processing engine. No waiting."
              }
            ].map((feature, i) => (
              <div key={i} className="border-4 border-[var(--border)] bg-[var(--background)] p-6 animate-fade-in transition-all hover:border-[var(--primary)]" style={{animationDelay: `${i * 0.1}s`}}>
                <h3 className="text-sm font-black uppercase tracking-wider mb-3">{feature.title}</h3>
                <p className="text-[var(--muted)] text-sm font-mono leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black uppercase tracking-wider mb-3 text-[var(--primary)]">How It Works</h2>
            <p className="text-[var(--muted)] text-base font-mono">Three simple steps to better hiring</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Paste Resume", desc: "Copy and paste resume text into the dashboard" },
              { step: "2", title: "Add Job Description", desc: "Enter the job requirements you're hiring for" },
              { step: "3", title: "Get Insights", desc: "Receive match score, skill analysis, and recommendations" },
            ].map((item, i) => (
              <div key={i} className="text-center border-4 border-[var(--border)] bg-[var(--card-bg)] p-6 animate-fade-in transition-all hover:border-[var(--primary)]" style={{animationDelay: `${i * 0.15}s`}}>
                <div className="w-16 h-16 border-4 border-[var(--primary)] bg-[var(--background)] text-[var(--primary)] text-2xl font-black flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider mb-3">{item.title}</h3>
                <p className="text-[var(--muted)] text-sm font-mono leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card gradient-bg-animated text-white text-center py-16 px-8">
            <h2 className="text-4xl font-bold mb-4 text-[var(--primary)]">Ready to Transform Your Hiring?</h2>
            <p className="text-xl text-white/90 mb-8">Start matching candidates to opportunities in seconds.</p>
            <Link href="/dashboard" className="btn bg-white text-[var(--primary)] text-lg px-8 py-4 hover:bg-gray-100">
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Divider between CTA and footer */}
      <div className="max-w-4xl mx-auto px-6">
        <hr className="border-t border-[var(--border)] opacity-30 my-12" />
      </div>

      {/* Footer */}
      <footer className="py-16 px-6 bg-black text-white mt-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6">
            We're here to help! <span className="text-[var(--primary-dark)]">Contact us</span>
          </h2>

          <div className="flex items-center justify-center gap-6 mb-8">
            <a href="#" aria-label="X" className="w-10 h-10 rounded-full bg-white/6 hover:bg-white/12 flex items-center justify-center text-white text-sm">X</a>
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/6 hover:bg-white/12 flex items-center justify-center text-white text-sm">f</a>
            <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/6 hover:bg-white/12 flex items-center justify-center text-white text-sm">in</a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/6 hover:bg-white/12 flex items-center justify-center text-white text-sm">ig</a>
          </div>

          <hr className="border-t border-[var(--border)] opacity-20 my-8" />

          <div className="mt-8">
            <div className="text-[var(--primary-dark)] font-extrabold mx-auto" style={{fontSize: 'clamp(48px, 12vw, 200px)', lineHeight: 0.9}}>
              Applytics
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
