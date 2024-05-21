FROM node:22-alpine as builder

RUN apk add doas; \
    adduser -D nestapi -G wheel; \
    echo 'nestapi:123' | chpasswd; \
    echo 'permit :wheel as root' > /etc/doas.d/doas.conf

# RUN adduser -D nestapi
USER nestapi
WORKDIR /home/nestapi

ENV NODE_ENV build
COPY ./* ./
RUN npm i

# COPY --chown=nestapi:nestapi . .
RUN npm run build && npm prune --omit=dev

# ---

FROM node:22-alpine

LABEL name="Nestjs REST API"

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

RUN adduser -D nestapi
USER nestapi
WORKDIR /home/nestapi

COPY --from=builder --chown=nestapi:nestapi /home/node/package*.json ./
COPY --from=builder --chown=nestapi:nestapi /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=nestapi:nestapi /home/node/dist/ ./dist/

# Healthcheck to ensure the application is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:${PORT}/health || exit 1


CMD ["pm2-runtime", "dist/main.js"]