FROM node:22-alpine AS base

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

FROM base AS builder

RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm build

FROM base AS runner

RUN pnpm i --prod --frozen-lockfile 

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start"]