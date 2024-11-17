# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:4-node18-appservice
# FROM mcr.microsoft.com/azure-functions/node:4-node18

# ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
#     AzureFunctionsJobHost__Logging__Console__IsEnabled=true

# COPY . /home/site/wwwroot

# RUN cd /home/site/wwwroot && \
#     npm install

# EXPOSE 7071

# CMD ["npm", "run", "start:azure"]



# FROM mcr.microsoft.com/azure-functions/node:4-node18 AS build

# WORKDIR /home/site/wwwroot

# COPY . .

# RUN npm install && \
#     npm run build

FROM mcr.microsoft.com/azure-functions/node:4-node18

WORKDIR /home/site/wwwroot

COPY . .

RUN npm install -g azure-functions-core-tools@4 --unsafe-perm true
RUN npm install

# ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
#     AzureFunctionsJobHost__Logging__Console__IsEnabled=true
    # AzureFunctionsJobHost__extensions__cors__allowedOrigins="[\"*\"]" \
    # AzureFunctionsJobHost__extensions__cors__supportCredentials=false


# COPY --from=build /home/site/wwwroot/node_modules /home/site/wwwroot/node_modules
# COPY --from=build /home/site/wwwroot/dist /home/site/wwwroot/dist

# EXPOSE 3000

# CMD ["node", "/home/site/wwwroot/dist/src/main.js"]

CMD ["npm", "run", "start:azure"]