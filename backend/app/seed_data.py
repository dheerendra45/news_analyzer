"""
Seed script to populate the database with initial news and reports data
Run: python -m app.seed_data
"""
import asyncio
from datetime import datetime, timedelta
from app.database import connect_to_mongo, close_mongo_connection, get_news_collection, get_reports_collection
from app.models.news import NewsModel, NewsStatus, NewsTier
from app.models.report import ReportModel, ReportStatus


# Sample News Data (from original design)
SAMPLE_NEWS = [
    {
        "title": "Meta Announces AI Agents Will Handle 40% of Customer Support by Q3",
        "description": "Meta reveals plans to deploy AI agents across its customer support operations, potentially affecting 2,000 contractor positions. The move follows similar announcements from Google and Microsoft. The tech giant is accelerating its AI-first strategy as part of a broader industry shift toward automated customer service solutions.",
        "summary": "Meta reveals plans to deploy AI agents across its customer support operations, potentially affecting 2,000 contractor positions. The move follows similar announcements from Google and Microsoft.",
        "source": "Reuters",
        "source_url": "https://reuters.com/technology",
        "category": "Technology",
        "tier": NewsTier.TIER_1,
        "tags": ["Big Tech", "Customer Service", "AI Agents"],
        "affected_roles": ["Customer Support", "Content Moderators"],
        "companies": ["Meta"],
        "key_stat_value": "40%",
        "key_stat_label": "Support automated",
        "secondary_stat_value": "2,000",
        "secondary_stat_label": "Contractors affected",
        "status": NewsStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=1),
    },
    {
        "title": "McKinsey: 30% of White-Collar Tasks Fully Automatable by 2027",
        "description": "New McKinsey Global Institute research finds that generative AI has accelerated automation timelines by 5-7 years for knowledge work. Report identifies legal, finance, and HR as highest-exposure sectors. The research suggests a fundamental restructuring of white-collar employment is underway.",
        "summary": "New McKinsey Global Institute research finds that generative AI has accelerated automation timelines by 5-7 years for knowledge work. Report identifies legal, finance, and HR as highest-exposure sectors.",
        "source": "Financial Times",
        "source_url": "https://ft.com",
        "category": "Research",
        "tier": NewsTier.TIER_1,
        "tags": ["Research Report", "White Collar", "Knowledge Work"],
        "affected_roles": ["Paralegals", "Financial Analysts", "HR Generalists"],
        "companies": ["McKinsey"],
        "key_stat_value": "30%",
        "key_stat_label": "Tasks automatable",
        "secondary_stat_value": "5-7yr",
        "secondary_stat_label": "Timeline acceleration",
        "status": NewsStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=1),
    },
    {
        "title": "Salesforce Expands Agentforce, Cuts Additional 700 Sales Roles",
        "description": "Following December's 4,000 layoffs, Salesforce announces another round of cuts focused on inside sales. CEO Benioff cites Agentforce platform handling 'majority of routine sales interactions.' The company continues its pivot toward AI-powered sales automation.",
        "summary": "Following December's 4,000 layoffs, Salesforce announces another round of cuts focused on inside sales. CEO Benioff cites Agentforce platform handling 'majority of routine sales interactions.'",
        "source": "Bloomberg",
        "source_url": "https://bloomberg.com",
        "category": "Technology",
        "tier": NewsTier.TIER_2,
        "tags": ["Sales", "SaaS", "AI Agents"],
        "affected_roles": ["Inside Sales", "SDRs", "Account Executives"],
        "companies": ["Salesforce"],
        "key_stat_value": "700",
        "key_stat_label": "Jobs cut",
        "secondary_stat_value": "4,700",
        "secondary_stat_label": "Total 2026 cuts",
        "status": NewsStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=2),
    },
    {
        "title": "UK Government to Cut 10,000 Civil Service Jobs Through AI Automation",
        "description": "British government announces plans to reduce civil service headcount by deploying AI for administrative tasks. Unions call it 'largest public sector tech displacement in UK history.' The initiative is part of a broader efficiency drive across government departments.",
        "summary": "British government announces plans to reduce civil service headcount by deploying AI for administrative tasks. Unions call it 'largest public sector tech displacement in UK history.'",
        "source": "The Guardian",
        "source_url": "https://theguardian.com",
        "category": "Policy",
        "tier": NewsTier.TIER_2,
        "tags": ["Public Sector", "Europe", "Policy"],
        "affected_roles": ["Administrative Officers", "Policy Support", "Data Entry"],
        "companies": ["UK Government"],
        "key_stat_value": "10,000",
        "key_stat_label": "Jobs eliminated",
        "secondary_stat_value": "£1.2B",
        "secondary_stat_label": "Projected savings",
        "status": NewsStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=2),
    },
    {
        "title": "Anthropic Plans 2,000 New Hires, Mostly in AI Safety and Research",
        "description": "AI safety company Anthropic announces aggressive hiring plans, bucking industry layoff trends. Focus on AI researchers, safety engineers, and policy specialists. The expansion comes as the company secures additional funding and increases its focus on responsible AI development.",
        "summary": "AI safety company Anthropic announces aggressive hiring plans, bucking industry layoff trends. Focus on AI researchers, safety engineers, and policy specialists.",
        "source": "TechCrunch",
        "source_url": "https://techcrunch.com",
        "category": "Technology",
        "tier": NewsTier.TIER_3,
        "tags": ["AI Safety", "Hiring", "New Roles"],
        "affected_roles": ["AI Researchers", "ML Engineers", "Policy Specialists"],
        "companies": ["Anthropic"],
        "key_stat_value": "2,000",
        "key_stat_label": "New positions",
        "secondary_stat_value": "60%",
        "secondary_stat_label": "Technical roles",
        "status": NewsStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=1),
    },
    {
        "title": "Goldman Sachs: AI Layoffs to Continue Through 2026",
        "description": "Goldman Sachs analysts predict sustained AI-driven workforce reductions across financial services. Report estimates 23 million US jobs face elevated automation risk by end of 2026. The analysis suggests financial services will see the most significant near-term impact.",
        "summary": "Goldman Sachs analysts predict sustained AI-driven workforce reductions across financial services. Report estimates 23 million US jobs face elevated automation risk by end of 2026.",
        "source": "Wall Street Journal",
        "source_url": "https://wsj.com",
        "category": "Finance",
        "tier": NewsTier.TIER_1,
        "tags": ["Finance", "Research Report", "Predictions"],
        "affected_roles": ["Financial Analysts", "Traders", "Back Office"],
        "companies": ["Goldman Sachs"],
        "key_stat_value": "23M",
        "key_stat_label": "Jobs at risk",
        "secondary_stat_value": "2026",
        "secondary_stat_label": "Target year",
        "status": NewsStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=3),
    },
    {
        "title": "Amazon Cuts 14,000 Corporate Jobs, Cites AI Efficiency Gains",
        "description": "Amazon announces major corporate restructuring, eliminating 14,000 positions across operations, HR, and finance departments. CEO Andy Jassy points to AI-driven productivity gains enabling smaller teams to accomplish more work.",
        "summary": "Amazon announces major corporate restructuring, eliminating 14,000 positions across operations, HR, and finance. AI-driven productivity gains cited as key enabler.",
        "source": "CNBC",
        "source_url": "https://cnbc.com",
        "category": "Technology",
        "tier": NewsTier.TIER_1,
        "tags": ["Big Tech", "Corporate", "Layoffs"],
        "affected_roles": ["Operations", "HR", "Finance"],
        "companies": ["Amazon"],
        "key_stat_value": "14,000",
        "key_stat_label": "Jobs eliminated",
        "secondary_stat_value": "Q1 2026",
        "secondary_stat_label": "Timeline",
        "status": NewsStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=4),
    },
    {
        "title": "Microsoft's 'Intelligence Engine' Strategy Reshapes 8,000 Roles",
        "description": "Microsoft reveals internal 'Intelligence Engine' initiative that will transform how teams operate. 8,000 positions to be restructured with AI augmentation. Company emphasizes upskilling over layoffs but acknowledges some role elimination.",
        "summary": "Microsoft reveals internal 'Intelligence Engine' initiative transforming team operations. 8,000 positions restructured with focus on AI augmentation.",
        "source": "The Verge",
        "source_url": "https://theverge.com",
        "category": "Technology",
        "tier": NewsTier.TIER_2,
        "tags": ["Big Tech", "AI Strategy", "Restructuring"],
        "affected_roles": ["Program Managers", "Analysts", "Support Staff"],
        "companies": ["Microsoft"],
        "key_stat_value": "8,000",
        "key_stat_label": "Roles affected",
        "secondary_stat_value": "60%",
        "secondary_stat_label": "Upskilling rate",
        "status": NewsStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=6),
    },
]


# Sample Reports Data
SAMPLE_REPORTS = [
    {
        "title": "The Structural Shift: Goldman Sachs AI Workforce Analysis",
        "summary": "Goldman Sachs warns AI-driven layoffs will continue through 2026. Our RPI analysis quantifies the risk for 23 million US workers across financial services and beyond.",
        "content": "Comprehensive analysis of Goldman Sachs' latest findings on AI workforce disruption...",
        "author": "Research Team",
        "reading_time": 12,
        "tags": ["Finance", "AI Layoffs", "Research Report", "RPI Analysis"],
        "cover_image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
        "status": ReportStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=2),
    },
    {
        "title": "McKinsey Global Institute: Automation Timeline Acceleration",
        "summary": "Comprehensive analysis of McKinsey's latest findings on generative AI accelerating automation timelines by 5-7 years for knowledge work. Deep dive into sector-specific impacts.",
        "content": "McKinsey's research reveals unprecedented acceleration in automation capabilities...",
        "author": "Intelligence Division",
        "reading_time": 15,
        "tags": ["McKinsey", "White Collar", "Knowledge Work", "Automation"],
        "cover_image_url": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop",
        "status": ReportStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=1),
    },
    {
        "title": "Q1 2026 Tech Layoffs Tracker: AI Impact Assessment",
        "summary": "Real-time tracking of AI-driven workforce reductions across major technology companies. Meta, Salesforce, Microsoft, and Amazon lead displacement trends.",
        "content": "Our Q1 2026 tracker reveals significant patterns in tech sector layoffs...",
        "author": "Data Analytics",
        "reading_time": 8,
        "tags": ["Tech Layoffs", "Big Tech", "Quarterly Report", "Tracker"],
        "cover_image_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
        "status": ReportStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=3),
    },
    {
        "title": "Customer Service Automation: The 2026 Tipping Point",
        "summary": "Analysis of AI agent deployment across customer support operations. Meta's 40% automation target signals industry-wide transformation affecting millions of workers.",
        "content": "Customer service stands at an inflection point as AI agents mature...",
        "author": "Sector Analysis",
        "reading_time": 10,
        "tags": ["Customer Service", "AI Agents", "Meta", "Automation"],
        "cover_image_url": "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&auto=format&fit=crop",
        "status": ReportStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=4),
    },
    {
        "title": "Public Sector AI: UK Government's 10,000 Job Reduction Plan",
        "summary": "Deep analysis of the UK government's civil service automation initiative. Implications for public sector employment globally and policy considerations.",
        "content": "The UK's ambitious civil service automation plan represents a turning point...",
        "author": "Policy Research",
        "reading_time": 14,
        "tags": ["Public Sector", "UK Government", "Policy", "Europe"],
        "cover_image_url": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop",
        "status": ReportStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=5),
    },
    {
        "title": "The AI Safety Hiring Boom: Counter-Trend Analysis",
        "summary": "While most sectors face AI-driven cuts, AI safety and research roles are expanding rapidly. Anthropic's 2,000 new hires signal emerging opportunities.",
        "content": "Amidst widespread AI-driven layoffs, a counter-trend emerges in AI safety...",
        "author": "Talent Intelligence",
        "reading_time": 7,
        "tags": ["AI Safety", "Hiring", "Anthropic", "New Roles"],
        "cover_image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
        "status": ReportStatus.PUBLISHED,
        "published_date": datetime.now() - timedelta(days=6),
    },
]


async def seed_news():
    """Seed news collection with sample data"""
    collection = get_news_collection()
    
    # Clear existing data (optional)
    await collection.delete_many({})
    print("🗑️  Cleared existing news data")
    
    for news_data in SAMPLE_NEWS:
        news_doc = NewsModel.create_document(
            title=news_data["title"],
            description=news_data["description"],
            summary=news_data["summary"],
            source=news_data["source"],
            source_url=news_data.get("source_url"),
            image_url=news_data.get("image_url"),
            category=news_data["category"],
            tier=news_data["tier"],
            status=news_data["status"],
            tags=news_data["tags"],
            affected_roles=news_data["affected_roles"],
            companies=news_data["companies"],
            key_stat_value=news_data.get("key_stat_value"),
            key_stat_label=news_data.get("key_stat_label"),
            secondary_stat_value=news_data.get("secondary_stat_value"),
            secondary_stat_label=news_data.get("secondary_stat_label"),
            published_date=news_data.get("published_date"),
        )
        await collection.insert_one(news_doc)
        print(f"✅ Added news: {news_data['title'][:50]}...")
    
    print(f"\n📰 Seeded {len(SAMPLE_NEWS)} news articles")


async def seed_reports():
    """Seed reports collection with sample data"""
    collection = get_reports_collection()
    
    # Clear existing data (optional)
    await collection.delete_many({})
    print("🗑️  Cleared existing reports data")
    
    for report_data in SAMPLE_REPORTS:
        report_doc = ReportModel.create_document(
            title=report_data["title"],
            summary=report_data["summary"],
            content=report_data.get("content"),
            file_url=report_data.get("file_url"),
            pdf_url=report_data.get("pdf_url"),
            cover_image_url=report_data.get("cover_image_url"),
            tags=report_data["tags"],
            status=report_data["status"],
            reading_time=report_data.get("reading_time"),
            author=report_data.get("author"),
            published_date=report_data.get("published_date"),
        )
        await collection.insert_one(report_doc)
        print(f"✅ Added report: {report_data['title'][:50]}...")
    
    print(f"\n📊 Seeded {len(SAMPLE_REPORTS)} reports")


async def main():
    """Main seed function"""
    print("\n🌱 Starting database seeding...\n")
    
    await connect_to_mongo()
    
    await seed_news()
    print()
    await seed_reports()
    
    await close_mongo_connection()
    
    print("\n✅ Database seeding completed!\n")


if __name__ == "__main__":
    asyncio.run(main())
