FROM --platform=linux/amd64 node:18-alpine AS base

FROM base AS api
COPY ./api/dist ./api/dist
COPY ./api/node_modules ./api/node_modules
EXPOSE 3000
CMD ["node", "/api/dist/main.js"]

FROM base AS app
RUN npm i -g serve
WORKDIR ./app
# COPY ./app/dist ./app/dist
COPY ./app ./app
EXPOSE 8080
# CMD [ "serve", "-s", "app/dist", "-p", "8080" ]
CMD ["npm", "run", "dev"]