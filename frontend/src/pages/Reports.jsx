import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reportsAPI } from "../api/reports";
import ReportCard from "../components/ReportCard";
import {
  Search,
  FileText,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [featuredReport, setFeaturedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);

  // Fetch reports from API
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size: 10,
      };
      if (search) params.search = search;
      if (selectedTag) params.tag = selectedTag;

      const response = await reportsAPI.getAll(params);
      const allReports = response.items || [];

      // Find the featured Goldman report (or first rich report)
      const featured = allReports.find(
        (r) =>
          r.is_rich_report ||
          r.title === "The Structural Shift" ||
          (r.hero_stats && r.hero_stats.length > 0),
      );

      if (featured) {
        setFeaturedReport(featured);
        // Filter out the featured report from regular list
        setReports(allReports.filter((r) => r.id !== featured.id));
      } else {
        setReports(allReports);
      }

      setTotal(response.total || 0);
      setTotalPages(response.pages || 1);

      // Extract unique tags from reports
      const allTags = new Set();
      (response.items || []).forEach((report) => {
        (report.tags || []).forEach((tag) => allTags.add(tag));
      });
      setTags(Array.from(allTags));
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to fetch reports. Is the backend running?",
      );
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchReports();
  }, [page, search, selectedTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchReports();
    toast.success("Reports refreshed");
  };

  return (
    <div className="min-h-screen bg-[#f4f5f3]">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-crimson" size={20} />
            <span className="font-inter text-xs text-crimson uppercase tracking-wider">
              Research Library
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl mb-4">
            Intelligence <em className="text-crimson italic">Reports</em>
          </h1>
          <p className="font-crimson text-xl text-titanium max-w-2xl">
            In-depth analysis and research reports on AI workforce disruption,
            automation trends, and the future of employment.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-platinum">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <div className="font-inter text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                Total Reports
              </div>
              <div className="font-playfair text-3xl text-crimson">{total}</div>
            </div>
            <div>
              <div className="font-inter text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                Topics Covered
              </div>
              <div className="font-playfair text-3xl">{tags.length}</div>
            </div>
            <div>
              <div className="font-inter text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                Latest Update
              </div>
              <div className="font-playfair text-3xl">Today</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Report - Dynamic from DB or fallback */}
      {(featuredReport || !loading) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8">
          <Link
            to={
              featuredReport
                ? `/report/${featuredReport.id}`
                : "/report/goldman-structural-shift"
            }
            className="block bg-black text-white p-8 hover:bg-charcoal transition-colors group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-inter text-[10px] font-semibold uppercase tracking-wider bg-crimson text-white px-3 py-1">
                    Featured Report
                  </span>
                  <span className="font-inter text-xs text-mist flex items-center gap-1">
                    <Clock size={12} />
                    {featuredReport?.reading_time || 8} min read
                  </span>
                </div>
                <h3 className="font-playfair text-2xl lg:text-3xl mb-3 group-hover:text-crimson transition-colors">
                  {featuredReport?.title === "The Structural Shift" ? (
                    <>
                      The Structural{" "}
                      <em className="italic text-crimson">Shift</em>
                    </>
                  ) : (
                    featuredReport?.title || (
                      <>
                        The Structural{" "}
                        <em className="italic text-crimson">Shift</em>
                      </>
                    )
                  )}
                </h3>
                <p className="font-crimson text-titanium text-lg leading-relaxed max-w-2xl">
                  {featuredReport?.subtitle ||
                    featuredReport?.summary ||
                    "Goldman Sachs warns AI-driven layoffs will continue through 2026—not because of recession, but because automation is now the strategy. What does this mean for your career?"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-crimson font-inter text-sm font-semibold uppercase tracking-wider">
                Read Full Report
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Section Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-4">
        <div className="flex justify-between items-center pb-4 border-b-2 border-black">
          <h2 className="font-playfair text-[28px]">
            Research <em className="text-crimson italic">Library</em>
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
                placeholder="Search reports..."
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

          {/* Tag Filter */}
          {tags.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => {
                  setSelectedTag("");
                  setPage(1);
                }}
                className={`font-inter text-xs px-4 py-2 border transition-colors whitespace-nowrap ${
                  selectedTag === ""
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-platinum hover:border-black"
                }`}
              >
                All Topics
              </button>
              {tags.slice(0, 5).map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag);
                    setPage(1);
                  }}
                  className={`font-inter text-xs px-4 py-2 border transition-colors whitespace-nowrap ${
                    selectedTag === tag
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-platinum hover:border-black"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reports Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-crimson border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-inter text-sm text-gray-500">
              Loading reports...
            </p>
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
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="font-crimson text-xl text-gray-500 mb-4">
              No reports found
            </p>
            <p className="font-inter text-sm text-gray-400">
              {search || selectedTag
                ? "Try adjusting your filters"
                : "Run the seed script to populate data"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
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
    </div>
  );
};

export default Reports;
