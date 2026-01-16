import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  BarChart3,
  FileText,
  Clock,
  AlertTriangle,
  Target,
  BookOpen,
  Link2,
} from "lucide-react";

// ============== HERO STATS BUILDER ==============
export const HeroStatsBuilder = ({ value, onChange }) => {
  const [stats, setStats] = useState(() => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value || [];
    } catch {
      return [];
    }
  });

  const updateStats = (newStats) => {
    setStats(newStats);
    onChange(JSON.stringify(newStats, null, 2));
  };

  const addStat = () => {
    updateStats([
      ...stats,
      { label: "", value: "", target: 0, context: "", percent: 0 },
    ]);
  };

  const updateStat = (index, field, val) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: val };
    updateStats(newStats);
  };

  const removeStat = (index) => {
    updateStats(stats.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="form-label flex items-center gap-2">
          <BarChart3 size={16} className="text-crimson" />
          Hero Stats (Animated numbers in hero section)
        </label>
        <button
          type="button"
          onClick={addStat}
          className="btn btn-sm bg-crimson/10 text-crimson hover:bg-crimson/20"
        >
          <Plus size={14} /> Add Stat
        </button>
      </div>

      {stats.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          No hero stats added. Click "Add Stat" to create animated statistics.
        </p>
      ) : (
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="border border-platinum p-3 bg-white relative"
            >
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">
                    Display Value (e.g., "54,694")
                  </label>
                  <input
                    type="text"
                    value={stat.value || ""}
                    onChange={(e) => updateStat(index, "value", e.target.value)}
                    className="form-input text-sm"
                    placeholder="54,694"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">
                    Target Number (for animation)
                  </label>
                  <input
                    type="number"
                    value={stat.target || 0}
                    onChange={(e) =>
                      updateStat(index, "target", parseInt(e.target.value) || 0)
                    }
                    className="form-input text-sm"
                    placeholder="54694"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Label</label>
                  <input
                    type="text"
                    value={stat.label || ""}
                    onChange={(e) => updateStat(index, "label", e.target.value)}
                    className="form-input text-sm"
                    placeholder="AI-Cited Layoffs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Percent (0-100)</label>
                  <input
                    type="number"
                    value={stat.percent || 0}
                    onChange={(e) =>
                      updateStat(index, "percent", parseInt(e.target.value) || 0)
                    }
                    className="form-input text-sm"
                    placeholder="75"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-600">
                    Context (appears below value)
                  </label>
                  <input
                    type="text"
                    value={stat.context || ""}
                    onChange={(e) =>
                      updateStat(index, "context", e.target.value)
                    }
                    className="form-input text-sm"
                    placeholder="Up 75% from Q1 baseline"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============== EXEC SUMMARY BUILDER ==============
export const ExecSummaryBuilder = ({ value, onChange }) => {
  const [data, setData] = useState(() => {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      return parsed || { paragraphs: [], stats: [] };
    } catch {
      return { paragraphs: [], stats: [] };
    }
  });

  const updateData = (newData) => {
    setData(newData);
    onChange(JSON.stringify(newData, null, 2));
  };

  const addParagraph = () => {
    updateData({ ...data, paragraphs: [...(data.paragraphs || []), ""] });
  };

  const updateParagraph = (index, text) => {
    const newParagraphs = [...data.paragraphs];
    newParagraphs[index] = text;
    updateData({ ...data, paragraphs: newParagraphs });
  };

  const removeParagraph = (index) => {
    updateData({
      ...data,
      paragraphs: data.paragraphs.filter((_, i) => i !== index),
    });
  };

  const addStat = () => {
    updateData({
      ...data,
      stats: [...(data.stats || []), { value: "", label: "" }],
    });
  };

  const updateStat = (index, field, val) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: val };
    updateData({ ...data, stats: newStats });
  };

  const removeStat = (index) => {
    updateData({ ...data, stats: data.stats.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-crimson" />
        <span className="font-semibold">Executive Summary</span>
      </div>

      {/* Paragraphs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Key Paragraphs</label>
          <button
            type="button"
            onClick={addParagraph}
            className="btn btn-sm bg-gray-100 hover:bg-gray-200"
          >
            <Plus size={14} /> Add Paragraph
          </button>
        </div>
        {(data.paragraphs || []).map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={p}
              onChange={(e) => updateParagraph(i, e.target.value)}
              className="form-textarea text-sm flex-1"
              rows={2}
              placeholder="Enter a key point..."
            />
            <button
              type="button"
              onClick={() => removeParagraph(i)}
              className="p-2 text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Summary Stats</label>
          <button
            type="button"
            onClick={addStat}
            className="btn btn-sm bg-gray-100 hover:bg-gray-200"
          >
            <Plus size={14} /> Add Stat
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(data.stats || []).map((stat, i) => (
            <div key={i} className="flex items-center gap-2 border p-2">
              <input
                type="text"
                value={stat.value || ""}
                onChange={(e) => updateStat(i, "value", e.target.value)}
                className="form-input text-sm w-24"
                placeholder="1.17M"
              />
              <input
                type="text"
                value={stat.label || ""}
                onChange={(e) => updateStat(i, "label", e.target.value)}
                className="form-input text-sm flex-1"
                placeholder="Total layoffs"
              />
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="p-1 text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============== METRICS BUILDER ==============
export const MetricsBuilder = ({ value, onChange }) => {
  const [metrics, setMetrics] = useState(() => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value || [];
    } catch {
      return [];
    }
  });

  const updateMetrics = (newMetrics) => {
    setMetrics(newMetrics);
    onChange(JSON.stringify(newMetrics, null, 2));
  };

  const addMetric = () => {
    updateMetrics([
      ...metrics,
      { label: "", value: "", change: "", changeType: "negative", context: "" },
    ]);
  };

  const updateMetric = (index, field, val) => {
    const newMetrics = [...metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: val };
    updateMetrics(newMetrics);
  };

  const removeMetric = (index) => {
    updateMetrics(metrics.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="form-label flex items-center gap-2">
          <Target size={16} className="text-crimson" />
          Key Metrics
        </label>
        <button
          type="button"
          onClick={addMetric}
          className="btn btn-sm bg-crimson/10 text-crimson hover:bg-crimson/20"
        >
          <Plus size={14} /> Add Metric
        </button>
      </div>

      {metrics.map((metric, index) => (
        <div
          key={index}
          className="border border-platinum p-3 bg-white relative"
        >
          <button
            type="button"
            onClick={() => removeMetric(index)}
            className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-600">Label</label>
              <input
                type="text"
                value={metric.label || ""}
                onChange={(e) => updateMetric(index, "label", e.target.value)}
                className="form-input text-sm"
                placeholder="Total US Layoffs"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Value</label>
              <input
                type="text"
                value={metric.value || ""}
                onChange={(e) => updateMetric(index, "value", e.target.value)}
                className="form-input text-sm"
                placeholder="1.17M"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Change</label>
              <input
                type="text"
                value={metric.change || ""}
                onChange={(e) => updateMetric(index, "change", e.target.value)}
                className="form-input text-sm"
                placeholder="▲ 54%"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Change Type</label>
              <select
                value={metric.changeType || "negative"}
                onChange={(e) =>
                  updateMetric(index, "changeType", e.target.value)
                }
                className="form-input text-sm"
              >
                <option value="negative">Negative (Red)</option>
                <option value="positive">Positive (Green)</option>
                <option value="neutral">Neutral (Gray)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-600">Context</label>
              <input
                type="text"
                value={metric.context || ""}
                onChange={(e) => updateMetric(index, "context", e.target.value)}
                className="form-input text-sm"
                placeholder="Highest since pandemic peak"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============== DATA TABLE BUILDER ==============
export const DataTableBuilder = ({ value, onChange }) => {
  const [rows, setRows] = useState(() => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value || [];
    } catch {
      return [];
    }
  });

  const updateRows = (newRows) => {
    setRows(newRows);
    onChange(JSON.stringify(newRows, null, 2));
  };

  const addRow = () => {
    updateRows([...rows, { company: "", jobs: "", aiCited: true, quote: "" }]);
  };

  const updateRow = (index, field, val) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: val };
    updateRows(newRows);
  };

  const removeRow = (index) => {
    updateRows(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="form-label">📊 Data Table (Company Layoffs)</label>
        <button
          type="button"
          onClick={addRow}
          className="btn btn-sm bg-crimson/10 text-crimson"
        >
          <Plus size={14} /> Add Row
        </button>
      </div>

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Company</th>
                <th className="p-2 text-left">Jobs</th>
                <th className="p-2 text-center">AI Cited</th>
                <th className="p-2 text-left">Quote</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.company || ""}
                      onChange={(e) => updateRow(i, "company", e.target.value)}
                      className="form-input text-sm w-full"
                      placeholder="Amazon"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.jobs || ""}
                      onChange={(e) => updateRow(i, "jobs", e.target.value)}
                      className="form-input text-sm w-24"
                      placeholder="14,000"
                    />
                  </td>
                  <td className="p-1 text-center">
                    <input
                      type="checkbox"
                      checked={row.aiCited || false}
                      onChange={(e) =>
                        updateRow(i, "aiCited", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.quote || ""}
                      onChange={(e) => updateRow(i, "quote", e.target.value)}
                      className="form-input text-sm w-full"
                      placeholder="CEO quote..."
                    />
                  </td>
                  <td className="p-1">
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="p-1 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============== TIMELINE BUILDER ==============
export const TimelineBuilder = ({ value, onChange }) => {
  const [items, setItems] = useState(() => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value || [];
    } catch {
      return [];
    }
  });

  const updateItems = (newItems) => {
    setItems(newItems);
    onChange(JSON.stringify(newItems, null, 2));
  };

  const addItem = () => {
    updateItems([...items, { date: "", title: "", desc: "" }]);
  };

  const updateItem = (index, field, val) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    updateItems(newItems);
  };

  const removeItem = (index) => {
    updateItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="form-label flex items-center gap-2">
          <Clock size={16} className="text-crimson" />
          Timeline
        </label>
        <button
          type="button"
          onClick={addItem}
          className="btn btn-sm bg-crimson/10 text-crimson"
        >
          <Plus size={14} /> Add Phase
        </button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="flex gap-3 items-start border p-3 bg-white">
          <div className="flex-shrink-0 w-20">
            <label className="text-xs text-gray-600">Date</label>
            <input
              type="text"
              value={item.date || ""}
              onChange={(e) => updateItem(index, "date", e.target.value)}
              className="form-input text-sm"
              placeholder="Q1 2026"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-600">Title</label>
            <input
              type="text"
              value={item.title || ""}
              onChange={(e) => updateItem(index, "title", e.target.value)}
              className="form-input text-sm"
              placeholder="Phase 1: Initial Wave"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-600">Description</label>
            <input
              type="text"
              value={item.desc || ""}
              onChange={(e) => updateItem(index, "desc", e.target.value)}
              className="form-input text-sm"
              placeholder="Description of this phase"
            />
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="p-1 text-red-500 mt-5"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

// ============== RISK BUCKETS BUILDER ==============
export const RiskBucketsBuilder = ({ value, onChange }) => {
  const [buckets, setBuckets] = useState(() => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value || [];
    } catch {
      return [];
    }
  });

  const updateBuckets = (newBuckets) => {
    setBuckets(newBuckets);
    onChange(JSON.stringify(newBuckets, null, 2));
  };

  const addBucket = () => {
    updateBuckets([
      ...buckets,
      {
        type: "critical",
        number: `0${buckets.length + 1}`,
        title: "",
        criteria: "",
        items: [],
      },
    ]);
  };

  const updateBucket = (index, field, val) => {
    const newBuckets = [...buckets];
    newBuckets[index] = { ...newBuckets[index], [field]: val };
    updateBuckets(newBuckets);
  };

  const addItemToBucket = (bucketIndex) => {
    const newBuckets = [...buckets];
    newBuckets[bucketIndex].items = [
      ...(newBuckets[bucketIndex].items || []),
      { name: "", aps: "", workers: "" },
    ];
    updateBuckets(newBuckets);
  };

  const updateBucketItem = (bucketIndex, itemIndex, field, val) => {
    const newBuckets = [...buckets];
    newBuckets[bucketIndex].items[itemIndex] = {
      ...newBuckets[bucketIndex].items[itemIndex],
      [field]: val,
    };
    updateBuckets(newBuckets);
  };

  const removeBucketItem = (bucketIndex, itemIndex) => {
    const newBuckets = [...buckets];
    newBuckets[bucketIndex].items = newBuckets[bucketIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    updateBuckets(newBuckets);
  };

  const removeBucket = (index) => {
    updateBuckets(buckets.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="form-label flex items-center gap-2">
          <AlertTriangle size={16} className="text-crimson" />
          Risk Buckets
        </label>
        <button
          type="button"
          onClick={addBucket}
          className="btn btn-sm bg-crimson/10 text-crimson"
        >
          <Plus size={14} /> Add Bucket
        </button>
      </div>

      {buckets.map((bucket, bIndex) => (
        <div
          key={bIndex}
          className={`border-l-4 p-4 ${
            bucket.type === "critical"
              ? "border-red-500 bg-red-50"
              : bucket.type === "elevated"
              ? "border-amber-500 bg-amber-50"
              : "border-teal-500 bg-teal-50"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="grid grid-cols-4 gap-2 flex-1">
              <select
                value={bucket.type || "critical"}
                onChange={(e) => updateBucket(bIndex, "type", e.target.value)}
                className="form-input text-sm"
              >
                <option value="critical">Critical</option>
                <option value="elevated">Elevated</option>
                <option value="moderate">Moderate</option>
              </select>
              <input
                type="text"
                value={bucket.number || ""}
                onChange={(e) => updateBucket(bIndex, "number", e.target.value)}
                className="form-input text-sm"
                placeholder="01"
              />
              <input
                type="text"
                value={bucket.title || ""}
                onChange={(e) => updateBucket(bIndex, "title", e.target.value)}
                className="form-input text-sm col-span-2"
                placeholder="Critical Exposure"
              />
            </div>
            <button
              type="button"
              onClick={() => removeBucket(bIndex)}
              className="p-1 text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <input
            type="text"
            value={bucket.criteria || ""}
            onChange={(e) => updateBucket(bIndex, "criteria", e.target.value)}
            className="form-input text-sm w-full mb-3"
            placeholder="Criteria: APS ≥ 0.8 AND employment > 500K"
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">
                Items ({bucket.items?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => addItemToBucket(bIndex)}
                className="text-xs text-crimson hover:underline"
              >
                + Add Item
              </button>
            </div>
            {(bucket.items || []).map((item, iIndex) => (
              <div key={iIndex} className="flex gap-2 items-center bg-white p-2">
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={(e) =>
                    updateBucketItem(bIndex, iIndex, "name", e.target.value)
                  }
                  className="form-input text-xs flex-1"
                  placeholder="Job Title"
                />
                <input
                  type="text"
                  value={item.aps || ""}
                  onChange={(e) =>
                    updateBucketItem(bIndex, iIndex, "aps", e.target.value)
                  }
                  className="form-input text-xs w-16"
                  placeholder="APS"
                />
                <input
                  type="text"
                  value={item.workers || ""}
                  onChange={(e) =>
                    updateBucketItem(bIndex, iIndex, "workers", e.target.value)
                  }
                  className="form-input text-xs w-20"
                  placeholder="Workers"
                />
                <button
                  type="button"
                  onClick={() => removeBucketItem(bIndex, iIndex)}
                  className="p-1 text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ============== GUIDANCE BUILDER ==============
export const GuidanceBuilder = ({ value, onChange }) => {
  const [sections, setSections] = useState(() => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value || [];
    } catch {
      return [];
    }
  });

  const updateSections = (newSections) => {
    setSections(newSections);
    onChange(JSON.stringify(newSections, null, 2));
  };

  const addSection = () => {
    updateSections([...sections, { title: "", items: [] }]);
  };

  const updateSection = (index, field, val) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: val };
    updateSections(newSections);
  };

  const addItemToSection = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].items = [
      ...(newSections[sectionIndex].items || []),
      "",
    ];
    updateSections(newSections);
  };

  const updateSectionItem = (sectionIndex, itemIndex, val) => {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex] = val;
    updateSections(newSections);
  };

  const removeSection = (index) => {
    updateSections(sections.filter((_, i) => i !== index));
  };

  const removeSectionItem = (sectionIndex, itemIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    updateSections(newSections);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="form-label flex items-center gap-2">
          <BookOpen size={16} className="text-crimson" />
          Guidance Sections
        </label>
        <button
          type="button"
          onClick={addSection}
          className="btn btn-sm bg-crimson/10 text-crimson"
        >
          <Plus size={14} /> Add Section
        </button>
      </div>

      {sections.map((section, sIndex) => (
        <div key={sIndex} className="border p-4 bg-white">
          <div className="flex justify-between items-center mb-3">
            <input
              type="text"
              value={section.title || ""}
              onChange={(e) => updateSection(sIndex, "title", e.target.value)}
              className="form-input text-sm font-medium"
              placeholder="For Workers / For Employers..."
            />
            <button
              type="button"
              onClick={() => removeSection(sIndex)}
              className="p-1 text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {(section.items || []).map((item, iIndex) => (
              <div key={iIndex} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    updateSectionItem(sIndex, iIndex, e.target.value)
                  }
                  className="form-input text-sm flex-1"
                  placeholder="Guidance point..."
                />
                <button
                  type="button"
                  onClick={() => removeSectionItem(sIndex, iIndex)}
                  className="p-1 text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItemToSection(sIndex)}
              className="text-xs text-crimson hover:underline"
            >
              + Add Item
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============== SOURCES BUILDER ==============
export const SourcesBuilder = ({ value, onChange }) => {
  const [sources, setSources] = useState(() => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value || [];
    } catch {
      return [];
    }
  });

  const updateSources = (newSources) => {
    setSources(newSources);
    onChange(JSON.stringify(newSources, null, 2));
  };

  const addSource = () => {
    updateSources([
      ...sources,
      { num: sources.length + 1, text: "", date: "" },
    ]);
  };

  const updateSource = (index, field, val) => {
    const newSources = [...sources];
    newSources[index] = { ...newSources[index], [field]: val };
    updateSources(newSources);
  };

  const removeSource = (index) => {
    updateSources(sources.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="form-label flex items-center gap-2">
          <Link2 size={16} className="text-crimson" />
          Sources & References
        </label>
        <button
          type="button"
          onClick={addSource}
          className="btn btn-sm bg-crimson/10 text-crimson"
        >
          <Plus size={14} /> Add Source
        </button>
      </div>

      {sources.map((source, index) => (
        <div key={index} className="flex gap-2 items-center">
          <span className="text-xs font-mono bg-gray-100 px-2 py-1">
            [{source.num}]
          </span>
          <input
            type="text"
            value={source.text || ""}
            onChange={(e) => updateSource(index, "text", e.target.value)}
            className="form-input text-sm flex-1"
            placeholder="Source name / URL"
          />
          <input
            type="text"
            value={source.date || ""}
            onChange={(e) => updateSource(index, "date", e.target.value)}
            className="form-input text-sm w-32"
            placeholder="January 2026"
          />
          <button
            type="button"
            onClick={() => removeSource(index)}
            className="p-1 text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

// ============== RPI ANALYSIS BUILDER ==============
export const RpiAnalysisBuilder = ({ value, onChange }) => {
  const [data, setData] = useState(() => {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      return parsed || { role: "", workers: "", salary: "", score: 0, tasks: [] };
    } catch {
      return { role: "", workers: "", salary: "", score: 0, tasks: [] };
    }
  });

  const updateData = (field, val) => {
    const newData = { ...data, [field]: val };
    setData(newData);
    onChange(JSON.stringify(newData, null, 2));
  };

  const addTask = () => {
    const newTasks = [...(data.tasks || []), { name: "", aps: 0 }];
    updateData("tasks", newTasks);
  };

  const updateTask = (index, field, val) => {
    const newTasks = [...data.tasks];
    newTasks[index] = { ...newTasks[index], [field]: val };
    updateData("tasks", newTasks);
  };

  const removeTask = (index) => {
    updateData(
      "tasks",
      data.tasks.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4 border p-4 bg-gradient-to-r from-crimson/5 to-transparent">
      <div className="flex items-center gap-2">
        <Target size={18} className="text-crimson" />
        <span className="font-semibold">RPI Analysis (Role Profile)</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-600">Role Title</label>
          <input
            type="text"
            value={data.role || ""}
            onChange={(e) => updateData("role", e.target.value)}
            className="form-input text-sm"
            placeholder="Admin Worker"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Workers</label>
          <input
            type="text"
            value={data.workers || ""}
            onChange={(e) => updateData("workers", e.target.value)}
            className="form-input text-sm"
            placeholder="3.6M"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Avg. Salary</label>
          <input
            type="text"
            value={data.salary || ""}
            onChange={(e) => updateData("salary", e.target.value)}
            className="form-input text-sm"
            placeholder="$42,000"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">RPI Score (0-100)</label>
          <input
            type="number"
            value={data.score || 0}
            onChange={(e) =>
              updateData("score", parseInt(e.target.value) || 0)
            }
            className="form-input text-sm"
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">
            Tasks (for gauge chart)
          </label>
          <button
            type="button"
            onClick={addTask}
            className="text-xs text-crimson hover:underline"
          >
            + Add Task
          </button>
        </div>
        {(data.tasks || []).map((task, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={task.name || ""}
              onChange={(e) => updateTask(i, "name", e.target.value)}
              className="form-input text-sm flex-1"
              placeholder="Task name"
            />
            <input
              type="number"
              value={task.aps || 0}
              onChange={(e) =>
                updateTask(i, "aps", parseFloat(e.target.value) || 0)
              }
              className="form-input text-sm w-20"
              placeholder="APS"
              min="0"
              max="1"
              step="0.01"
            />
            <button
              type="button"
              onClick={() => removeTask(i)}
              className="p-1 text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  HeroStatsBuilder,
  ExecSummaryBuilder,
  MetricsBuilder,
  DataTableBuilder,
  TimelineBuilder,
  RiskBucketsBuilder,
  GuidanceBuilder,
  SourcesBuilder,
  RpiAnalysisBuilder,
};
