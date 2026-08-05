# Multi-stage isn't needed here (no build step) — this is a plain Node runtime.
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
