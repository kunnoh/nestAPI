FROM node:22-alpine as builder

WORKDIR /nestapi-dev

ENV NODE_ENV build
COPY ./* ./
RUN npm ci

RUN npm run build && npm prune --omit=dev

# ---

FROM node:22-alpine

LABEL name="Nestjs REST API"
LABEL maintainer="Kunnoh"

# Add a non-root user and install doas for privilege escalation
RUN apk add --no-cache doas && \
    adduser -D nestapi -G wheel && \
    echo 'permit :wheel as root' > /etc/doas.d/doas.conf && \
    rm -rf /var/cache/apk/*
# RUN adduser -D nestapi

ENV NODE_ENV production

USER nestapi
WORKDIR /nestapi


# Copy built app files from the builder stage
COPY --from=builder --chown=nestapi:nestapi /nestapi-dev/dist ./dist
COPY --from=builder --chown=nestapi:nestapi /nestapi-dev/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Healthcheck to ensure the application is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:${PORT}/health || exit 1


CMD ["node", "dist/main.js"]