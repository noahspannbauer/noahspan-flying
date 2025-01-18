FROM --platform=linux/amd64 node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS install
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=app --prod /prod/app

FROM base AS api
COPY --from=install /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 3000
CMD ["node", "dist/main.js"]

FROM base AS app
ARG VITE_API_URL
ARG VITE_CLIENT_ID
ARG VITE_TENANT_ID
ARG VITE_REDIRECT_URL
RUN npm i -g serve
COPY --from=install /prod/app /prod/app
WORKDIR /prod/app
EXPOSE 8080
CMD [ "serve", "-s", "dist", "-p", "8080" ]