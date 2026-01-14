import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { intelligenceCardsAPI } from "../../api/intelligenceCards";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Building2,
  BarChart3,
  Users,
  DollarSign,
  ArrowUpDown,
} from "lucide-react";
import "../../styles/admin-cards.css";

const CardsManager = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    tier: "",
    company: "",
    search: "",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState(getEmptyFormData());
  const [saving, setSaving] = useState(false);

  // Expanded stat section
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchCards();
    fetchStats();
  }, [page, filters]);

  function getEmptyFormData() {
    return {
      title: "",
      title_highlight: "",
      company: "",
      company_icon: "",
      company_gradient: "",
      category: "Layoffs",
      excerpt: "",
      tier: "tier_1",
      tier_label: "",
      stat1: { value: "", label: "", type: "" },
      stat2: { value: "", label: "", type: "" },
      stat3: { value: "", label: "", type: "" },
      rpi_score: "",
      jobs_affected: "",
      ai_investment: "",
      report_id: "",
      analysis_url: "",
      is_featured: false,
      display_order: 0,
      industry: "",
      tags: [],
      status: "draft",
    };
  }

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await intelligenceCardsAPI.getAll({
        page,
        size: 20,
        status: filters.status || undefined,
        tier: filters.tier || undefined,
        company: filters.company || undefined,
        search: filters.search || undefined,
      });
      setCards(response.items);
      setTotalPages(response.pages);
    } catch (err) {
      setError("Failed to fetch cards");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await intelligenceCardsAPI.getStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleNewCard = () => {
    setEditingCard(null);
    setFormData(getEmptyFormData());
    setShowModal(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setFormData({
      title: card.title || "",
      title_highlight: card.title_highlight || "",
      company: card.company || "",
      company_icon: card.company_icon || "",
      company_gradient: card.company_gradient || "",
      category: card.category || "Layoffs",
      excerpt: card.excerpt || "",
      tier: card.tier || "tier_1",
      tier_label: card.tier_label || "",
      stat1: card.stat1 || { value: "", label: "", type: "" },
      stat2: card.stat2 || { value: "", label: "", type: "" },
      stat3: card.stat3 || { value: "", label: "", type: "" },
      rpi_score: card.rpi_score || "",
      jobs_affected: card.jobs_affected || "",
      ai_investment: card.ai_investment || "",
      report_id: card.report_id || "",
      analysis_url: card.analysis_url || "",
      is_featured: card.is_featured || false,
      display_order: card.display_order || 0,
      industry: card.industry || "",
      tags: card.tags || [],
      status: card.status || "draft",
    });
    setShowModal(true);
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm("Are you sure you want to delete this card?")) return;

    try {
      await intelligenceCardsAPI.delete(cardId);
      fetchCards();
      fetchStats();
    } catch (err) {
      setError("Failed to delete card");
    }
  };

  const handleToggleStatus = async (cardId) => {
    try {
      await intelligenceCardsAPI.toggleStatus(cardId);
      fetchCards();
      fetchStats();
    } catch (err) {
      setError("Failed to toggle status");
    }
  };

  const handleToggleFeatured = async (cardId) => {
    try {
      await intelligenceCardsAPI.toggleFeatured(cardId);
      fetchCards();
      fetchStats();
    } catch (err) {
      setError("Failed to toggle featured");
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (statKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [statKey]: { ...prev[statKey], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean up stat objects - only include if they have values
      const cleanedData = {
        ...formData,
        stat1: formData.stat1.value ? formData.stat1 : null,
        stat2: formData.stat2.value ? formData.stat2 : null,
        stat3: formData.stat3.value ? formData.stat3 : null,
        rpi_score: formData.rpi_score || null,
        jobs_affected: formData.jobs_affected || null,
        ai_investment: formData.ai_investment || null,
        report_id: formData.report_id || null,
        analysis_url: formData.analysis_url || null,
      };

      if (editingCard) {
        await intelligenceCardsAPI.update(editingCard.id, cleanedData);
      } else {
        await intelligenceCardsAPI.create(cleanedData);
      }

      setShowModal(false);
      fetchCards();
      fetchStats();
    } catch (err) {
      setError(editingCard ? "Failed to update card" : "Failed to create card");
    } finally {
      setSaving(false);
    }
  };

  const getTierBadgeClass = (tier) => {
    switch (tier) {
      case "tier_1":
        return "tier-critical";
      case "tier_2":
        return "tier-elevated";
      case "tier_3":
        return "tier-moderate";
      default:
        return "";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "published":
        return "status-published";
      case "draft":
        return "status-draft";
      case "archived":
        return "status-archived";
      default:
        return "";
    }
  };

  const companyOptions = [
    {
      value: "amazon",
      label: "Amazon",
      icon: "A",
      gradient: "amazon-gradient",
    },
    { value: "meta", label: "Meta", icon: "M", gradient: "meta-gradient" },
    {
      value: "google",
      label: "Google",
      icon: "G",
      gradient: "google-gradient",
    },
    {
      value: "microsoft",
      label: "Microsoft",
      icon: "M",
      gradient: "microsoft-gradient",
    },
    { value: "apple", label: "Apple", icon: "🍎", gradient: "apple-gradient" },
    { value: "tesla", label: "Tesla", icon: "T", gradient: "tesla-gradient" },
    {
      value: "nvidia",
      label: "NVIDIA",
      icon: "N",
      gradient: "nvidia-gradient",
    },
    {
      value: "jpmorgan",
      label: "JP Morgan",
      icon: "JP",
      gradient: "jpmorgan-gradient",
    },
    {
      value: "goldman",
      label: "Goldman Sachs",
      icon: "GS",
      gradient: "goldman-gradient",
    },
    { value: "ibm", label: "IBM", icon: "IBM", gradient: "ibm-gradient" },
    {
      value: "salesforce",
      label: "Salesforce",
      icon: "SF",
      gradient: "salesforce-gradient",
    },
    {
      value: "walmart",
      label: "Walmart",
      icon: "W",
      gradient: "walmart-gradient",
    },
  ];

  const handleCompanySelect = (companyValue) => {
    const company = companyOptions.find((c) => c.value === companyValue);
    if (company) {
      setFormData((prev) => ({
        ...prev,
        company: company.label,
        company_icon: company.icon,
        company_gradient: company.gradient,
      }));
    }
  };

  return (
    <div className="cards-manager">
      <div className="cards-manager-header">
        <div className="header-left">
          <h1>Intelligence Cards Manager</h1>
          <p>
            Manage and publish workforce intelligence cards for the landing and
            archive pages.
          </p>
        </div>
        <button className="btn-primary" onClick={handleNewCard}>
          <Plus size={18} />
          New Card
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total_cards}</span>
              <span className="stat-label">Total Cards</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon published">
              <Eye size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.published_cards}</span>
              <span className="stat-label">Published</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon draft">
              <Edit2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.draft_cards}</span>
              <span className="stat-label">Drafts</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon featured">
              <Star size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.featured_cards}</span>
              <span className="stat-label">Featured</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="filters-left">
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filters.tier}
              onChange={(e) => handleFilterChange("tier", e.target.value)}
            >
              <option value="">All Tiers</option>
              <option value="tier_1">Tier 1 - Critical</option>
              <option value="tier_2">Tier 2 - Elevated</option>
              <option value="tier_3">Tier 3 - Moderate</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
            >
              <option value="">All Companies</option>
              {companyOptions.map((company) => (
                <option key={company.value} value={company.value}>
                  {company.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="search-group">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search cards..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Cards Table */}
      <div className="cards-table-container">
        <table className="cards-table">
          <thead>
            <tr>
              <th>Card</th>
              <th>Company</th>
              <th>Category</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td colSpan="8">
                    <div className="skeleton-cell"></div>
                  </td>
                </tr>
              ))
            ) : cards.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No cards found. Create your first card!
                </td>
              </tr>
            ) : (
              cards.map((card) => (
                <tr key={card.id}>
                  <td className="card-title-cell">
                    <div className="card-title-wrapper">
                      <span
                        className="card-title"
                        dangerouslySetInnerHTML={{
                          __html: card.title.replace(
                            card.title_highlight,
                            `<em>${card.title_highlight}</em>`
                          ),
                        }}
                      ></span>
                      <span className="card-excerpt">{card.excerpt}</span>
                    </div>
                  </td>
                  <td>
                    <div className="company-cell">
                      <div className={`company-icon ${card.company_gradient}`}>
                        {card.company_icon}
                      </div>
                      <span>{card.company}</span>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{card.category}</span>
                  </td>
                  <td>
                    <span
                      className={`tier-badge ${getTierBadgeClass(card.tier)}`}
                    >
                      {card.tier === "tier_1"
                        ? "Critical"
                        : card.tier === "tier_2"
                        ? "Elevated"
                        : "Moderate"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        card.status
                      )}`}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`featured-btn ${
                        card.is_featured ? "active" : ""
                      }`}
                      onClick={() => handleToggleFeatured(card.id)}
                      title={
                        card.is_featured ? "Remove featured" : "Set as featured"
                      }
                    >
                      {card.is_featured ? (
                        <Star size={18} />
                      ) : (
                        <StarOff size={18} />
                      )}
                    </button>
                  </td>
                  <td className="date-cell">
                    {new Date(card.published_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditCard(card)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn toggle"
                        onClick={() => handleToggleStatus(card.id)}
                        title={
                          card.status === "published" ? "Unpublish" : "Publish"
                        }
                      >
                        {card.status === "published" ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteCard(card.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCard ? "Edit Card" : "Create New Card"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-section">
                <h3>Basic Information</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleFormChange("title", e.target.value)
                      }
                      placeholder="e.g., Goldman Sachs to Cut 4,000 Jobs"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Title Highlight</label>
                    <input
                      type="text"
                      value={formData.title_highlight}
                      onChange={(e) =>
                        handleFormChange("title_highlight", e.target.value)
                      }
                      placeholder="Word to italicize in gold"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Company *</label>
                    <select
                      value={
                        companyOptions.find((c) => c.label === formData.company)
                          ?.value || ""
                      }
                      onChange={(e) => handleCompanySelect(e.target.value)}
                      required
                    >
                      <option value="">Select Company</option>
                      {companyOptions.map((company) => (
                        <option key={company.value} value={company.value}>
                          {company.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleFormChange("category", e.target.value)
                      }
                      required
                    >
                      <option value="Layoffs">Layoffs & Restructures</option>
                      <option value="AI Investment">AI Investment</option>
                      <option value="Automation">Automation Rollout</option>
                      <option value="Hiring">Hiring Signals</option>
                      <option value="Earnings">Earnings & Outlook</option>
                      <option value="Robotics">Robotics</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Excerpt *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      handleFormChange("excerpt", e.target.value)
                    }
                    placeholder="Brief description of the analysis..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tier *</label>
                    <select
                      value={formData.tier}
                      onChange={(e) => handleFormChange("tier", e.target.value)}
                      required
                    >
                      <option value="tier_1">Tier 1 - Critical</option>
                      <option value="tier_2">Tier 2 - Elevated</option>
                      <option value="tier_3">Tier 3 - Moderate</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tier Label</label>
                    <input
                      type="text"
                      value={formData.tier_label}
                      onChange={(e) =>
                        handleFormChange("tier_label", e.target.value)
                      }
                      placeholder="e.g., Tier 1 — Critical Impact"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleFormChange("status", e.target.value)
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Display Order</label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) =>
                        handleFormChange(
                          "display_order",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3
                  className="expandable"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  Statistics & Metrics
                  {showAdvanced ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </h3>

                {showAdvanced && (
                  <>
                    <div className="form-row three-col">
                      <div className="form-group">
                        <label>RPI Score</label>
                        <input
                          type="text"
                          value={formData.rpi_score}
                          onChange={(e) =>
                            handleFormChange("rpi_score", e.target.value)
                          }
                          placeholder="e.g., 8.7"
                        />
                      </div>
                      <div className="form-group">
                        <label>Jobs Affected</label>
                        <input
                          type="text"
                          value={formData.jobs_affected}
                          onChange={(e) =>
                            handleFormChange("jobs_affected", e.target.value)
                          }
                          placeholder="e.g., 4,000"
                        />
                      </div>
                      <div className="form-group">
                        <label>AI Investment</label>
                        <input
                          type="text"
                          value={formData.ai_investment}
                          onChange={(e) =>
                            handleFormChange("ai_investment", e.target.value)
                          }
                          placeholder="e.g., $1.2B"
                        />
                      </div>
                    </div>

                    <div className="stat-inputs">
                      <h4>Stat 1</h4>
                      <div className="form-row three-col">
                        <div className="form-group">
                          <label>Value</label>
                          <input
                            type="text"
                            value={formData.stat1.value}
                            onChange={(e) =>
                              handleStatChange("stat1", "value", e.target.value)
                            }
                            placeholder="e.g., 4,000"
                          />
                        </div>
                        <div className="form-group">
                          <label>Label</label>
                          <input
                            type="text"
                            value={formData.stat1.label}
                            onChange={(e) =>
                              handleStatChange("stat1", "label", e.target.value)
                            }
                            placeholder="e.g., Jobs Cut"
                          />
                        </div>
                        <div className="form-group">
                          <label>Type</label>
                          <select
                            value={formData.stat1.type}
                            onChange={(e) =>
                              handleStatChange("stat1", "type", e.target.value)
                            }
                          >
                            <option value="">Default</option>
                            <option value="critical">Critical (Red)</option>
                            <option value="elevated">Elevated (Gold)</option>
                            <option value="moderate">Moderate (Teal)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="stat-inputs">
                      <h4>Stat 2</h4>
                      <div className="form-row three-col">
                        <div className="form-group">
                          <label>Value</label>
                          <input
                            type="text"
                            value={formData.stat2.value}
                            onChange={(e) =>
                              handleStatChange("stat2", "value", e.target.value)
                            }
                            placeholder="e.g., 8.7"
                          />
                        </div>
                        <div className="form-group">
                          <label>Label</label>
                          <input
                            type="text"
                            value={formData.stat2.label}
                            onChange={(e) =>
                              handleStatChange("stat2", "label", e.target.value)
                            }
                            placeholder="e.g., Peak RPI"
                          />
                        </div>
                        <div className="form-group">
                          <label>Type</label>
                          <select
                            value={formData.stat2.type}
                            onChange={(e) =>
                              handleStatChange("stat2", "type", e.target.value)
                            }
                          >
                            <option value="">Default</option>
                            <option value="critical">Critical (Red)</option>
                            <option value="elevated">Elevated (Gold)</option>
                            <option value="moderate">Moderate (Teal)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="stat-inputs">
                      <h4>Stat 3</h4>
                      <div className="form-row three-col">
                        <div className="form-group">
                          <label>Value</label>
                          <input
                            type="text"
                            value={formData.stat3.value}
                            onChange={(e) =>
                              handleStatChange("stat3", "value", e.target.value)
                            }
                            placeholder="e.g., $1.2B"
                          />
                        </div>
                        <div className="form-group">
                          <label>Label</label>
                          <input
                            type="text"
                            value={formData.stat3.label}
                            onChange={(e) =>
                              handleStatChange("stat3", "label", e.target.value)
                            }
                            placeholder="e.g., AI Budget"
                          />
                        </div>
                        <div className="form-group">
                          <label>Type</label>
                          <select
                            value={formData.stat3.type}
                            onChange={(e) =>
                              handleStatChange("stat3", "type", e.target.value)
                            }
                          >
                            <option value="">Default</option>
                            <option value="critical">Critical (Red)</option>
                            <option value="elevated">Elevated (Gold)</option>
                            <option value="moderate">Moderate (Teal)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="form-section">
                <h3>Links & References</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Report ID</label>
                    <input
                      type="text"
                      value={formData.report_id}
                      onChange={(e) =>
                        handleFormChange("report_id", e.target.value)
                      }
                      placeholder="Link to detailed report"
                    />
                  </div>
                  <div className="form-group">
                    <label>Analysis URL</label>
                    <input
                      type="text"
                      value={formData.analysis_url}
                      onChange={(e) =>
                        handleFormChange("analysis_url", e.target.value)
                      }
                      placeholder="Alternative URL for analysis"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) =>
                        handleFormChange("industry", e.target.value)
                      }
                      placeholder="e.g., Finance, Technology"
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) =>
                          handleFormChange("is_featured", e.target.checked)
                        }
                      />
                      Featured Card
                    </label>
                    <span className="help-text">
                      Featured cards appear in the archive banner
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingCard
                    ? "Update Card"
                    : "Create Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsManager;
