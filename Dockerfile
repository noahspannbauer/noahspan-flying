FROM --platform=linux/amd64 node:18-alpine AS base

FROM base AS api
COPY ./api/dist ./api/dist
COPY ./api/node_modules ./api/node_modules
EXPOSE 3000
CMD ["node", "/api/dist/main.js"]
# CMD ["tail", "-f", "/dev/null"] 

FROM base AS app
ARG VITE_API_URL
ARG VITE_CLIENT_ID
ARG VITE_TENANT_ID
ARG VITE_REDIRECT_URL
RUN npm i -g serve
COPY ./app/dist ./app/dist
EXPOSE 8080
CMD [ "serve", "-s", "app/dist", "-p", "8080" ]