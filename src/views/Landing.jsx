import React, { useEffect, useRef, useState } from 'react';
import '../Landing.css';
import { 
  Sparkles, 
  ArrowRight, 
  Leaf, 
  Users, 
  ShieldCheck, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send 
} from 'lucide-react';

export default function Landing({ onLaunch }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const observerRef = useRef(null);

  // Intersection Observer to trigger entrance animations on scroll
  useEffect(() => {
    const options = {
      root: null,
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "How does EcoSphere automate carbon emissions reporting?",
      a: "When enabled, our auto-calculation engine maps operational logs (purchased fuel, logistics miles, electricity consumption) to corresponding global emission factor databases, generating instant CO₂ equivalent records without manual configuration."
    },
    {
      q: "Can we configure ESG weight priorities?",
      a: "Yes. From the settings administration dashboard, managers can customize the overall score weights (e.g., set Environmental to 50%, Social to 25%, and Governance to 25%) to align with specific corporate governance guidelines."
    },
    {
      q: "How are gamification badges automatically unlocked?",
      a: "Our background listener tracks active employee credentials, XP points, and completed sustainability challenges. Once the target criteria are met (e.g., volunteer for 3 CSR events), the badge is bound to the employee profile and logged in the alerts feed."
    },
    {
      q: "Is data stored locally and secure?",
      a: "Yes, the platform uses a localized data schema that synchronizes directly with your browser's Local Storage. Your operational and corporate datasets remain fully within your local browser sandbox, requiring zero external server configuration."
    }
  ];

  return (
    <div className="landing-body">
      <div className="landing-content">
        
        {/* Navigation bar */}
        <nav className="landing-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--color-env)" />
            <span className="brand-name" style={{ fontSize: '1.1rem' }}>Eco<span>Sphere</span></span>
          </div>
          
          <div className="nav-links">
            <a href="#about" className="nav-link">About</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#showcase" className="nav-link">Showcase</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#faq" className="nav-link">FAQ</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          <button className="btn btn-primary" onClick={onLaunch}>
            Launch App <ArrowRight size={16} />
          </button>
        </nav>

        {/* Section 1: Hero */}
        <section className="landing-section" id="hero">
          <div className="hero-container">
            <div className="animate-on-scroll" style={{ transitionDelay: '100ms' }}>
              <div className="hero-glass-panel">
                
                {/* Botanical leaves branch SVG overlapping the glass deck */}
                <svg className="organic-leaf-branch leaf-left" viewBox="0 0 100 200" fill="none">
                  <path d="M20 200 C30 140 45 90 60 10" stroke="#27ae60" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M60 10 C72 -2 85 8 60 22 Z" fill="#2ecc71" fillOpacity="0.8"/>
                  <path d="M48 55 C22 45 10 58 45 70 Z" fill="#27ae60" fillOpacity="0.9"/>
                  <path d="M51 90 C78 78 88 90 54 102 Z" fill="#2ecc71" fillOpacity="0.75"/>
                  <path d="M42 125 C18 115 6 128 39 140 Z" fill="#27ae60" fillOpacity="0.85"/>
                  <path d="M44 160 C70 148 80 160 46 172 Z" fill="#2ecc71" fillOpacity="0.8"/>
                </svg>

                <svg className="organic-leaf-branch leaf-right" viewBox="0 0 100 200" fill="none">
                  <path d="M80 200 C70 140 55 90 40 10" stroke="#2ecc71" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M40 10 C28 -2 15 8 40 22 Z" fill="#27ae60" fillOpacity="0.8"/>
                  <path d="M52 55 C78 45 90 58 55 70 Z" fill="#2ecc71" fillOpacity="0.9"/>
                  <path d="M49 90 C22 78 12 90 46 102 Z" fill="#27ae60" fillOpacity="0.75"/>
                  <path d="M58 125 C82 115 94 128 61 140 Z" fill="#2ecc71" fillOpacity="0.85"/>
                  <path d="M56 160 C30 148 20 160 54 172 Z" fill="#27ae60" fillOpacity="0.8"/>
                </svg>

                <h1 className="hero-title">
                  Direct ESG<span>Management</span> That Drives Value
                </h1>

                <div className="hero-description-wrapper">
                  <div className="hero-sub-text">
                    Decarbonize operations and empower employees through automated, gamified ESG tracking.
                  </div>
                  <div className="hero-main-desc">
                    EcoSphere bridges the gap between raw corporate operations data and ESG performance score disclosure. Connect fuel, electricity, community actions, and compliance audits into a unified carbon-accounting engine.
                  </div>
                </div>

                <div className="hero-actions">
                  <button className="btn btn-primary" onClick={onLaunch}>
                    Get Started
                  </button>
                  <button className="btn btn-secondary" onClick={() => {
                    const el = document.getElementById('about');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Explore Features
                  </button>
                </div>
              </div>
            </div>

            {/* Right side floating KPIs card */}
            <div className="animate-on-scroll" style={{ transitionDelay: '300ms' }}>
              <div className="hero-floating-card">
                <div className="floating-kpi">
                  <Leaf size={24} color="var(--color-env)" />
                  <div>
                    <div className="floating-kpi-value">82%</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Environmental Progress</div>
                  </div>
                </div>

                <div className="floating-kpi">
                  <Users size={24} color="var(--color-soc)" />
                  <div>
                    <div className="floating-kpi-value">4.8k</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>CSR Volunteer Hours</div>
                  </div>
                </div>

                <div className="floating-kpi">
                  <ShieldCheck size={24} color="var(--color-gov)" />
                  <div>
                    <div className="floating-kpi-value">100%</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Governance Sign-Off</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: About */}
        <section className="landing-section about-section" id="about">
          <div className="animate-on-scroll" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <span className="section-label">Our Mission</span>
            <h2 className="section-title">Automating Sustainability from Ground Operations to Compliance Reports</h2>
            <p className="section-desc-lead">
              Many organizations manage their sustainability parameters through separate manual sheets, leading to disjointed data trails, compliance risks, and low staff participation. EcoSphere unites Environmental carbon ledgers, Social CSR events, and Governance policy audits inside one glassmorphic ecosystem.
            </p>
          </div>
        </section>

        {/* Section 3: Features */}
        <section className="landing-section" id="features">
          <div className="animate-on-scroll">
            <span className="section-label">Core Modules</span>
            <h2 className="section-title">Fully Integrated ESG Pillars</h2>
          </div>

          <div className="features-grid">
            {/* Env Feature */}
            <div className="feature-glass-card animate-on-scroll">
              <div className="feature-icon-wrapper" style={{ color: 'var(--color-env)' }}>
                <Leaf size={22} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.2rem' }}>Environmental Ledger</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Configure emission factors and log raw operations (electricity consumed, fleet mileage). The context engine calculates exact CO₂ outputs automatically.
              </p>
            </div>

            {/* Soc Feature */}
            <div className="feature-glass-card animate-on-scroll">
              <div className="feature-icon-wrapper" style={{ color: 'var(--color-soc)' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.2rem' }}>Social Engagement</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Register volunteer drives, support employee participation sign-offs, and track internal diversity profiles to feed corporate sustainability values.
              </p>
            </div>

            {/* Gov Feature */}
            <div className="feature-glass-card animate-on-scroll">
              <div className="feature-icon-wrapper" style={{ color: 'var(--color-gov)' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.2rem' }}>Governance Compliance</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Distribute corporate policies for sign-off signatures, schedule audits, and track unresolved compliance violation tickets with direct ownership.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Showcase (CSS Dashboard preview) */}
        <section className="landing-section" id="showcase" style={{ background: 'rgba(12, 17, 13, 0.4)' }}>
          <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
            <span className="section-label">Interactive Platform</span>
            <h2 className="section-title">An Operational Control Room for ESG</h2>
            <p className="section-desc-lead" style={{ margin: '0 auto 20px auto' }}>
              Take control of your data trail. Inspect the live ESG summary scores circles built directly within our platform showcase below.
            </p>
          </div>

          <div className="showcase-display animate-on-scroll">
            <div className="showcase-screen-mockup">
              {/* Mini CSS dashboard representation */}
              <div style={{ display: 'flex', gap: '32px', padding: '40px', width: '100%', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>ENV SCORE</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-env)', fontFamily: 'var(--font-display)' }}>82<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span></div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>SOC SCORE</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-soc)', fontFamily: 'var(--font-display)' }}>74<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span></div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>GOV SCORE</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-gov)', fontFamily: 'var(--font-display)' }}>88<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Pricing */}
        <section className="landing-section" id="pricing">
          <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
            <span className="section-label">Flexible Plans</span>
            <h2 className="section-title">Transparent Pricing Built for Impact</h2>
          </div>

          <div className="pricing-grid">
            {/* Starter */}
            <div className="pricing-card animate-on-scroll">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Starter</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Best for early ESG tracking</p>
              </div>
              <div className="pricing-price">$0 <span>/ forever</span></div>
              <div className="pricing-features-list">
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Local Carbon Ledger</div>
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Standard CSR Activity Logs</div>
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Local browser storage sync</div>
              </div>
              <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={onLaunch}>Start Free</button>
            </div>

            {/* Pro */}
            <div className="pricing-card premium animate-on-scroll">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Professional</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Best for mid-size companies</p>
              </div>
              <div className="pricing-price">$49 <span>/ month</span></div>
              <div className="pricing-features-list">
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Automated emissions calculations</div>
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Badge unlocks & Rewards catalog</div>
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Governance Audits tracking</div>
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Custom reports exports</div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 'auto' }} onClick={onLaunch}>Get Started</button>
            </div>

            {/* Enterprise */}
            <div className="pricing-card animate-on-scroll">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Enterprise</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Best for global institutions</p>
              </div>
              <div className="pricing-price">$199 <span>/ month</span></div>
              <div className="pricing-features-list">
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> All Pro features included</div>
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Priority support response</div>
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Infinite data records capacity</div>
                <div className="pricing-feature-item"><Check size={14} color="var(--color-env)" /> Advanced config weight overrides</div>
              </div>
              <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={onLaunch}>Contact Sales</button>
            </div>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section className="landing-section" id="faq" style={{ background: 'rgba(12, 17, 13, 0.3)' }}>
          <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="section-label">Questions</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="faq-list animate-on-scroll">
            {faqData.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <button className="faq-question-btn" onClick={() => toggleFaq(idx)}>
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeFaq === idx && (
                  <div className="faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Contact */}
        <section className="landing-section" id="contact">
          <div className="contact-container">
            <div className="animate-on-scroll">
              <span className="section-label">Connect</span>
              <h2 className="section-title">Ready to Decarbonize Your Operations?</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Fill out the contact form or launch the direct live sandbox application to start tracking emission and gamified employee scores instantly in your browser sandbox.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div>Email: <strong style={{ color: '#fff' }}>support@ecosphere-esg.com</strong></div>
                <div>Location: <strong style={{ color: '#fff' }}>San Francisco, CA</strong></div>
              </div>
            </div>

            <div className="animate-on-scroll">
              <div className="panel-card" style={{ background: 'rgba(25, 35, 28, 0.4)' }}>
                <form onSubmit={(e) => { e.preventDefault(); alert("Thanks! We will reach out to you shortly."); }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                      <label>Your Name</label>
                      <input type="text" className="form-input" required placeholder="Full Name" />
                    </div>
                    <div className="form-group">
                      <label>Work Email</label>
                      <input type="email" className="form-input" required placeholder="name@company.com" />
                    </div>
                    <div className="form-group">
                      <label>Message</label>
                      <textarea className="form-textarea" placeholder="Tell us about your organization's ESG goals..." />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                      Send Message <Send size={14} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Eco<span>Sphere</span></h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '8px' }}>
                Empowering businesses to audit, manage, and gamify Environmental, Social, and Governance compliance requirements.
              </p>
            </div>
            
            <div className="footer-links-col">
              <h4>Product</h4>
              <a href="#hero" className="footer-link-item">Platform Overview</a>
              <a href="#features" className="footer-link-item">ESG Modules</a>
              <a href="#showcase" className="footer-link-item">Sandbox Demo</a>
            </div>

            <div className="footer-links-col">
              <h4>Resources</h4>
              <a href="#faq" className="footer-link-item">FAQ Help</a>
              <a href="#pricing" className="footer-link-item">Pricing Plans</a>
              <a href="#contact" className="footer-link-item">Support Contact</a>
            </div>

            <div className="footer-links-col">
              <h4>Compliance</h4>
              <span className="footer-link-item">GHG Scope 1 & 2</span>
              <span className="footer-link-item">CSR Audit trail</span>
              <span className="footer-link-item">SEC Disclosures</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} EcoSphere ESG Inc. All rights reserved. Built as a premium hackathon demo submission.
          </div>
        </footer>

      </div>
    </div>
  );
}
