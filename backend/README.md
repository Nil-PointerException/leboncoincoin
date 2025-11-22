# LMC Backend - Classified Ads Platform

A modern, serverless backend for a classified-ads platform built with **Quarkus**, **PostgreSQL**, and designed to run on **AWS Lambda** with **AWS RDS**.

## 🏗️ Architecture

- **Framework**: Quarkus 3.16+ with Java 23
- **Runtime**: AWS Lambda (via `quarkus-amazon-lambda-http`)
- **Database**: PostgreSQL with Panache ORM (Hibernate)
- **Storage**: AWS S3 for image uploads
- **Authentication**: Clerk JWT (OIDC)
- **API Style**: RESTful with reactive endpoints
- **Migrations**: Flyway

## 📦 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/lmc/
│   │   │   ├── domain/           # JPA Entity models (User, Listing, Message)
│   │   │   ├── repository/       # Panache repositories
│   │   │   ├── service/          # Business logic layer
│   │   │   ├── resource/         # REST API endpoints
│   │   │   ├── dto/              # Request/Response DTOs
│   │   │   ├── exception/        # Exception handling
│   │   │   └── security/         # Security configuration
│   │   └── resources/
│   │       ├── application.yml   # Configuration
│   │       └── db/migration/     # Flyway SQL migrations
│   └── test/
├── docker-compose.yml            # Local PostgreSQL setup
├── pom.xml
└── README.md
```

## 🔧 Prerequisites

- Java 23
- Maven 3.9+
- Docker & Docker Compose (for local PostgreSQL)
- AWS CLI configured with credentials
- Clerk account for authentication

## 🚀 Getting Started

> **💡 Quick Start**: Pour un développement rapide sans configuration AWS ni Clerk, voir [DEV_PROFILE.md](./DEV_PROFILE.md)

### Development Profiles

LMC Backend supporte deux profils :

| Profile | Usage | Auth | S3 | Database |
|---------|-------|------|-----|----------|
| **dev** | Développement local | ❌ Test user | MinIO local | PostgreSQL local |
| **prod** | Production | ✅ Clerk OIDC | AWS S3 | AWS RDS |

### Quick Start (Dev Profile) 🎯

```bash
# 1. Démarrer PostgreSQL + MinIO
docker-compose up -d

# 2. Lancer en mode dev (pas de config AWS/Clerk nécessaire)
mvn quarkus:dev

# 3. Tester l'API
curl http://localhost:8080/api/listings
```

**➡️ Documentation complète:** [DEV_PROFILE.md](./DEV_PROFILE.md)

### Full Setup (Prod Profile) ⚙️

Si vous voulez tester avec Clerk et AWS S3 :

### 1. Start Local PostgreSQL Database

```bash
# Start PostgreSQL and pgAdmin with Docker Compose
docker-compose up -d

# Check that containers are running
docker ps
```

**PostgreSQL credentials (local dev):**
- Host: `localhost:5432`
- Database: `lmc_db`
- Username: `lmc_user`
- Password: `lmc_password`

**pgAdmin (optional):**
- URL: http://localhost:5050
- Email: `admin@lmc.com`
- Password: `admin`

### 2. Configure Environment Variables

Create a `.env` file or set environment variables:

```bash
# Database
export DB_URL=jdbc:postgresql://localhost:5432/lmc_db
export DB_USERNAME=lmc_user
export DB_PASSWORD=lmc_password
export DB_LOG_SQL=true

# AWS Configuration
export AWS_REGION=eu-west-3
export S3_BUCKET_NAME=lmc-images

# Clerk Configuration
export CLERK_CLIENT_ID=your-clerk-client-id
export CLERK_CLIENT_SECRET=your-clerk-client-secret
export CLERK_DOMAIN=your-domain.clerk.accounts.dev

# CORS Configuration
export CORS_ORIGINS=http://localhost:5173
```

### 3. Create S3 Bucket

```bash
aws s3 mb s3://lmc-images --region eu-west-3
aws s3api put-bucket-cors --bucket lmc-images --cors-configuration file://cors.json
```

### 4. Run in Development Mode

```bash
mvn quarkus:dev
```

The API will be available at: `http://localhost:8080/api`

**Flyway will automatically:**
- Create the database schema
- Run all migrations on startup

## 📊 Database Schema

### Tables

**users**
- `id` (VARCHAR PRIMARY KEY) - Clerk user ID
- `email` (VARCHAR UNIQUE NOT NULL)
- `name` (VARCHAR NOT NULL)
- `created_at` (TIMESTAMP)

**listings**
- `id` (VARCHAR PRIMARY KEY) - UUID
- `title` (VARCHAR NOT NULL)
- `description` (TEXT)
- `price` (DECIMAL)
- `category` (VARCHAR)
- `location` (VARCHAR)
- `user_id` (VARCHAR FK → users)
- `created_at` (TIMESTAMP)

**listing_images** (join table for @ElementCollection)
- `listing_id` (VARCHAR FK → listings)
- `image_url` (VARCHAR)

**messages** (for future implementation)
- `id` (VARCHAR PRIMARY KEY)
- `listing_id` (VARCHAR FK → listings)
- `from_user_id` (VARCHAR FK → users)
- `to_user_id` (VARCHAR FK → users)
- `content` (TEXT)
- `created_at` (TIMESTAMP)

### Indexes

Performance indexes are created on:
- `users.email`
- `listings.user_id`, `listings.category`, `listings.location`, `listings.created_at`, `listings.price`
- `messages.listing_id`, `messages.from_user_id`, `messages.to_user_id`

## 📡 API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `GET /api/listings` - Get all listings (with optional filters)
  - Query params: `category`, `location`, `minPrice`, `maxPrice`, `search`
- `GET /api/listings/{id}` - Get listing by ID

### Authenticated Endpoints (requires Clerk JWT)

- `POST /api/listings` - Create a new listing
- `DELETE /api/listings/{id}` - Delete a listing (owner only)
- `GET /api/me` - Get current user info
- `GET /api/me/listings` - Get current user's listings
- `POST /api/uploads/presigned-url` - Get S3 presigned URL for image upload

## 🗃️ Database Migrations

Migrations are managed by **Flyway** and located in `src/main/resources/db/migration/`

### Create a new migration

```bash
# Format: V{version}__{description}.sql
# Example: V1.0.2__add_listing_status.sql
touch src/main/resources/db/migration/V1.0.2__add_listing_status.sql
```

### Migration naming convention

- `V1.0.0__` - Initial schema
- `V1.0.1__` - Sample data (optional)
- `V1.0.2__` - Feature additions
- `V1.1.0__` - Major changes

### View migration status

```bash
# Connect to database
psql -h localhost -U lmc_user -d lmc_db

# Check flyway_schema_history table
SELECT * FROM flyway_schema_history;
```

## 🚢 Deployment to AWS (Lambda + RDS)

### 1. Create RDS PostgreSQL Instance

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
    --db-instance-identifier lmc-db-prod \
    --db-instance-class db.t4g.micro \
    --engine postgres \
    --engine-version 16.1 \
    --master-username admin \
    --master-user-password YOUR_SECURE_PASSWORD \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxx \
    --db-subnet-group-name your-subnet-group \
    --backup-retention-period 7 \
    --publicly-accessible false

# Get RDS endpoint
aws rds describe-db-instances \
    --db-instance-identifier lmc-db-prod \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text
```

### 2. Update Lambda Environment Variables

```bash
export DB_URL=jdbc:postgresql://your-rds-endpoint.rds.amazonaws.com:5432/lmc_db
export DB_USERNAME=admin
export DB_PASSWORD=your_secure_password
```

### 3. Build and Deploy Lambda

```bash
# Build for Lambda
mvn clean package

# Deploy with SAM
sam deploy \
    --template-file sam-template.yaml \
    --stack-name lmc-backend-prod \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        DbUrl=$DB_URL \
        DbUsername=$DB_USERNAME \
        DbPassword=$DB_PASSWORD
```

### 4. Configure Lambda VPC

Your Lambda function **must** be in the same VPC as RDS:
- Configure Lambda VPC settings
- Add Lambda to RDS security group
- Ensure NAT Gateway for internet access (S3, Clerk)

## 🧪 Testing

### Quick Start

```bash
# Run all integration tests
mvn test

# Or use the script (starts PostgreSQL automatically)
.\run-tests.ps1              # Windows
./run-tests.sh               # Linux/Mac

# Tests run automatically with install
mvn clean install
```

### What's Tested

✅ **Happy Path** : Create → Read → Update → Delete  
✅ **Filters** : Category, Location, Price, Search  
✅ **Validation** : Required fields, data types  
✅ **Errors** : 404, 400, 422  
✅ **Authentication** : Auto test user injection  

### Test Coverage

- `ListingResourceTest` - 12 tests covering full CRUD lifecycle
- RestAssured integration tests
- No JWT tokens required (auto test user)
- PostgreSQL required (via docker-compose)

**📖 Complete guide:** [TEST_QUICK_START.md](./TEST_QUICK_START.md) | [TESTING.md](./TESTING.md)

## 🔐 Security

- All authenticated endpoints validate Clerk JWT tokens via Quarkus OIDC
- CORS is configured for specified origins
- User ownership is verified before allowing deletions
- S3 presigned URLs expire after 5 minutes
- Database credentials stored in AWS Secrets Manager (production)
- SSL/TLS connections to RDS

## 🛠️ Technologies

- **Quarkus** - Supersonic Subatomic Java Framework
- **Panache ORM** - Simplified Hibernate with repository pattern
- **PostgreSQL 16** - Relational database
- **Flyway** - Database migrations
- **AWS Lambda** - Serverless compute
- **AWS RDS** - Managed PostgreSQL
- **AWS S3** - Object storage for images
- **Clerk** - Modern authentication platform
- **Jakarta EE** - REST, CDI, Validation APIs

## 📊 Monitoring & Performance

### Enable RDS Performance Insights

```bash
aws rds modify-db-instance \
    --db-instance-identifier lmc-db-prod \
    --enable-performance-insights \
    --performance-insights-retention-period 7
```

### CloudWatch Metrics
- RDS: CPU, Connections, Read/Write IOPS
- Lambda: Duration, Errors, Concurrent Executions
- Database query performance via Hibernate statistics

## 💰 Cost Optimization

**Development:**
- Use Docker Compose for local PostgreSQL (free)
- RDS: db.t4g.micro with 20GB storage (~$15/month)

**Production:**
- RDS: Reserved instances for 50% savings
- Lambda: Stays in free tier for MVP traffic
- Enable RDS auto-scaling for storage

## 📝 Common Commands

```bash
# Start local database
docker-compose up -d

# Stop local database
docker-compose down

# View database logs
docker logs lmc-postgres

# Run Quarkus in dev mode (with live reload)
mvn quarkus:dev

# Build for production
mvn clean package -DskipTests

# Connect to local PostgreSQL
psql -h localhost -U lmc_user -d lmc_db

# Run Flyway migrations manually
mvn flyway:migrate
```

## 🐛 Troubleshooting

### Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -p 5432 -U lmc_user -d lmc_db

# Check Docker containers
docker ps
docker logs lmc-postgres
```

### Migration Failures

```bash
# Check Flyway history
SELECT * FROM flyway_schema_history ORDER BY installed_rank;

# Repair Flyway (if needed)
mvn flyway:repair
```

### Lambda + RDS Connection Timeout

- Verify Lambda is in same VPC as RDS
- Check security group rules
- Ensure NAT Gateway exists for outbound traffic
- Increase Lambda timeout (default 30s)

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
