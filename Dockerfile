# Production image: builds the site and runs the Node server.
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG SITE_URL=https://www.thebrandmediamarketing.com
ARG ALLOWED_HOSTS=
ENV SITE_URL=$SITE_URL ALLOWED_HOSTS=$ALLOWED_HOSTS
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev && mkdir -p data/leads && chown -R node:node /app
USER node
EXPOSE 4321
HEALTHCHECK CMD wget -qO- http://127.0.0.1:4321/ >/dev/null || exit 1
CMD ["node", "./dist/server/entry.mjs"]
