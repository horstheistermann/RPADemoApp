#!/bin/bash

export NVM_DIR=/root/.nvm
source $NVM_DIR/nvm.sh
cd /app/http-server
#yarn start --host=0.0.0.0 --no-inline --no-hot --no-live-reload --no-static-watch
#yarn start --host=0.0.0.0 --server-type https
node server.js