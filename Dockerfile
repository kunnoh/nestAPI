# Build stage
FROM node:22-alpine AS build-stage

WORKDIR /app
ENV NODE_ENV build

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Run tests
RUN npm test

# Build the application
RUN npm run build && npm prune --omit=dev

# Intermediate stage to create user and group
FROM debian:stable-slim AS intermediate-stage

RUN groupadd --system --gid 1001 appuser && \
    useradd --system --uid 1001 --gid appuser appuser

# Final release stage
FROM gcr.io/distroless/nodejs18-debian12 AS build-release-stage

ENV NODE_ENV production
WORKDIR /app

# Copy the built application and node_modules from the build stage
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/node_modules /app/node_modules

# Copy user and group information
COPY --from=intermediate-stage /etc/passwd /etc/passwd
COPY --from=intermediate-stage /etc/group /etc/group

USER appuser:appuser

EXPOSE 3000

CMD ["dist/main.js"]
