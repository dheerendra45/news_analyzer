# Report Creation Guide - Paste Full Report Feature

## Overview

The admin panel now supports **3 methods** for creating reports:

1. **Fill Manually** - Traditional form-based entry (field by field)
2. **Paste Full Report** - ⭐ NEW! Paste complete JSON to auto-fill all fields
3. **Upload HTML** - Upload a complete HTML file (for standalone reports)

## Using the "Paste Full Report" Feature

### Benefits

- ✅ **Save Time**: Copy-paste entire report content at once
- ✅ **No Manual Entry**: Avoid filling fields one by one
- ✅ **Rich Reports**: Includes all advanced fields (hero stats, metrics, timeline, etc.)
- ✅ **Consistent Format**: Ensures proper data structure
- ✅ **Easy Editing**: Edit JSON externally, paste when ready

### How to Use

1. **Navigate to Admin Dashboard** → Reports Manager
2. Click **"+ Create Report"** button
3. Select **"Paste Full Report"** tab
4. **Option A**: Click "Load Example" to see the template structure
5. **Option B**: Paste your own JSON content
6. Click **"Parse & Fill"** button
7. Review auto-populated fields
8. Make any final adjustments if needed
9. Click **"Create"** or **"Update"**

### JSON Structure

The JSON should follow this structure:

```json
{
  "title": "Report Title",
  "subtitle": "Optional subtitle",
  "author": "Author Name",
  "summary": "Brief summary",
  "content": "Full report content (supports markdown)",
  "tags": ["tag1", "tag2"],
  "reading_time": 15,
  "status": "published",
  "cover_image_url": "https://...",
  "is_rich_report": true,
  "label": "Report Label",
  "tier": "tier_1",
  "hero_context": "Why this matters...",
  "hero_stats": [...],
  "exec_summary": {...},
  "metrics": [...],
  "data_table": [...],
  "timeline": [...],
  "guidance": [...],
  "sources": [...]
}
```

### Full Example

See `report-template-example.json` in the project root for a complete, working example with:

- Basic fields (title, author, summary, content)
- Rich report fields (hero stats, metrics, timeline)
- All supported data structures
- Real-world values and formatting

### Field Types

#### Basic Fields (Always Available)

- `title` (string, required): Report title
- `subtitle` (string): Secondary title
- `author` (string): Author name
- `summary` (string, required): Brief description
- `content` (string): Full report content (markdown supported)
- `tags` (array of strings): Tags for categorization
- `reading_time` (number): Minutes to read
- `status` (string): "draft" or "published"
- `cover_image_url` (string): Cover image URL
- `pdf_url` (string): Optional PDF attachment
- `file_url` (string): Optional external file

#### Rich Report Fields (When is_rich_report: true)

- `is_rich_report` (boolean): Enable rich features
- `label` (string): Display label
- `tier` (string): "tier_1", "tier_2", or "tier_3"
- `hero_context` (string): Hero section context

#### Rich Report Arrays/Objects

- `hero_stats` (array): Animated statistics

  ```json
  [
    {
      "label": "Stat Label",
      "value": "54,694",
      "target": 54694,
      "context": "Additional context",
      "percent": 75
    }
  ]
  ```

- `exec_summary` (object): Executive summary

  ```json
  {
    "title": "Executive Summary",
    "points": ["Point 1", "Point 2"]
  }
  ```

- `metrics` (array): Key metrics

  ```json
  [
    {
      "title": "Metric Name",
      "value": "100",
      "change": "+10%",
      "trend": "up",
      "description": "Description"
    }
  ]
  ```

- `data_table` (array): Tabular data

  ```json
  [
    { "header": "Column1", "rows": ["val1", "val2"] },
    { "header": "Column2", "rows": ["val3", "val4"] }
  ]
  ```

- `timeline` (array): Timeline events

  ```json
  [
    {
      "date": "January 2026",
      "event": "Event description",
      "impact": "Impact description"
    }
  ]
  ```

- `guidance` (array): Recommendations

  ```json
  [
    {
      "icon": "👤",
      "title": "Guidance Title",
      "recommendation": "Recommendation text"
    }
  ]
  ```

- `sources` (array): References
  ```json
  [
    {
      "title": "Source Title",
      "url": "https://...",
      "date": "Date"
    }
  ]
  ```

### Tips

1. **Validate JSON First**: Use a JSON validator (like jsonlint.com) before pasting
2. **Use the Example**: Click "Load Example" to see proper formatting
3. **Escape Special Characters**: Use `\"` for quotes inside strings
4. **Markdown Support**: The `content` field supports markdown formatting
5. **Arrays as Strings**: You can also use `"tags": "AI, Workforce, Research"` (comma-separated)
6. **Edit After Paste**: All fields remain editable after parsing

### Troubleshooting

**Error: "Invalid JSON format"**

- Ensure your JSON is properly formatted
- Check for missing commas, quotes, or brackets
- Use a JSON validator tool

**Fields Not Populating**

- Verify field names match exactly (case-sensitive)
- Check that arrays and objects are properly structured
- Ensure no trailing commas in JSON

**Rich Fields Not Showing**

- Set `"is_rich_report": true` in your JSON
- Or manually enable "Rich Report Mode" after parsing

### Workflow Examples

#### Scenario 1: Quick Report from Template

1. Copy `report-template-example.json`
2. Edit values in your text editor
3. Paste into "Paste Full Report"
4. Click "Parse & Fill"
5. Publish immediately

#### Scenario 2: Programmatic Report Generation

1. Generate JSON from external tool/script
2. Copy generated JSON
3. Paste into admin panel
4. Quick review
5. Publish

#### Scenario 3: Report Duplication

1. Export existing report (copy from database/API)
2. Modify necessary fields
3. Paste as new report
4. Update title and dates
5. Create new version

## Need Help?

- Check `report-template-example.json` for reference
- Use "Load Example" button for quick template
- Contact support for custom field requirements
