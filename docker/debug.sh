#!/bin/sh
set -e

# Install nodemon. Explained at: https://medium.com/sensei-developer-blog/remote-debugging-node-js-in-docker-1936eb4ef522
npm install -g nodemon

# Cert creation for SSL still needs to run
/usr/local/bin/certs.sh

# Start with debugging enabled and nodemon watcher
nodemon --debug /usr/src/app/server/src/app.js