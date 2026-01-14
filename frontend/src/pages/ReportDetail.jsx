import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronRight,
  FileText,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { reportsAPI } from "../api/reports";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Goldman Sachs Report Data (Special Featured Report)
const goldmanReport = {
  id: "goldman-structural-shift",
  title: "The Structural Shift",
  subtitle:
    "Goldman Sachs warns AI-driven layoffs will continue through 2026—not because of recession, but because automation is now the strategy. What does this mean for your career?",
  label: "Workforce Intelligence Briefing · January 2026",
  readingTime: 12,
  tier: "tier_1",
  heroStats: [
    {
      label: "AI-Cited Layoffs in 2025",
      value: "54,694",
      context: "Up 75% from 2023 baseline",
      percent: 75,
    },
    {
      label: "Companies Replacing HR/Admin with AI",
      value: "30%",
      context: "By end of 2026 (planned)",
      percent: 30,
      accent: true,
    },
    {
      label: "US Jobs at Elevated Automation Risk",
      value: "23M",
      context: "15% of total US workforce",
      percent: 15,
    },
  ],
  heroContext: `For the first time, major corporations are eliminating jobs not in response to economic pressure, but as a proactive strategy. Goldman Sachs identifies this as a structural transformation—companies are redesigning operations around AI before seeing productivity gains. If you work in administration, HR, or customer support, this report quantifies your exposure and offers concrete guidance.`,
  execSummary: {
    paragraphs: [
      `Unlike previous waves of job cuts triggered by recession or poor quarterly earnings, this transformation is structural, not cyclical. Companies are proactively redesigning operations around automation—often before AI has delivered measurable productivity gains.`,
      `In 2025, AI was explicitly cited in nearly 55,000 US layoffs, with Amazon (14,000 jobs), Microsoft (15,000), and Salesforce (4,000) leading the charge. These aren't struggling companies—they're some of the most profitable enterprises on Earth.`,
      `The paradox: Markets no longer reward layoffs as they once did. Investors increasingly view mass cuts as a sign of weakness, not efficiency. Yet executives continue anyway, fearing competitive disadvantage if they don't automate first.`,
    ],
    stats: [
      { value: "1.17M", label: "Total US layoffs in 2025" },
      { value: "54,694", label: "AI-attributed layoffs" },
      { value: "4.7%", label: "Share of total cuts" },
    ],
  },
  metrics: [
    {
      label: "Total US Layoffs (2025)",
      value: "1.17M",
      change: "▲ 54% vs 2024",
      changeType: "negative",
      context: "Highest since COVID-19",
    },
    {
      label: "AI-Attributed Cuts",
      value: "54.7K",
      change: "▲ 75% since 2023",
      changeType: "negative",
      context: "Explicitly cited AI",
    },
    {
      label: "High-Risk US Jobs",
      value: "23M",
      change: "SHRM Analysis",
      changeType: "neutral",
      context: "15% of workforce",
    },
    {
      label: "Young Tech Unemployment",
      value: "+3%",
      change: "▲ since Jan 2025",
      changeType: "negative",
      context: "Ages 20-30 in tech",
    },
  ],
  layoffTable: [
    {
      company: "Amazon",
      jobs: "14,000",
      aiCited: true,
      quote:
        '"Need fewer people doing some of the jobs that are being done today" — Andy Jassy',
    },
    {
      company: "Microsoft",
      jobs: "15,000",
      aiCited: true,
      quote: '"From software factory to intelligence engine" — Satya Nadella',
    },
    {
      company: "Salesforce",
      jobs: "4,000",
      aiCited: true,
      quote: '"AI now handles 30-50% of our workload" — Marc Benioff',
    },
    {
      company: "IBM",
      jobs: "~500",
      aiCited: true,
      quote: "Replaced HR functions with AI chatbots",
    },
    {
      company: "Workday",
      jobs: "1,750",
      aiCited: true,
      quote: '"Prioritizing AI investment" — Carl Eschenbach',
    },
  ],
  rpiAnalysis: {
    role: "Administrative Support Worker",
    workers: "3.6M US workers",
    salary: "$42K median salary",
    score: 72,
    tasks: [
      {
        name: "Data entry & processing",
        weight: "25%",
        aps: 0.95,
        hrf: 0.05,
        level: "high",
      },
      {
        name: "Calendar/scheduling",
        weight: "20%",
        aps: 0.85,
        hrf: 0.15,
        level: "high",
      },
      {
        name: "Document preparation",
        weight: "15%",
        aps: 0.8,
        hrf: 0.25,
        level: "high",
      },
      {
        name: "Basic correspondence",
        weight: "15%",
        aps: 0.7,
        hrf: 0.4,
        level: "moderate",
      },
      {
        name: "Stakeholder coordination",
        weight: "15%",
        aps: 0.45,
        hrf: 0.6,
        level: "moderate",
      },
      {
        name: "Problem-solving/escalation",
        weight: "10%",
        aps: 0.2,
        hrf: 0.85,
        level: "low",
      },
    ],
  },
  riskBuckets: [
    {
      type: "critical",
      number: "01",
      title: "Critical Exposure",
      criteria: "APS ≥ 0.8 · HRF ≤ 0.2",
      items: [
        "Data entry clerks (95% risk)",
        "Basic customer service reps",
        "Recruitment screening (85%)",
        "Benefits administration (90%)",
        "Bookkeeping & basic accounting",
      ],
    },
    {
      type: "augment",
      number: "02",
      title: "Augmentation Zone",
      criteria: "APS 0.4-0.7 · Human oversight required",
      items: [
        "Executive assistants",
        "HR business partners",
        "Technical support specialists",
        "Office managers",
        "Compliance coordinators",
      ],
    },
    {
      type: "resilient",
      number: "03",
      title: "Human Anchors",
      criteria: "HRF ≥ 0.7 · Durably human",
      items: [
        "Employee relations specialists",
        "Change management leads",
        "Executive coaches",
        "Conflict mediators",
        "Strategic HR advisors",
      ],
    },
  ],
  timeline: [
    {
      date: "Now – Q2 2026",
      title: "Enterprise Acceleration",
      desc: "30% of companies plan to replace HR/admin functions with AI by year-end. Big Tech continues 'efficiency' rounds. Entry-level hiring freezes spread across sectors. Administrative job postings are already down 12% YoY.",
    },
    {
      date: "Q3 2026 – 2027",
      title: "Mid-Market Adoption",
      desc: "AI agent platforms mature and costs drop. SMBs deploy automation for customer support, basic HR, and administrative tasks. 7.5 million data entry and admin jobs projected at elevated risk of elimination.",
    },
    {
      date: "2027 – 2028",
      title: "White-Collar Compression",
      desc: "10-20% of entry-level white-collar jobs eliminated. McKinsey estimates 12-14% of workers may need to transition occupations. New roles emerge in AI oversight, prompt engineering, and human-AI collaboration.",
    },
    {
      date: "2028 – 2030",
      title: "Equilibrium Search",
      desc: "Goldman Sachs projects 6-7% net workforce displacement—but notes that displacement effects historically fade after ~2 years as new roles emerge. For context: 60% of US workers today are in occupations that didn't exist in 1940.",
    },
  ],
  guidance: [
    {
      title: "For Administrative Workers",
      items: [
        "Audit your tasks: Categorize daily activities as routine/digital (high risk), judgment-based (moderate), or relationship-driven (resilient)",
        "Shift toward exceptions: Volunteer for escalation handling, stakeholder coordination, and complex problem-solving",
        "Learn your AI tools: Being the AI-proficient admin is dramatically safer than being the manual one",
        "Consider lateral moves: Employee relations, change management, and training roles have higher HRF scores",
      ],
    },
    {
      title: "For HR Professionals",
      items: [
        "Recognize what's automatable: 85% of recruitment screening and 90% of benefits admin are high-exposure—pivot toward strategic HR",
        "Build new expertise: Workforce planning, AI ethics, and human-AI teaming are emerging high-value skills",
        "Become a capability architect: Position yourself as the one who designs roles around AI augmentation",
        "Master governance: AI audit, bias detection, and compliance will be critical functions",
      ],
    },
  ],
  sources: [
    {
      num: 1,
      text: "Business Today: Goldman Sachs report on AI-led layoffs 2026",
      date: "January 4, 2026",
    },
    {
      num: 2,
      text: "CNBC: AI job cuts - Amazon, Microsoft, Salesforce cite AI",
      date: "December 21, 2025",
    },
    {
      num: 3,
      text: "Challenger, Gray & Christmas: 54,694 AI-attributed layoffs",
      date: "December 2025",
    },
    {
      num: 4,
      text: "SHRM: 15% of US jobs (23M) at heightened automation risk",
      date: "October 3, 2025",
    },
    {
      num: 5,
      text: "Goldman Sachs Research: AI and the Global Workforce",
      date: "August 2025",
    },
    {
      num: 6,
      text: "Fortune/Oxford Economics: AI layoffs as corporate fiction",
      date: "January 7, 2026",
    },
  ],
};

// Check if this is a special featured report ID or Goldman-related report
const isGoldmanReport = (id) => {
  return id === "goldman-structural-shift" || id === "goldman";
};

// Check if the API report is a Goldman/Structural Shift report
const isGoldmanAPIReport = (report) => {
  if (!report) return false;
  const title = report.title?.toLowerCase() || "";
  return (
    title.includes("structural shift") ||
    title.includes("goldman") ||
    (report.tags &&
      report.tags.some(
        (tag) =>
          tag.toLowerCase().includes("goldman") ||
          tag.toLowerCase().includes("rpi")
      ))
  );
};

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0]);
  const [gaugeValue, setGaugeValue] = useState(0);

  // Fetch report from API or use static Goldman report
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      // Check if it's the special Goldman Sachs featured report (legacy route)
      if (isGoldmanReport(id)) {
        setReport({ ...goldmanReport, isGoldmanFeatured: true });
        setLoading(false);
        return;
      }

      // Fetch from API for all reports
      try {
        const data = await reportsAPI.getById(id);
        // Check if the fetched report is a Goldman-style report
        const isGoldman = isGoldmanAPIReport(data);
        if (isGoldman) {
          // Merge API data with rich Goldman report data for consistent UI
          setReport({ ...goldmanReport, ...data, isGoldmanFeatured: true });
        } else {
          setReport({ ...data, isGoldmanFeatured: false });
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(
          err.response?.data?.detail ||
            "Failed to load report. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // Animate stats on mount (only for Goldman report)
  useEffect(() => {
    if (!report?.isGoldmanFeatured) return;

    const targetValues = [54694, 30, 23];
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats([
        Math.round(eased * targetValues[0]),
        Math.round(eased * targetValues[1]),
        Math.round(eased * targetValues[2]),
      ]);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // Gauge animation
    const gaugeInterval = setInterval(() => {
      setGaugeValue((prev) => {
        if (prev >= 72) {
          clearInterval(gaugeInterval);
          return 72;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(gaugeInterval);
  }, [report?.isGoldmanFeatured]);

  const getTaskBarColor = (level) => {
    switch (level) {
      case "high":
        return "bg-gradient-to-r from-crimson to-deep-crimson";
      case "moderate":
        return "bg-gradient-to-r from-gold to-amber-700";
      case "low":
        return "bg-gradient-to-r from-teal to-teal-700";
      default:
        return "bg-gray-400";
    }
  };

  const getBucketColor = (type) => {
    switch (type) {
      case "critical":
        return "border-t-4 border-t-crimson";
      case "augment":
        return "border-t-4 border-t-gold";
      case "resilient":
        return "border-t-4 border-t-teal";
      default:
        return "";
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f3] pt-[72px]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-crimson animate-spin mx-auto mb-4" />
            <p className="font-inter text-gray-600">Loading report...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f5f3] pt-[72px]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-crimson mx-auto mb-4" />
            <h2 className="font-playfair text-2xl mb-2">Report Not Found</h2>
            <p className="font-inter text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/reports")}
              className="font-inter text-sm font-semibold uppercase tracking-wider px-6 py-3 bg-crimson text-white hover:bg-deep-crimson transition-all"
            >
              Back to Reports
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not Found State
  if (!report) {
    return (
      <div className="min-h-screen bg-[#f4f5f3] pt-[72px]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl mb-2">Report Not Found</h2>
            <p className="font-inter text-gray-600 mb-6">
              The report you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/reports")}
              className="font-inter text-sm font-semibold uppercase tracking-wider px-6 py-3 bg-crimson text-white hover:bg-deep-crimson transition-all"
            >
              Back to Reports
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Generic API Report View (non-Goldman reports) - Minimal Detail View
  if (!report.isGoldmanFeatured) {
    return (
      <div className="min-h-screen bg-[#f4f5f3] pt-[72px]">
        <Navbar />

        {/* Hero Section */}
        <section className="bg-black text-white pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
            {/* Back Button */}
            <button
              onClick={() => navigate("/reports")}
              className="flex items-center gap-2 font-inter text-sm text-mist hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Reports
            </button>

            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-crimson" />
                <span className="font-inter text-xs font-semibold uppercase tracking-wide text-crimson">
                  Research Report
                </span>
              </div>
              {report.published_date && (
                <span className="font-inter text-xs text-mist">
                  {new Date(report.published_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-playfair text-4xl lg:text-5xl leading-tight mb-6">
              {report.title}
            </h1>

            {/* Author & Reading Time */}
            <div className="flex items-center gap-6 text-titanium mb-8">
              {report.author && (
                <span className="font-inter text-sm">By {report.author}</span>
              )}
              {report.reading_time && (
                <span className="font-inter text-sm flex items-center gap-2">
                  <Clock size={14} />
                  {report.reading_time} min read
                </span>
              )}
            </div>

            {/* Summary */}
            {report.summary && (
              <p className="font-crimson text-xl text-titanium leading-relaxed max-w-3xl">
                {report.summary}
              </p>
            )}
          </div>
        </section>

        {/* Cover Image */}
        {report.cover_image_url && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 -mt-8">
            <div className="aspect-video overflow-hidden shadow-xl">
              <img
                src={report.cover_image_url}
                alt={report.title}
                className="w-full h-full object-cover"
              />
            </div>
          </section>
        )}

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
            {/* Tags */}
            {report.tags && report.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {report.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="font-inter text-xs px-3 py-1.5 bg-white border border-platinum text-charcoal"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Main Content */}
            {report.content && (
              <div className="prose prose-lg max-w-none">
                <div
                  className="font-crimson text-lg text-charcoal leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: report.content.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            )}

            {/* PDF Download */}
            {report.pdf_url && (
              <div className="mt-12 p-8 bg-white border border-platinum">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-playfair text-xl mb-2">
                      Download Full Report
                    </h3>
                    <p className="font-inter text-sm text-gray-600">
                      Get the complete PDF version of this report
                    </p>
                  </div>
                  <a
                    href={report.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-inter text-sm font-semibold uppercase tracking-wider px-6 py-3 bg-crimson text-white hover:bg-deep-crimson transition-all"
                  >
                    <Download size={16} />
                    Download PDF
                  </a>
                </div>
              </div>
            )}

            {/* External File Link */}
            {report.file_url && !report.pdf_url && (
              <div className="mt-12 p-8 bg-white border border-platinum">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-playfair text-xl mb-2">
                      View Full Report
                    </h3>
                    <p className="font-inter text-sm text-gray-600">
                      Access the complete version of this report
                    </p>
                  </div>
                  <a
                    href={report.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-inter text-sm font-semibold uppercase tracking-wider px-6 py-3 bg-crimson text-white hover:bg-deep-crimson transition-all"
                  >
                    View Report
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // =====================================================
  // GOLDMAN SACHS FEATURED REPORT (Original HTML Template)
  // =====================================================
  return (
    <div className="min-h-screen bg-[#f4f5f3]">
      {/* Fixed Masthead */}
      <header className="bg-black/95 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/" className="font-playfair text-xl sm:text-2xl text-white">
            Replace<span className="text-crimson">able</span>.ai
          </Link>
          <nav className="hidden lg:flex gap-6 xl:gap-10 items-center">
            <a
              href="#context"
              className="font-inter text-sm font-medium text-titanium hover:text-white transition-colors"
            >
              The Story
            </a>
            <a
              href="#analysis"
              className="font-inter text-sm font-medium text-titanium hover:text-white transition-colors"
            >
              Analysis
            </a>
            <a
              href="#timeline"
              className="font-inter text-sm font-medium text-titanium hover:text-white transition-colors"
            >
              Timeline
            </a>
            <a
              href="#guidance"
              className="font-inter text-sm font-medium text-titanium hover:text-white transition-colors"
            >
              Guidance
            </a>
          </nav>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden sm:flex font-inter text-xs text-mist items-center gap-2">
              <Clock size={14} />
              {report.readingTime} min read
            </span>
            <span className="font-inter text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-crimson text-white px-2 sm:px-3 py-1 sm:py-1.5">
              Tier 1 Analysis
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-black relative overflow-hidden pt-16 sm:pt-20">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-crimson/20 via-transparent to-teal/10 animate-pulse"
          style={{ animationDuration: "20s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-20 relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 font-inter text-sm text-mist hover:text-white mb-6 sm:mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to News
            </button>

            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-6 sm:w-10 h-px bg-crimson"></div>
              <span className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-crimson">
                {report.label}
              </span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-6 sm:mb-8">
              The Structural <em className="text-crimson italic">Shift</em>
            </h1>

            <p className="font-crimson text-lg sm:text-xl text-titanium leading-relaxed mb-6 sm:mb-8 max-w-xl">
              {report.subtitle}
            </p>

            <div className="font-inter text-sm text-mist py-4 sm:py-5 border-y border-white/10 mb-8 sm:mb-10 leading-relaxed">
              <strong className="text-crimson font-semibold">
                Why this matters:
              </strong>{" "}
              <span className="hidden sm:inline">{report.heroContext}</span>
              <span className="sm:hidden">
                {report.heroContext.substring(0, 150)}...
              </span>
            </div>

            <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row">
              <a
                href="#analysis"
                className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-6 sm:px-8 py-3 sm:py-4 bg-crimson text-white hover:bg-deep-crimson transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-crimson/30 text-center"
              >
                See Your Risk Score
              </a>
              <a
                href="#guidance"
                className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-6 sm:px-8 py-3 sm:py-4 border border-white/30 text-white hover:border-white hover:bg-white/5 transition-all text-center"
              >
                Get Strategic Guidance
              </a>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 lg:p-10">
            <div className="font-inter text-[10px] font-semibold uppercase tracking-widest text-mist mb-6 sm:mb-8 pb-4 border-b border-white/10">
              Key Findings at a Glance
            </div>

            {report.heroStats.map((stat, i) => (
              <div key={i} className="mb-6 sm:mb-8 last:mb-0">
                <div className="font-inter text-[10px] sm:text-xs text-mist uppercase tracking-wide mb-2">
                  {stat.label}
                </div>
                <div
                  className={`font-playfair text-3xl sm:text-4xl lg:text-5xl ${
                    stat.accent ? "text-crimson" : "text-white"
                  } mb-2`}
                >
                  {i === 0
                    ? animatedStats[0].toLocaleString()
                    : i === 1
                    ? animatedStats[1] + "%"
                    : animatedStats[2] + "M"}
                </div>
                <div className="font-crimson text-sm text-titanium italic">
                  {stat.context}
                </div>
                <div className="h-1 bg-white/10 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal via-gold to-crimson transition-all duration-1000"
                    style={{ width: `${stat.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Context Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white" id="context">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 sm:w-10 h-px bg-crimson"></div>
            <span className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-crimson">
              Understanding the Shift
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6">
            What's Actually <em className="text-crimson italic">Happening</em>
          </h2>

          <p className="font-crimson text-lg sm:text-xl text-charcoal max-w-3xl leading-relaxed mb-10 sm:mb-16">
            In January 2026, Goldman Sachs released a stark assessment that sent
            tremors through workforce planning circles: AI-driven layoffs will
            persist through the year—not because companies are struggling, but
            because automation has become the default strategy for staying
            competitive.
          </p>

          {/* Executive Summary Card */}
          <div className="grid lg:grid-cols-3 gap-0 bg-white border border-platinum mb-10 sm:mb-16">
            <div className="lg:col-span-2 p-6 sm:p-8 lg:p-12 lg:border-r border-platinum">
              <div className="font-inter text-[10px] font-semibold uppercase tracking-widest text-crimson mb-4 sm:mb-5">
                Executive Summary
              </div>
              {report.execSummary.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="font-crimson text-base sm:text-lg text-charcoal leading-relaxed mb-4 sm:mb-5 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </div>
            <div className="p-6 sm:p-8 lg:p-12 flex flex-row lg:flex-col justify-around lg:justify-center border-t lg:border-t-0 border-platinum">
              {report.execSummary.stats.map((stat, i) => (
                <div
                  key={i}
                  className="mb-0 lg:mb-8 last:mb-0 text-center lg:text-left"
                >
                  <div className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-crimson">
                    {stat.value}
                  </div>
                  <div className="font-inter text-[10px] sm:text-xs uppercase tracking-wide text-gray-500 mt-1 sm:mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology Panel */}
          <div className="bg-black text-white p-6 sm:p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal via-gold to-crimson"></div>
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <BookOpen className="text-crimson" size={20} />
              <span className="font-playfair text-xl sm:text-2xl">
                How We Measure Automation Risk
              </span>
            </div>
            <p className="font-inter text-sm text-titanium leading-relaxed mb-4 sm:mb-6">
              This briefing applies Replaceable.ai's proprietary{" "}
              <strong className="text-white">
                Replaceability Potential Index (RPI™)
              </strong>{" "}
              methodology. Unlike simple "will AI take my job" predictions, RPI
              breaks down each role into constituent tasks, scoring each on
              Automation Probability (APS) and Human Resilience Factors (HRF).
              The result is a nuanced view of which specific activities face
              displacement—and which remain durably human.
            </p>
            <div className="flex gap-0.5 h-2 rounded overflow-hidden mb-3">
              <div className="flex-1 bg-teal hover:scale-y-150 transition-transform cursor-pointer"></div>
              <div className="flex-1 bg-slate hover:scale-y-150 transition-transform cursor-pointer"></div>
              <div className="flex-1 bg-gold hover:scale-y-150 transition-transform cursor-pointer"></div>
              <div className="flex-1 bg-crimson hover:scale-y-150 transition-transform cursor-pointer"></div>
              <div className="flex-1 bg-deep-crimson hover:scale-y-150 transition-transform cursor-pointer"></div>
            </div>
            <div className="flex justify-between font-inter text-[8px] sm:text-[9px] text-mist uppercase tracking-wide">
              <span>Low Risk (0-20)</span>
              <span>Moderate (40-60)</span>
              <span>Critical (80-100)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#f4f5f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 sm:w-10 h-px bg-crimson"></div>
            <span className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-crimson">
              The 2025 Reckoning
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6">
            By the <em className="text-crimson italic">Numbers</em>
          </h2>

          <p className="font-crimson text-lg sm:text-xl text-charcoal max-w-3xl leading-relaxed mb-10 sm:mb-16">
            Before diving into projections, let's ground ourselves in what
            actually happened. The data comes from Challenger, Gray & Christmas
            (the leading layoff tracking firm), SHRM workforce research, and
            Goldman Sachs' own analysis.
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-platinum bg-white">
            {report.metrics.map((metric, i) => (
              <div
                key={i}
                className="p-6 sm:p-8 lg:p-10 border-b sm:border-r border-platinum last:border-r-0 sm:last:border-b-0 sm:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r group hover:bg-black transition-all duration-300"
              >
                <div className="font-inter text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 mb-3 sm:mb-4 group-hover:text-mist transition-colors">
                  {metric.label}
                </div>
                <div className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-black mb-2 group-hover:text-white transition-colors">
                  {metric.value}
                </div>
                <div
                  className={`font-inter text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 ${
                    metric.changeType === "negative"
                      ? "text-crimson"
                      : metric.changeType === "positive"
                      ? "text-teal"
                      : "text-gold"
                  }`}
                >
                  {metric.change}
                </div>
                <div className="font-crimson text-sm text-gray-500 italic group-hover:text-titanium transition-colors">
                  {metric.context}
                </div>
              </div>
            ))}
          </div>

          {/* Data Table */}
          <div className="bg-white border border-platinum mt-8 sm:mt-10 overflow-hidden">
            <div className="bg-black p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="font-playfair text-lg sm:text-xl text-white">
                Major AI-Cited Layoffs in 2025
              </span>
              <span className="font-inter text-[10px] sm:text-xs text-mist">
                Companies that explicitly referenced AI in layoff announcements
              </span>
            </div>
            {/* Mobile: Card View */}
            <div className="block sm:hidden">
              {report.layoffTable.map((row, i) => (
                <div
                  key={i}
                  className="p-4 border-b border-platinum last:border-b-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-inter font-semibold text-black">
                      {row.company}
                    </span>
                    <span className="font-inter text-[9px] font-semibold uppercase tracking-wide bg-crimson text-white px-2 py-0.5">
                      AI Cited
                    </span>
                  </div>
                  <div className="font-crimson text-base text-charcoal mb-2">
                    {row.jobs} jobs
                  </div>
                  <div className="font-crimson italic text-sm text-gray-600">
                    {row.quote}
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop: Table View */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="bg-[#f4f5f3]">
                  <th className="font-inter text-[10px] font-semibold uppercase tracking-wider text-gray-500 text-left px-4 lg:px-6 py-3 lg:py-4 border-b-2 border-black">
                    Company
                  </th>
                  <th className="font-inter text-[10px] font-semibold uppercase tracking-wider text-gray-500 text-left px-4 lg:px-6 py-3 lg:py-4 border-b-2 border-black">
                    Jobs Cut
                  </th>
                  <th className="font-inter text-[10px] font-semibold uppercase tracking-wider text-gray-500 text-left px-4 lg:px-6 py-3 lg:py-4 border-b-2 border-black">
                    AI Cited
                  </th>
                  <th className="font-inter text-[10px] font-semibold uppercase tracking-wider text-gray-500 text-left px-4 lg:px-6 py-3 lg:py-4 border-b-2 border-black hidden md:table-cell">
                    Executive Statement
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.layoffTable.map((row, i) => (
                  <tr key={i} className="hover:bg-[#f4f5f3] transition-colors">
                    <td className="font-inter font-semibold text-black px-4 lg:px-6 py-4 lg:py-5 border-b border-platinum">
                      {row.company}
                    </td>
                    <td className="font-crimson text-base px-4 lg:px-6 py-4 lg:py-5 border-b border-platinum">
                      {row.jobs}
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-5 border-b border-platinum">
                      <span className="font-inter text-[9px] font-semibold uppercase tracking-wide bg-crimson text-white px-2 py-0.5">
                        Yes
                      </span>
                    </td>
                    <td className="font-crimson italic text-charcoal px-4 lg:px-6 py-4 lg:py-5 border-b border-platinum hidden md:table-cell">
                      {row.quote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* RPI Analysis Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white" id="analysis">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 sm:w-10 h-px bg-crimson"></div>
            <span className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-crimson">
              Replaceability Analysis
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6">
            Quantifying <em className="text-crimson italic">Your</em> Exposure
          </h2>

          <p className="font-crimson text-lg sm:text-xl text-charcoal max-w-3xl leading-relaxed mb-10 sm:mb-16">
            Abstract statistics only go so far. To understand what "structural
            automation" actually means, we need to examine specific roles at the
            task level. Below, we've applied RPI methodology to the
            Administrative Support Worker category—one of the highest-exposure
            job families identified by SHRM.
          </p>

          {/* RPI Analysis Grid */}
          <div className="grid lg:grid-cols-2 border border-platinum bg-white">
            {/* Score Panel */}
            <div className="bg-black p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center text-center">
              <div className="font-playfair text-xl sm:text-2xl lg:text-3xl text-white mb-2">
                {report.rpiAnalysis.role}
              </div>
              <div className="font-inter text-xs sm:text-sm text-mist mb-6 sm:mb-10">
                {report.rpiAnalysis.workers} · {report.rpiAnalysis.salary}
              </div>

              {/* Gauge */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 mb-4 sm:mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#c41e3a"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(gaugeValue / 100) * 502}, 502`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-white">
                    {gaugeValue}%
                  </span>
                  <span className="font-inter text-[9px] sm:text-[10px] uppercase tracking-wider text-mist mt-1 sm:mt-2">
                    Automatable
                  </span>
                </div>
              </div>

              <div className="font-inter text-xs sm:text-sm text-crimson">
                ↑ 8 points from 2024 baseline
              </div>
            </div>

            {/* Task Breakdown */}
            <div className="p-4 sm:p-6 lg:p-10">
              <div className="font-inter text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-platinum">
                Task-Level Breakdown
              </div>

              {/* Mobile: Simplified Cards */}
              <div className="block lg:hidden space-y-4">
                {report.rpiAnalysis.tasks.map((task, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-inter text-sm font-medium text-charcoal">
                        {task.name}
                      </span>
                      <span className="font-inter text-xs text-gray-500">
                        {task.weight}
                      </span>
                    </div>
                    <div className="h-2 bg-platinum rounded overflow-hidden mb-2">
                      <div
                        className={`h-full rounded ${getTaskBarColor(
                          task.level
                        )}`}
                        style={{ width: `${task.aps * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>APS: {task.aps}</span>
                      <span>HRF: {task.hrf}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Grid View */}
              <div className="hidden lg:block">
                {report.rpiAnalysis.tasks.map((task, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[180px_1fr_50px_50px_50px] gap-4 items-center py-4 border-b border-platinum"
                  >
                    <div className="font-inter text-sm font-medium text-charcoal">
                      {task.name}
                    </div>
                    <div className="h-2 bg-platinum rounded overflow-hidden">
                      <div
                        className={`h-full rounded ${getTaskBarColor(
                          task.level
                        )}`}
                        style={{ width: `${task.aps * 100}%` }}
                      ></div>
                    </div>
                    <div className="font-inter text-xs text-gray-500 text-center">
                      {task.weight}
                    </div>
                    <div className="font-inter text-xs text-gray-500 text-center">
                      {task.aps}
                    </div>
                    <div className="font-inter text-xs text-gray-500 text-center">
                      {task.hrf}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between font-inter text-[10px] text-gray-500 uppercase tracking-wide pt-4 mt-4 border-t border-platinum">
                  <span>Task</span>
                  <div className="flex gap-8">
                    <span>Weight</span>
                    <span>APS</span>
                    <span>HRF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insight Block */}
          <div className="bg-black p-8 sm:p-12 lg:p-16 my-10 sm:my-16 relative overflow-hidden">
            <span className="absolute -top-6 sm:-top-10 left-4 sm:left-10 font-playfair text-[120px] sm:text-[160px] lg:text-[200px] text-crimson/10 leading-none">
              "
            </span>
            <div className="relative z-10 max-w-4xl">
              <blockquote className="font-playfair text-xl sm:text-2xl lg:text-3xl italic text-white leading-relaxed mb-4 sm:mb-6">
                We suspect some firms are trying to dress up layoffs as a good
                news story rather than bad news, such as past over-hiring. AI
                becomes the scapegoat for executives looking to cover for past
                mistakes.
              </blockquote>
              <cite className="font-inter text-sm text-mist not-italic">
                — Oxford Economics, January 2026 Research Briefing
              </cite>
            </div>
          </div>

          {/* Risk Buckets */}
          <div className="flex items-center gap-3 mb-4 mt-12 sm:mt-16 lg:mt-20">
            <div className="w-6 sm:w-10 h-px bg-crimson"></div>
            <span className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-crimson">
              Risk Stratification
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6">
            The Automation <em className="text-crimson italic">Spectrum</em>
          </h2>

          <p className="font-crimson text-lg sm:text-xl text-charcoal max-w-3xl leading-relaxed mb-10 sm:mb-16">
            Not all roles face equal displacement risk. Based on our RPI
            analysis of over 800 occupations, we've identified three distinct
            exposure categories. Understanding where your role falls is the
            first step toward strategic adaptation.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-0 sm:border border-platinum">
            {report.riskBuckets.map((bucket, i) => (
              <div
                key={i}
                className={`p-6 sm:p-8 lg:p-12 bg-white border sm:border-0 sm:border-r border-platinum last:border-r-0 ${getBucketColor(
                  bucket.type
                )} hover:-translate-y-1 hover:shadow-xl transition-all group`}
              >
                <div className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-platinum mb-4 sm:mb-5 group-hover:text-crimson transition-colors">
                  {bucket.number}
                </div>
                <div className="font-playfair text-xl sm:text-2xl text-black mb-2">
                  {bucket.title}
                </div>
                <div className="font-inter text-[10px] sm:text-xs uppercase tracking-wide text-gray-500 mb-4 sm:mb-6">
                  {bucket.criteria}
                </div>
                <ul className="space-y-2">
                  {bucket.items.map((item, j) => (
                    <li
                      key={j}
                      className="font-crimson text-sm sm:text-base text-charcoal pl-4 sm:pl-5 relative leading-relaxed"
                    >
                      <span className="absolute left-0 text-gray-400">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section
        className="py-16 sm:py-24 lg:py-32 bg-black relative overflow-hidden"
        id="timeline"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-gold/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 sm:w-10 h-px bg-crimson"></div>
            <span className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-crimson">
              Displacement Timeline
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-white mb-4 sm:mb-6">
            When Structural Becomes{" "}
            <em className="text-crimson italic">Material</em>
          </h2>

          <p className="font-crimson text-lg sm:text-xl text-titanium max-w-3xl leading-relaxed mb-10 sm:mb-16">
            Knowing that change is coming matters less than knowing when. Based
            on Goldman Sachs projections, enterprise adoption patterns, and
            historical technology displacement curves, here's what the
            transition looks like.
          </p>

          {/* Timeline */}
          <div className="relative pl-8 sm:pl-12 lg:pl-20 mt-10 sm:mt-16">
            <div className="absolute left-2 sm:left-3 lg:left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal via-gold to-crimson"></div>

            {report.timeline.map((item, i) => (
              <div
                key={i}
                className="relative pb-10 sm:pb-12 lg:pb-16 last:pb-0"
              >
                <div className="absolute -left-[22px] sm:-left-[33px] lg:-left-[60px] top-1.5 sm:top-2 w-3 h-3 sm:w-4 sm:h-4 bg-crimson rounded-full shadow-lg shadow-crimson/50"></div>
                <div className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-crimson mb-2 sm:mb-3">
                  {item.date}
                </div>
                <div className="font-playfair text-xl sm:text-2xl lg:text-3xl text-white mb-2 sm:mb-3">
                  {item.title}
                </div>
                <p className="font-crimson text-base sm:text-lg text-titanium leading-relaxed max-w-2xl">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guidance Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#f4f5f3]" id="guidance">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 sm:w-10 h-px bg-crimson"></div>
            <span className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-crimson">
              Strategic Guidance
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6">
            What Should You <em className="text-crimson italic">Do Now</em>
          </h2>

          <p className="font-crimson text-lg sm:text-xl text-charcoal max-w-3xl leading-relaxed mb-10 sm:mb-16">
            Data without action is just anxiety fuel. Based on our analysis of
            successful role transitions and emerging job categories, here are
            concrete steps for workers in high-exposure categories.
          </p>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {report.guidance.map((card, i) => (
              <div
                key={i}
                className="bg-white border border-platinum p-6 sm:p-8 lg:p-12 hover:border-crimson hover:shadow-xl transition-all"
              >
                <div className="font-playfair text-xl sm:text-2xl text-black mb-4 sm:mb-6">
                  {card.title}
                </div>
                <ul className="space-y-0">
                  {card.items.map((item, j) => (
                    <li
                      key={j}
                      className="font-crimson text-sm sm:text-base text-charcoal py-2 sm:py-3 pl-5 sm:pl-6 relative border-b border-platinum last:border-b-0 leading-relaxed"
                    >
                      <span className="absolute left-0 top-2.5 sm:top-3.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-crimson"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-crimson py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8 lg:gap-10">
          <div className="text-center lg:text-left">
            <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-white mb-2 sm:mb-3">
              Check Your Role's RPI Score
            </h3>
            <p className="font-inter text-sm sm:text-base text-white/80">
              Get a personalized automation risk assessment for your specific
              job title and industry.
            </p>
          </div>
          <a
            href="#"
            className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-white text-crimson hover:bg-black hover:text-white transition-all flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center"
          >
            Analyze My Role
            <ChevronRight size={16} />
          </a>
        </div>
      </section>

      {/* Sources Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="bg-white border border-platinum p-6 sm:p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-platinum">
              <BookOpen className="text-crimson" size={20} />
              <span className="font-playfair text-xl sm:text-2xl">
                Sources & References
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-3 sm:gap-y-4">
              {report.sources.map((source, i) => (
                <div key={i} className="flex gap-2 sm:gap-3 font-inter text-sm">
                  <span className="font-semibold text-crimson min-w-[16px] sm:min-w-[20px]">
                    {source.num}
                  </span>
                  <div>
                    <span className="text-charcoal hover:text-crimson transition-colors cursor-pointer">
                      {source.text}
                    </span>
                    <span className="block text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                      {source.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 sm:py-16 lg:py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link
                to="/"
                className="font-playfair text-xl sm:text-2xl text-white mb-4 sm:mb-5 block"
              >
                Replace<span className="text-crimson">able</span>.ai
              </Link>
              <p className="font-crimson text-sm text-gray-500 leading-relaxed">
                Transforming automation uncertainty into strategic clarity. We
                help professionals and enterprises understand not which jobs
                disappear, but what humans will do that matters.
              </p>
            </div>
            <div>
              <h5 className="font-inter text-[10px] font-semibold uppercase tracking-widest text-mist mb-4 sm:mb-5">
                Research
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-inter text-sm text-titanium hover:text-crimson transition-colors"
                  >
                    Workforce Intelligence
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-inter text-sm text-titanium hover:text-crimson transition-colors"
                  >
                    RPI™ Methodology
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-inter text-sm text-titanium hover:text-crimson transition-colors"
                  >
                    Published Reports
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-inter text-[10px] font-semibold uppercase tracking-widest text-mist mb-4 sm:mb-5">
                Products
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-inter text-sm text-titanium hover:text-crimson transition-colors"
                  >
                    Role Analyzer
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-inter text-sm text-titanium hover:text-crimson transition-colors"
                  >
                    Enterprise Reports
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-inter text-sm text-titanium hover:text-crimson transition-colors"
                  >
                    API Access
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-inter text-[10px] font-semibold uppercase tracking-widest text-mist mb-4 sm:mb-5">
                Company
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-inter text-sm text-titanium hover:text-crimson transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-inter text-sm text-titanium hover:text-crimson transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-inter text-sm text-titanium hover:text-crimson transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-white/5">
            <p className="font-inter text-xs text-gray-500">
              © 2026 Replaceable.ai · All rights reserved
            </p>
            <p className="font-inter text-xs text-gray-500">
              Last updated: January 10, 2026 · Report ID: WI-2026-0110-GS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReportDetail;
