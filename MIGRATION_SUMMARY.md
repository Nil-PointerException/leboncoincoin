# 📋 Migration Summary: DynamoDB → PostgreSQL

## Overview

The LMC backend has been **successfully migrated** from **DynamoDB** to **PostgreSQL** with **Panache ORM**.

---

## ✅ What Changed

### 1. **Database Layer**

| Before (DynamoDB) | After (PostgreSQL) |
|-------------------|-------------------|
| NoSQL document store | Relational database |
| DynamoDB Enhanced Client | Panache ORM (Hibernate) |
| Scan operations for queries | SQL queries with indexes |
| No schema enforcement | Strict schema with migrations |
| Manual table creation | Flyway migrations |

### 2. **Dependencies (pom.xml)**

**Removed:**
- `quarkus-amazon-dynamodb`
- `software.amazon.awssdk:dynamodb-enhanced`

**Added:**
- `quarkus-hibernate-orm-panache` - ORM layer
- `quarkus-jdbc-postgresql` - PostgreSQL driver
- `quarkus-flyway` - Database migrations

### 3. **Domain Models**

**Before (DynamoDB annotations):**
```java
@DynamoDbBean
public class User {
    @DynamoDbPartitionKey
    @DynamoDbAttribute("id")
    private String id;
    // ...
}
```

**After (JPA annotations):**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id")
    private String id;
    
    @PrePersist
    protected void onCreate() { ... }
    // ...
}
```

### 4. **Repositories**

**Before (DynamoDB):**
```java
public class UserRepository {
    private final DynamoDbTable<User> table;
    
    public User save(User user) {
        table.putItem(user);
        return user;
    }
}
```

**After (Panache):**
```java
@ApplicationScoped
public class UserRepository implements PanacheRepositoryBase<User, String> {
    public Optional<User> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }
}
```

### 5. **Services**

**Changes:**
- Added `@Transactional` annotations
- Changed from `save()` to `persist()`
- Changed from `findById()` to `findByIdOptional()`
- Improved query methods with Panache

### 6. **Configuration (application.yml)**

**Removed DynamoDB config:**
```yaml
dynamodb:
  endpoint-override: ...
  aws:
    region: ...
```

**Added PostgreSQL config:**
```yaml
datasource:
  db-kind: postgresql
  jdbc:
    url: jdbc:postgresql://localhost:5432/lmc_db
  username: lmc_user
  password: lmc_password

hibernate-orm:
  database:
    generation: none

flyway:
  migrate-at-start: true
```

---

## 🗄️ Database Schema

### Tables Created (via Flyway)

1. **users**
   - Primary Key: `id` (VARCHAR)
   - Unique: `email`
   - Index on `email`

2. **listings**
   - Primary Key: `id` (UUID)
   - Foreign Key: `user_id` → `users(id)` CASCADE
   - Indexes: `user_id`, `category`, `location`, `created_at`, `price`

3. **listing_images**
   - Join table for `@ElementCollection`
   - Foreign Key: `listing_id` → `listings(id)` CASCADE

4. **messages** (ready for future use)
   - Primary Key: `id` (UUID)
   - Foreign Keys to `listings` and `users`

---

## 📁 New Files Created

### Backend

1. **Flyway Migrations**
   - `src/main/resources/db/migration/V1.0.0__create_initial_schema.sql`
   - `src/main/resources/db/migration/V1.0.1__add_sample_data.sql`

2. **Docker Compose**
   - `backend/docker-compose.yml` - Local PostgreSQL + pgAdmin

3. **Configuration**
   - `backend/env.example` - Environment variables template

4. **Updated Documentation**
   - `backend/README.md` - PostgreSQL-specific instructions
   - `DEPLOYMENT.md` - RDS deployment guide
   - `README.md` - Updated architecture

---

## 🔄 Migration Steps (What Was Done)

### Step 1: Update Dependencies
- ✅ Replaced DynamoDB with PostgreSQL/Panache in `pom.xml`

### Step 2: Convert Entities
- ✅ Replaced `@DynamoDbBean` with `@Entity`
- ✅ Replaced `@DynamoDbPartitionKey` with `@Id`
- ✅ Added `@Table`, `@Column` annotations
- ✅ Added `@PrePersist` lifecycle hooks

### Step 3: Rewrite Repositories
- ✅ Implemented `PanacheRepositoryBase<Entity, ID>`
- ✅ Replaced DynamoDB table operations with Panache queries
- ✅ Improved filtering with SQL queries

### Step 4: Update Services
- ✅ Added `@Transactional` for write operations
- ✅ Changed method calls (`persist()`, `findByIdOptional()`, etc.)

### Step 5: Database Configuration
- ✅ Configured PostgreSQL datasource
- ✅ Configured Hibernate ORM
- ✅ Configured Flyway migrations

### Step 6: Create Migrations
- ✅ Created SQL scripts for schema creation
- ✅ Added indexes for performance

### Step 7: Local Development Setup
- ✅ Created `docker-compose.yml` for local PostgreSQL
- ✅ Added pgAdmin for database management

### Step 8: Update Documentation
- ✅ Updated all README files
- ✅ Updated deployment guide for RDS
- ✅ Created this migration summary

---

## 🚀 How to Run (Post-Migration)

### Local Development

```bash
# 1. Start PostgreSQL
cd backend
docker-compose up -d

# 2. Run backend (Flyway runs migrations automatically)
mvn quarkus:dev

# 3. Run frontend
cd frontend
npm run dev
```

### Production (AWS)

```bash
# 1. Create RDS PostgreSQL instance
aws rds create-db-instance ...

# 2. Deploy Lambda (with VPC config)
sam deploy --guided

# 3. Migrations run automatically on first Lambda invocation
```

---

## ✨ Benefits of PostgreSQL Migration

### Performance
- ✅ **Relational queries** - Efficient JOINs and complex queries
- ✅ **Indexes** - B-tree indexes on common query fields
- ✅ **Full-text search** - Ready for advanced search features

### Data Integrity
- ✅ **ACID transactions** - Data consistency guaranteed
- ✅ **Foreign keys** - Referential integrity enforced
- ✅ **Schema validation** - Type safety at database level

### Developer Experience
- ✅ **SQL queries** - Familiar and powerful
- ✅ **Panache ORM** - Simplified repository pattern
- ✅ **Flyway migrations** - Version-controlled schema changes
- ✅ **Local development** - Easy Docker Compose setup

### Cost
- ✅ **RDS pricing** - Predictable costs (~€15/month for t4g.micro)
- ✅ **No scan costs** - Unlike DynamoDB's per-request pricing
- ✅ **Better for small-medium scale** - More cost-effective than DynamoDB for MVP

---

## 🔍 Query Comparison

### Example: Find listings by user

**DynamoDB (Scan):**
```java
return table.scan()
    .items()
    .stream()
    .filter(listing -> userId.equals(listing.getUserId()))
    .collect(Collectors.toList());
```

**PostgreSQL (Indexed Query):**
```java
return list("userId", Sort.descending("createdAt"), userId);
```

### Example: Filter by category and location

**DynamoDB (Scan + Filter):**
```java
return table.scan()
    .items()
    .stream()
    .filter(l -> category.equals(l.getCategory()))
    .filter(l -> l.getLocation().contains(location))
    .collect(Collectors.toList());
```

**PostgreSQL (SQL with Indexes):**
```java
return find(
    "LOWER(category) = LOWER(:category) AND LOWER(location) LIKE LOWER(:location)",
    Sort.descending("createdAt"),
    Map.of("category", category, "location", "%" + location + "%")
).list();
```

---

## 🎯 Next Steps (Recommended)

### Immediate
1. ✅ Test locally with Docker Compose
2. ✅ Create RDS instance in AWS
3. ✅ Deploy to Lambda with VPC config
4. ✅ Verify migrations run successfully

### Soon
- [ ] Add full-text search (PostgreSQL `tsvector`)
- [ ] Add database connection pooling tuning
- [ ] Set up read replicas for scaling
- [ ] Add database performance monitoring

### Future Enhancements
- [ ] Implement message system (tables ready)
- [ ] Add soft deletes for listings
- [ ] Add listing edit history
- [ ] Add analytics tables

---

## 📞 Support

If you encounter issues during or after migration:

1. Check PostgreSQL logs: `docker logs lmc-postgres`
2. Check Flyway history: `SELECT * FROM flyway_schema_history;`
3. Verify Lambda VPC config for RDS access
4. Refer to `DEPLOYMENT.md` for troubleshooting

---

**Migration completed successfully! 🎉**

