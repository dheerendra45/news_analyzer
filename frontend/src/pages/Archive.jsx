import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { intelligenceCardsAPI } from "../api/intelligenceCards";
import { Search, Grid, List, ChevronRight, X } from "lucide-react";

const Archive = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [featuredCard, setFeaturedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    company: "",
    tier: "",
    category: "",
    date_filter: "",
    search: "",
    sort_by: "newest",
  });

  // Active filters display
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    fetchCards();
    fetchFeaturedCard();
  }, [page, filters]);

  useEffect(() => {
    // Build active filters array for display
    const active = [];
    if (filters.company)
      active.push({ key: "company", value: filters.company });
    if (filters.tier)
      active.push({ key: "tier", value: getTierLabel(filters.tier) });
    if (filters.category)
      active.push({ key: "category", value: filters.category });
    if (filters.date_filter)
      active.push({
        key: "date_filter",
        value: getDateLabel(filters.date_filter),
      });
    setActiveFilters(active);
  }, [filters]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await intelligenceCardsAPI.getAll({
        page,
        size: 12,
        ...filters,
      });
      setCards(response.items);
      setTotalPages(response.pages);
      setTotal(response.total);
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCard = async () => {
    try {
      const featured = await intelligenceCardsAPI.getFeaturedCard();
      setFeaturedCard(featured);
    } catch (err) {
      console.error("Failed to fetch featured card:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCards();
  };

  const clearFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({
      company: "",
      tier: "",
      category: "",
      date_filter: "",
      search: "",
      sort_by: "newest",
    });
    setPage(1);
  };

  const handleCardClick = (card) => {
    if (card.report_id) {
      navigate(`/report/${card.report_id}`);
    } else if (card.analysis_url) {
      navigate(card.analysis_url);
    }
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case "tier_1":
        return "Tier 1 — Critical";
      case "tier_2":
        return "Tier 2 — Elevated";
      case "tier_3":
        return "Tier 3 — Moderate";
      default:
        return tier;
    }
  };

  const getDateLabel = (dateFilter) => {
    switch (dateFilter) {
      case "7d":
        return "Last 7 Days";
      case "30d":
        return "Last 30 Days";
      case "90d":
        return "Last 90 Days";
      case "2026":
        return "2026";
      case "2025":
        return "2025";
      default:
        return dateFilter;
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
        return "critical";
      case "elevated":
        return "elevated";
      case "moderate":
        return "moderate";
      default:
        return "";
    }
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        className={`pagination-btn ${page === 1 ? "disabled" : ""}`}
        onClick={() => page > 1 && setPage(page - 1)}
        disabled={page === 1}
      >
        ← Previous
      </button>,
    );

    // Page numbers
    if (startPage > 1) {
      buttons.push(
        <button key={1} className="pagination-btn" onClick={() => setPage(1)}>
          1
        </button>,
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-btn ${page === i ? "active" : ""}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>,
        );
      }
      buttons.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </button>,
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        className={`pagination-btn ${page === totalPages ? "disabled" : ""}`}
        onClick={() => page < totalPages && setPage(page + 1)}
        disabled={page === totalPages}
      >
        Next →
      </button>,
    );

    return buttons;
  };

  return (
    <div className="archive-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="page-header-content">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <Link to="/">Intelligence</Link>
            <ChevronRight size={12} />
            <span>Archive</span>
          </nav>
          <h1>
            Intelligence <em>Archive</em>
          </h1>
          <p className="page-header-subtitle">
            Complete collection of RPI-analyzed workforce intelligence. Every
            major corporate announcement decoded through the lens of career
            impact.
          </p>

          <div className="header-stats">
            <div className="header-stat">
              <span className="header-stat-value">{total}</span>
              <span className="header-stat-label">Analyses</span>
            </div>
            <div className="header-stat">
              <span className="header-stat-value">42</span>
              <span className="header-stat-label">Companies</span>
            </div>
            <div className="header-stat">
              <span className="header-stat-value crimson">847K</span>
              <span className="header-stat-label">Jobs Tracked</span>
            </div>
            <div className="header-stat">
              <span className="header-stat-value">94%</span>
              <span className="header-stat-label">Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        {/* Featured Banner */}
        {featuredCard && (
          <div
            className="featured-banner"
            onClick={() => handleCardClick(featuredCard)}
          >
            <div className="featured-content">
              <span className="featured-label">Featured Analysis</span>
              <h2
                dangerouslySetInnerHTML={{
                  __html: featuredCard.title.replace(
                    featuredCard.title_highlight,
                    `<em>${featuredCard.title_highlight}</em>`,
                  ),
                }}
              ></h2>
              <p className="featured-excerpt">{featuredCard.excerpt}</p>
              <span className="featured-link">
                Read Full Analysis
                <ChevronRight size={16} />
              </span>
            </div>
            <div className="featured-stats">
              {featuredCard.stat1 && (
                <div className="featured-stat">
                  <div className="featured-stat-value">
                    {featuredCard.stat1.value}
                  </div>
                  <div className="featured-stat-label">
                    {featuredCard.stat1.label}
                  </div>
                </div>
              )}
              {featuredCard.stat2 && (
                <div className="featured-stat">
                  <div
                    className={`featured-stat-value ${
                      featuredCard.stat2.type === "critical" ? "crimson" : ""
                    }`}
                  >
                    {featuredCard.stat2.value}
                  </div>
                  <div className="featured-stat-label">
                    {featuredCard.stat2.label}
                  </div>
                </div>
              )}
              {featuredCard.ai_investment && (
                <div className="featured-stat">
                  <div className="featured-stat-value">
                    {featuredCard.ai_investment}
                  </div>
                  <div className="featured-stat-label">AI Investment</div>
                </div>
              )}
              {featuredCard.stat3 && (
                <div className="featured-stat">
                  <div className="featured-stat-value">
                    {featuredCard.stat3.value}
                  </div>
                  <div className="featured-stat-label">
                    {featuredCard.stat3.label}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-left">
            <div className="filter-group">
              <select
                className="filter-select"
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
              >
                <option value="">All Companies</option>
                <option value="amazon">Amazon</option>
                <option value="meta">Meta</option>
                <option value="google">Google</option>
                <option value="microsoft">Microsoft</option>
                <option value="apple">Apple</option>
                <option value="tesla">Tesla</option>
                <option value="nvidia">NVIDIA</option>
                <option value="jpmorgan">JP Morgan</option>
                <option value="goldman">Goldman Sachs</option>
                <option value="ibm">IBM</option>
                <option value="salesforce">Salesforce</option>
                <option value="walmart">Walmart</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                className="filter-select"
                value={filters.tier}
                onChange={(e) => handleFilterChange("tier", e.target.value)}
              >
                <option value="">All Tiers</option>
                <option value="tier_1">Tier 1 — Critical</option>
                <option value="tier_2">Tier 2 — Elevated</option>
                <option value="tier_3">Tier 3 — Moderate</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Topics</option>
                <option value="Layoffs">Layoffs & Restructures</option>
                <option value="AI Investment">AI Investment</option>
                <option value="Automation">Automation Rollout</option>
                <option value="Hiring">Hiring Signals</option>
                <option value="Earnings">Earnings & Outlook</option>
                <option value="Robotics">Robotics</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                className="filter-select"
                value={filters.date_filter}
                onChange={(e) =>
                  handleFilterChange("date_filter", e.target.value)
                }
              >
                <option value="">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
          <div className="filter-right">
            <form onSubmit={handleSearchSubmit} className="search-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search analyses..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </form>
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="active-filters">
            <span className="active-filters-label">Filters:</span>
            {activeFilters.map((filter) => (
              <span key={filter.key} className="filter-tag">
                {filter.value}
                <button onClick={() => clearFilter(filter.key)}>
                  <X size={12} />
                </button>
              </span>
            ))}
            <button className="clear-all" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>
        )}

        {/* Results Header */}
        <div className="results-header">
          <span className="results-count">
            Showing{" "}
            <strong>
              {(page - 1) * 12 + 1}-{Math.min(page * 12, total)}
            </strong>{" "}
            of <strong>{total}</strong> analyses
          </span>
          <div className="sort-dropdown">
            <span className="sort-label">Sort by:</span>
            <select
              className="sort-select"
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rpi-high">Highest RPI</option>
              <option value="rpi-low">Lowest RPI</option>
              <option value="jobs">Most Jobs Affected</option>
            </select>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="analyses-grid">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="analysis-card skeleton"></div>
                ))
              : cards.map((card) => (
                  <div
                    key={card.id}
                    className="analysis-card"
                    onClick={() => handleCardClick(card)}
                  >
                    <div
                      className={`analysis-card-image ${card.company_gradient || ""}`}
                      style={
                        card.gradient_start && card.gradient_end
                          ? {
                              background: `linear-gradient(135deg, ${card.gradient_start} 0%, ${card.gradient_end} 100%)`,
                            }
                          : undefined
                      }
                    >
                      <div className="analysis-card-image-overlay"></div>
                      <div className="analysis-card-company">
                        <div className="company-icon">
                          {card.company_logo ? (
                            <img
                              src={card.company_logo}
                              alt={card.company}
                              className="company-logo-img"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.textContent =
                                  card.company_icon ||
                                  card.company.charAt(0).toUpperCase();
                              }}
                            />
                          ) : (
                            card.company_icon ||
                            card.company.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="company-name">{card.company}</span>
                      </div>
                      <span
                        className={`analysis-card-tier ${getTierClass(
                          card.tier,
                        )}`}
                      >
                        {card.tier === "tier_1"
                          ? "Tier 1"
                          : card.tier === "tier_2"
                            ? "Tier 2"
                            : "Tier 3"}
                      </span>
                    </div>
                    <div className="analysis-card-content">
                      <div className="analysis-card-meta">
                        <span className="analysis-card-date">
                          {new Date(card.published_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="analysis-card-category">
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
                      <p className="analysis-card-excerpt">{card.excerpt}</p>
                      <div className="analysis-card-stats">
                        {card.stat1 && (
                          <div className="analysis-card-stat">
                            <div className="analysis-card-stat-value">
                              {card.stat1.value}
                            </div>
                            <div className="analysis-card-stat-label">
                              {card.stat1.label}
                            </div>
                          </div>
                        )}
                        {card.stat2 && (
                          <div className="analysis-card-stat">
                            <div
                              className={`analysis-card-stat-value ${getStatValueClass(
                                card.stat2.type,
                              )}`}
                            >
                              {card.stat2.value}
                            </div>
                            <div className="analysis-card-stat-label">
                              {card.stat2.label}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="analyses-list">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="analysis-list-item skeleton"></div>
                ))
              : cards.map((card) => (
                  <div
                    key={card.id}
                    className="analysis-list-item"
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="list-item-company">
                      <div
                        className={`list-item-company-icon ${card.company_gradient || ""}`}
                        style={
                          card.gradient_start && card.gradient_end
                            ? {
                                background: `linear-gradient(135deg, ${card.gradient_start} 0%, ${card.gradient_end} 100%)`,
                              }
                            : undefined
                        }
                      >
                        {card.company_logo ? (
                          <img
                            src={card.company_logo}
                            alt={card.company}
                            className="company-logo-img"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.textContent =
                                card.company_icon ||
                                card.company.charAt(0).toUpperCase();
                            }}
                          />
                        ) : (
                          card.company_icon ||
                          card.company.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="list-item-company-name">
                        {card.company}
                      </span>
                    </div>
                    <div className="list-item-content">
                      <div className="list-item-meta">
                        <span
                          className={`list-item-tier ${getTierClass(
                            card.tier,
                          )}`}
                        >
                          {card.tier === "tier_1"
                            ? "Tier 1"
                            : card.tier === "tier_2"
                              ? "Tier 2"
                              : "Tier 3"}
                        </span>
                        <span className="list-item-date">
                          {new Date(card.published_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="list-item-category">
                          {card.category}
                        </span>
                      </div>
                      <h3
                        className="list-item-title"
                        dangerouslySetInnerHTML={{
                          __html: card.title.replace(
                            card.title_highlight,
                            `<em>${card.title_highlight}</em>`,
                          ),
                        }}
                      ></h3>
                      <p className="list-item-excerpt">{card.excerpt}</p>
                    </div>
                    <div className="list-item-stats">
                      {card.stat1 && (
                        <div className="list-item-stat">
                          <span className="list-item-stat-label">
                            {card.stat1.label}
                          </span>
                          <span className="list-item-stat-value">
                            {card.stat1.value}
                          </span>
                        </div>
                      )}
                      {card.ai_investment && (
                        <div className="list-item-stat">
                          <span className="list-item-stat-label">
                            AI Investment
                          </span>
                          <span className="list-item-stat-value">
                            {card.ai_investment}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="list-item-rpi">
                      {card.rpi_score && (
                        <>
                          <div
                            className={`list-item-rpi-score ${getStatValueClass(
                              card.stat2?.type,
                            )}`}
                          >
                            {card.rpi_score}
                          </div>
                          <div className="list-item-rpi-label">Peak RPI</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">{renderPagination()}</div>
        )}
      </main>

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

export default Archive;
