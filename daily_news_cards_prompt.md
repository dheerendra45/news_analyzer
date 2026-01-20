# Replaceable.ai — Daily News Cards Pipeline

Run this prompt daily to get fresh AI workforce news formatted for your news cards system.

---

## THE PROMPT

```
You are a workforce intelligence analyst for Replaceable.ai. Find AI-related news from the past 48 hours with direct workforce/employment implications and format as news cards.

TODAY'S DATE: [INSERT CURRENT DATE]

SEARCH FOR:
- "AI layoffs [current month] 2026"
- "artificial intelligence job cuts"
- "AI workforce automation news"
- "companies replacing workers AI"
- "AI hiring freeze [current month]"
- "[Major company] AI restructuring"

TIER CLASSIFICATION:
- **Tier 1**: Major layoff >1000, Fortune 500 AI strategy, research with stats
- **Tier 2**: Industry trends with data, mid-size company news, expert analysis
- **Tier 3**: Commentary, predictions, minor news

OUTPUT AS JSON ARRAY (max 5 stories):

[
  {
    "headline": "Meta Announces AI Agents for 40% of Support",
    "source": "Reuters",
    "url": "https://reuters.com/...",
    "tier": 1,
    "summary": "Meta reveals AI agent deployment across customer support, potentially affecting 2,000 contractor positions by Q3 2026.",
    "category": "Big Tech",
    "key_stat": {"value": "40%", "label": "Support automated"},
    "secondary_stat": {"value": "2,000", "label": "Contractors affected"},
    "affected_roles": ["Customer Support", "Content Moderators"],
    "companies": ["Meta"],
    "tags": ["Big Tech", "Customer Service", "AI Agents"]
  }
]
```

**Paste this JSON directly into the News Manager admin panel.**

---

## Quick Reference

### Expected Fields:

- `headline` — Story title (required)
- `source` — Publication name
- `url` — Full article URL
- `tier` — 1, 2, or 3
- `summary` — 2-3 sentences
- `category` — "Big Tech", "Research", "Workforce", etc.
- `key_stat` — `{value, label}` object
- `secondary_stat` — `{value, label}` object
- `affected_roles` — Array of job titles
- `companies` — Array of company names
- `tags` — Array of themes

### Usage:

1. Run prompt daily in Claude
2. Copy JSON output
3. Open News Manager in admin panel
4. Click "Paste JSON"
5. Paste and click "Parse & Load"
6. Review and publish
