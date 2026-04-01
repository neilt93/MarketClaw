FROM node:20-slim AS base
RUN npm install -g pnpm@9

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/mcp-server/package.json ./apps/mcp-server/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/mcp-server/node_modules ./apps/mcp-server/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
RUN pnpm --filter @declutter/shared build
RUN pnpm --filter @declutter/mcp-server build

FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/apps/mcp-server/dist ./dist
COPY --from=builder /app/apps/mcp-server/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./node_modules/@declutter/shared/dist
COPY --from=builder /app/packages/shared/package.json ./node_modules/@declutter/shared/package.json

EXPOSE 3001
ENV PORT=3001
CMD ["node", "dist/http.js"]
