# Stage 1: Dependencies
FROM node:24.11.0-alpine AS dependencies

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Installing production dependencies
COPY package*.json ./
COPY prisma ./prisma/

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"
RUN npm ci --omit=dev --legacy-peer-deps && \
    npx prisma generate

# Stage 2: Build
FROM node:24.11.0-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package.json and install all dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Installing ALL dependencies for build
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"
RUN npm ci --legacy-peer-deps && \
    npx prisma generate

# Copy source files and build the project
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:24.11.0-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package.json first
COPY --from=builder /app/package*.json ./

# Copy production dependencies from the first stage
COPY --from=dependencies /app/node_modules ./node_modules

# Install dev dependencies for watch mode in development
RUN npm install --legacy-peer-deps

# Copy built code from the second stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Copy source code and config files for development hot-reload
COPY --from=builder /app/src ./src
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/nodemon.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.build.json ./

# Expose port
EXPOSE 4000

# Container health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application with migrations
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
