FROM node:22-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --omit=dev

# ---

FROM node:22-alpine

ENV NODE_ENV production
ENV DB_HOST=172.17.0.2
ENV DB_PORT=5432
ENV DB_USER=sapientuser
ENV DB_DB=sapientdb
ENV DB_PASSWORD=Fwe42r3t4@@R23q
ENV PORT=7066

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/main.js"]