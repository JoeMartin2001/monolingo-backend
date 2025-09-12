# ─── Stage 1: Build ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN yarn install --frozen-lockfile

# Copy source and build the app
COPY . .
RUN npm run build

# ─── Stage 2: Runtime ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copy only necessary files from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Expose the app port (use env later for flexibility)
EXPOSE 3000

# Default command
CMD ["node", "dist/main.js"]
