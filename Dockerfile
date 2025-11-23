FROM --platform=linux/amd64 node:22-slim

WORKDIR app
COPY ./api/dist ./api/dist
COPY ./api/package.json package-lock.json ./api
COPY ./client/dist ./client/dist

WORKDIR api
RUN npm ci

WORKDIR /
COPY ./api/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]