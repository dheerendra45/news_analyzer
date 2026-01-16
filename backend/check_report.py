import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

async def check():
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    
    # Check intelligence cards that link to reports
    print("Intelligence cards with report links:")
    async for card in db.intelligence_cards.find({"report_id": {"$exists": True, "$ne": None}}):
        print(f"  Card: {card.get('title')}")
        print(f"  Links to report_id: {card.get('report_id')}")
        print()
    
    # Show the correct report ID
    print("\nCorrect Goldman report (with rich data):")
    r = await db.reports.find_one({"title": "The Structural Shift", "is_rich_report": True})
    if r:
        print(f"  ID: {r.get('_id')}")
        print(f"  Title: {r.get('title')}")
    
    client.close()

asyncio.run(check())
