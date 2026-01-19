import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { intelligenceCardsAPI } from "../api/intelligenceCards";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState({
    total_analyses: 0,
    total_roles_assessed: 0,
    ai_capital_tracked: "0",
    jobs_impacted: "0K",
  });
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Animated counters state
  const [animatedStats, setAnimatedStats] = useState({
    analyses: 0,
    roles: 0,
    capital: 0,
    jobs: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsData, statsData] = await Promise.all([
          intelligenceCardsAPI.getLandingCards(8),
          intelligenceCardsAPI.getStats(),
        ]);
        setCards(cardsData);
        setStats(statsData);

        // Animate counters
        animateCounters(statsData);
      } catch (err) {
        console.error("Failed to fetch landing data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const animateCounters = (data) => {
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        analyses: Math.round(eased * data.total_analyses),
        roles: Math.round(eased * data.total_roles_assessed),
        capital: Math.round(eased * parseInt(data.ai_capital_tracked)),
        jobs: Math.round(eased * parseInt(data.jobs_impacted)),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Auto-scroll news feed (continuous, pause on hover)
  useEffect(() => {
    if (loading || !scrollRef.current) return;

    const newsScroll = scrollRef.current;
    let animationId;

    const autoScroll = () => {
      if (!isHovering && newsScroll) {
        const maxScroll = newsScroll.scrollWidth - newsScroll.clientWidth;
        if (newsScroll.scrollLeft >= maxScroll - 1) {
          // Reset to beginning for infinite loop
          newsScroll.scrollLeft = 0;
        } else {
          newsScroll.scrollLeft += 1;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    // Start slower auto-scroll using requestAnimationFrame with throttle
    let lastTime = 0;
    const scrollSpeed = 30; // Lower = faster

    const throttledScroll = (timestamp) => {
      if (timestamp - lastTime >= scrollSpeed) {
        if (!isHovering && newsScroll) {
          const maxScroll = newsScroll.scrollWidth - newsScroll.clientWidth;
          if (newsScroll.scrollLeft >= maxScroll - 1) {
            newsScroll.scrollLeft = 0;
          } else {
            newsScroll.scrollLeft += 1;
          }
        }
        lastTime = timestamp;
      }
      animationId = requestAnimationFrame(throttledScroll);
    };

    animationId = requestAnimationFrame(throttledScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [loading, isHovering]);

  const handleCardClick = (card) => {
    if (card.report_id) {
      navigate(`/report/${card.report_id}`);
    } else if (card.analysis_url) {
      navigate(card.analysis_url);
    }
  };

  const getTierClass = (tier) => {
    switch (tier) {
      case "tier_1":
        return "";
      case "tier_2":
        return "elevated";
      case "tier_3":
        return "moderate";
      default:
        return "";
    }
  };

  const getStatValueClass = (type) => {
    switch (type) {
      case "critical":
        return "text-crimson";
      case "elevated":
        return "text-gold";
      case "moderate":
        return "text-teal";
      default:
        return "text-white";
    }
  };

  // News ticker items
  const tickerItems = [
    {
      tag: "Breaking",
      text: "Amazon WARN filing confirms 30,000 job cuts by May 2026 — RPI 72",
    },
    {
      tag: "Analysis",
      text: "Meta Reality Labs restructure affects 8,500 roles — Hardware division RPI elevated to 58",
    },
    {
      tag: "New",
      text: "Google announces Project Jarvis — Customer support roles face RPI surge",
    },
    {
      tag: "Update",
      text: "Microsoft Copilot expansion — Administrative roles RPI now critical at 71",
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              Workforce Intelligence
              <span className="live-indicator">
                <span className="live-dot"></span>
                Live Feed
              </span>
            </div>
            <h1>
              News That Moves <em>Careers.</em>
              <br />
              Analyzed Through <em>RPI.</em>
            </h1>
            <p className="hero-subtitle">
              Every corporate announcement carries workforce implications. We
              decode what layoffs, AI investments, and strategic pivots actually
              mean for roles—quantified through our Replaceability Potential
              Index.
            </p>

            <div className="hero-actions">
              <a href="#feed" className="btn-primary">
                View Intelligence Feed
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#subscribe" className="btn-secondary">
                Subscribe
              </a>
            </div>

            <div className="trusted-by">
              <p className="trusted-label">Trusted by professionals at</p>
              <div className="trusted-logos">
                <span className="trusted-logo">McKinsey</span>
                <span className="trusted-logo">Goldman Sachs</span>
                <span className="trusted-logo">Deloitte</span>
                <span className="trusted-logo">BCG</span>
                <span className="trusted-logo">JP Morgan</span>
              </div>
            </div>
          </div>

          <div className="hero-stats-card">
            <div className="stats-header">
              <span className="stats-title">Platform Intelligence</span>
              <span className="stats-updated">Updated 2 hours ago</span>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{animatedStats.analyses}</div>
                <div className="stat-label">Analyses Published</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {animatedStats.roles.toLocaleString()}
                </div>
                <div className="stat-label">Roles Assessed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value critical">
                  ${animatedStats.capital}B
                </div>
                <div className="stat-label">AI Capital Tracked</div>
              </div>
              <div className="stat-item">
                <div className="stat-value gold">{animatedStats.jobs}K</div>
                <div className="stat-label">Jobs Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breaking News Ticker */}
      <div className="news-ticker">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div key={index} className="ticker-item">
              <span className="ticker-tag">{item.tag}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* News Feed Section */}
      <section className="news-feed-section" id="feed">
        <div className="container">
          <div className="section-header">
            <div className="section-header-text">
              <div className="section-label">Intelligence Feed</div>
              <h2 className="section-title">
                Latest <em>Analyses</em>
              </h2>
            </div>
            <div className="feed-controls">
              <button className="feed-btn" onClick={scrollLeft}>
                <ChevronLeft size={20} />
              </button>
              <button className="feed-btn" onClick={scrollRight}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="news-scroll-wrapper">
          <div
            ref={scrollRef}
            className="news-scroll-container"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {loading ? (
              <div className="loading-cards">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="news-card skeleton"></div>
                ))}
              </div>
            ) : (
              /* Duplicate cards for seamless infinite scroll */
              [...cards, ...cards].map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  className="news-card"
                  onClick={() => handleCardClick(card)}
                >
                  <div
                    className={`news-card-image ${card.company_gradient || ""}`}
                    style={
                      card.gradient_start && card.gradient_end
                        ? {
                            background: `linear-gradient(135deg, ${card.gradient_start} 0%, ${card.gradient_end} 100%)`,
                          }
                        : undefined
                    }
                  >
                    <div className="news-card-image-overlay"></div>
                    <div className="news-card-company">
                      <div className="company-icon">
                        {card.company_logo ? (
                          <img
                            src={card.company_logo}
                            alt={card.company}
                            className="company-logo-img"
                          />
                        ) : (
                          card.company_icon
                        )}
                      </div>
                      <span className="company-name">{card.company}</span>
                    </div>
                    <span
                      className={`news-card-tier ${getTierClass(card.tier)}`}
                    >
                      {card.tier_label}
                    </span>
                  </div>
                  <div className="news-card-content">
                    <div className="news-card-meta">
                      <span className="news-card-date">
                        {new Date(card.published_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <span className="news-card-category">
                        {card.category}
                      </span>
                    </div>
                    <h3
                      dangerouslySetInnerHTML={{
                        __html: card.title.replace(
                          card.title_highlight,
                          `<em>${card.title_highlight}</em>`,
                        ),
                      }}
                    ></h3>
                    <p className="news-card-excerpt">{card.excerpt}</p>
                    <div className="news-card-stats">
                      {card.stat1 && (
                        <div className="news-card-stat">
                          <div className="news-card-stat-value">
                            {card.stat1.value}
                          </div>
                          <div className="news-card-stat-label">
                            {card.stat1.label}
                          </div>
                        </div>
                      )}
                      {card.stat2 && (
                        <div className="news-card-stat">
                          <div
                            className={`news-card-stat-value ${getStatValueClass(
                              card.stat2.type,
                            )}`}
                          >
                            {card.stat2.value}
                          </div>
                          <div className="news-card-stat-label">
                            {card.stat2.label}
                          </div>
                        </div>
                      )}
                      {card.stat3 && (
                        <div className="news-card-stat">
                          <div className="news-card-stat-value">
                            {card.stat3.value}
                          </div>
                          <div className="news-card-stat-label">
                            {card.stat3.label}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="container">
          <div className="view-all-container">
            <Link to="/archive" className="view-all-btn">
              View All {stats.total_analyses} Analyses
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof-section">
        <div className="container">
          <div className="proof-header">
            <div className="section-label">Trusted Intelligence</div>
            <h2 className="section-title">
              Used by <em>Industry Leaders</em>
            </h2>
            <p className="section-subtitle">
              Career strategists and enterprise teams rely on Replaceable.ai for
              workforce intelligence.
            </p>
          </div>

          <div className="company-logos">
            {["McKinsey", "Deloitte", "BCG", "KPMG", "Accenture"].map(
              (company) => (
                <div key={company} className="company-logo-item">
                  <div className="company-logo-icon">{company}</div>
                  <span className="company-logo-label">
                    {company === "McKinsey"
                      ? "Strategy Team"
                      : company === "Deloitte"
                        ? "Human Capital"
                        : company === "BCG"
                          ? "Future of Work"
                          : company === "KPMG"
                            ? "Advisory"
                            : "Talent & Org"}
                  </span>
                </div>
              ),
            )}
          </div>

          <div className="stats-banner">
            <div className="stats-banner-item">
              <div className="stats-banner-value">
                47<span>K</span>
              </div>
              <div className="stats-banner-label">Subscribers</div>
            </div>
            <div className="stats-banner-item">
              <div className="stats-banner-value">
                2.8<span>M</span>
              </div>
              <div className="stats-banner-label">RPI Scores Generated</div>
            </div>
            <div className="stats-banner-item">
              <div className="stats-banner-value">{stats.total_analyses}</div>
              <div className="stats-banner-label">Deep Analyses</div>
            </div>
            <div className="stats-banner-item">
              <div className="stats-banner-value">
                94<span>%</span>
              </div>
              <div className="stats-banner-label">Accuracy Rate</div>
            </div>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Replaceable.ai has transformed how we advise clients on
                workforce strategy. The RPI framework gives us quantifiable data
                where we previously had only intuition."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">SC</div>
                <div className="testimonial-info">
                  <h4>Sarah Chen</h4>
                  <p>Partner, Human Capital</p>
                  <span className="testimonial-company">
                    McKinsey & Company
                  </span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "When Amazon filed those WARN notices, Replaceable.ai had the
                analysis out within hours. That's the speed enterprise clients
                need for workforce planning."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">MR</div>
                <div className="testimonial-info">
                  <h4>Michael Rodriguez</h4>
                  <p>Chief People Officer</p>
                  <span className="testimonial-company">Fortune 500 Tech</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "I used their Amazon analysis to renegotiate my role before the
                layoffs hit. Moved from an RPI 72 position to one scoring 34.
                Career saved."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">JK</div>
                <div className="testimonial-info">
                  <h4>James Kim</h4>
                  <p>Senior Program Manager</p>
                  <span className="testimonial-company">Former Amazon L6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-section">
        <div className="container">
          <div className="value-header">
            <div className="section-label">Beyond Headlines</div>
            <h2 className="section-title">
              Not Just News. <em>Career Intelligence.</em>
            </h2>
            <p className="section-subtitle">
              Traditional news tells you what happened. We tell you what it
              means for your career, your role, and your replaceability score.
            </p>
          </div>

          <div className="value-grid">
            <div className="value-card">
              <div className="value-number">01</div>
              <h3>RPI-Quantified Impact</h3>
              <p>
                Every story includes precise RPI scores for affected roles. Know
                exactly how automation announcements shift your career risk
                profile in real-time.
              </p>
            </div>

            <div className="value-card">
              <div className="value-number">02</div>
              <h3>Timeline Projections</h3>
              <p>
                Multi-phase analysis from immediate impacts to 5-year outlooks.
                Understand not just what's happening, but precisely when it will
                affect you.
              </p>
            </div>

            <div className="value-card">
              <div className="value-number">03</div>
              <h3>Role-Level Guidance</h3>
              <p>
                Actionable career pathways for every affected position.
                Strategic guidance tailored to your specific situation, skills,
                and timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="methodology-section">
        <div className="container">
          <div className="methodology-grid">
            <div className="methodology-content">
              <div className="section-label">Our Approach</div>
              <h2 className="section-title">
                The <em>RPI Framework</em>
                <br />
                Applied to Breaking News
              </h2>
              <p>
                Our Replaceability Potential Index isn't just for career
                planning—it's a lens for understanding the workforce
                implications of every major corporate announcement.
              </p>

              <ul className="methodology-list">
                <li>
                  <span className="methodology-number">01</span>
                  <div className="methodology-item-content">
                    <h4>Automation Probability Score (APS)</h4>
                    <p>
                      We assess which tasks within affected roles can be
                      automated based on the announced technology investments.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="methodology-number">02</span>
                  <div className="methodology-item-content">
                    <h4>Human Resilience Factor (HRF)</h4>
                    <p>
                      Critical thinking, relationship-building, and creative
                      elements that may protect certain roles from displacement.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="methodology-number">03</span>
                  <div className="methodology-item-content">
                    <h4>Industry Adoption Factor (IAF)</h4>
                    <p>
                      How quickly the announcing company's sector typically
                      implements workforce-transforming technology.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rpi-visual">
              <div className="rpi-visual-header">
                <span className="rpi-visual-title">Live RPI Analysis</span>
                <span className="rpi-badge">Amazon L6 Manager</span>
              </div>

              <div className="rpi-example-role">
                <h4>Senior Program Manager</h4>
                <p>Amazon • Level 6 • Operations</p>
              </div>

              <RPIComponents />
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="subscribe-section" id="subscribe">
        <div className="container">
          <div className="subscribe-content">
            <div className="subscribe-text">
              <h2>
                Stay Ahead of <em>Workforce Shifts</em>
              </h2>
              <p>
                Receive weekly intelligence briefings with RPI-analyzed news,
                emerging automation trends, and strategic career guidance
                delivered directly to your inbox.
              </p>

              <ul className="subscribe-benefits">
                <li>
                  <Check size={16} />
                  Weekly intelligence digest with RPI scores
                </li>
                <li>
                  <Check size={16} />
                  Breaking analysis within 24 hours of major news
                </li>
                <li>
                  <Check size={16} />
                  Role-specific alerts based on your profile
                </li>
                <li>
                  <Check size={16} />
                  Quarterly strategic outlook reports
                </li>
              </ul>
            </div>

            <div className="subscribe-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@company.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Current Role</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Product Manager"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Primary Interest</label>
                <select className="form-select">
                  <option>All Intelligence Briefings</option>
                  <option>Tech Industry Focus</option>
                  <option>Finance & Banking</option>
                  <option>Healthcare & Life Sciences</option>
                  <option>Manufacturing & Supply Chain</option>
                  <option>Professional Services</option>
                </select>
              </div>
              <button className="subscribe-btn">
                Subscribe to Intelligence
              </button>
              <p className="form-note">
                Free weekly digest • 47,000+ subscribers • Unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-text">
            <h3>Check Your Role's RPI Score</h3>
            <p>
              Get personalized analysis of your automation exposure and
              strategic guidance.
            </p>
          </div>
          <Link to="/analyze" className="cta-btn">
            Analyze My Role →
          </Link>
        </div>
      </section>
    </div>
  );
};

// RPI Components with animation
const RPIComponents = () => {
  const [values, setValues] = useState({ aps: 0, hrf: 0, iaf: 0, total: 0 });
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValues();
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateValues = () => {
    const targets = { aps: 78, hrf: 35, iaf: 82, total: 72 };
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValues({
        aps: Math.round(eased * targets.aps),
        hrf: Math.round(eased * targets.hrf),
        iaf: Math.round(eased * targets.iaf),
        total: Math.round(eased * targets.total),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div ref={containerRef}>
      <div className="rpi-components">
        <div className="rpi-component">
          <div className="rpi-component-name">
            APS
            <span>Automation Probability</span>
          </div>
          <div className="rpi-bar-track">
            <div
              className="rpi-bar aps"
              style={{ width: `${values.aps}%` }}
            ></div>
          </div>
          <div className="rpi-component-value aps">{values.aps}%</div>
        </div>

        <div className="rpi-component">
          <div className="rpi-component-name">
            HRF
            <span>Human Resilience</span>
          </div>
          <div className="rpi-bar-track">
            <div
              className="rpi-bar hrf"
              style={{ width: `${values.hrf}%` }}
            ></div>
          </div>
          <div className="rpi-component-value hrf">{values.hrf}%</div>
        </div>

        <div className="rpi-component">
          <div className="rpi-component-name">
            IAF
            <span>Industry Adoption</span>
          </div>
          <div className="rpi-bar-track">
            <div
              className="rpi-bar iaf"
              style={{ width: `${values.iaf}%` }}
            ></div>
          </div>
          <div className="rpi-component-value iaf">{values.iaf}%</div>
        </div>
      </div>

      <div className="rpi-result">
        <div className="rpi-result-left">
          <h5>Composite Score</h5>
          <p>CRITICAL — HIGH EXPOSURE</p>
        </div>
        <div className="rpi-result-score">
          <span className="rpi-result-value">{values.total}</span>
          <span className="rpi-result-max">/ 100</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
