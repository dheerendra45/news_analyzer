# JSON Report Upload — Admin Prompt Guide

## Quick Start Prompt (Copy & Paste to ChatGPT/Claude)

Use this prompt when generating a new Replaceable.ai report in JSON format:

---

```
You are generating a JSON report for Replaceable.ai's admin panel. The report will render with Goldman Sachs-style visuals including animated stats, progress bars, gradient timelines, 2-column guidance grids, and RPI gauge charts.

Generate a complete JSON report about: [YOUR TOPIC HERE]

STRICT FORMAT RULES:
1. All text values MUST use straight double quotes ("), never curly/smart quotes (" ")
2. Escape any quotes inside text with backslash: \"like this\"
3. No trailing commas after the last item in arrays or objects
4. All numbers must be unquoted (not "72" but 72 for numeric fields)
5. Use \n for newlines inside strings, never actual line breaks within a string value

REQUIRED TOP-LEVEL FIELDS:
{
  "title": "Your Report Title",
  "subtitle": "One-line subtitle for the hero section",
  "summary": "2-3 sentence overview (max 10,000 chars). This shows on the report card.",
  "label": "Workforce Intelligence Briefing · [Month Year]",
  "tier": "tier_1",
  "author": "Replaceable.ai Research",
  "reading_time": 12,
  "tags": ["AI", "Workforce", "Topic1", "Topic2"],
  "status": "draft",
  "hero_context": "2-4 sentences explaining why this matters to the reader personally."
}

HERO STATS (animated numbers in dark hero panel, max 4):
  "hero_stats": [
    {
      "label": "Short Label",
      "value": "54,694",
      "target": 54694,
      "context": "Brief context line",
      "percent": 75
    }
  ]
  - "value" = display string (can include commas, %, M, K)
  - "target" = integer for counter animation
  - "percent" = 0-100 for the gradient progress bar width

EXECUTIVE SUMMARY (split panel with paragraphs + stats sidebar):
  "exec_summary": {
    "paragraphs": [
      "**Bold Label**: Paragraph text here...",
      "Second paragraph..."
    ],
    "stats": [
      {"value": "1.17M", "label": "Total layoffs"}
    ]
  }

METRICS (4-column grid with hover effects):
  "metrics": [
    {
      "label": "Total US Layoffs",
      "value": "1.17M",
      "change": "▲ 54% vs 2024",
      "changeType": "negative",
      "context": "Highest since pandemic"
    }
  ]
  - changeType: "negative" (red), "positive" (green), "neutral" (gold)

DATA TABLE (companies with layoff data):
  "data_table": [
    {
      "company": "Amazon",
      "jobs": "14,000",
      "aiCited": true,
      "quote": "CEO quote or description"
    }
  ]

RPI ANALYSIS (gauge chart + task breakdown):
  "rpi_analysis": {
    "role": "Administrative Support Worker",
    "workers": "3.6M US workers",
    "salary": "$42K median salary",
    "score": 72,
    "tasks": [
      {
        "name": "Data entry & processing",
        "weight": "25%",
        "aps": 0.95,
        "hrf": 0.05,
        "level": "high"
      }
    ]
  }
  - "score" = 0-100 integer for the circular gauge
  - "aps" = 0.0 to 1.0 (Automation Probability Score)
  - "hrf" = 0.0 to 1.0 (Human Resilience Factor)
  - "level" = "high" (red bar), "moderate" (gold bar), "low" (green bar)
  NOTE: aps can also be 0-100 integers — the system auto-normalizes.

INSIGHT BLOCK (large quote callout):
  "insight_block": {
    "quote": "The actual quote text here...",
    "attribution": "Person Name, Title, Date"
  }

CONTEXT BOX (highlighted callout panel):
  "context_box": {
    "title": "Why This Is Different",
    "body": "Explanatory paragraph...",
    "items": ["Bullet point 1", "Bullet point 2"],
    "note": "Source attribution"
  }

RISK BUCKETS (3-column cards: critical/augment/resilient):
  "risk_buckets": [
    {
      "type": "critical",
      "number": "01",
      "title": "Critical Exposure",
      "criteria": "APS ≥ 0.8 · HRF ≤ 0.2",
      "items": ["Role 1 (95% risk)", "Role 2"]
    },
    {
      "type": "augment",
      "number": "02",
      "title": "Augmentation Zone",
      "criteria": "APS 0.4-0.7",
      "items": ["Role 1", "Role 2"]
    },
    {
      "type": "resilient",
      "number": "03",
      "title": "Human Anchors",
      "criteria": "HRF ≥ 0.7",
      "items": ["Role 1", "Role 2"]
    }
  ]

TIMELINE (vertical line with phases):
  "timeline": [
    {
      "date": "Now – Q2 2026",
      "event": "Phase Title",
      "impact": "Detailed description of what happens in this phase..."
    }
  ]

GUIDANCE (2-column card grid):
  "guidance": [
    {
      "title": "For Workers in Affected Roles",
      "items": [
        "Action item 1: description",
        "Action item 2: description"
      ]
    },
    {
      "title": "For Employers & HR Leaders",
      "items": [
        "Action item 1: description"
      ]
    }
  ]
  NOTE: Use EXACTLY 2 or 4 guidance sections for best 2-column layout.

SOURCES (numbered references):
  "sources": [
    {
      "title": "Source Name and Description",
      "url": "https://example.com/article",
      "date": "January 15, 2026"
    }
  ]

SECTION CUSTOMIZATION (optional):
  "context_label": "Understanding the Analysis",
  "context_title": "What's Actually *Happening*",
  "context_intro": "Custom intro paragraph...",
  "metrics_label": "Market Impact Data",
  "metrics_title": "By the *Numbers*",
  "metrics_intro": "Key data points..."
  (* wrapping makes text crimson italic in the rendered heading)

EXTRA FIELDS: You can include any additional fields. They will be stored
and available for future rendering. Example:
  "methodology_note": "...",
  "regional_breakdown": {...}

Output ONLY the JSON object with no markdown formatting or code fences.
```

---

## Common Errors & Fixes

### Error: "JSON Parse Error at line X, column Y"
**Cause**: Usually unescaped quotes inside text values.
**Fix**: Find the line number and look for `"` inside strings. Escape them as `\"`.
```
BAD:  "quote": "He said "AI is the future" to reporters"
GOOD: "quote": "He said \"AI is the future\" to reporters"
```

### Error: "JSON Parse Error... Unexpected token"
**Cause**: Smart/curly quotes from Word or GPT copy-paste.
**Fix**: The parser auto-fixes these now, but if issues persist, do Find & Replace:
- Replace `"` and `"` with `"`
- Replace `'` and `'` with `'`

### Error: "Failed to process report content — Cannot read properties of undefined"
**Cause**: A nested field is missing (e.g., `exec_summary` has `blocks` but parser expected `paragraphs`). 
**Fix**: Use the exact field names from the template above. The parser handles multiple formats but stick to the documented format for best results.

### Report uploads but sections are empty
**Cause**: Field values are in wrong format (e.g., `metrics` uses `title` instead of `label`).
**Fix**: The parser now normalizes both formats automatically:
- `title` → `label` for metrics
- `severity` → `type` for risk_buckets  
- `trend: "up"` → `changeType: "negative"` for metrics

### RPI gauge shows 0% or tasks have no bars
**Cause**: `aps` values are on 0-100 scale but system expected 0-1, or vice versa.
**Fix**: Both formats now work. `aps: 95` and `aps: 0.95` both render correctly.

### Guidance section shows single column
**Cause**: Only 1 guidance section provided.
**Fix**: Provide 2+ guidance sections for the 2-column grid layout.

### Data doesn't appear after "successful" upload
**Cause**: The report was saved but `is_rich_report` wasn't set to `true`.
**Fix**: The parser now auto-sets `is_rich_report: true` for all JSON-pasted reports.

---

## Validation Checklist Before Upload

- [ ] Valid JSON (test at jsonlint.com)
- [ ] `title` and `summary` are present and non-empty
- [ ] All strings use straight double quotes `"`
- [ ] No trailing commas
- [ ] `hero_stats` has `target` (integer) and `percent` (0-100)
- [ ] `rpi_analysis.score` is an integer 0-100
- [ ] `rpi_analysis.tasks` each have `name` and `aps`
- [ ] `guidance` has 2+ sections for 2-column layout
- [ ] `risk_buckets` has `type` field ("critical", "augment", or "resilient")
- [ ] `timeline` entries have `date`, `event`, and `impact`
- [ ] `sources` entries have `title`, `url`, and `date`

## Quick Test

Use the sample file `sample_report_v2_complete.json` in the project root to test all features. Paste it into the admin's "Paste Full Report" area and click "Parse & Fill".
