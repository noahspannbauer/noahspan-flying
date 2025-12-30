#!/bin/bash
cd ./app
npx typeorm migration:run -d ./api/dist/database/data-source.js
node ./api/dist/main.js