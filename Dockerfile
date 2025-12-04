# Stage 1: Dependencies
FROM node:24.11.0-alpine AS dependencies

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Устанавливаем production зависимости
COPY package*.json ./
COPY prisma ./prisma/

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"
RUN npm ci --omit=dev --legacy-peer-deps && \
    npx prisma generate

# Stage 2: Build
FROM node:24.11.0-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Копируем package.json
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем ВСЕ зависимости для сборки
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"
RUN npm ci --legacy-peer-deps && \
    npx prisma generate

# Копируем исходники и собираем
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:24.11.0-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Копируем production зависимости из первого стейджа
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package*.json ./

# Копируем собранный код из второго стейджа
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose порт
EXPOSE 4000

# Здоровье контейнера
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Запуск приложения с миграциями
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
