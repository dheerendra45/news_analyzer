# News Analyzer - Full Stack Application

A production-ready full-stack application for managing AI-related news and reports with a React frontend and FastAPI backend.

## 🏗️ Architecture

```
news_analyzer/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # Application entry point
│   │   ├── config.py       # Configuration settings
│   │   ├── database.py     # MongoDB connection
│   │   ├── dependencies.py # Auth dependencies
│   │   ├── models/         # MongoDB document models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # JWT & password utilities
│   ├── uploads/            # File storage
│   ├── requirements.txt
│   └── .env
│
└── frontend/               # React + Vite Frontend
    ├── src/
    │   ├── api/           # Axios API layer
    │   ├── components/    # Reusable components
    │   ├── context/       # Auth context
    │   ├── pages/         # Page components
    │   │   └── admin/     # Admin dashboard pages
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Authentication

### Default Admin Credentials

```
Email: admin@replaceable.ai
Password: admin123
```

### Auth Flow

1. User submits login credentials
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. Token included in all subsequent API requests
5. Protected routes check for valid token

### JWT Token Structure

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "admin",
  "exp": 1234567890
}
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint                 | Description         | Auth  |
| ------ | ------------------------ | ------------------- | ----- |
| POST   | `/api/auth/register`     | Register new user   | No    |
| POST   | `/api/auth/login`        | Login and get token | No    |
| GET    | `/api/auth/me`           | Get current user    | Yes   |
| POST   | `/api/auth/admin/create` | Create admin user   | Admin |
| POST   | `/api/auth/upload/image` | Upload image        | Admin |
| POST   | `/api/auth/upload/pdf`   | Upload PDF          | Admin |

### News

| Method | Endpoint                | Description                         | Auth     |
| ------ | ----------------------- | ----------------------------------- | -------- |
| GET    | `/api/news`             | Get all news (published for public) | Optional |
| GET    | `/api/news/{id}`        | Get news by ID                      | Optional |
| POST   | `/api/news`             | Create news                         | Admin    |
| PUT    | `/api/news/{id}`        | Update news                         | Admin    |
| DELETE | `/api/news/{id}`        | Delete news                         | Admin    |
| PATCH  | `/api/news/{id}/status` | Toggle status                       | Admin    |

### Reports

| Method | Endpoint                   | Description                            | Auth     |
| ------ | -------------------------- | -------------------------------------- | -------- |
| GET    | `/api/reports`             | Get all reports (published for public) | Optional |
| GET    | `/api/reports/{id}`        | Get report by ID                       | Optional |
| POST   | `/api/reports`             | Create report                          | Admin    |
| PUT    | `/api/reports/{id}`        | Update report                          | Admin    |
| DELETE | `/api/reports/{id}`        | Delete report                          | Admin    |
| PATCH  | `/api/reports/{id}/status` | Toggle status                          | Admin    |

## 📋 Sample API Requests

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@replaceable.ai",
    "password": "admin123"
  }'
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "email": "admin@replaceable.ai",
    "username": "admin",
    "role": "admin",
    "is_active": true
  }
}
```

### Create News (Admin)

```bash
curl -X POST http://localhost:8000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Meta Announces AI Agents Will Handle 40% of Customer Support",
    "description": "Meta reveals plans to deploy AI agents across customer support...",
    "summary": "Meta to automate 40% of customer support with AI",
    "source": "Reuters",
    "source_url": "https://reuters.com/article/...",
    "category": "Big Tech",
    "tier": "tier_1",
    "status": "published",
    "tags": ["Big Tech", "Customer Service", "AI Agents"],
    "affected_roles": ["Customer Support", "Content Moderators"],
    "companies": ["Meta"],
    "key_stat_value": "40%",
    "key_stat_label": "Support automated",
    "secondary_stat_value": "2,000",
    "secondary_stat_label": "Contractors affected"
  }'
```

**Response:**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Meta Announces AI Agents Will Handle 40% of Customer Support",
  "description": "Meta reveals plans to deploy AI agents...",
  "summary": "Meta to automate 40% of customer support with AI",
  "source": "Reuters",
  "source_url": "https://reuters.com/article/...",
  "image_url": null,
  "category": "Big Tech",
  "tier": "tier_1",
  "status": "published",
  "tags": ["Big Tech", "Customer Service", "AI Agents"],
  "affected_roles": ["Customer Support", "Content Moderators"],
  "companies": ["Meta"],
  "key_stat": { "value": "40%", "label": "Support automated" },
  "secondary_stat": { "value": "2,000", "label": "Contractors affected" },
  "published_date": "2026-01-12T00:00:00",
  "created_at": "2026-01-12T00:00:00"
}
```

### Get Published News (Public)

```bash
curl http://localhost:8000/api/news?page=1&size=10
```

**Response:**

```json
{
  "items": [...],
  "total": 25,
  "page": 1,
  "size": 10,
  "pages": 3
}
```

## 🔄 How Admin Updates Reflect on Public Pages

1. **Admin creates/updates content** via Dashboard
2. **Status control**: Content with `status: "draft"` is only visible to admins
3. **Publishing**: Toggle status to `"published"` to make content public
4. **Real-time updates**: Public pages fetch latest published content via API
5. **Caching**: Consider adding Redis for production caching

```
Admin Dashboard                     Public Pages
      │                                  │
      │ Create/Edit News                 │
      │ Set status: draft                │
      │      ↓                           │
      │ Preview (admin only)             │
      │      ↓                           │
      │ Publish (status: published)      │
      │      ↓                           │
      └──────────────────────────────────┘
                    │
                    ↓
              MongoDB (news collection)
                    │
                    ↓
         GET /api/news (status=published)
                    │
                    ↓
              Public News Page
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt
- **Role-Based Access**: Admin-only dashboard
- **CORS Configuration**: Whitelist allowed origins
- **Protected Routes**: Frontend + Backend protection
- **Input Validation**: Pydantic schema validation

## 📁 MongoDB Collections

### users

```json
{
  "_id": ObjectId,
  "email": "admin@replaceable.ai",
  "username": "admin",
  "hashed_password": "$2b$12$...",
  "role": "admin",
  "is_active": true,
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### news

```json
{
  "_id": ObjectId,
  "title": "...",
  "description": "...",
  "summary": "...",
  "source": "Reuters",
  "source_url": "https://...",
  "image_url": "/uploads/images/...",
  "category": "Big Tech",
  "tier": "tier_1",
  "status": "published",
  "tags": ["AI", "Layoffs"],
  "affected_roles": ["Engineers"],
  "companies": ["Meta"],
  "key_stat": { "value": "40%", "label": "..." },
  "secondary_stat": { "value": "2K", "label": "..." },
  "published_date": ISODate,
  "created_at": ISODate,
  "updated_at": ISODate,
  "created_by": "user_id"
}
```

### reports

```json
{
  "_id": ObjectId,
  "title": "...",
  "summary": "...",
  "content": "...",
  "file_url": "https://...",
  "pdf_url": "/uploads/pdfs/...",
  "cover_image_url": "/uploads/images/...",
  "tags": ["Research", "AI"],
  "status": "published",
  "reading_time": 15,
  "author": "Research Team",
  "published_date": ISODate,
  "created_at": ISODate,
  "updated_at": ISODate,
  "created_by": "user_id"
}
```

## 🎨 Frontend Routes

| Path             | Component      | Access |
| ---------------- | -------------- | ------ |
| `/`              | News           | Public |
| `/reports`       | Reports        | Public |
| `/login`         | Login          | Public |
| `/admin`         | Dashboard      | Admin  |
| `/admin/news`    | NewsManager    | Admin  |
| `/admin/reports` | ReportsManager | Admin  |

## 🚢 Production Deployment

### Backend (e.g., Railway, Render, AWS)

```bash
# Set environment variables
MONGODB_URL=mongodb+srv://...
SECRET_KEY=your-production-secret-key
FRONTEND_URL=https://your-frontend-domain.com
DEBUG=False
```

### Frontend (e.g., Vercel, Netlify)

```bash
# Build for production
npm run build

# Environment variable
VITE_API_URL=https://your-backend-api.com/api
```

## 📝 License

MIT License - see LICENSE file for details.
