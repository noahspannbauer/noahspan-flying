FROM --platform=linux/amd64 node:18-alpine

COPY ./node_modules ./node_modules
COPY ./dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]