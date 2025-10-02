#!/bin/bash
npx typeorm migration:run -d ./dist/config/typeorm-cli.config.js
node ./dist/main.js