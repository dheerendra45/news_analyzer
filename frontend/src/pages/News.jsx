import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { newsAPI } from "../api/news";
import NewsCard from "../components/NewsCard";
import { Search, RefreshCw, AlertCircle, Check } from "lucide-react";
import toast from "react-hot-toast";

// Previously analyzed stories (static data for display)
const analyzedStories = [
  {
    id: "goldman-structural-shift",
    title: "Goldman Sachs: AI Layoffs to Continue Through 2026",
    date: "2026-01-10",
    status: "Report Published",
  },
  {
    id: "amazon-14k-cuts",
    title: "Amazon Cuts 14,000 Corporate Jobs, Cites AI",
    date: "2026-01-08",
    status: "Report Published",
  },
  {
    id: "microsoft-intelligence-engine",
    title: "Microsoft's 'Intelligence Engine' Strategy",
    date: "2026-01-06",
    status: "Report Published",
  },
  {
    id: "shrm-23m-jobs",
    title: "SHRM: 23M US Jobs at Elevated Automation Risk",
    date: "2026-01-04",
    status: "Analyzed",
  },
  {
    id: "ibm-hr-chatbots",
    title: "IBM Replaces 500 HR Roles with AI Chatbots",
    date: "2026-01-02",
    status: "Analyzed",
  },
  {
    id: "workday-layoffs",
    title: "Workday Cuts 1,750, Prioritizes AI Investment",
    date: "2025-12-28",
    status: "Analyzed",
  },
];

// Automated search queries
const searchQueries = [
  {
    day: "Monday",
    query: '"AI layoffs this week"',
    secondary: '+ "automation job cuts"',
  },
  {
    day: "Tuesday",
    query: '"AI workforce research report"',
    secondary: '+ "jobs replaced by AI"',
  },
  {
    day: "Wednesday",
    query: '"AI hiring freeze"',
    secondary: '+ "artificial intelligence employment"',
  },
  {
    day: "Thursday",
    query: '"CEO AI jobs statement"',
    secondary: '+ "AI restructuring"',
  },
  {
    day: "Friday",
    query: '"AI job market impact"',
    secondary: '+ "automation workforce 2026"',
  },
  {
    day: "Weekend",
    query: '"Goldman McKinsey AI workforce"',
    secondary: '+ "AI employment statistics"',
  },
];

const News = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tier, setTier] = useState("");
  const [analyzedFilter, setAnalyzedFilter] = useState("This Week");
  const [stats, setStats] = useState({
    total: 0,
    tier1: 0,
    tier2: 0,
    tier3: 0,
  });

  // Fetch news from API
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size: 10,
      };
      if (search) params.search = search;
      if (tier) params.tier = tier;

      const response = await newsAPI.getAll(params);
      setNews(response.items || []);
      setTotal(response.total || 0);
      setTotalPages(response.pages || 1);

      // Calculate stats from all fetched items
      const items = response.items || [];
      setStats({
        total: response.total || items.length,
        tier1: items.filter((n) => n.tier === "tier_1").length,
        tier2: items.filter((n) => n.tier === "tier_2").length,
        tier3: items.filter((n) => n.tier === "tier_3").length,
      });
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to fetch news. Is the backend running?"
      );
      toast.error("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchNews();
  }, [page, search, tier]);

  // Handler for Generate Report button
  const handleGenerateReport = (id) => {
    navigate(`/reports/${id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchNews();
    toast.success("News refreshed");
  };

  const tiers = [
    { value: "", label: "All Tiers" },
    { value: "tier_1", label: "Tier 1 - Major" },
    { value: "tier_2", label: "Tier 2 - Medium" },
    { value: "tier_3", label: "Tier 3 - Minor" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f3]">
      {/* Hero Section */}
      <section className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-inter text-xs text-green-500 uppercase tracking-wider">
              Pipeline Active
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl mb-4">
            Daily Intelligence <em className="text-crimson italic">Pipeline</em>
          </h1>
          <p className="font-crimson text-xl text-titanium max-w-2xl">
            Real-time tracking of AI workforce disruption. Breaking news,
            research reports, and impact analysis.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white p-6 border border-platinum">
            <div className="font-inter text-[10px] uppercase tracking-wider text-gray-500 mb-2">
              Total Stories
            </div>
            <div className="font-playfair text-4xl text-crimson">{total}</div>
          </div>
          <div className="bg-white p-6 border border-platinum">
            <div className="font-inter text-[10px] uppercase tracking-wider text-gray-500 mb-2">
              Tier 1 (Major)
            </div>
            <div className="font-playfair text-4xl">{stats.tier1}</div>
          </div>
          <div className="bg-white p-6 border border-platinum">
            <div className="font-inter text-[10px] uppercase tracking-wider text-gray-500 mb-2">
              Tier 2 (Medium)
            </div>
            <div className="font-playfair text-4xl">{stats.tier2}</div>
          </div>
          <div className="bg-white p-6 border border-platinum">
            <div className="font-inter text-[10px] uppercase tracking-wider text-gray-500 mb-2">
              Tier 3 (Minor)
            </div>
            <div className="font-playfair text-4xl">{stats.tier3}</div>
          </div>
        </div>
      </section>

      {/* Section Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-4">
        <div className="flex justify-between items-center pb-4 border-b-2 border-black">
          <h2 className="font-playfair text-[28px]">
            News <em className="text-crimson italic">Feed</em>
          </h2>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 font-inter text-xs px-4 py-2 border border-platinum hover:border-black transition-colors bg-white"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search news..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-platinum text-sm font-inter focus:outline-none focus:border-crimson transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-crimson text-white font-inter text-sm font-semibold hover:bg-deep-crimson transition-colors"
            >
              Search
            </button>
          </form>

          {/* Tier Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {tiers.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTier(t.value);
                  setPage(1);
                }}
                className={`font-inter text-xs px-4 py-2 border transition-colors whitespace-nowrap ${
                  tier === t.value
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-platinum hover:border-black"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-crimson border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-inter text-sm text-gray-500">Loading news...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="font-inter text-red-500 mb-2">{error}</p>
            <p className="font-inter text-sm text-gray-500 mb-4">
              Make sure the backend server is running on port 8000
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-crimson text-white font-inter text-sm font-semibold hover:bg-deep-crimson transition-colors"
            >
              Retry
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-crimson text-xl text-gray-500 mb-4">
              No news articles found
            </p>
            <p className="font-inter text-sm text-gray-400">
              {search || tier
                ? "Try adjusting your filters"
                : "Run the seed script to populate data"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  onGenerateReport={handleGenerateReport}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-platinum font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition-colors bg-white"
                >
                  Previous
                </button>
                <span className="font-inter text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-platinum font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition-colors bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Previously Analyzed Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 border-t border-platinum">
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="font-playfair text-[28px]">
            Previously <em className="text-crimson italic">Analyzed</em>
          </h2>
          <div className="flex gap-2">
            {["This Week", "This Month", "All Time"].map((filter) => (
              <button
                key={filter}
                onClick={() => setAnalyzedFilter(filter)}
                className={`font-inter text-xs px-4 py-2 border transition-colors ${
                  analyzedFilter === filter
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-platinum hover:border-black"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyzedStories.map((story) => (
            <div
              key={story.id}
              onClick={() => navigate(`/reports`)}
              className="bg-white border border-platinum p-5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer hover:border-crimson"
            >
              <div className="font-inter text-[13px] font-medium text-charcoal mb-2">
                {story.title}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-[11px] text-gray-500">
                  {story.date}
                </span>
                <span
                  className={`font-inter text-[11px] flex items-center gap-1 ${
                    story.status === "Report Published"
                      ? "text-green-600"
                      : "text-green-500"
                  }`}
                >
                  <Check size={12} />
                  {story.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Automated Search Queries Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 border-t border-platinum">
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="font-playfair text-[28px]">
            <em className="text-crimson italic">Automated</em> Search Queries
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchQueries.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-platinum p-5 hover:border-crimson transition-colors"
            >
              <div className="font-inter text-[10px] uppercase tracking-wider text-crimson mb-2">
                {item.day}
              </div>
              <div className="font-inter text-sm text-black mb-1">
                {item.query}
              </div>
              <div className="font-inter text-xs text-gray-500">
                {item.secondary}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default News;
