ARG SENTRY_DSN=""

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN [ -n "$SENTRY_DSN" ] && sed -i "s|sentryDsn: ''|sentryDsn: '${SENTRY_DSN}'|" src/environments/environment.prod.ts || true
RUN pnpm frontend:build

FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/kusiqumir_page/server/server.mjs"]
