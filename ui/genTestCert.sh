#!/bin/bash

# For testing of ssl use this to generate the private and key files to use in tests
# usage ./genTestCert.sh localhost
domain=$1
cd server/config/environment/keys
openssl req -newkey rsa:2048 -new -nodes -keyout private.pem -out csr.pem \
  -subj "/O=$domain/CN=*.$domain/subjectAltName=DNS:*.$domain/"
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout private.pem -out cert.pem \
  -subj "/O=$domain/CN=*.$domain/subjectAltName=DNS:*.$domain/"
