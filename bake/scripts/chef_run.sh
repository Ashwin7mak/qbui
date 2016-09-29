#!/bin/bash -xe
set -o pipefail

CHEF_REPO=/var/packer/coreui/chef

cd ${CHEF_REPO}

if [[ -e "${CHEF_REPO}/service/overrides.json" ]];
    then
        sudo -E chef-client -z -o "role[coreui]" -j "${CHEF_REPO}/service/overrides.json"
    else
        sudo -E chef-client -z -o "role[coreui]"
fi
sudo rm -rf "${CHEF_REPO}/nodes"
sudo rm -rf /root/.chef