# Backend - Production Ready
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production=true

# Copy app from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app ./

# Switch to non-root user
USER nodejs

EXPOSE 3030

# Use node directly instead of yarn start for production
CMD ["node", "app.js"]
