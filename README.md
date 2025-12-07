# Home Library Service

## Quick Start

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker Desktop - [Download & Install Docker & Start Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Downloading and Install

```
git clone https://github.com/olenaweb/nodejs2025Q4-service.git
cd nodejs2025Q4-service
git checkout -b dev-part2 origin/dev-part2

```

#### Important!!! (because old project!!!)

#### Installing NPM modules

The --legacy-peer-deps flag is used to resolve dependency version conflicts.

```
npm install --legacy-peer-deps
```

## Check application

```powershell
# 1. !!! rename .env.example to .env
# 2. start Docker Desktop in your OS
# 3. create and run containers
npm run start
# 4. check logs of server in real time
npm run logs
# check http://localhost:4000/
# 5. change head in nodejs2025Q4-service\src\app.service.ts "RSS Home Library Service 2025 Q4 🚀"
# check http://localhost:4000/ - refresh the browser page, the title has changed in real time

# 6. check tests
npm run test:clean
# 7. NPM script for vulnerabilities scanning
npm run docker:check:db
npm run docker:check:library
# 8. Auto-fix and format
npm run lint
npm run format
# 9. check network
docker network inspect nodejs2025q4-service_home-library-network  

```

```powershell
# stop application
npm run down
# start application
npm run up
```

##### 4. check logs of server in real time

```
docker-compose logs -f app
```

Expected output:

```
# ✅ Successfully connected to database
# ✅ Application is running on: http://localhost:4000
# ✅ Swagger UI: http://localhost:4000/doc
```

## 📋 Task Completion Checklist

### ✅ Basic Scope (130 points) - Containerization, Docker

| Requirement                                       | Points | Status | Implementation                               |
| ------------------------------------------------- | ------ | ------ | -------------------------------------------- |
| README.md has instruction how to run application  | +20    | ✅     | See "Quick Start"(#quick-start) section      |
| User-defined bridge is created and configured     | +30    | ✅     | `home-library-network` in docker-compose.yml |
| Container auto restart after crash                | +30    | ✅     | `restart: unless-stopped` policy             |
| Application restarting upon changes in src folder | +20    | ✅     | nodemon + volume mount `./src:/app/src`      |
| Database files and logs stored in volumes         | +30    | ✅     | `pgdata` and `postgres-logs` volumes         |

**Total Basic Scope: 130/130 ✅**

### ✅ Basic Scope (100 points) - Database & ORM

| Requirement                             | Points | Status | Implementation                                 |
| --------------------------------------- | ------ | ------ | ---------------------------------------------- |
| Users data in PostgreSQL via Prisma     | +20    | ✅     | `User` model in schema.prisma + migrations     |
| Artists data in PostgreSQL via Prisma   | +20    | ✅     | `Artist` model in schema.prisma + migrations   |
| Albums data in PostgreSQL via Prisma    | +20    | ✅     | `Album` model in schema.prisma + migrations    |
| Tracks data in PostgreSQL via Prisma    | +20    | ✅     | `Track` model in schema.prisma + migrations    |
| Favorites data in PostgreSQL via Prisma | +20    | ✅     | `Favorite` model in schema.prisma + migrations |

**Total Basic Scope: 100/100 ✅**

### ✅ Advanced Scope (130 points)

#### Containerization, Docker

| Requirement                             | Points | Status | Implementation                                                                                                                                         |
| --------------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Image size < 500 MB                     | +20    | ✅     | postgres-db: 105.6 MB , rss-home-library: 204.5 MB    [olenaweb/rss-home-library](https://hub.docker.com/r/olenaweb/rss-home-library) [olenaweb/postgres-db](https://hub.docker.com/r/olenaweb/postgres-db)                                                                                                        |
| NPM script for vulnerabilities scanning | +10    | ✅     | `npm run docker:check:db` and `npm run docker:check:library`                                                                                           |
| Image pushed to DockerHub               | +20    | ✅     | [olenaweb/postgres-db](https://hub.docker.com/r/olenaweb/postgres-db), [olenaweb/rss-home-library](https://hub.docker.com/r/olenaweb/rss-home-library) |

**Note:** \*App image includes devDependencies (nodemon, @nestjs/cli, typescript) for hot-reload functionality required by the task. 

#### Database & ORM

| Requirement                             | Points | Status | Implementation                                         |
| --------------------------------------- | ------ | ------ | ------------------------------------------------------ |
| Migrations create database entities     | +30    | ✅     | `prisma/migrations/` with `prisma migrate deploy`      |
| Connection variables in .env            | +10    | ✅     | All vars in `.env` (POSTGRES_USER, PASSWORD, DB, PORT) |
| Prisma relations between entities       | +10    | ✅     | Artist↔Album↔Track, Favorites many-to-many             |
| PostgreSQL in Docker (no local install) | +30    | ✅     | postgres:17-alpine container with healthcheck          |

**Total Advanced Scope: 130/130 ✅**

### ✅ Forfeits Check (0 penalties)

| Penalty                                                               | Points   | Status | Check                                                |
| --------------------------------------------------------------------- | -------- | ------ | ---------------------------------------------------- |
| specific image is used (ubuntu with installation of node or postgres) | -20      | ✅     | Using `postgres:17-alpine` and `node:24.11.0-alpine` |
| Postgres not configured as dependency                                 | -20      | ✅     | `depends_on` with `condition: service_healthy`       |
| Failing tests                                                         | -10 each | ✅     | All 67 tests passing                                 |
| Hardcoded variables in docker-compose.yml                             | -20      | ✅     | All variables from `.env` via `${VAR}`               |

**Total Penalties: 0 ✅**

---

**Final Score: 360/360 points**

## Commands for Run of application

#### !!! Important . First of all : Start Docker Desktop in Your OS

```powershell
docker-compose up -d --build
# server log at real time:
docker-compose logs -f app

```

### Stop

```
docker-compose down
```

### Stop with removed volumes and network. Dont do it without reason!!!

```
docker-compose down -v
```

**⚠️ IMPORTANT:** After `docker-compose down -v`, database tables are deleted! You need to apply migrations:

```powershell
# Reassembly
docker-compose up -d --build
```

then

```powershell
# Windows PowerShell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"; npx prisma migrate deploy

# Linux/Mac
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public" npx prisma migrate deploy

# Then restart application
docker-compose restart app
```

#### The tables are in:

**Where are the tables stored?**

###### Tables are stored in Docker volume pgdata

Volume is mounted to: /var/lib/postgresql/data inside the container
Contains: All tables, indexes, PostgreSQL data
**"Docker-compose down -v" removes all volumes**
**Therefore, you need to re-apply the migrations**

### Start , Restart

```powershell
# start
docker-compose up -d
# restart
docker-compose restart

```

### Development Features

#### ✅ Hot-Reload (Auto-restart on file changes)

The application automatically restarts when you modify files in the `src` folder. This is achieved through:

- **Volume mounting**: `./src` is mounted to `/app/src` in the container
- **Watch mode**: NestJS `--watch` flag monitors file changes
- Changes are detected and the app rebuilds/restarts automatically

#### ✅ Auto-restart after crash

Containers automatically restart if they crash:

- **Policy**: `restart: unless-stopped` in docker-compose.yml
- Applies to both `app` and `postgres` containers
- Containers won't restart if manually stopped with `docker-compose stop`

#### ✅ Environment Variables

All database connection variables are stored in `.env`:

- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name
- `POSTGRES_PORT` - Database port (5432)
- `DATABASE_URL` - Full connection string (auto-constructed from above variables)

**Note**: The `.env` file is git-ignored. Copy `.env.example` to `.env` and configure your values.

### PostgreSQL Logs

```powershell
# status
docker-compose ps postgres
# logs
docker-compose logs postgres
# statistics
docker stats home-library-app home-library-postgres
# restart DB
docker-compose restart postgres

```

### Container status

```
docker-compose ps

```

1. Start the app (4000 as default) : http://localhost:4000
   There is an accessible menu for viewing documentation.
2. After starting the app on port (4000 as default) you can open
   in your browser OpenAPI documentation (Swagger UI) by typing http://localhost:4000/doc/ and check work of application or press the button "Swagger UI" .

## Docker images size

###### in Docker Desktop

```
olenaweb/home-library-postgres:latest 105.6 MB
olenaweb/rss-home-library:latest      204.5 MB
```

## Testing (only after Server started!!!)

```powershell
npm run test:clean
# or
npm run clean:db  # Clears tables and preserves structure
npm test
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

## Modules

This application includes 5 main modules:

- **User** - User management with authentication
- **Artist** - Artist management
- **Album** - Album management with artist relationships
- **Track** - Track management with artist and album relationships
- **Favorites** - Favorites management for artists, albums, and tracks

#### RUN

**✅ What to check with OpenAPI/Swagger:**

1. Open in your browser: `http://localhost:4000/doc`
2. You should see Swagger UI with a "Users" and others sections
3. Try running queries directly in Swagger:
   - Click on `POST /user`
   - Click "Try it out"
   - Enter data:
     ```json
     {
       "login": "testuser",
       "password": "Password123"
     }
     ```
   - Click "Execute"
   - You will receive a response with the created user (without password!)
4. continue with others endpoints
