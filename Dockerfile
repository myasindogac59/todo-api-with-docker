# Stage 1 Builder
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY src/ ./src/

# Stage 2 Production
FROM node:18-alpine AS production

# Güvenlik için non-root kullanıcı oluştur
RUN addgroup -g 1001 nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

COPY --from=builder /app/src ./src
USER nodeuser
CMD ["node", "src/index.js"]
