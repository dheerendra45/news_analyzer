"""
Seed script to add the Goldman Sachs report with all rich data to MongoDB.
"""
import asyncio
import sys
sys.path.insert(0, '.')

from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from app.config import settings

# Goldman Report Data - Matching the HTML file exactly
goldman_report_data = {
    "title": "The Structural Shift",
    "summary": "Goldman Sachs warns AI-driven layoffs will continue through 2026—not because of recession, but because automation is now the strategy. Our RPI analysis quantifies the risk for 23 million US workers.",
    "content": """In January 2026, Goldman Sachs released a stark assessment that sent tremors through workforce planning circles: AI-driven layoffs will persist through the year—not because companies are struggling, but because automation has become the default strategy for staying competitive.

Unlike previous waves of job cuts triggered by recession or poor quarterly earnings, this transformation is structural, not cyclical. Companies are proactively redesigning operations around automation—often before AI has delivered measurable productivity gains.

In 2025, AI was explicitly cited in nearly 55,000 US layoffs, with Amazon (14,000 jobs), Microsoft (15,000), and Salesforce (4,000) leading the charge. These aren't struggling companies—they're some of the most profitable enterprises on Earth.

The paradox: Markets no longer reward layoffs as they once did. Investors increasingly view mass cuts as a sign of weakness, not efficiency. Yet executives continue anyway, fearing competitive disadvantage if they don't automate first.""",
    "author": "Replaceable.ai Research Desk",
    "status": "published",
    "reading_time": 12,
    "published_date": datetime(2026, 1, 15),
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow(),
    "tags": ["AI", "Workforce", "Goldman Sachs", "Layoffs", "Automation"],
    
    # Rich Report Fields
    "is_rich_report": True,
    "label": "WORKFORCE INTELLIGENCE BRIEFING · JANUARY 2026",
    "subtitle": "Goldman Sachs warns AI-driven layoffs will continue through 2026—not because of recession, but because automation is now the strategy. What does this mean for your career?",
    "tier": "tier_1",
    
    "hero_context": "For the first time, major corporations are eliminating jobs not in response to economic pressure, but as a proactive strategy. Goldman Sachs identifies this as a structural transformation—companies are redesigning operations around AI before seeing productivity gains. If you work in administration, HR, or customer support, this report quantifies your exposure and offers concrete guidance.",
    
    "hero_stats": [
        {
            "label": "AI-Cited Layoffs in 2025",
            "value": "54,694",
            "target": 54694,
            "suffix": "",
            "context": "Up 75% from 2023 baseline",
            "percent": 75,
            "accent": False
        },
        {
            "label": "Companies Replacing HR/Admin with AI",
            "value": "30%",
            "target": 30,
            "suffix": "%",
            "context": "By end of 2026 (planned)",
            "percent": 30,
            "accent": True
        },
        {
            "label": "US Jobs at Elevated Automation Risk",
            "value": "23M",
            "target": 23,
            "suffix": "M",
            "context": "15% of total US workforce",
            "percent": 15,
            "accent": False
        }
    ],
    
    "exec_summary": {
        "paragraphs": [
            "Unlike previous waves of job cuts triggered by recession or poor quarterly earnings, this transformation is structural, not cyclical. Companies are proactively redesigning operations around automation—often before AI has delivered measurable productivity gains.",
            "In 2025, AI was explicitly cited in nearly 55,000 US layoffs, with Amazon (14,000 jobs), Microsoft (15,000), and Salesforce (4,000) leading the charge. These aren't struggling companies—they're some of the most profitable enterprises on Earth.",
            "The paradox: Markets no longer reward layoffs as they once did. Investors increasingly view mass cuts as a sign of weakness, not efficiency. Yet executives continue anyway, fearing competitive disadvantage if they don't automate first."
        ],
        "stats": [
            {"value": "1.17M", "label": "Total US layoffs in 2025"},
            {"value": "54,694", "label": "AI-attributed layoffs"},
            {"value": "4.7%", "label": "Share of total cuts"}
        ]
    },
    
    "metrics": [
        {
            "label": "Total US Layoffs (2025)",
            "value": "1.17M",
            "change": "▲ 54% vs 2024",
            "changeType": "negative",
            "context": "Highest since COVID-19"
        },
        {
            "label": "AI-Attributed Cuts",
            "value": "54.7K",
            "change": "▲ 75% since 2023",
            "changeType": "negative",
            "context": "Explicitly cited AI"
        },
        {
            "label": "High-Risk US Jobs",
            "value": "23M",
            "change": "SHRM Analysis",
            "changeType": "neutral",
            "context": "15% of workforce"
        },
        {
            "label": "Young Tech Unemployment",
            "value": "+3%",
            "change": "▲ since Jan 2025",
            "changeType": "negative",
            "context": "Ages 20-30 in tech"
        }
    ],
    
    "data_table": [
        {"company": "Amazon", "jobs": "14,000", "aiCited": True, "quote": "\"Need fewer people doing some of the jobs that are being done today\" — Andy Jassy"},
        {"company": "Microsoft", "jobs": "15,000", "aiCited": True, "quote": "\"From software factory to intelligence engine\" — Satya Nadella"},
        {"company": "Salesforce", "jobs": "4,000", "aiCited": True, "quote": "\"AI now handles 30-50% of our workload\" — Marc Benioff"},
        {"company": "IBM", "jobs": "~500", "aiCited": True, "quote": "Replaced HR functions with AI chatbots"},
        {"company": "Workday", "jobs": "1,750", "aiCited": True, "quote": "\"Prioritizing AI investment\" — Carl Eschenbach"}
    ],
    
    "rpi_analysis": {
        "role": "Administrative Support Worker",
        "workers": "3.6M US workers",
        "salary": "$42K median salary",
        "score": 72,
        "delta": "↑ 8 points from 2024 baseline",
        "tasks": [
            {"name": "Data entry & processing", "weight": "25%", "aps": 0.95, "hrf": 0.05, "width": 95, "level": "high"},
            {"name": "Calendar/scheduling", "weight": "20%", "aps": 0.85, "hrf": 0.15, "width": 85, "level": "high"},
            {"name": "Document preparation", "weight": "15%", "aps": 0.80, "hrf": 0.25, "width": 80, "level": "high"},
            {"name": "Basic correspondence", "weight": "15%", "aps": 0.70, "hrf": 0.40, "width": 70, "level": "moderate"},
            {"name": "Stakeholder coordination", "weight": "15%", "aps": 0.45, "hrf": 0.60, "width": 45, "level": "moderate"},
            {"name": "Problem-solving/escalation", "weight": "10%", "aps": 0.20, "hrf": 0.85, "width": 20, "level": "low"}
        ],
        "quote": {
            "text": "We suspect some firms are trying to dress up layoffs as a good news story rather than bad news, such as past over-hiring. AI becomes the scapegoat for executives looking to cover for past mistakes.",
            "source": "— Oxford Economics, January 2026 Research Briefing"
        }
    },
    
    "risk_buckets": [
        {
            "number": "01",
            "title": "Critical Exposure",
            "criteria": "APS ≥ 0.8 · HRF ≤ 0.2",
            "type": "critical",
            "items": [
                "Data entry clerks (95% risk)",
                "Basic customer service reps",
                "Recruitment screening (85%)",
                "Benefits administration (90%)",
                "Bookkeeping & basic accounting"
            ]
        },
        {
            "number": "02",
            "title": "Augmentation Zone",
            "criteria": "APS 0.4-0.7 · Human oversight required",
            "type": "augment",
            "items": [
                "Executive assistants",
                "HR business partners",
                "Technical support specialists",
                "Office managers",
                "Compliance coordinators"
            ]
        },
        {
            "number": "03",
            "title": "Human Anchors",
            "criteria": "HRF ≥ 0.7 · Durably human",
            "type": "resilient",
            "items": [
                "Employee relations specialists",
                "Change management leads",
                "Executive coaches",
                "Conflict mediators",
                "Strategic HR advisors"
            ]
        }
    ],
    
    "timeline": [
        {
            "date": "Now – Q2 2026",
            "title": "Enterprise Acceleration",
            "desc": "30% of companies plan to replace HR/admin functions with AI by year-end. Big Tech continues 'efficiency' rounds. Entry-level hiring freezes spread across sectors. Administrative job postings are already down 12% YoY."
        },
        {
            "date": "Q3 2026 – 2027",
            "title": "Mid-Market Adoption",
            "desc": "AI agent platforms mature and costs drop. SMBs deploy automation for customer support, basic HR, and administrative tasks. 7.5 million data entry and admin jobs projected at elevated risk of elimination."
        },
        {
            "date": "2027 – 2028",
            "title": "White-Collar Compression",
            "desc": "10-20% of entry-level white-collar jobs eliminated. McKinsey estimates 12-14% of workers may need to transition occupations. New roles emerge in AI oversight, prompt engineering, and human-AI collaboration."
        },
        {
            "date": "2028 – 2030",
            "title": "Equilibrium Search",
            "desc": "Goldman Sachs projects 6-7% net workforce displacement—but notes that displacement effects historically fade after ~2 years as new roles emerge. For context: 60% of US workers today are in occupations that didn't exist in 1940."
        }
    ],
    
    "guidance": [
        {
            "title": "For Administrative Workers",
            "icon": "document",
            "items": [
                "Audit your tasks: Categorize daily activities as routine/digital (high risk), judgment-based (moderate), or relationship-driven (resilient)",
                "Shift toward exceptions: Volunteer for escalation handling, stakeholder coordination, and complex problem-solving",
                "Learn your AI tools: Being the AI-proficient admin is dramatically safer than being the manual one",
                "Consider lateral moves: Employee relations, change management, and training roles have higher HRF scores"
            ]
        },
        {
            "title": "For HR Professionals",
            "icon": "person",
            "items": [
                "Recognize what's automatable: 85% of recruitment screening and 90% of benefits admin are high-exposure—pivot toward strategic HR",
                "Build new expertise: Workforce planning, AI ethics, and human-AI teaming are emerging high-value skills",
                "Become a capability architect: Position yourself as the one who designs roles around AI augmentation",
                "Master governance: AI audit, bias detection, and compliance will be critical functions"
            ]
        }
    ],
    
    "sources": [
        {"num": 1, "text": "Business Today: Goldman Sachs report on AI-led layoffs 2026", "date": "January 4, 2026", "url": "https://www.businesstoday.in/technology/news/story/automation-over-hiring-goldman-sachs-report-explains-why-2026-could-see-another-wave-of-ai-led-layoffs-509334-2026-01-04"},
        {"num": 2, "text": "CNBC: AI job cuts - Amazon, Microsoft, Salesforce cite AI", "date": "December 21, 2025", "url": "https://www.cnbc.com/2025/12/21/ai-job-cuts-amazon-microsoft-and-more-cite-ai-for-2025-layoffs.html"},
        {"num": 3, "text": "Challenger, Gray & Christmas: 54,694 AI-attributed layoffs", "date": "December 2025", "url": "#"},
        {"num": 4, "text": "SHRM: 15% of US jobs (23M) at heightened automation risk", "date": "October 3, 2025", "url": "https://www.hrdive.com/news/shrm-jobs-heightened-risk-automation/801971/"},
        {"num": 5, "text": "Goldman Sachs Research: AI and the Global Workforce", "date": "August 2025", "url": "https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce"},
        {"num": 6, "text": "Fortune/Oxford Economics: AI layoffs as corporate fiction", "date": "January 7, 2026", "url": "https://fortune.com/2026/01/07/ai-layoffs-convenient-corporate-fiction-true-false-oxford-economics-productivity/"}
    ]
}


async def seed_goldman_report():
    """Seed the Goldman report into MongoDB"""
    print("🔗 Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    
    # Delete any existing Goldman-related reports to avoid duplicates
    delete_result = await db.reports.delete_many({
        "$or": [
            {"title": {"$regex": "Structural Shift", "$options": "i"}},
            {"title": "The Structural Shift"}
        ]
    })
    print(f"🗑️ Deleted {delete_result.deleted_count} existing Goldman-related reports")
    
    # Insert fresh Goldman report with all data
    print("✨ Creating fresh Goldman report with full rich data...")
    result = await db.reports.insert_one(goldman_report_data)
    report_id = result.inserted_id
    
    print(f"✅ Goldman report seeded successfully! ID: {report_id}")
    
    # Close connection
    client.close()
    print("🔒 MongoDB connection closed")


if __name__ == "__main__":
    asyncio.run(seed_goldman_report())
