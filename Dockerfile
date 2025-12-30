FROM node:22

WORKDIR app
COPY ./api/dist ./api/dist
COPY ./api/package.json package-lock.json ./api
COPY ./client/dist ./client/dist

WORKDIR api
RUN npm ci

WORKDIR /
COPY ./api/entrypoint.sh ./app/entrypoint.sh
RUN chmod +x ./app/entrypoint.sh

EXPOSE 3000

CMD ["./app/entrypoint.sh"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]