#!/usr/bin/env bash
# see more about nvm: https://github.com/creationix/nvm
# added bonus: gives you the opportunity to switch node versions
set -x

# install nvm
curl https://raw.github.com/creationix/nvm/master/install.sh | sh
 
cat ~/.bashrc
cat ~/.profile 

export NVM_DIR="~/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
 
# install a node.js version, edit the version you want to use
nvm install v6.9.5
