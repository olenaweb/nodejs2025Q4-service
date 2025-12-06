# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

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
# 1. rename .env.example to .env
# 2. start Docker Desktop in your OS
# 3. create and run containers
npm run start
# 4. see logs of server in real time
npm run logs
# check http://localhost:4000/
# change head in nodejs2025Q4-service\src\app.service.ts "RSS Home Library Service 2025 Q4 🚀"
# check http://localhost:4000/ - refresh the browser page, the title has changed in real time

# check tests
npm run test:clean

```

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

Where are the tables stored?

###### Tables are stored in Docker volume pgdata

Volume is mounted to: /var/lib/postgresql/data inside the container
Contains: All tables, indexes, PostgreSQL data
Docker-compose down -v removes all volumes
Therefore, you need to re-apply the migrations

### Start , Restart

```powershell
# start
docker-compose up -d
# restart
docker-compose restart

```

### Development Features

#### 🔄 Hot-Reload (Auto-restart on file changes)

The application automatically restarts when you modify files in the `src` folder. This is achieved through:

- **Volume mounting**: `./src` is mounted to `/app/src` in the container
- **Watch mode**: NestJS `--watch` flag monitors file changes
- Changes are detected and the app rebuilds/restarts automatically

#### 🔁 Auto-restart after crash

Containers automatically restart if they crash:

- **Policy**: `restart: unless-stopped` in docker-compose.yml
- Applies to both `app` and `postgres` containers
- Containers won't restart if manually stopped with `docker-compose stop`

#### 🔐 Environment Variables

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

```powershel
docker images
# olenaweb/postgres-db:latest            bdca0ec26ac6        398MB          111MB    U
# olenaweb/rss-home-library:latest       4e7dba8de754        387MB         84.2MB    U
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
