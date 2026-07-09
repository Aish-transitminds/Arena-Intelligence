# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package configurations
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies for compiling TS/Vite)
RUN npm ci

# Copy all source files
COPY . .

# Set Nitro preset to build a standalone Node.js server
ENV NITRO_PRESET=node-server
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine AS runner
WORKDIR /app

# Set runtime configuration
ENV PORT=8080
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Copy the compiled output folder from builder stage
COPY --from=builder /app/.output ./.output

# Expose port 8080 for Google Cloud Run
EXPOSE 8080

# Start the Nitro node server
CMD ["node", ".output/server/index.mjs"]
