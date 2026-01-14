"""
MongoDB database connection and initialization
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING, DESCENDING
from app.config import settings

# MongoDB client instance
client: AsyncIOMotorClient = None
database = None


async def connect_to_mongo():
    """Connect to MongoDB and initialize database"""
    global client, database
    
    client = AsyncIOMotorClient(settings.mongodb_url)
    database = client[settings.database_name]
    
    # Create indexes for better performance
    await create_indexes()
    
    print(f"✅ Connected to MongoDB: {settings.database_name}")


async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("❌ MongoDB connection closed")


async def create_indexes():
    """Create database indexes for optimal queries"""
    # Users collection indexes
    await database.users.create_indexes([
        IndexModel([("email", ASCENDING)], unique=True),
        IndexModel([("username", ASCENDING)], unique=True)
    ])
    
    # News collection indexes
    await database.news.create_indexes([
        IndexModel([("published_date", DESCENDING)]),
        IndexModel([("status", ASCENDING)]),
        IndexModel([("category", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)])
    ])
    
    # Reports collection indexes
    await database.reports.create_indexes([
        IndexModel([("published_date", DESCENDING)]),
        IndexModel([("status", ASCENDING)]),
        IndexModel([("tags", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)])
    ])
    
    # Intelligence Cards collection indexes
    await database.intelligence_cards.create_indexes([
        IndexModel([("published_date", DESCENDING)]),
        IndexModel([("status", ASCENDING)]),
        IndexModel([("tier", ASCENDING)]),
        IndexModel([("company", ASCENDING)]),
        IndexModel([("is_featured", DESCENDING)]),
        IndexModel([("display_order", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)])
    ])


def get_database():
    """Return database instance"""
    return database


# Collection getters
def get_users_collection():
    return database.users


def get_news_collection():
    return database.news


def get_reports_collection():
    return database.reports


def get_intelligence_cards_collection():
    return database.intelligence_cards
