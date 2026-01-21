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
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Code,
  FileCode,
  Monitor,
  Send,
  Mail,
  Check,
  ExternalLink,
} from "lucide-react";
import {
  HeroStatsBuilder,
  ExecSummaryBuilder,
  MetricsBuilder,
  DataTableBuilder,
  TimelineBuilder,
  RiskBucketsBuilder,
  GuidanceBuilder,
  SourcesBuilder,
  RpiAnalysisBuilder,
} from "./RichReportBuilder";

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

  // Upload mode: 'manual', 'html', or 'paste'
  const [uploadMode, setUploadMode] = useState("manual");
  const [htmlContent, setHtmlContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [pasteContent, setPasteContent] = useState("");

  // Send to Manager state
  const [showSendModal, setShowSendModal] = useState(false);
  const [managerEmail, setManagerEmail] = useState("");
  const [sendingPreview, setSendingPreview] = useState(false);
  const [previewMessage, setPreviewMessage] = useState("");

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
    // Rich report fields (always enabled)
    is_rich_report: true,
    subtitle: "",
    label: "",
    tier: "tier_1",
    hero_context: "",
    hero_stats: "[]",
    exec_summary: "{}",
    metrics: "[]",
    data_table: "[]",
    rpi_analysis: "{}",
    risk_buckets: "[]",
    timeline: "[]",
    guidance: "[]",
    sources: "[]",
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
      // Rich report fields (always enabled)
      is_rich_report: true,
      subtitle: "",
      label: "",
      tier: "tier_1",
      hero_context: "",
      hero_stats: "[]",
      exec_summary: "{}",
      metrics: "[]",
      data_table: "[]",
      rpi_analysis: "{}",
      risk_buckets: "[]",
      timeline: "[]",
      guidance: "[]",
      sources: "[]",
    });
    setEditingReport(null);
    setUploadMode("manual");
    setHtmlContent("");
    setPasteContent("");
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Handle HTML file upload
  const handleHtmlUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
      toast.error("Please upload an HTML file");
      return;
    }

    try {
      const text = await file.text();

      // Store the raw HTML content
      setHtmlContent(text);

      // Set upload mode to html so it uses html_content on save
      setUploadMode("html");

      // Try to extract title from HTML
      const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
      const h1Match = text.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const extractedTitle = titleMatch
        ? titleMatch[1]
        : h1Match
          ? h1Match[1]
          : "";

      // Try to extract meta description for summary
      const metaDescMatch =
        text.match(
          /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
        ) ||
        text.match(
          /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i,
        );
      const extractedSummary = metaDescMatch ? metaDescMatch[1] : "";

      // Update form data with extracted info
      // Ensure title and summary are NEVER empty (required by backend)
      const finalTitle =
        extractedTitle.trim() ||
        prev.title ||
        file.name.replace(/\.(html|htm)$/i, "") ||
        "Untitled HTML Report";
      const finalSummary =
        extractedSummary.trim() ||
        prev.summary ||
        "HTML Report - Full document rendering";

      setFormData((prev) => ({
        ...prev,
        title: finalTitle,
        summary: finalSummary,
        content: "", // Clear content when using html_content
      }));

      toast.success(
        "HTML file loaded successfully! The full HTML will be rendered as-is.",
      );
    } catch (err) {
      toast.error("Failed to read HTML file");
      console.error(err);
    }
  };

  // Handle Paste Full Report Content
  const handlePasteContent = () => {
    if (!pasteContent.trim()) {
      toast.error("Please paste some content first");
      return;
    }

    try {
      // Try to parse as JSON first
      let parsed = JSON.parse(pasteContent);

      // Check if it's a nested structure with "report" wrapper
      if (parsed.report) {
        parsed = parsed.report;
      }

      // Helper to safely stringify or use value
      const safeStringify = (val, defaultVal) => {
        if (val === undefined || val === null) {
          return typeof defaultVal === "string"
            ? defaultVal
            : JSON.stringify(defaultVal, null, 2);
        }
        return typeof val === "string" ? val : JSON.stringify(val, null, 2);
      };

      // Helper to clean citation references like [web:158]
      const cleanCitations = (text) => {
        if (!text || typeof text !== "string") return text || "";
        return text.replace(/\[web:\d+\]/g, "").trim();
      };

      // Helper to convert stats_panel to hero_stats format
      const convertStatsPanel = (statsPanel) => {
        if (!statsPanel || !Array.isArray(statsPanel)) return [];
        return statsPanel.map((stat) => ({
          label: String(stat.label || ""),
          value: String(stat.value || ""),
          target: parseInt(
            String(stat.value || "0").replace(/[^0-9-]/g, "") || "0",
          ),
          context: String(stat.context || ""),
          percent: Number(stat.percent) || 0,
        }));
      };

      // Helper to convert executive_summary to exec_summary format
      const convertExecSummary = (execSummary) => {
        if (!execSummary) return {};

        // If already in correct format with paragraphs, return as is
        if (execSummary.paragraphs && Array.isArray(execSummary.paragraphs)) {
          return execSummary;
        }

        // If it has title and points (old format), convert to paragraphs
        if (execSummary.title && execSummary.points) {
          return {
            paragraphs: execSummary.points,
            stats: execSummary.stats || [],
          };
        }

        // If it has blocks array (JSON format), convert each block to a paragraph
        if (execSummary.blocks && Array.isArray(execSummary.blocks)) {
          return {
            paragraphs: execSummary.blocks.map((block) => {
              const title = block.title ? `**${block.title}**: ` : "";
              const body = cleanCitations(String(block.body || ""));
              return `${title}${body}`;
            }),
            stats: execSummary.stats || [],
          };
        }

        return {
          paragraphs: [],
          stats: [],
        };
      };

      // Helper to convert timeline - handle both formats
      const convertTimeline = (timelineData) => {
        if (!timelineData) return [];
        // If it's already an array of {date, event, impact}, return as is
        if (Array.isArray(timelineData)) {
          return timelineData.map((item) => ({
            date: String(item.date || item.phase || ""),
            event: String(item.event || item.status || ""),
            impact: cleanCitations(
              String(item.impact || item.description || ""),
            ),
          }));
        }
        // If it's an object with phases array
        if (timelineData.phases && Array.isArray(timelineData.phases)) {
          return timelineData.phases.map((phase) => ({
            date: String(phase.phase || ""),
            event: String(phase.status || ""),
            impact: cleanCitations(String(phase.description || "")),
          }));
        }
        return [];
      };

      // Helper to convert guidance - handle both formats
      const convertGuidance = (guidanceData) => {
        if (!guidanceData) return [];

        // If it's already an array of {title, items}, clean citations and return
        if (Array.isArray(guidanceData) && guidanceData[0]?.items) {
          return guidanceData.map((group) => ({
            title: cleanCitations(String(group.title || "")),
            items: (group.items || []).map((item) =>
              cleanCitations(String(item || "")),
            ),
          }));
        }

        // If it's an array of {icon, title, recommendation}, convert to grouped format
        if (Array.isArray(guidanceData) && guidanceData[0]?.recommendation) {
          // Group by title
          const grouped = {};
          guidanceData.forEach((item) => {
            const title = String(item.title || "");
            if (!grouped[title]) {
              grouped[title] = [];
            }
            grouped[title].push(
              cleanCitations(String(item.recommendation || "")),
            );
          });
          return Object.entries(grouped).map(([title, items]) => ({
            title,
            items,
          }));
        }

        // If it has audiences array (nested format from JSON)
        if (guidanceData.audiences && Array.isArray(guidanceData.audiences)) {
          return guidanceData.audiences.map((audience) => ({
            title: String(audience.audience || ""),
            items: (audience.actions || []).map((action) =>
              cleanCitations(String(action || "")),
            ),
          }));
        }

        return [];
      };

      // Helper to convert sources - handle both formats
      const convertSources = (sourcesData) => {
        if (!sourcesData) return [];
        if (!Array.isArray(sourcesData)) return [];
        return sourcesData.map((source) => ({
          title: String(source.title || ""),
          url: String(source.url || ""),
          date: String(source.date || ""),
        }));
      };

      // Determine hero_stats - convert to proper format
      let heroStats = [];
      if (parsed.hero_stats && Array.isArray(parsed.hero_stats)) {
        // Ensure each stat has all required fields and clean any citations
        heroStats = parsed.hero_stats.map((stat) => ({
          label: cleanCitations(String(stat.label || "")),
          value: String(stat.value || ""),
          target:
            typeof stat.target === "number"
              ? stat.target
              : parseInt(
                  String(stat.value || "0").replace(/[^0-9-]/g, "") || "0",
                ),
          context: cleanCitations(String(stat.context || "")),
          percent: typeof stat.percent === "number" ? stat.percent : 0,
        }));
      } else if (parsed.stats_panel && Array.isArray(parsed.stats_panel)) {
        heroStats = convertStatsPanel(parsed.stats_panel);
      }

      // Determine exec_summary - clean citations and ensure proper format
      let execSummary = {};
      if (parsed.exec_summary) {
        // Clean citations from paragraphs if they exist
        if (
          parsed.exec_summary.paragraphs &&
          Array.isArray(parsed.exec_summary.paragraphs)
        ) {
          execSummary = {
            paragraphs: parsed.exec_summary.paragraphs.map((p) =>
              cleanCitations(String(p || "")),
            ),
            stats: (parsed.exec_summary.stats || []).map((s) => ({
              value: String(s.value || ""),
              label: cleanCitations(String(s.label || "")),
            })),
          };
        } else {
          execSummary = convertExecSummary(parsed.exec_summary);
        }
      } else if (parsed.executive_summary) {
        execSummary = convertExecSummary(parsed.executive_summary);
      }

      // Determine timeline - clean citations from impact text
      let timeline = [];
      if (parsed.timeline) {
        timeline = convertTimeline(parsed.timeline).map((item) => ({
          date: cleanCitations(item.date),
          event: cleanCitations(item.event),
          impact: cleanCitations(item.impact),
        }));
      }

      // Determine guidance
      let guidance = [];
      if (parsed.guidance) {
        guidance = convertGuidance(parsed.guidance);
      }

      // Determine sources
      let sources = [];
      if (parsed.sources) {
        sources = convertSources(parsed.sources);
      }

      // Extract summary - clean it and truncate if needed
      let summaryText =
        parsed.summary ||
        parsed.hero?.why_this_matters ||
        parsed.executive_summary?.blocks?.[0]?.body ||
        "";
      summaryText = cleanCitations(summaryText);

      // Update form data with parsed content
      setFormData({
        title:
          parsed.title || parsed.meta?.title || parsed.hero?.headline || "",
        summary: summaryText,
        content: parsed.content || "",
        file_url: parsed.file_url || "",
        pdf_url: parsed.pdf_url || "",
        cover_image_url: parsed.cover_image_url || "",
        tags: Array.isArray(parsed.tags)
          ? parsed.tags.join(", ")
          : parsed.tags || "",
        status: parsed.status || "draft",
        reading_time: parsed.reading_time?.toString() || "",
        author: parsed.author || parsed.meta?.author || "",
        // Rich report fields (always enabled)
        is_rich_report: true,
        subtitle: parsed.subtitle || parsed.hero?.subtitle || "",
        label: parsed.label || parsed.meta?.date_context || "",
        tier: parsed.tier || "tier_1",
        hero_context: cleanCitations(
          parsed.hero_context || parsed.hero?.why_this_matters || "",
        ),
        hero_stats: safeStringify(heroStats, []),
        exec_summary: safeStringify(execSummary, {}),
        metrics: safeStringify(parsed.metrics || [], []),
        data_table: safeStringify(parsed.data_table || [], []),
        rpi_analysis: safeStringify(
          parsed.rpi_analysis
            ? {
                role: cleanCitations(String(parsed.rpi_analysis.role || "")),
                workers: cleanCitations(
                  String(parsed.rpi_analysis.workers || ""),
                ),
                salary: cleanCitations(
                  String(parsed.rpi_analysis.salary || ""),
                ),
                score:
                  typeof parsed.rpi_analysis.score === "number"
                    ? parsed.rpi_analysis.score
                    : parseInt(parsed.rpi_analysis.score || "0"),
                tasks: (parsed.rpi_analysis.tasks || []).map((task) => ({
                  name: cleanCitations(String(task.name || "")),
                  aps:
                    typeof task.aps === "number"
                      ? task.aps
                      : parseInt(task.aps || "0"),
                })),
              }
            : {},
          {},
        ),
        risk_buckets: safeStringify(parsed.risk_buckets || [], []),
        timeline: safeStringify(timeline, []),
        guidance: safeStringify(guidance, []),
        sources: safeStringify(sources, []),
      });

      toast.success("Report content parsed and loaded successfully!");
      setPasteContent(""); // Clear the paste area
      setUploadMode("manual"); // Switch to form mode to show parsed fields
    } catch (err) {
      toast.error(
        "Invalid JSON format. Please check your content and try again.",
      );
      console.error("Parse error:", err);
    }
  };

  const openEditModal = (item) => {
    setEditingReport(item);
    // If report has html_content, set upload mode to html and load the content
    if (item.html_content) {
      setUploadMode("html");
      setHtmlContent(item.html_content);
    } else {
      setUploadMode("form");
      setHtmlContent("");
    }
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
      // Rich report fields (always enabled)
      is_rich_report: true,
      subtitle: item.subtitle || "",
      label: item.label || "",
      tier: item.tier || "tier_1",
      hero_context: item.hero_context || "",
      hero_stats: JSON.stringify(item.hero_stats || [], null, 2),
      exec_summary: JSON.stringify(item.exec_summary || {}, null, 2),
      metrics: JSON.stringify(item.metrics || [], null, 2),
      data_table: JSON.stringify(item.data_table || [], null, 2),
      rpi_analysis: JSON.stringify(item.rpi_analysis || {}, null, 2),
      risk_buckets: JSON.stringify(item.risk_buckets || [], null, 2),
      timeline: JSON.stringify(item.timeline || [], null, 2),
      guidance: JSON.stringify(item.guidance || [], null, 2),
      sources: JSON.stringify(item.sources || [], null, 2),
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
      // Parse JSON fields safely
      const parseJSON = (str, defaultVal) => {
        try {
          return JSON.parse(str);
        } catch {
          return defaultVal;
        }
      };

      const payload = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        file_url: formData.file_url,
        pdf_url: formData.pdf_url,
        cover_image_url: formData.cover_image_url,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: formData.status,
        reading_time: formData.reading_time
          ? parseInt(formData.reading_time)
          : null,
        author: formData.author,
        // Rich report fields
        is_rich_report: formData.is_rich_report,
        subtitle: formData.subtitle,
        label: formData.label,
        tier: formData.tier,
        hero_context: formData.hero_context,
        hero_stats: parseJSON(formData.hero_stats, []),
        exec_summary: parseJSON(formData.exec_summary, {}),
        metrics: parseJSON(formData.metrics, []),
        data_table: parseJSON(formData.data_table, []),
        rpi_analysis: parseJSON(formData.rpi_analysis, {}),
        risk_buckets: parseJSON(formData.risk_buckets, []),
        timeline: parseJSON(formData.timeline, []),
        guidance: parseJSON(formData.guidance, []),
        sources: parseJSON(formData.sources, []),
        // Full HTML content for standalone HTML reports
        html_content: uploadMode === "html" && htmlContent ? htmlContent : null,
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
      // Handle validation errors properly
      const errorData = err.response?.data;
      let errorMessage = "Failed to save report";

      if (errorData) {
        if (typeof errorData.detail === "string") {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // Pydantic validation errors come as array
          errorMessage = errorData.detail
            .map((e) => `${e.loc?.join(" → ") || "Field"}: ${e.msg}`)
            .join(", ");
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }

      toast.error(errorMessage);
      console.error("Submit error:", err);
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

  // Generate full HTML document for iframe preview
  const generatePreviewHtml = () => {
    // If HTML content was uploaded, use it directly as it's a complete document
    if (uploadMode === "html" && htmlContent) {
      return htmlContent;
    }

    // Otherwise, generate a styled preview from form data
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.title || "Report Preview"}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --crimson: #c41e3a;
      --deep-crimson: #8b1629;
      --black: #0f0f0f;
      --charcoal: #2d2d2d;
      --titanium: #c4cdbe;
      --grey: #6f6f6f;
      --mist: #8b8b8b;
      --platinum: #e8e8e8;
      --bg: #f4f5f3;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Crimson Text', Georgia, serif;
      background: var(--bg);
      color: var(--black);
      line-height: 1.7;
      font-size: 18px;
    }
    
    .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
    
    .cover-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      margin-bottom: 32px;
    }
    
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: var(--black);
    }
    
    .subtitle {
      font-family: 'Crimson Text', serif;
      font-size: 1.25rem;
      color: var(--grey);
      margin-bottom: 16px;
    }
    
    .meta {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      color: var(--mist);
      margin-bottom: 32px;
      display: flex;
      gap: 16px;
    }
    
    .summary {
      background: white;
      padding: 24px;
      border-left: 4px solid var(--crimson);
      margin-bottom: 32px;
    }
    
    .summary-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--mist);
      margin-bottom: 8px;
    }
    
    .content {
      font-size: 1.125rem;
      line-height: 1.8;
    }
    
    .content p { margin-bottom: 1.5em; }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--platinum);
    }
    
    .tag {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      padding: 6px 12px;
      background: white;
      border: 1px solid var(--platinum);
      color: var(--charcoal);
    }
  </style>
</head>
<body>
  <div class="container">
    ${formData.cover_image_url ? `<img src="${formData.cover_image_url}" alt="Cover" class="cover-image" />` : ""}
    <h1>${formData.title || "Untitled Report"}</h1>
    ${formData.subtitle ? `<p class="subtitle">${formData.subtitle}</p>` : ""}
    <div class="meta">
      ${formData.author ? `<span>By ${formData.author}</span>` : ""}
      ${formData.reading_time ? `<span>· ${formData.reading_time} min read</span>` : ""}
    </div>
    ${
      formData.summary
        ? `
      <div class="summary">
        <div class="summary-label">Summary</div>
        <p>${formData.summary}</p>
      </div>
    `
        : ""
    }
    <div class="content">
      ${formData.content ? formData.content.replace(/\n/g, "<br/>") : '<p style="color: #999; text-align: center;">No content added yet</p>'}
    </div>
    ${
      formData.tags
        ? `
      <div class="tags">
        ${formData.tags
          .split(",")
          .filter((t) => t.trim())
          .map((tag) => `<span class="tag">${tag.trim()}</span>`)
          .join("")}
      </div>
    `
        : ""
    }
  </div>
</body>
</html>`;
  };

  // Handle sending preview to manager
  const handleSendToManager = async () => {
    if (!managerEmail.trim()) {
      toast.error("Please enter manager's email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingPreview(true);
    try {
      const previewData = {
        to_email: managerEmail.trim(),
        subject: `Report Preview: ${formData.title || "Untitled Report"}`,
        report_title: formData.title || "Untitled Report",
        report_summary: formData.summary || "",
        report_author: formData.author || "Admin",
        message: previewMessage || "",
        html_content: generatePreviewHtml(),
      };

      await reportsAPI.sendPreview(previewData);
      toast.success(`Preview sent to ${managerEmail}!`);
      setShowSendModal(false);
      setManagerEmail("");
      setPreviewMessage("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send preview");
      console.error(err);
    } finally {
      setSendingPreview(false);
    }
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex-1 min-w-0 mb-4">
          <h1 className="font-playfair text-2xl sm:text-3xl mb-1 sm:mb-2 text-black">
            Reports Manager
          </h1>
          <p className="font-crimson text-sm sm:text-base text-gray-600">
            Create and manage research reports
          </p>
        </div>
      </div>

      {/* Search & Create Button Section */}
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
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors font-medium whitespace-nowrap"
            >
              SEARCH
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-white rounded-md transition-colors font-semibold whitespace-nowrap"
              style={{
                background: "#c41e3a",
                boxShadow: "0 2px 4px rgba(196, 30, 58, 0.2)",
              }}
            >
              <Plus size={18} />
              CREATE REPORT
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
                          <div className="font-inter text-sm font-medium truncate max-w-xs lg:max-w-md flex items-center gap-2">
                            {item.title}
                            {item.is_rich_report && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-crimson/10 text-crimson text-[10px] font-medium">
                                <Sparkles size={10} /> Rich
                              </span>
                            )}
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="btn btn-secondary btn-sm flex items-center gap-1"
                  title="Preview Report"
                >
                  <Monitor size={16} />
                  <span className="hidden sm:inline">Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSendModal(true)}
                  className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
                  title="Send Preview to Manager"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">Send to Manager</span>
                </button>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              {/* Upload Mode Toggle */}
              {!editingReport && (
                <div className="bg-gray-50 border border-platinum p-4 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-inter font-semibold text-sm">
                      Create Method
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setUploadMode("manual")}
                      className={`flex flex-col items-center justify-center gap-2 py-3 px-2 border-2 transition-all ${
                        uploadMode === "manual"
                          ? "border-crimson bg-crimson/5 text-crimson"
                          : "border-platinum bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <Edit2 size={18} />
                      <span className="font-inter text-xs font-medium">
                        Fill Manually
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("paste")}
                      className={`flex flex-col items-center justify-center gap-2 py-3 px-2 border-2 transition-all ${
                        uploadMode === "paste"
                          ? "border-crimson bg-crimson/5 text-crimson"
                          : "border-platinum bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <Copy size={18} />
                      <span className="font-inter text-xs font-medium">
                        Paste Full Report
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("html")}
                      className={`flex flex-col items-center justify-center gap-2 py-3 px-2 border-2 transition-all ${
                        uploadMode === "html"
                          ? "border-crimson bg-crimson/5 text-crimson"
                          : "border-platinum bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <FileCode size={18} />
                      <span className="font-inter text-xs font-medium">
                        Upload HTML
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* HTML Upload Section */}
              {uploadMode === "html" && !editingReport && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <div className="flex items-center gap-3 mb-3">
                    <Code size={20} className="text-blue-600" />
                    <div>
                      <h3 className="font-inter font-semibold text-sm text-blue-900">
                        Upload HTML Report
                      </h3>
                      <p className="font-inter text-xs text-blue-700">
                        Upload an HTML file like goa.html to create a report
                        directly
                      </p>
                    </div>
                  </div>
                  <label className="block">
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                        htmlContent
                          ? "border-green-400 bg-green-50"
                          : "border-blue-300 hover:border-blue-500 hover:bg-blue-100/50"
                      }`}
                    >
                      {htmlContent ? (
                        <div className="space-y-2">
                          <FileCode
                            size={32}
                            className="mx-auto text-green-600"
                          />
                          <p className="font-inter text-sm font-medium text-green-700">
                            HTML file loaded!
                          </p>
                          <p className="font-inter text-xs text-green-600">
                            {(htmlContent.length / 1024).toFixed(1)} KB • Click
                            to replace
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload size={32} className="mx-auto text-blue-400" />
                          <p className="font-inter text-sm text-blue-600">
                            Click to upload HTML file
                          </p>
                          <p className="font-inter text-xs text-blue-500">
                            or drag and drop
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept=".html,.htm"
                        onChange={handleHtmlUpload}
                        className="hidden"
                      />
                    </div>
                  </label>

                  {/* Show Title and Summary fields when HTML is uploaded so admin can verify/edit them */}
                  {htmlContent && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          Title (Required) *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Report title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          Summary (Required) *
                        </label>
                        <textarea
                          name="summary"
                          value={formData.summary}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Brief summary"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-blue-900 mb-1">
                            Author
                          </label>
                          <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Author name"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-blue-900 mb-1">
                            Reading Time (min)
                          </label>
                          <input
                            type="number"
                            name="reading_time"
                            value={formData.reading_time}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 8"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Paste Full Report Section */}
              {uploadMode === "paste" && !editingReport && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded">
                  <div className="flex items-center gap-3 mb-3">
                    <Copy size={20} className="text-purple-600" />
                    <div className="flex-1">
                      <h3 className="font-inter font-semibold text-sm text-purple-900">
                        Paste Full Report Content
                      </h3>
                      <p className="font-inter text-xs text-purple-700">
                        Paste complete report as JSON to auto-fill all fields
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const exampleTemplate = {
                          title: "AI Workforce Impact Report Q1 2026",
                          subtitle:
                            "Comprehensive analysis of AI-driven workforce transformation",
                          author: "Research Team",
                          summary:
                            "This quarterly report examines the accelerating impact of AI on workforce dynamics...",
                          content:
                            "# Executive Overview\n\nThe first quarter of 2026 marks a significant inflection point...",
                          tags: ["AI", "Workforce", "Research"],
                          reading_time: 15,
                          status: "published",
                          is_rich_report: true,
                          label:
                            "Workforce Intelligence Briefing · January 2026",
                          tier: "tier_1",
                          hero_context:
                            "As AI capabilities accelerate, understanding workforce impact is critical...",
                          hero_stats: [
                            {
                              label: "AI-Cited Layoffs",
                              value: "54,694",
                              target: 54694,
                              context: "Up 75% from Q4 2025",
                              percent: 75,
                            },
                          ],
                          exec_summary: {
                            title: "Executive Summary",
                            points: [
                              "AI-cited workforce reductions increased 75% quarter-over-quarter",
                              "Technology sector leads with 68% of total displacement",
                            ],
                          },
                          metrics: [],
                          timeline: [],
                          guidance: [],
                          sources: [],
                        };
                        setPasteContent(
                          JSON.stringify(exampleTemplate, null, 2),
                        );
                        toast.success("Example template loaded!");
                      }}
                      className="btn btn-sm bg-purple-100 text-purple-700 hover:bg-purple-200 whitespace-nowrap"
                    >
                      <FileText size={14} />
                      Load Example
                    </button>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={pasteContent}
                      onChange={(e) => setPasteContent(e.target.value)}
                      className="w-full border-2 border-purple-300 rounded-lg p-3 font-mono text-xs resize-y min-h-[200px] focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                      placeholder={`Paste your report JSON here, for example:
{
  "title": "AI Workforce Impact Report Q1 2026",
  "subtitle": "Comprehensive analysis of AI-driven workforce changes",
  "author": "Research Team",
  "summary": "This report analyzes...",
  "content": "Full report content here...",
  "tags": ["AI", "Workforce", "Research"],
  "reading_time": 15,
  "status": "published",
  "is_rich_report": true,
  "label": "Workforce Intelligence Briefing · January 2026",
  "tier": "tier_1",
  "hero_context": "Why this matters...",
  "hero_stats": [
    {
      "label": "AI-Cited Layoffs",
      "value": "54,694",
      "target": 54694,
      "context": "Up 75% from Q1 baseline",
      "percent": 75
    }
  ],
  "metrics": [...],
  "timeline": [...],
  ...and more
}`}
                    />

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 bg-purple-100 p-2 rounded text-xs text-purple-800">
                        <p className="font-semibold mb-1">📋 Tip:</p>
                        <p>
                          Copy the entire report structure as JSON. All fields
                          will be automatically populated. Rich report fields
                          will be enabled if present.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handlePasteContent}
                        disabled={!pasteContent.trim()}
                        className="btn bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        <Sparkles size={16} />
                        Parse & Fill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Form Fields - Only show in manual or paste mode after parsing, or when editing */}
              {(uploadMode === "manual" ||
                uploadMode === "paste" ||
                editingReport) && (
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
              )}

              {/* Rich Report Fields (Always Enabled) */}
              {(uploadMode === "manual" ||
                uploadMode === "paste" ||
                editingReport) && (
                <div className="space-y-6 border border-crimson/20 p-4 bg-crimson/5">
                  <div className="flex items-center justify-between border-b border-crimson/20 pb-2">
                    <h3 className="font-playfair text-lg">
                      Rich Report Configuration
                    </h3>
                    {editingReport && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(editingReport.id);
                          toast.success("Report ID copied!");
                        }}
                        className="btn btn-sm bg-gray-100 hover:bg-gray-200 text-xs"
                      >
                        <Copy size={12} /> Copy Report ID
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Subtitle */}
                    <div className="md:col-span-2">
                      <label className="form-label">Subtitle</label>
                      <textarea
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows={2}
                        placeholder="Subtitle displayed below the title"
                      />
                    </div>

                    {/* Label */}
                    <div>
                      <label className="form-label">Label</label>
                      <input
                        type="text"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., Workforce Intelligence Briefing · January 2026"
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
                        <option value="tier_1">Tier 1 - Critical Impact</option>
                        <option value="tier_2">Tier 2 - Elevated Risk</option>
                        <option value="tier_3">Tier 3 - Moderate</option>
                      </select>
                    </div>

                    {/* Hero Context */}
                    <div className="md:col-span-2">
                      <label className="form-label">
                        Hero Context (Why this matters)
                      </label>
                      <textarea
                        name="hero_context"
                        value={formData.hero_context}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows={4}
                        placeholder="Explanation of why this report matters to the reader"
                      />
                    </div>
                  </div>

                  {/* Visual Builders for Complex Fields */}
                  <div className="space-y-6 pt-4 border-t border-crimson/20">
                    {/* Hero Stats Builder */}
                    <HeroStatsBuilder
                      value={formData.hero_stats}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, hero_stats: val }))
                      }
                    />

                    {/* Exec Summary Builder */}
                    <ExecSummaryBuilder
                      value={formData.exec_summary}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          exec_summary: val,
                        }))
                      }
                    />

                    {/* Metrics Builder */}
                    <MetricsBuilder
                      value={formData.metrics}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, metrics: val }))
                      }
                    />

                    {/* Data Table Builder */}
                    <DataTableBuilder
                      value={formData.data_table}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, data_table: val }))
                      }
                    />

                    {/* RPI Analysis Builder */}
                    <RpiAnalysisBuilder
                      value={formData.rpi_analysis}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          rpi_analysis: val,
                        }))
                      }
                    />

                    {/* Risk Buckets Builder */}
                    <RiskBucketsBuilder
                      value={formData.risk_buckets}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          risk_buckets: val,
                        }))
                      }
                    />

                    {/* Timeline Builder */}
                    <TimelineBuilder
                      value={formData.timeline}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, timeline: val }))
                      }
                    />

                    {/* Guidance Builder */}
                    <GuidanceBuilder
                      value={formData.guidance}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, guidance: val }))
                      }
                    />

                    {/* Sources Builder */}
                    <SourcesBuilder
                      value={formData.sources}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, sources: val }))
                      }
                    />
                  </div>
                </div>
              )}

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

      {/* Preview Modal - Using iframe to preserve original HTML styles */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-6xl h-[90vh] flex flex-col rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-platinum bg-gray-50">
              <div className="flex items-center gap-3">
                <Monitor size={20} className="text-crimson" />
                <h3 className="font-playfair text-xl">Report Preview</h3>
                {uploadMode === "html" && htmlContent && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-inter rounded">
                    HTML Template
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSendModal(true)}
                  className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
                  title="Send to Manager"
                >
                  <Send size={14} />
                  Send to Manager
                </button>
                <button
                  onClick={() => {
                    // Open preview in new tab
                    const blob = new Blob([generatePreviewHtml()], {
                      type: "text/html",
                    });
                    const url = URL.createObjectURL(blob);
                    window.open(url, "_blank");
                  }}
                  className="btn btn-sm btn-secondary flex items-center gap-1"
                  title="Open in New Tab"
                >
                  <ExternalLink size={14} />
                  Open in Tab
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Iframe Preview - Preserves original HTML styles */}
            <div className="flex-1 overflow-hidden bg-gray-200 p-4">
              <iframe
                srcDoc={generatePreviewHtml()}
                title="Report Preview"
                className="w-full h-full bg-white rounded shadow-lg"
                sandbox="allow-same-origin"
                style={{ border: "none" }}
              />
            </div>

            <div className="p-4 border-t border-platinum bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-500 font-inter">
                {uploadMode === "html" && htmlContent
                  ? "Previewing uploaded HTML template with original styling"
                  : "Previewing generated report layout"}
              </p>
              <button
                onClick={() => setShowPreview(false)}
                className="btn btn-primary"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send to Manager Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
          <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b border-platinum bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-white" />
                <h3 className="font-playfair text-xl text-white">
                  Send Preview to Manager
                </h3>
              </div>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-2 hover:bg-white/20 rounded transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Report Summary */}
              <div className="bg-gray-50 p-4 rounded border border-platinum">
                <p className="text-xs text-gray-500 font-inter uppercase tracking-wider mb-2">
                  Report to Send
                </p>
                <p className="font-playfair text-lg font-semibold">
                  {formData.title || "Untitled Report"}
                </p>
                {formData.author && (
                  <p className="text-sm text-gray-600 mt-1">
                    By {formData.author}
                  </p>
                )}
              </div>

              {/* Manager Email */}
              <div>
                <label className="form-label flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  Manager's Email Address *
                </label>
                <input
                  type="email"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  className="form-input"
                  placeholder="manager@company.com"
                  autoFocus
                />
              </div>

              {/* Optional Message */}
              <div>
                <label className="form-label flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" />
                  Message (Optional)
                </label>
                <textarea
                  value={previewMessage}
                  onChange={(e) => setPreviewMessage(e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Add a note for your manager... (e.g., 'Please review before publishing')"
                />
              </div>

              {/* Info */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <Check
                  size={16}
                  className="text-blue-600 mt-0.5 flex-shrink-0"
                />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">What will be sent:</p>
                  <ul className="list-disc list-inside mt-1 text-xs text-blue-700">
                    <li>Full HTML preview of the report</li>
                    <li>Report title and summary</li>
                    <li>Your custom message (if provided)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-platinum bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="btn btn-secondary"
                disabled={sendingPreview}
              >
                Cancel
              </button>
              <button
                onClick={handleSendToManager}
                disabled={sendingPreview || !managerEmail.trim()}
                className="btn bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {sendingPreview ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Preview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManager;
