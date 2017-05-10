#!/usr/bin/env bash
set -eo pipefail

# More about NVM: https://github.com/creationix/nvm

# Install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

# Install the specified node.js version
nvm install v6.9.5
