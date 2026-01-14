"""
Seed data script for populating the intelligence cards and reports collections
with Goldman Sachs AI Layoffs report data.
"""
import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "news_analyzer")


async def seed_data():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    # Collections
    intelligence_cards = db.intelligence_cards
    reports = db.reports
    
    print("Starting seed data process...")
    
    # First, create the detailed report
    report_id = ObjectId()
    
    goldman_report = {
        "_id": report_id,
        "title": "The Structural Shift: AI-Driven Workforce Transformation",
        "slug": "goldman-sachs-ai-layoffs-2026",
        "summary": "Goldman Sachs warns AI-driven layoffs will continue through 2026—not because of recession, but because automation is now the strategy. Our RPI analysis quantifies the risk for 23 million US workers.",
        "content": """
## What's Actually Happening

In January 2026, Goldman Sachs released a stark assessment that sent tremors through workforce planning circles: AI-driven layoffs will persist through the year—not because companies are struggling, but because automation has become the default strategy for staying competitive.

### Executive Summary

Unlike previous waves of job cuts triggered by recession or poor quarterly earnings, this transformation is **structural, not cyclical**. Companies are proactively redesigning operations around automation—often before AI has delivered measurable productivity gains.

In 2025, AI was explicitly cited in nearly 55,000 US layoffs, with Amazon (14,000 jobs), Microsoft (15,000), and Salesforce (4,000) leading the charge. These aren't struggling companies—they're some of the most profitable enterprises on Earth.

**The paradox:** Markets no longer reward layoffs as they once did. Investors increasingly view mass cuts as a sign of weakness, not efficiency. Yet executives continue anyway, fearing competitive disadvantage if they don't automate first.

### Key Statistics

- **1.17M** - Total US layoffs in 2025
- **54,694** - AI-attributed layoffs
- **4.7%** - Share of total cuts
- **23M** - US jobs at elevated automation risk
- **15%** - Percentage of total US workforce at risk

## The RPI Analysis

This briefing applies Replaceable.ai's proprietary **Replaceability Potential Index (RPI™)** methodology. Unlike simple "will AI take my job" predictions, RPI breaks down each role into constituent tasks, scoring each on Automation Probability (APS) and Human Resilience Factors (HRF).

### High-Risk Roles

**Administrative Support Worker** - RPI 8.7
- High exposure to automation
- Document processing, scheduling, data entry most vulnerable
- Strategic advisory work remains human-centric

**Customer Service Representative** - RPI 8.2
- AI chatbots handling 80% of routine queries
- Complex escalations still require human judgment
- Emotional intelligence becomes key differentiator

**HR Coordinator** - RPI 7.8
- Recruiting automation accelerating
- Employee relations still human-dependent
- Compliance work increasingly automated

### Companies Leading AI-Driven Restructuring

| Company | Jobs Cut | AI Investment | Timeline |
|---------|----------|---------------|----------|
| Amazon | 14,000 | $4B | Q1-Q2 2025 |
| Microsoft | 15,000 | $10B | FY2025 |
| Google | 12,000 | $30B | 2024-2025 |
| Salesforce | 4,000 | $2B | Q1 2025 |

## Strategic Guidance

### For Individual Contributors

1. **Audit your task portfolio** - Which of your daily activities could be automated?
2. **Invest in AI fluency** - Learn to work alongside AI tools
3. **Develop irreplaceable skills** - Judgment, creativity, emotional intelligence
4. **Build strategic visibility** - Make your unique value visible to leadership

### For Managers

1. **Map team automation exposure** - Use RPI to assess team risk
2. **Create upskilling roadmaps** - Transition employees to higher-value work
3. **Document human-value activities** - Justify headcount with strategic contributions
4. **Engage in workforce planning** - Partner with HR on transition strategies

### For Executives

1. **Balance automation with retention** - Don't automate away institutional knowledge
2. **Consider reputational risk** - Markets now penalize aggressive cuts
3. **Invest in transition programs** - Severance + upskilling shows good faith
4. **Plan for the long term** - Automation is a journey, not an event

## Timeline of Events

### Q1 2025
- Goldman Sachs releases initial AI workforce impact report
- Amazon announces 14,000 role eliminations
- RPI framework gains mainstream adoption

### Q2 2025
- Microsoft expands AI-driven restructuring
- First "automation severance" packages appear
- Congressional hearings on AI employment begin

### Q3-Q4 2025
- Google accelerates AI integration across operations
- Industry-wide HR automation reaches 38%
- Retraining programs show mixed results

### 2026 Outlook
- 60-70% of Fortune 500 expected to have AI-first workforce strategies
- Continued pressure on middle-management roles
- Rise of "human premium" positions

## Sources

1. Goldman Sachs Global Investment Research, "The Automation Imperative," January 2026
2. Bureau of Labor Statistics, Quarterly Layoff Reports, 2025
3. Challenger, Gray & Christmas, Annual Layoff Report, January 2026
4. Replaceable.ai RPI Methodology Documentation, v2.3
5. MIT Technology Review, "The AI Employment Paradox," December 2025

---

*This analysis was produced by Replaceable.ai's Research Division. For personalized career risk assessment, use our RPI Calculator.*
        """,
        "author": "Replaceable.ai Research",
        "status": "published",
        "file_url": None,
        "pdf_url": None,
        "cover_image_url": None,
        "published_date": datetime(2026, 1, 15),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "created_by": None,
        "tags": ["Goldman Sachs", "AI", "Layoffs", "Workforce", "Automation", "RPI"],
        "reading_time": 12,
    }
    
    # Check if report exists - delete and recreate
    await reports.delete_many({"slug": goldman_report["slug"]})
    await reports.insert_one(goldman_report)
    print(f"Created report: {goldman_report['title']}")
    report_id = goldman_report["_id"]
    
    # Now create intelligence cards for the landing and archive pages
    sample_cards = [
        {
            "title": "Goldman Sachs Warns AI Layoffs Will Continue Through 2026",
            "title_highlight": "Continue Through 2026",
            "company": "Goldman Sachs",
            "company_icon": "GS",
            "company_gradient": "goldman-gradient",
            "category": "AI Investment",
            "excerpt": "Unlike previous waves of job cuts, this transformation is structural, not cyclical. Companies are proactively redesigning operations around automation.",
            "tier": "tier_1",
            "tier_label": "Tier 1 — Critical Impact",
            "stat1": {"value": "54,694", "label": "AI-Cited Layoffs", "type": ""},
            "stat2": {"value": "8.7", "label": "Peak RPI", "type": "critical"},
            "stat3": {"value": "23M", "label": "Jobs at Risk", "type": ""},
            "rpi_score": "8.7",
            "jobs_affected": "54,694",
            "ai_investment": "$30B+",
            "report_id": str(report_id),
            "analysis_url": f"/report/{str(report_id)}",
            "is_featured": True,
            "display_order": 1,
            "industry": "Finance",
            "tags": ["goldman", "ai", "layoffs", "workforce"],
            "status": "published",
            "published_date": datetime(2026, 1, 15),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Amazon Cuts 14,000 Roles Amid AI Transformation",
            "title_highlight": "AI Transformation",
            "company": "Amazon",
            "company_icon": "A",
            "company_gradient": "amazon-gradient",
            "category": "Layoffs",
            "excerpt": "Amazon accelerates workforce restructuring as AI-powered automation reshapes fulfillment and customer service operations.",
            "tier": "tier_1",
            "tier_label": "Tier 1 — Critical Impact",
            "stat1": {"value": "14,000", "label": "Jobs Cut", "type": ""},
            "stat2": {"value": "8.4", "label": "Peak RPI", "type": "critical"},
            "stat3": {"value": "$4B", "label": "AI Budget", "type": ""},
            "rpi_score": "8.4",
            "jobs_affected": "14,000",
            "ai_investment": "$4B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 2,
            "industry": "Technology",
            "tags": ["amazon", "layoffs", "automation", "fulfillment"],
            "status": "published",
            "published_date": datetime(2025, 11, 20),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Microsoft Announces 15,000 Job Cuts as AI Strategy Expands",
            "title_highlight": "AI Strategy Expands",
            "company": "Microsoft",
            "company_icon": "M",
            "company_gradient": "microsoft-gradient",
            "category": "Layoffs",
            "excerpt": "Microsoft expands Copilot integration across all products while reducing workforce in traditional support roles.",
            "tier": "tier_1",
            "tier_label": "Tier 1 — Critical Impact",
            "stat1": {"value": "15,000", "label": "Jobs Cut", "type": ""},
            "stat2": {"value": "8.1", "label": "Peak RPI", "type": "critical"},
            "stat3": {"value": "$10B", "label": "OpenAI Investment", "type": ""},
            "rpi_score": "8.1",
            "jobs_affected": "15,000",
            "ai_investment": "$10B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 3,
            "industry": "Technology",
            "tags": ["microsoft", "copilot", "layoffs", "ai"],
            "status": "published",
            "published_date": datetime(2025, 10, 5),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Meta's AI Agents Replace 4,000 Customer Support Roles",
            "title_highlight": "AI Agents",
            "company": "Meta",
            "company_icon": "M",
            "company_gradient": "meta-gradient",
            "category": "Automation",
            "excerpt": "Meta deploys AI agents to handle 80% of advertiser and creator support queries, eliminating thousands of positions.",
            "tier": "tier_2",
            "tier_label": "Tier 2 — Elevated Impact",
            "stat1": {"value": "4,000", "label": "Roles Replaced", "type": ""},
            "stat2": {"value": "7.6", "label": "Peak RPI", "type": "elevated"},
            "stat3": {"value": "80%", "label": "Query Automation", "type": ""},
            "rpi_score": "7.6",
            "jobs_affected": "4,000",
            "ai_investment": "$2B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 4,
            "industry": "Technology",
            "tags": ["meta", "facebook", "ai agents", "customer support"],
            "status": "published",
            "published_date": datetime(2025, 9, 18),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Google Restructures 12,000 Positions Around Gemini AI",
            "title_highlight": "Gemini AI",
            "company": "Google",
            "company_icon": "G",
            "company_gradient": "google-gradient",
            "category": "Layoffs",
            "excerpt": "Alphabet consolidates AI efforts under Gemini brand while eliminating duplicate roles across search, cloud, and ads divisions.",
            "tier": "tier_1",
            "tier_label": "Tier 1 — Critical Impact",
            "stat1": {"value": "12,000", "label": "Jobs Cut", "type": ""},
            "stat2": {"value": "8.0", "label": "Peak RPI", "type": "critical"},
            "stat3": {"value": "$30B", "label": "AI Investment", "type": ""},
            "rpi_score": "8.0",
            "jobs_affected": "12,000",
            "ai_investment": "$30B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 5,
            "industry": "Technology",
            "tags": ["google", "alphabet", "gemini", "layoffs"],
            "status": "published",
            "published_date": datetime(2025, 8, 22),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Salesforce Eliminates 4,000 Roles as Einstein AI Scales",
            "title_highlight": "Einstein AI",
            "company": "Salesforce",
            "company_icon": "SF",
            "company_gradient": "salesforce-gradient",
            "category": "Layoffs",
            "excerpt": "Salesforce accelerates AI-first strategy with Einstein Copilot while reducing headcount in sales and support functions.",
            "tier": "tier_2",
            "tier_label": "Tier 2 — Elevated Impact",
            "stat1": {"value": "4,000", "label": "Jobs Cut", "type": ""},
            "stat2": {"value": "7.4", "label": "Peak RPI", "type": "elevated"},
            "stat3": {"value": "$2B", "label": "AI Budget", "type": ""},
            "rpi_score": "7.4",
            "jobs_affected": "4,000",
            "ai_investment": "$2B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 6,
            "industry": "Technology",
            "tags": ["salesforce", "einstein", "layoffs", "crm"],
            "status": "published",
            "published_date": datetime(2025, 7, 14),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Tesla Accelerates Robotics Push, Reduces Factory Workforce",
            "title_highlight": "Robotics Push",
            "company": "Tesla",
            "company_icon": "T",
            "company_gradient": "tesla-gradient",
            "category": "Robotics",
            "excerpt": "Optimus humanoid robots deployed in Austin factory as Tesla aims for 50% automation of repetitive manufacturing tasks.",
            "tier": "tier_2",
            "tier_label": "Tier 2 — Elevated Impact",
            "stat1": {"value": "3,500", "label": "Jobs Affected", "type": ""},
            "stat2": {"value": "7.2", "label": "Peak RPI", "type": "elevated"},
            "stat3": {"value": "50%", "label": "Automation Target", "type": ""},
            "rpi_score": "7.2",
            "jobs_affected": "3,500",
            "ai_investment": "$1.5B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 7,
            "industry": "Automotive",
            "tags": ["tesla", "optimus", "robotics", "manufacturing"],
            "status": "published",
            "published_date": datetime(2025, 6, 8),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "NVIDIA Reports Record Revenue as AI Infrastructure Demand Soars",
            "title_highlight": "Record Revenue",
            "company": "NVIDIA",
            "company_icon": "N",
            "company_gradient": "nvidia-gradient",
            "category": "Earnings",
            "excerpt": "NVIDIA posts $35B quarterly revenue as data center demand for H100 GPUs drives unprecedented growth.",
            "tier": "tier_3",
            "tier_label": "Tier 3 — Moderate Impact",
            "stat1": {"value": "$35B", "label": "Q4 Revenue", "type": ""},
            "stat2": {"value": "4.2", "label": "Peak RPI", "type": "moderate"},
            "stat3": {"value": "+125%", "label": "YoY Growth", "type": ""},
            "rpi_score": "4.2",
            "jobs_affected": None,
            "ai_investment": "$25B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 8,
            "industry": "Semiconductors",
            "tags": ["nvidia", "ai chips", "earnings", "data center"],
            "status": "published",
            "published_date": datetime(2025, 5, 20),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "IBM Expands watsonx Rollout, Phases Out Legacy Support Teams",
            "title_highlight": "watsonx Rollout",
            "company": "IBM",
            "company_icon": "IBM",
            "company_gradient": "ibm-gradient",
            "category": "Automation",
            "excerpt": "IBM's watsonx platform automates enterprise consulting workflows, impacting thousands of technical support roles.",
            "tier": "tier_2",
            "tier_label": "Tier 2 — Elevated Impact",
            "stat1": {"value": "8,000", "label": "Roles Impacted", "type": ""},
            "stat2": {"value": "7.0", "label": "Peak RPI", "type": "elevated"},
            "stat3": {"value": "$3B", "label": "watsonx Investment", "type": ""},
            "rpi_score": "7.0",
            "jobs_affected": "8,000",
            "ai_investment": "$3B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 9,
            "industry": "Technology",
            "tags": ["ibm", "watsonx", "consulting", "enterprise"],
            "status": "published",
            "published_date": datetime(2025, 4, 12),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "JP Morgan Deploys AI Trading Algorithms, Reduces Analyst Teams",
            "title_highlight": "AI Trading Algorithms",
            "company": "JP Morgan",
            "company_icon": "JP",
            "company_gradient": "jpmorgan-gradient",
            "category": "AI Investment",
            "excerpt": "JP Morgan's AI research platform generates 80% of routine market analysis, reducing dependency on junior analysts.",
            "tier": "tier_2",
            "tier_label": "Tier 2 — Elevated Impact",
            "stat1": {"value": "2,500", "label": "Roles Affected", "type": ""},
            "stat2": {"value": "7.5", "label": "Peak RPI", "type": "elevated"},
            "stat3": {"value": "80%", "label": "Automation Rate", "type": ""},
            "rpi_score": "7.5",
            "jobs_affected": "2,500",
            "ai_investment": "$2B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 10,
            "industry": "Finance",
            "tags": ["jpmorgan", "trading", "ai", "finance"],
            "status": "published",
            "published_date": datetime(2025, 3, 28),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Walmart Tests AI Store Management, 10,000 Roles Under Review",
            "title_highlight": "AI Store Management",
            "company": "Walmart",
            "company_icon": "W",
            "company_gradient": "walmart-gradient",
            "category": "Automation",
            "excerpt": "Walmart pilots AI-driven inventory and staffing optimization across 500 stores, putting mid-level management roles at risk.",
            "tier": "tier_2",
            "tier_label": "Tier 2 — Elevated Impact",
            "stat1": {"value": "10,000", "label": "Roles Under Review", "type": ""},
            "stat2": {"value": "6.8", "label": "Peak RPI", "type": "elevated"},
            "stat3": {"value": "500", "label": "Pilot Stores", "type": ""},
            "rpi_score": "6.8",
            "jobs_affected": "10,000",
            "ai_investment": "$1.5B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 11,
            "industry": "Retail",
            "tags": ["walmart", "retail", "automation", "management"],
            "status": "published",
            "published_date": datetime(2025, 2, 15),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Apple Expands Siri AI Capabilities, Support Staff Restructuring",
            "title_highlight": "Siri AI Capabilities",
            "company": "Apple",
            "company_icon": "🍎",
            "company_gradient": "apple-gradient",
            "category": "AI Investment",
            "excerpt": "Apple's enhanced Siri handles more complex support queries, reducing need for first-tier AppleCare representatives.",
            "tier": "tier_3",
            "tier_label": "Tier 3 — Moderate Impact",
            "stat1": {"value": "2,000", "label": "Roles Affected", "type": ""},
            "stat2": {"value": "5.8", "label": "Peak RPI", "type": "moderate"},
            "stat3": {"value": "$5B", "label": "AI R&D Budget", "type": ""},
            "rpi_score": "5.8",
            "jobs_affected": "2,000",
            "ai_investment": "$5B",
            "report_id": None,
            "analysis_url": None,
            "is_featured": False,
            "display_order": 12,
            "industry": "Technology",
            "tags": ["apple", "siri", "support", "ai"],
            "status": "published",
            "published_date": datetime(2025, 1, 22),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
    ]
    
    # Clear existing cards and insert new ones
    await intelligence_cards.delete_many({})
    print("Cleared existing intelligence cards")
    
    result = await intelligence_cards.insert_many(sample_cards)
    print(f"Inserted {len(result.inserted_ids)} intelligence cards")
    
    # Update the Goldman report card with the correct report_id reference
    await intelligence_cards.update_one(
        {"company": "Goldman Sachs"},
        {"$set": {"report_id": str(report_id), "analysis_url": f"/report/{str(report_id)}"}}
    )
    print("Updated Goldman card with report reference")
    
    print("\n✅ Seed data complete!")
    print(f"   - 1 detailed report created")
    print(f"   - {len(sample_cards)} intelligence cards created")
    print(f"\nYou can now:")
    print(f"   - View the landing page at /")
    print(f"   - View the archive at /archive")
    print(f"   - View the Goldman report at /report/{str(report_id)}")
    print(f"   - Manage cards at /admin/cards")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_data())
