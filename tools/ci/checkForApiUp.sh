#!/bin/bash

#grab the total amount of time we are willing ot wait for the server to come up
TOTAL_WAIT_TIME=$1
echo "Starting API health check.  Max verification time: $TOTAL_WAIT_TIME" seconds
#loop and check whether the server is up, if so, return, otherwise up the wait time and loop again
SERVER_RESPONSE=`curl -s -o /dev/null -w \"%{http_code}\" http://test.quickbase-dev.com:8080/api/api/v1/health`

i=1
while [ $i -lt $TOTAL_WAIT_TIME ] && [ "$SERVER_RESPONSE" != "\"200\"" ]; do
    echo "Sleeping $i seconds"
    sleep $i
    SERVER_RESPONSE=`curl -s -o /dev/null -w \"%{http_code}\" http://test.quickbase-dev:8080/api/api/v1/health`
    echo "Server response: $SERVER_RESPONSE"
    i=$(($i * 2))
done

if [ "$SERVER_RESPONSE" != "\"200\"" ]; then
    echo "API health check failed...aborting."

    PID=$(ps -ef | grep org.apache.catalina.startup.Bootstrap | grep -v grep | awk '{ print $2 }')

    if [[ -n "$PID" ]]; then
        echo "Found Tomcat.  Forcefully shutting down."
        kill -9 $PID
    else
        echo "Cant find a Tomcat instance to shutdown.  Check out the Cargo configuration in the gradle script."
    fi

    exit 1;
else
    echo "API health check successfull."
fi

exit 0

