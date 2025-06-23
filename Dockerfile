# Stage 1: Build the Next.js application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy application files
COPY . .

# Define build arguments for environment variables
ARG DATABASE_URL
ARG NEXT_PUBLIC_APP_URL
ARG MINIO_ENDPOINT
ARG MINIO_PORT
ARG MINIO_CLIENT_ACCESS_KEY
ARG MINIO_CLIENT_SECRET_KEY
ARG MINIO_USE_SSL
ARG BUCKET_NAME
ARG REDIS_URL
ARG REDIS_PASSWORD

# Set environment variables during build time
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV MINIO_ENDPOINT=${MINIO_ENDPOINT}
ENV MINIO_PORT=${MINIO_PORT}
ENV MINIO_CLIENT_ACCESS_KEY=${MINIO_CLIENT_ACCESS_KEY}
ENV MINIO_CLIENT_SECRET_KEY=${MINIO_CLIENT_SECRET_KEY}
ENV MINIO_USE_SSL=${MINIO_USE_SSL}
ENV BUCKET_NAME=${BUCKET_NAME}
ENV REDIS_URL=${REDIS_URL}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}

# Build application
RUN yarn build

# Stage 2: Create production image
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from build stage
COPY --from=build --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nextjs:nodejs /app/yarn.lock ./yarn.lock
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/src/env.js ./src/env.js

# Define runtime environment variables
ENV NODE_ENV production
ENV PORT 3000

# Pass build-time environment variables to runtime
ARG DATABASE_URL
ARG NEXT_PUBLIC_APP_URL
ARG MINIO_ENDPOINT
ARG MINIO_PORT
ARG MINIO_CLIENT_ACCESS_KEY
ARG MINIO_CLIENT_SECRET_KEY
ARG MINIO_USE_SSL
ARG BUCKET_NAME
ARG REDIS_URL
ARG REDIS_PASSWORD

# Set environment variables for runtime
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV MINIO_ENDPOINT=${MINIO_ENDPOINT}
ENV MINIO_PORT=${MINIO_PORT}
ENV MINIO_CLIENT_ACCESS_KEY=${MINIO_CLIENT_ACCESS_KEY}
ENV MINIO_CLIENT_SECRET_KEY=${MINIO_CLIENT_SECRET_KEY}
ENV MINIO_USE_SSL=${MINIO_USE_SSL}
ENV BUCKET_NAME=${BUCKET_NAME}
ENV REDIS_URL=${REDIS_URL}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}

# Expose the port the app will run on
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Start the application
CMD ["yarn", "start"]
