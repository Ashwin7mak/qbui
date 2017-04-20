#!/usr/bin/env bash
set -x

# More about NVM: https://github.com/creationix/nvm
# Install nvm
curl https://raw.github.com/creationix/nvm/master/install.sh | sh
cat ~/.bashrc
cat ~/.profile 
export NVM_DIR="~/.nvm"

# This loads NVM
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
 
# Install the specified node.js version
nvm install v6.9.5
