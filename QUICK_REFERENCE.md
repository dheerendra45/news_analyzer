# Quick Reference: Paste Full Report Feature

## 🚀 In 30 Seconds

1. Click **"+ Create Report"**
2. Select **"Paste Full Report"** tab
3. Click **"Load Example"** (optional)
4. Paste your JSON
5. Click **"✨ Parse & Fill"**
6. Click **"Create"**

**Done!** ⏱️ 2-3 minutes instead of 20-30 minutes

---

## 📋 Minimal JSON Template

```json
{
  "title": "Your Report Title",
  "author": "Your Name",
  "summary": "Brief summary of the report",
  "content": "Full report content here...",
  "tags": ["tag1", "tag2"],
  "status": "published"
}
```

## 📊 Rich Report Template

```json
{
  "title": "Rich Report Title",
  "author": "Author Name",
  "summary": "Summary text",
  "content": "Content text",
  "is_rich_report": true,
  "label": "Report Label",
  "tier": "tier_1",
  "hero_stats": [
    {
      "label": "Stat Label",
      "value": "1,234",
      "target": 1234,
      "context": "Context text",
      "percent": 50
    }
  ],
  "timeline": [
    {
      "date": "January 2026",
      "event": "Event description",
      "impact": "Impact description"
    }
  ]
}
```

---

## 🎯 Field Quick Reference

| Field            | Type    | Required | Example                |
| ---------------- | ------- | -------- | ---------------------- |
| `title`          | string  | ✅ Yes   | "Q1 Report"            |
| `summary`        | string  | ✅ Yes   | "Brief summary"        |
| `author`         | string  | No       | "John Doe"             |
| `content`        | string  | No       | "Full content"         |
| `tags`           | array   | No       | `["AI", "Tech"]`       |
| `status`         | string  | No       | "published" or "draft" |
| `reading_time`   | number  | No       | `15`                   |
| `is_rich_report` | boolean | No       | `true`                 |

---

## ⚡ Pro Tips

1. **Use "Load Example"** - Shows exact format
2. **Validate JSON First** - Use jsonlint.com
3. **Save Templates** - Reuse for similar reports
4. **Edit After Parse** - All fields remain editable
5. **Copy Existing** - Duplicate and modify reports

---

## ❗ Common Issues

| Error                   | Fix                              |
| ----------------------- | -------------------------------- |
| "Invalid JSON format"   | Check quotes, commas, brackets   |
| Fields not populating   | Verify field names match exactly |
| Rich fields not showing | Set `"is_rich_report": true`     |

---

## 📖 Full Documentation

- **Complete Guide**: `REPORT_PASTE_GUIDE.md`
- **Comparison**: `REPORT_METHODS_COMPARISON.md`
- **Visual Guide**: `VISUAL_GUIDE.md`
- **Full Example**: `report-template-example.json`

---

## 💡 Time Savings Calculator

| Reports/Week | Manual Time | Paste Time | **Time Saved**    |
| ------------ | ----------- | ---------- | ----------------- |
| 5 reports    | 125 min     | 15 min     | **110 min (88%)** |
| 10 reports   | 250 min     | 30 min     | **220 min (88%)** |
| 20 reports   | 500 min     | 60 min     | **440 min (88%)** |

---

## 🎨 Visual Reminder

```
BEFORE: 100+ form fields × 20-30 minutes ❌
AFTER:  1 paste × 2-3 minutes ✅

TIME SAVED: 80-90% 🚀
```

---

**Keep this card handy for quick reference!**
