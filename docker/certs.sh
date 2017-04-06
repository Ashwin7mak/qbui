#!/bin/sh
set -e
set -o pipefail

mkdir -p /dev/shm/secrets
chmod 750 /dev/shm/secrets
openssl req -batch -nodes -new -x509 \
-keyout /dev/shm/secrets/nodejs.key \
-out /dev/shm/secrets/nodejs.crt \
-subj "/C=US/ST=MA/L=Cambridge/O=Intuit/OU=QuickBase/CN=*.coreui.newstack.quickbaserocks.com"
chmod 640 /dev/shm/secrets/nodejs.key