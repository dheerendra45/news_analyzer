import { useState, useEffect } from "react";
import { reportsAPI } from "../../api/reports";
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
  FileText,
} from "lucide-react";

const ReportsManager = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    file_url: "",
    pdf_url: "",
    cover_image_url: "",
    tags: "",
    status: "draft",
    reading_time: "",
    author: "",
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const response = await reportsAPI.getAll(params);
      setReports(response.items);
      setTotalPages(response.pages);
    } catch (err) {
      toast.error("Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReports();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      summary: "",
      content: "",
      file_url: "",
      pdf_url: "",
      cover_image_url: "",
      tags: "",
      status: "draft",
      reading_time: "",
      author: "",
    });
    setEditingReport(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingReport(item);
    setFormData({
      title: item.title || "",
      summary: item.summary || "",
      content: item.content || "",
      file_url: item.file_url || "",
      pdf_url: item.pdf_url || "",
      cover_image_url: item.cover_image_url || "",
      tags: (item.tags || []).join(", "),
      status: item.status || "draft",
      reading_time: item.reading_time?.toString() || "",
      author: item.author || "",
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
      setFormData((prev) => ({ ...prev, cover_image_url: result.url }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await authAPI.uploadPdf(file);
      setFormData((prev) => ({ ...prev, pdf_url: result.url }));
      toast.success("PDF uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload PDF");
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
        reading_time: formData.reading_time
          ? parseInt(formData.reading_time)
          : null,
      };

      if (editingReport) {
        await reportsAPI.update(editingReport.id, payload);
        toast.success("Report updated successfully");
      } else {
        await reportsAPI.create(payload);
        toast.success("Report created successfully");
      }

      closeModal();
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save report");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await reportsAPI.delete(id);
      toast.success("Report deleted successfully");
      fetchReports();
    } catch (err) {
      toast.error("Failed to delete report");
      console.error(err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await reportsAPI.toggleStatus(id);
      toast.success("Status updated");
      fetchReports();
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl mb-1 sm:mb-2">
            Reports Manager
          </h1>
          <p className="font-crimson text-sm sm:text-base text-gray-600">
            Create and manage research reports
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Create Report
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
                placeholder="Search reports..."
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

      {/* Reports List */}
      <div className="bg-white border border-platinum">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-crimson border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="font-crimson text-xl text-gray-500">
              No reports found
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-platinum">
              {reports.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {item.cover_image_url ? (
                      <img
                        src={item.cover_image_url}
                        alt=""
                        className="w-16 h-16 object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <FileText size={20} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-inter text-sm font-medium line-clamp-2 mb-1">
                        {item.title}
                      </div>
                      <div className="font-inter text-xs text-gray-500">
                        {item.author || "No author"} ·{" "}
                        {format(new Date(item.published_date), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        item.status === "published"
                          ? "status-published"
                          : "status-draft"
                      }
                    >
                      {item.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className="p-2 hover:bg-gray-100 transition-colors"
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
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-50 text-red-500 transition-colors"
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
                    Author
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
                {reports.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-platinum hover:bg-gray-50"
                  >
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        {item.cover_image_url ? (
                          <img
                            src={item.cover_image_url}
                            alt=""
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <FileText size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-inter text-sm font-medium truncate max-w-xs lg:max-w-md">
                            {item.title}
                          </div>
                          <div className="font-inter text-xs text-gray-500 truncate">
                            {item.tags?.slice(0, 3).join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">
                      <span className="font-inter text-sm">
                        {item.author || "-"}
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
                {editingReport ? "Edit Report" : "Create Report"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                    placeholder="Report title"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Author name"
                  />
                </div>

                {/* Reading Time */}
                <div>
                  <label className="form-label">Reading Time (minutes)</label>
                  <input
                    type="number"
                    name="reading_time"
                    value={formData.reading_time}
                    onChange={handleInputChange}
                    min="1"
                    className="form-input"
                    placeholder="e.g., 15"
                  />
                </div>

                {/* Summary */}
                <div className="md:col-span-2">
                  <label className="form-label">Summary *</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    required
                    className="form-textarea"
                    rows={3}
                    placeholder="Brief summary of the report"
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <label className="form-label">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows={8}
                    placeholder="Full report content (optional)"
                  />
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

                {/* Tags */}
                <div>
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="AI, Workforce, Research"
                  />
                </div>

                {/* Cover Image */}
                <div className="md:col-span-2">
                  <label className="form-label">Cover Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="cover_image_url"
                      value={formData.cover_image_url}
                      onChange={handleInputChange}
                      className="form-input flex-1"
                      placeholder="Cover image URL"
                    />
                    <label className="btn btn-secondary cursor-pointer">
                      <Upload size={16} />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* PDF URL */}
                <div className="md:col-span-2">
                  <label className="form-label">PDF File (optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="pdf_url"
                      value={formData.pdf_url}
                      onChange={handleInputChange}
                      className="form-input flex-1"
                      placeholder="PDF URL"
                    />
                    <label className="btn btn-secondary cursor-pointer">
                      <Upload size={16} />
                      Upload PDF
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* File URL */}
                <div className="md:col-span-2">
                  <label className="form-label">
                    External File URL (optional)
                  </label>
                  <input
                    type="url"
                    name="file_url"
                    value={formData.file_url}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://..."
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
                      {editingReport ? "Update" : "Create"}
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

export default ReportsManager;
