# 🚀 Quick Start Guide

Get the LMC platform running locally in 5 minutes!

## Prerequisites

Install these first:
- ✅ Java 23
- ✅ Maven 3.9+
- ✅ Docker & Docker Compose
- ✅ Node.js 18+

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd lmc-backend
```

## Step 2: Start PostgreSQL

```bash
cd backend
docker-compose up -d

# Verify PostgreSQL is running
docker ps
# Should see: lmc-postgres (port 5432) and lmc-pgadmin (port 5050)
```

## Step 3: Configure Backend

```bash
# Copy environment template
cp env.example .env

# Edit .env and add your Clerk credentials
# Get them from: https://dashboard.clerk.com

# Minimum required:
# DB_URL=jdbc:postgresql://localhost:5432/lmc_db
# DB_USERNAME=lmc_user
# DB_PASSWORD=lmc_password
# CLERK_CLIENT_ID=your_clerk_client_id
# CLERK_CLIENT_SECRET=your_clerk_client_secret
# CLERK_DOMAIN=your-domain.clerk.accounts.dev
```

## Step 4: Start Backend

```bash
# From backend directory
mvn quarkus:dev

# Wait for "Quarkus X.X.X started in X.XXXs"
# Flyway will create database tables automatically
```

Backend ready at: **http://localhost:8080**

Test it:
```bash
curl http://localhost:8080/api/health
# Should return: {"status":"UP",...}
```

## Step 5: Configure Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_BASE_URL=http://localhost:8080/api
EOF

# Get publishable key from: https://dashboard.clerk.com
```

## Step 6: Start Frontend

```bash
npm run dev
```

Frontend ready at: **http://localhost:5173**

## Step 7: Setup Clerk (First Time)

1. Go to https://clerk.com
2. Create account and new application
3. Enable **Email/Password** authentication
4. Copy keys:
   - **Publishable Key** → Frontend `.env`
   - **Client ID** → Backend `.env`
   - **Client Secret** → Backend `.env`
5. In Clerk settings, set:
   - Allowed redirect URLs: `http://localhost:5173/*`
   - Allowed origins: `http://localhost:5173`

## ✅ Verify Everything Works

### Test Backend
```bash
# Health check
curl http://localhost:8080/api/health

# Get listings (should be empty initially)
curl http://localhost:8080/api/listings
```

### Test Frontend
1. Open http://localhost:5173
2. Click **"Inscription"** to create account
3. Login with Clerk
4. Click **"Créer une annonce"**
5. Fill form and submit

## 🗄️ View Database

**Option 1: pgAdmin (Web UI)**
- URL: http://localhost:5050
- Email: `admin@lmc.com`
- Password: `admin`
- Connect to server:
  - Host: `postgres` (Docker network)
  - Port: `5432`
  - Database: `lmc_db`
  - Username: `lmc_user`
  - Password: `lmc_password`

**Option 2: CLI**
```bash
docker exec -it lmc-postgres psql -U lmc_user -d lmc_db

# Inside psql:
\dt                # List tables
SELECT * FROM users;
SELECT * FROM listings;
\q                 # Exit
```

## 🛑 Stop Everything

```bash
# Stop backend (Ctrl+C in terminal)

# Stop frontend (Ctrl+C in terminal)

# Stop PostgreSQL
cd backend
docker-compose down
```

## 🔄 Restart After Stopping

```bash
# Start PostgreSQL
cd backend
docker-compose up -d

# Start backend (in terminal 1)
mvn quarkus:dev

# Start frontend (in terminal 2)
cd frontend
npm run dev
```

## 🐛 Troubleshooting

### PostgreSQL won't start
```bash
# Check if port 5432 is already used
lsof -i :5432

# If another PostgreSQL is running, stop it or change port in docker-compose.yml
```

### Backend can't connect to database
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs lmc-postgres

# Test connection
psql -h localhost -U lmc_user -d lmc_db
```

### Flyway migration errors
```bash
# View migration history
docker exec -it lmc-postgres psql -U lmc_user -d lmc_db -c "SELECT * FROM flyway_schema_history;"

# If needed, reset database
docker-compose down -v  # WARNING: Deletes all data!
docker-compose up -d
mvn quarkus:dev  # Migrations run again
```

### Frontend can't reach backend
- Check backend is running: `curl http://localhost:8080/api/health`
- Check CORS in `backend/src/main/resources/application.yml`
- Verify `VITE_API_BASE_URL` in frontend `.env`

### Clerk authentication errors
- Verify all Clerk keys are correct
- Check Clerk domain format: `your-app.clerk.accounts.dev` (without https://)
- Ensure redirect URLs are set in Clerk dashboard

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Read [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to AWS
- Read [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) to understand the architecture

## 💡 Tips

- Backend has **live reload** - just save Java files
- Frontend has **HMR** - instant updates on save
- Database persists between restarts (Docker volume)
- Use pgAdmin for easy database browsing

---

**Happy coding! 🎉**

