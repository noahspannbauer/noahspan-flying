FROM node:22

WORKDIR app
COPY ./api/dist ./api/dist
COPY ./api/package.json package-lock.json ./api
COPY ./client/dist ./client/dist

WORKDIR api
RUN npm ci

WORKDIR /

EXPOSE 3000

CMD ["node", "./app/api/dist/main.js"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]