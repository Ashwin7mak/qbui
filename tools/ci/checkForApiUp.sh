#!/bin/bash

#loop and check whether the server is up, if so, return, otherwise up the wait time and loop again
SERVER_RESPONSE=`curl 'http://localhost:8080/api/api/v1/health'`
i=1
while [ $i -lt 30 ] && [ -z "$SERVER_RESPONSE" ]; do
    i=$(($i * 2))
    echo "Sleeping $i seconds"
    sleep $i
    SERVER_RESPONSE=`curl 'http://localhost:8080/api/api/v1/health'`
done

if [ -z "$SERVER_RESPONSE" ]; then
    echo "Waited a long time. That server is not coming up..."
    exit 1;
fi

exit 0

