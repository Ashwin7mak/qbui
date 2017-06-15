# To directly build an image from this Dockerfile, run 'docker build -t quickbase/coreui .' from the root project directory
FROM library/node:6.9.5-alpine

# Install OpenSSL to generate key and cert for SSL
RUN apk add --no-cache openssl

# Add SSL config script to image and make it executable
COPY docker/certs.sh /usr/local/bin/certs.sh
RUN chmod +x /usr/local/bin/certs.sh

# Expects that the code has already been built at 'dist'
# Copy dist code only into image
RUN mkdir -p /usr/src/app
COPY ui/dist/ /usr/src/app
WORKDIR /usr/src/app

# Create the secrets directory, update ownership, create a key and self-signed cert
# Start Node. All a one-liner to make use of /dev/shm for now for secrets
CMD /usr/local/bin/certs.sh && node server/src/app.js
