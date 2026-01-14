import { useState, useEffect } from "react";
import { newsAPI } from "../../api/news";
import { authAPI } from "../../api/auth";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  X,
  Upload,
  Save,
} from "lucide-react";

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    summary: "",
    source: "",
    source_url: "",
    image_url: "",
    category: "General",
    tier: "tier_2",
    status: "draft",
    tags: "",
    affected_roles: "",
    companies: "",
    key_stat_value: "",
    key_stat_label: "",
    secondary_stat_value: "",
    secondary_stat_label: "",
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const response = await newsAPI.getAll(params);
      setNews(response.items);
      setTotalPages(response.pages);
    } catch (err) {
      toast.error("Failed to load news");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      summary: "",
      source: "",
      source_url: "",
      image_url: "",
      category: "General",
      tier: "tier_2",
      status: "draft",
      tags: "",
      affected_roles: "",
      companies: "",
      key_stat_value: "",
      key_stat_label: "",
      secondary_stat_value: "",
      secondary_stat_label: "",
    });
    setEditingNews(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      summary: item.summary || "",
      source: item.source || "",
      source_url: item.source_url || "",
      image_url: item.image_url || "",
      category: item.category || "General",
      tier: item.tier || "tier_2",
      status: item.status || "draft",
      tags: (item.tags || []).join(", "),
      affected_roles: (item.affected_roles || []).join(", "),
      companies: (item.companies || []).join(", "),
      key_stat_value: item.key_stat?.value || "",
      key_stat_label: item.key_stat?.label || "",
      secondary_stat_value: item.secondary_stat?.value || "",
      secondary_stat_label: item.secondary_stat?.label || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await authAPI.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: result.url }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        affected_roles: formData.affected_roles
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        companies: formData.companies
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };

      if (editingNews) {
        await newsAPI.update(editingNews.id, payload);
        toast.success("News updated successfully");
      } else {
        await newsAPI.create(payload);
        toast.success("News created successfully");
      }

      closeModal();
      fetchNews();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save news");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?"))
      return;

    try {
      await newsAPI.delete(id);
      toast.success("News deleted successfully");
      fetchNews();
    } catch (err) {
      toast.error("Failed to delete news");
      console.error(err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await newsAPI.toggleStatus(id);
      toast.success("Status updated");
      fetchNews();
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case "tier_1":
        return "Tier 1 - Major";
      case "tier_2":
        return "Tier 2 - Medium";
      case "tier_3":
        return "Tier 3 - Minor";
      default:
        return tier;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl mb-1 sm:mb-2">
            News Manager
          </h1>
          <p className="font-crimson text-sm sm:text-base text-gray-600">
            Create and manage news articles
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Create News
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-platinum p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 w-full"
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto justify-center"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {["", "published", "draft"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`font-inter text-xs px-3 sm:px-4 py-2 border transition-colors flex-1 sm:flex-none ${
                  statusFilter === status
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-platinum hover:border-black"
                }`}
              >
                {status === ""
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white border border-platinum">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-crimson border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-crimson text-xl text-gray-500">No news found</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-platinum">
              {news.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-inter text-sm font-medium truncate">
                        {item.title}
                      </div>
                      <div className="font-inter text-xs text-gray-500">
                        {item.source}
                      </div>
                    </div>
                    <span
                      className={
                        item.status === "published"
                          ? "status-published ml-2 flex-shrink-0"
                          : "status-draft ml-2 flex-shrink-0"
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          item.tier === "tier_1"
                            ? "bg-crimson"
                            : item.tier === "tier_2"
                            ? "bg-gold"
                            : "bg-teal"
                        }`}
                      ></span>
                      <span>{getTierLabel(item.tier)}</span>
                      <span>·</span>
                      <span>
                        {format(new Date(item.published_date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        title={
                          item.status === "published" ? "Unpublish" : "Publish"
                        }
                      >
                        {item.status === "published" ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b border-platinum">
                  <th className="text-left p-3 sm:p-4 font-inter text-xs uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="text-left p-3 sm:p-4 font-inter text-xs uppercase tracking-wider text-gray-500 hidden md:table-cell">
                    Tier
                  </th>
                  <th className="text-left p-3 sm:p-4 font-inter text-xs uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="text-left p-3 sm:p-4 font-inter text-xs uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-right p-3 sm:p-4 font-inter text-xs uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-platinum hover:bg-gray-50"
                  >
                    <td className="p-3 sm:p-4">
                      <div className="font-inter text-sm font-medium truncate max-w-xs lg:max-w-md">
                        {item.title}
                      </div>
                      <div className="font-inter text-xs text-gray-500">
                        {item.source}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          item.tier === "tier_1"
                            ? "bg-crimson"
                            : item.tier === "tier_2"
                            ? "bg-gold"
                            : "bg-teal"
                        }`}
                      ></span>
                      <span className="font-inter text-xs">
                        {getTierLabel(item.tier)}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <span
                        className={
                          item.status === "published"
                            ? "status-published"
                            : "status-draft"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell">
                      <span className="font-inter text-xs text-gray-500">
                        {format(new Date(item.published_date), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                          title={
                            item.status === "published"
                              ? "Unpublish"
                              : "Publish"
                          }
                        >
                          {item.status === "published" ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 sm:p-2 hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 p-4 border-t border-platinum">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50 w-full sm:w-auto justify-center"
            >
              Previous
            </button>
            <span className="flex items-center px-4 font-inter text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary disabled:opacity-50 w-full sm:w-auto justify-center"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full sm:max-w-4xl min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-platinum p-3 sm:p-4 flex items-center justify-between z-10">
              <h2 className="font-playfair text-xl sm:text-2xl">
                {editingNews ? "Edit News" : "Create News"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="News headline"
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="form-label">Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Reuters"
                  />
                </div>

                {/* Source URL */}
                <div>
                  <label className="form-label">Source URL</label>
                  <input
                    type="url"
                    name="source_url"
                    value={formData.source_url}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>

                {/* Summary */}
                <div className="md:col-span-2">
                  <label className="form-label">Summary</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows={3}
                    placeholder="Brief summary of the news"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="form-textarea"
                    rows={5}
                    placeholder="Full description"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Technology"
                  />
                </div>

                {/* Tier */}
                <div>
                  <label className="form-label">Tier</label>
                  <select
                    name="tier"
                    value={formData.tier}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="tier_1">Tier 1 - Major (Crimson)</option>
                    <option value="tier_2">Tier 2 - Medium (Gold)</option>
                    <option value="tier_3">Tier 3 - Minor (Teal)</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="form-label">Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="form-input flex-1"
                      placeholder="Image URL"
                    />
                    <label className="btn btn-secondary cursor-pointer">
                      <Upload size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Key Stat */}
                <div>
                  <label className="form-label">Key Stat Value</label>
                  <input
                    type="text"
                    name="key_stat_value"
                    value={formData.key_stat_value}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 40%"
                  />
                </div>

                <div>
                  <label className="form-label">Key Stat Label</label>
                  <input
                    type="text"
                    name="key_stat_label"
                    value={formData.key_stat_label}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Jobs Affected"
                  />
                </div>

                {/* Secondary Stat */}
                <div>
                  <label className="form-label">Secondary Stat Value</label>
                  <input
                    type="text"
                    name="secondary_stat_value"
                    value={formData.secondary_stat_value}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 2,000"
                  />
                </div>

                <div>
                  <label className="form-label">Secondary Stat Label</label>
                  <input
                    type="text"
                    name="secondary_stat_label"
                    value={formData.secondary_stat_label}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Layoffs"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="AI, Layoffs, Tech"
                  />
                </div>

                {/* Affected Roles */}
                <div>
                  <label className="form-label">
                    Affected Roles (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="affected_roles"
                    value={formData.affected_roles}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Customer Support, Sales"
                  />
                </div>

                {/* Companies */}
                <div className="md:col-span-2">
                  <label className="form-label">
                    Companies (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="companies"
                    value={formData.companies}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Meta, Google, Microsoft"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-platinum">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingNews ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
