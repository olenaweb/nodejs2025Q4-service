# Home Library Service

REST API service for managing home music library with authentication, authorization, logging, and error handling.

##  Project Overview

This project implements a comprehensive REST API service with:
- **JWT-based Authentication & Authorization** (200 points)
- **Advanced Logging & Error Handling** (170 points)
- **Music Library Management** (Albums, Artists, Tracks, Favorites)
- **Docker containerization** with PostgreSQL database
- **Swagger API documentation**

**Total Score: 340/340 points (100%)** ✅

---

##  Quick Start

### Prerequisites

- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Node.js v22.14.0+** - [Download & Install Node.js](https://nodejs.org/en/download/)
- **Docker Desktop** - [Download & Install Docker](https://www.docker.com/products/docker-desktop/) and start it

### Installation

```bash
# Clone repository
git clone https://github.com/olenaweb/nodejs2025Q4-service.git
cd nodejs2025Q4-service

# Checkout the authentication branch
git checkout -b dev-part3 origin/dev-part3

# Install dependencies (use --legacy-peer-deps due to @nestjs/swagger compatibility)
npm install --legacy-peer-deps

# Rename environment file
# Windows PowerShell:
Copy-Item .env.example .env
# Linux/Mac:
cp .env.example .env
```

### Running the Application

```bash
# Start Docker Desktop first!

# Build and start containers
npm run start

# View logs in real-time
npm run logs
# or
docker logs home-library-app

# Test included clean database before tests (REQUIRED!) and run 98 tests
npm run test:clean:auth
npm run test:clean:refresh
# or
# clean db!
npm run clean:db
npm run test:auth

# clean db!
npm run clean:db
npm run test:refresh

# check database
docker exec -it home-library-postgres psql -U postgres -d home_library -c "SELECT login, password FROM users;"
# check linter
npm run lint
# Stop containers
npm run down
# Start containers
npm run up
```

**Access Points:**
- Application: http://localhost:4000/
- Swagger UI: http://localhost:4000/doc

---

##  Testing & Verification

### 1. Basic Functionality Tests with Authentication & Authorization

```bash
# Clean database before tests (REQUIRED!)
npm run clean:db
# Run authentication tests
npm run test:auth

# or
npm run test:clean:auth
```

**Expected:** 94 tests pass (10 test suites)

### 2. Refresh Token Tests

```bash
# Clean database (REQUIRED!)
npm run clean:db
# Run refresh token tests
npm run test:refresh

# or
npm run test:clean:refresh
```

**Expected:** 4 tests pass

### 4. Manual Testing via Swagger

1. Open http://localhost:4000/doc
2. **Register user:** POST `/auth/signup`
   ```json
   {
    "login": "edgar_po",
    "password": "secret123"
   }
   ```
3. **Login:** POST `/auth/login` (same credentials)
   - Copy the `accessToken` from response
4. **Authorize:** Click 🔒 "Authorize" button at top
   - Enter: `{your_accessToken}`
   ##### example :
   - Enter: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYWE3OTRmNi01YTY0LTRkMTMtYmI0Ny00OWEwMzI3NWM2ZmUiLCJsb2dpbiI6ImVkZ2FyX3BvIiwiaWF0IjoxNzY1NjExODcyLCJleHAiOjE3NjU2MTU0NzJ9.1EETNhYBAANKoEse27p-Ss7mwQM39Tjesk4ybQmCTCg`
   - Click "Authorize" button
5. **Test protected endpoints:** Try GET `/user`, `/artist`, `/album`, etc.
```powershell
   # example :
   GET `/user`
   POST `/artist`
   POST `/album`
   POST `/track`
   POST favs/artist/1039c10b-83c7-406e-b1cb-5499af0ed3ea -use real Id
   GET `/favs`
   # and so on...
```
### 5. Code Quality Checks

```bash
# Check for linting errors
npm run lint

# Format code
npm run format

# Security scan
npm run docker:check:db
npm run docker:check:library
```

---

##  Implementation Status

### Part 1: Logging & Error Handling (Basic Scope) - 100/100 points

| Requirement | Points | Status | Implementation |
|------------|--------|--------|----------------|
| Custom LoggingService implemented | 20 | ✅ | `src/logging/logging.service.ts`  |
| Custom Exception Filter implemented | 20 | ✅ | `src/logging/all-exceptions.filter.ts` |
| Request/Response logging | 20 | ✅ | `src/logging/logging.interceptor.ts` logs URL, query, body, status |
| Error handling with proper HTTP codes | 20 | ✅ | All controllers use proper status codes (400, 404, 409, etc.) |
| `uncaughtException` handling | 10 | ✅ | `src/main.ts` - logged and graceful shutdown |
| `unhandledRejection` handling | 10 | ✅ | `src/main.ts` - logged and graceful shutdown |

**Verification:**
- Logs in console show structured JSON format
- All errors return proper HTTP status codes
- Check `docker logs home-library-app` for exception handling

### Part 2: Logging & Error Handling (Advanced Scope) - 70/70 points

| Requirement | Points | Status | Implementation |
|------------|--------|--------|----------------|
| Logs written to file | 20 | ✅ | `logs/application-YYYY-MM-DD.log` on host machine |
| Log file rotation by size | 10 | ✅ | Rotates at 10MB (configurable) |
| Environment variable for max file size | 10 | ✅ | `LOG_FILE_MAX_SIZE` in `.env` (default: 10m) |
| Separate error log file | 10 | ✅ | `logs/error-YYYY-MM-DD.log` for errors only |
| Logging level configuration | 20 | ✅ | `LOG_LEVEL` in `.env` (0-4: error, warn, log, debug, verbose ; now set to 4) |

**Verification:**
```bash
# Check log files on host (real-time sync with container)
# bash only
ls -lh ./logs/
cat ./logs/application-2025-12-12.log
cat ./logs/error-2025-12-12.log

# Test rotation: Set LOG_FILE_MAX_SIZE=1m in .env and make many requests
```

### Part 3: Authentication (Basic Scope) - 140 points

| Requirement | Points | Status | Implementation |
|------------|--------|--------|----------------|
| POST `/auth/signup` with service separation | 30 | ✅ | `src/auth/auth.controller.ts` + `auth.service.ts` |
| POST `/auth/login` with service separation | 30 | ✅ | Returns `accessToken` + `refreshToken` |
| Password hashing (bcrypt) | 10 | ✅ | 10 salt rounds, stored as hash in DB |
| Access Token (JWT with userId + login) | 20 | ✅ | Secret in `.env`, expires in 1h |
| Authentication required for all routes | 40 | ✅ | `JwtAuthGuard` on all controllers except `/auth/*`, `/doc`, `/` |
| Separate JWT validation module | 10 | ✅ | `JwtStrategy` + `JwtAuthGuard` in `src/auth/` |

**Verification:**
```bash
# Automated tests
# bash only
npm run clean:db && npm run test:auth
# or
# powershell
npm run test:clean:auth
# Expected: 94 tests pass

# Manual verification in Swagger:
# 1. Try GET /user without token → 401 Unauthorized
# 2. Signup → Login → Copy token
# 3. Authorize with token → GET /user → 200 OK
```
**Verification of Password hashing (bcrypt)**
```bash
# Check DB for hashed password
docker exec -it home-library-postgres psql -U postgres -d home_library -c "SELECT login, password FROM users;"

# or
docker exec -it home-library-postgres psql -U postgres -d home_library
# show tables
\d
# show users table
\d users
# show users table columns
\d+ users
# show users table data
SELECT login, password FROM users;
# quit
\q

# example of answer :
   login   |                           password
-----------+--------------------------------------------------------------
 edgar_po  | $2b$10$6OgwY62zv3FcnKWOGNa4fualfD2FXAmKJGcq7vAaWXA/ahh.SXBi2
 testuser3 | $2b$10$vgN.bYuHoTML8NvIcCxDpeoU/gsdF7TPuTq6Rr0rDD4BbJFk3NiI6
(2 rows)
```

### Part 4: Authentication (Advanced Scope) - 30 points

| Requirement | Points | Status | Implementation |
|------------|--------|--------|----------------|
| POST `/auth/refresh` with service separation | 30 | ✅ | Validates `refreshToken`, returns new tokens |

**Verification:**
```bash
# bash only
npm run clean:db && npm run test:refresh
# or
# powershell
npm run test:clean:refresh
# Expected: 4 tests pass (valid token, invalid token, missing token, expired token)
```

##  Environment Variables

Key variables in `.env`:

```env
# Server
PORT=4000

# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/home_library?schema=public"

# JWT Authentication
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

# Password Hashing
CRYPT_SALT=10

# Logging
LOG_LEVEL=3                    # 0=error, 1=warn, 2=log, 3=debug, 4=verbose
LOG_FILE_MAX_SIZE=20m          # Max size before rotation
```

---

##  Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Build and start Docker containers |
| `npm run down` | Stop Docker containers |
| `npm run up` | Start existing containers |
| `npm run logs` | View application logs in real-time |
| `npm run clean:db` | Clear database and restart app |
| `npm test` | Run all basic and authentication refresh tests |
| `npm run test:auth` | Run authentication tests (94 tests) |
| `npm run test:clean:auth` | Clean DB + Run authentication tests (94 tests) |
| `npm run test:refresh` | Run refresh token tests (4 tests) |
| `npm run test:clean:refresh` | Clean DB + Run refresh token tests (4 tests) |
| `npm run lint` | Check and fix linting errors |
| `npm run format` | Format code with Prettier |
| `npm run docker:check:db` | Security scan for PostgreSQL image |
| `npm run docker:check:library` | Security scan for app image |
| `docker exec -it home-library-postgres psql -U postgres -d home_library -c "SELECT login, password FROM users;"` | Check DB for hashed password |

---


##  Final Checklist

Verify:

- [X] All tests pass: `npm run clean:db && npm run test:auth` (94 tests)
- [X] Refresh tests pass: `npm run clean:db && npm run test:refresh` (4 tests)
- [X] No linting errors: `npm run lint`
- [X] Swagger documentation accessible: http://localhost:4000/doc
- [X] Log files created in `./logs/` directory
- [X] All endpoints protected
- [X] Passwords stored as bcrypt hashes (check DB)
- [X] Environment variables configured in `.env`
- [X] Docker containers running: `docker ps`

---

##  Test Results Summary

**Total: 98/98 tests passing (100%)**

- ✅ Basic tests with Authentication: 94 tests
- ✅ Refresh token tests: 4 tests

**No forfeits:**
- ✅ 0 failing tests
- ✅ 0 linting errors
- ✅ 0 compilation errors

**Final Score: 340/340 (100%)**

---

##  Support

For questions about implementation, check:
- Swagger documentation: http://localhost:4000/doc
- Application logs: `./logs/application-*.log`

---

##  License

This project is part of RS School Node.js 2025 Q4 course.

---

**Author:** olenaweb
**Branch:** dev-part3
**Date:** December 2025
