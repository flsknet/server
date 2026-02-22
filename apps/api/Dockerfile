FROM node:22-alpine AS base

RUN corepack enable

WORKDIR /app

FROM base AS prepare

COPY . .

RUN pnpm dlx turbo prune @flsk/api --docker

FROM base AS builder

COPY --from=prepare /app/out/json .

RUN pnpm install --frozen-lockfile 

COPY --from=prepare /app/out/full .

RUN pnpm turbo build

FROM base AS runner

COPY --from=prepare /app/out/json .

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/migrations ./packages/database/migrations

EXPOSE 3000

CMD ["pnpm", "--filter", "@flsk/api", "start"]