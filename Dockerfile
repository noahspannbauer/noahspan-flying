# FROM --platform=linux/amd64 node:18-alpine AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable

# FROM base AS api
# COPY /api/dist /app/dist
# COPY /api/node_modules /app/node_modules
# WORKDIR /app
# EXPOSE 3000
# # CMD ["node", "dist/main.js"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]

# FROM base AS app
# COPY /app/dist /app/dist
# WORKDIR /app
# RUN npm i -g serve
# EXPOSE 8080
# CMD [ "serve", "-s", "/dist", "-p", "8080" ]





FROM node:22-slim AS base

FROM base AS migrate
WORKDIR migrations
COPY ./migrations .
RUN npm i -g pnpm
RUN pnpm install

FROM base AS api
WORKDIR api
COPY ./.prod/api .
EXPOSE 3000
CMD ["node", "dist/main.js"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]

FROM base AS app
WORKDIR /app
COPY ./.prod/app .
RUN npm i -g serve
EXPOSE 8080
CMD [ "serve", "-s", "dist", "-p", "8080" ]