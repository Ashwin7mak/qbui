#!/bin/bash

#grab the total amount of time we are willing ot wait for the server to come up
TOTAL_WAIT_TIME=$1
#loop and check whether the server is up, if so, return, otherwise up the wait time and loop again
SERVER_RESPONSE=`curl -s -o /dev/null -w \"%{http_code}\" http://localhost:8080/api/api/v1/health`

i=1
while [ $i -lt $TOTAL_WAIT_TIME ] && [ "$SERVER_RESPONSE" != "\"200\"" ]; do
    i=$(($i * 2))
    echo "Sleeping $i seconds"
    sleep $i
    SERVER_RESPONSE=`curl -s -o /dev/null -w \"%{http_code}\" http://localhost:8080/api/api/v1/health`
done

if [ "$SERVER_RESPONSE" != "\"200\"" ]; then
    echo "Waited a long time. That server is not coming up..."
    exit 1;
fi

exit 0

