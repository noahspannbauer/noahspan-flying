#!/bin/bash
npx typeorm migration:run -d ./app/api/dist/database/data-source.js
node ./app/api/dist/main.js