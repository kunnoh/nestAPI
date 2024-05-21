FROM node:22-alpine as builder

ENV NODE_ENV build

USER nestapi
WORKDIR /home/node

COPY package*.json ./
RUN npm i

COPY --chown=nestapi:nestapi . .
RUN npm run build \
    && npm prune --omit=dev

# ---

FROM node:22-alpine

ENV NODE_ENV production

# Define build arguments
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_DB
ARG DB_PASSWORD
ARG PORT

# Set environment variables
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USER=$DB_USER
ENV DB_DB=$DB_DB
ENV DB_PASSWORD=$DB_PASSWORD
ENV PORT=$PORT

USER nestapi
WORKDIR /home/node

COPY --from=builder --chown=nestapi:nestapi /home/node/package*.json ./
COPY --from=builder --chown=nestapi:nestapi /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=nestapi:nestapi /home/node/dist/ ./dist/

# Healthcheck to ensure the application is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:${PORT}/health || exit 1


CMD ["node", "dist/main.js"]