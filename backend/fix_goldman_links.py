"""
Fix script to:
1. Delete duplicate Goldman reports (keep only the one with rich data)
2. Update intelligence cards to point to the correct report
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.config import settings

async def fix_goldman_links():
    print("🔗 Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    
    # 1. Find the correct Goldman report (the one with rich data)
    correct_report = await db.reports.find_one({
        "title": "The Structural Shift",
        "is_rich_report": True
    })
    
    if not correct_report:
        print("❌ No rich Goldman report found! Run seed_goldman_report.py first.")
        client.close()
        return
    
    correct_id = str(correct_report["_id"])
    print(f"✅ Found correct Goldman report: {correct_id}")
    
    # 2. Delete all other "Structural Shift" reports
    delete_result = await db.reports.delete_many({
        "$and": [
            {"title": {"$regex": "Structural Shift", "$options": "i"}},
            {"_id": {"$ne": correct_report["_id"]}}
        ]
    })
    print(f"🗑️ Deleted {delete_result.deleted_count} duplicate reports")
    
    # 3. Update all intelligence cards that reference Goldman/Structural Shift to point to correct report
    update_result = await db.intelligence_cards.update_many(
        {"title": {"$regex": "Goldman|Structural Shift", "$options": "i"}},
        {"$set": {"report_id": correct_id}}
    )
    print(f"📝 Updated {update_result.modified_count} intelligence cards to point to correct report")
    
    # 4. Verify the fix
    print("\n📋 Verification:")
    async for card in db.intelligence_cards.find({"report_id": correct_id}):
        print(f"  ✓ Card '{card.get('title')}' -> report {card.get('report_id')}")
    
    client.close()
    print("\n✅ Fix complete!")

if __name__ == "__main__":
    asyncio.run(fix_goldman_links())
