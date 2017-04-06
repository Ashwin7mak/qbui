# To directly build an image from this Dockerfile, run 'docker build -t quickbase/ui .' from the root project directory
FROM library/node:6.9.5-alpine

RUN apk add --no-cache openssl

ADD docker/certs.sh /usr/local/bin/certs.sh
RUN chmod +x /usr/local/bin/certs.sh

# Create the secrets directory, update ownership, create a key and self-signed cert
# Start Node. All a one-liner to make use of /dev/shm for now for secrets
CMD /usr/local/bin/certs.sh && tail -f /dev/null