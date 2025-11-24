# 🏗️ LeBonCoinCoin - Modern Classified Ads Platform

A full-stack, cloud-native classified-ads platform (similar to Kleinanzeigen) built with modern technologies and designed for France. 🦆

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│   React + TypeScript + Material UI + Clerk + Vite          │
│                     (Deployed on Netlify/Vercel)            │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS/REST
┌─────────────────────▼───────────────────────────────────────┐
│                    API Gateway                              │
│                  (AWS HTTP API)                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  AWS Lambda                                 │
│         Quarkus Backend (Java 23)                           │
│    REST API + PostgreSQL + S3 + Clerk Auth                  │
└─────────┬──────────────────────────┬────────────────────────┘
          │                          │
┌─────────▼─────────┐      ┌────────▼────────┐
│   AWS RDS         │      │      S3         │
│  PostgreSQL 16    │      │  (Image Files)  │
└───────────────────┘      └─────────────────┘
```

## 🚀 Tech Stack

### Backend
- **Language**: Java 21 (Amazon Corretto 21)
- **Framework**: Quarkus 3.16+ (Serverless/AWS Lambda)
- **Database**: PostgreSQL 16 (AWS RDS)
- **ORM**: Panache (Hibernate-based)
- **Migrations**: Flyway
- **Storage**: AWS S3 (presigned URLs)
- **Auth**: Clerk JWT validation (OIDC)
- **Email**: Amazon SES (Prod) / MailHog (Dev)
- **API**: RESTful with reactive endpoints

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **UI Library**: Material UI (MUI) v6
- **Authentication**: Clerk React
- **HTTP Client**: Axios
- **Routing**: React Router v6

## 📂 Project Structure

```
leboncoincoin-backend/
├── backend/              # Quarkus Java backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/leboncoincoin/
│   │       │   ├── entity/        # JPA Entities
│   │       │   ├── repository/    # Panache repositories
│   │       │   ├── service/       # Business logic
│   │       │   ├── resource/      # REST endpoints
│   │       │   ├── dto/           # Request/Response DTOs
│   │       │   ├── exception/     # Exception handlers
│   │       │   └── security/      # Security config
│   │       └── resources/
│   │           ├── application.yml
│   │           └── db/migration/  # Flyway SQL scripts
│   ├── docker-compose.yml         # Local PostgreSQL
│   ├── pom.xml
│   └── README.md
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── README.md
│
├── README.md             # This file
└── DEPLOYMENT.md         # Complete deployment guide
```

## ✨ Features

### Implemented Features

#### Public
- ✅ Browse all listings
- ✅ Filter by category, location, price range
- ✅ Search listings by keyword
- ✅ View listing details

#### Authenticated (Clerk)
- ✅ User login/signup
- ✅ Create new listings
- ✅ Upload images to S3
- ✅ View user profile
- ✅ View own listings
- ✅ Delete own listings
- ✅ Messaging system between users
- ✅ Favorites/Watchlist
- ✅ Email notifications (Welcome email)

## 🏃 Getting Started

### 🎯 Quick Start (Dev Mode)

Pour un développement rapide **sans AWS ni Clerk** :

```bash
# Backend avec MinIO (S3 local) et auth désactivée
cd backend
mvn quarkus:dev
```

**✨ Le profil dev inclut :**
- ✅ S3 local (MinIO) - pas besoin de compte AWS
- ✅ Authentification désactivée - utilisateur de test automatique
- ✅ PostgreSQL local - avec Docker
- ✅ Console MinIO - http://localhost:9001
- ✅ MailHog (Emails) - http://localhost:8025
- ✅ Hot reload - modifications instantanées

**📖 Documentation complète :** [backend/DEV_PROFILE.md](backend/DEV_PROFILE.md)

---

### ⚙️ Full Setup (Production Mode)

Si vous voulez tester avec Clerk et AWS S3 :

### Prerequisites

- **Java 21** (Amazon Corretto 21 recommended for backend)
- **Maven 3.9+** (for backend)
- **Docker & Docker Compose** (for local PostgreSQL)
- **Node.js 18+** (for frontend)
- **AWS Account** (for deployment)
- **Clerk Account** (for authentication)

### 1. Backend Setup

```bash
cd backend

# Start local PostgreSQL with Docker Compose
docker-compose up -d

# Configure environment variables
export DB_URL=jdbc:postgresql://localhost:5432/leboncoincoin_db
export DB_USERNAME=leboncoincoin_user
export DB_PASSWORD=leboncoincoin_password
export CLERK_CLIENT_ID=your-clerk-client-id
export CLERK_CLIENT_SECRET=your-clerk-client-secret
export CLERK_DOMAIN=your-domain.clerk.accounts.dev

# Run in dev mode (Flyway will create tables automatically)
mvn quarkus:dev
```

Backend will run on: http://localhost:8080

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env file:
echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key" > .env
echo "VITE_API_BASE_URL=http://localhost:8080/api" >> .env

# Run development server
npm run dev
```

Frontend will run on: http://localhost:5173

### 3. Clerk Setup

1. Create account at https://clerk.com
2. Create a new application
3. Enable Email/Password authentication
4. Copy publishable key to frontend `.env`
5. Copy client ID and secret to backend environment
6. Configure JWKS endpoint in backend `application.yml`

## 📊 Database Schema

### Relational Model

**users**
- id (PK, VARCHAR) - Clerk user ID
- email (UNIQUE, NOT NULL)
- name (NOT NULL)
- created_at (TIMESTAMP)

**listings**
- id (PK, UUID)
- title, description, price
- category, location
- user_id (FK → users)
- created_at (TIMESTAMP)

**listing_images** (join table)
- listing_id (FK → listings)
- image_url (VARCHAR)

**conversations**
- id (PK, UUID)
- listing_id (FK → listings)
- buyer_id, seller_id (FK → users)
- created_at, updated_at (TIMESTAMP)

**messages**
- id (PK, UUID)
- conversation_id (FK → conversations)
- sender_id (FK → users)
- content (TEXT)
- sent_at (TIMESTAMP)
- is_read (BOOLEAN)

**favorites**
- id (PK, UUID)
- user_id (FK → users)
- listing_id (FK → listings)
- created_at (TIMESTAMP)

### Indexes for Performance

- `users.email` (unique)
- `listings.user_id`, `listings.category`, `listings.location`, `listings.created_at`, `listings.price`
- Full-text search ready

## 📡 API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/listings` - List all listings (with filters)
- `GET /api/listings/{id}` - Get listing by ID

### Authenticated (requires Clerk JWT)
- `POST /api/listings` - Create listing
- `DELETE /api/listings/{id}` - Delete listing (owner only)
- `GET /api/me` - Get current user
- `GET /api/me/listings` - Get user's listings
- `POST /api/uploads/presigned-url` - Get S3 upload URL
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create conversation
- `GET /api/favorites` - Get user favorites

## 🚢 Deployment

### Backend (AWS Lambda + RDS)

```bash
cd backend

# Build
mvn clean package

# Deploy with SAM
sam deploy --guided
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.

### Frontend (Netlify/Vercel)

```bash
cd frontend

# Build
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🔐 Security

- JWT validation via Clerk OIDC
- CORS configured for allowed origins
- Presigned S3 URLs (5min expiry)
- User ownership verification
- SSL/TLS for RDS connections
- VPC isolation for Lambda + RDS

## 📝 Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DB_URL` | PostgreSQL JDBC URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `AWS_REGION` | AWS region |
| `S3_BUCKET_NAME` | S3 bucket for images |
| `CLERK_CLIENT_ID` | Clerk application ID |
| `CLERK_CLIENT_SECRET` | Clerk secret key |
| `CLERK_DOMAIN` | Clerk domain |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `VITE_API_BASE_URL` | Backend API URL |

## 🗃️ Database Migrations

Flyway manages database schema:

```bash
# Migrations in: src/main/resources/db/migration/
# Format: V{version}__{description}.sql

# Create new migration
touch backend/src/main/resources/db/migration/V1.0.4__add_feature.sql

# Migrations run automatically on app startup
```

## 🛣️ Roadmap

### Phase 2 (Future)
- [ ] Advanced search (full-text)
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Mobile app (React Native)

## 💰 Cost Estimation

**Monthly costs (AWS eu-west-3):**
- RDS (db.t4g.micro, 20GB): ~€15
- Lambda (1M requests): ~€2
- S3 (10GB): ~€0.30
- Data Transfer: ~€1
- **Total: ~€18-20/month**

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ and 🦆 using modern, cloud-native technologies**
