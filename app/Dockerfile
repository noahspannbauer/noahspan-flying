ARG VITE_API_URL
ARG VITE_CLIENT_ID
ARG VITE_TENANT_ID
ARG VITE_REDIRECT_URL

FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

COPY ./dist ./dist

ENV NODE_ENV=production

RUN npm i -g serve

EXPOSE 8080

CMD [ "serve", "-s", "dist", "-p", "8080" ]