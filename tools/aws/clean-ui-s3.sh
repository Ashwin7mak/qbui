#!/bin/sh

export http_proxy=http://qypprdproxy02.ie.intuit.net:80
export no_proxy='.intuit.net, .intuit.com, 10.*.*.*, localhost, 127.0.0.1'

# Number of builds difference between current and prior we want to keep 5 builds around the value would be 5
NUM_OF_BUILDS_TO_KEEP=5

cd /app/jenkins/workspace/ui_development/
S3=/app/jenkins/s3cmd-1.5.0-rc1/s3cmd
SERVICES="ui"
for service in $SERVICES; do
	for line in $($S3 ls s3://quickbase-preprod-software/rpms/$service/ | grep '\.zip'); do
		file=$(echo $line | grep '\.zip')
		if [[ ! -z "$file" ]]; then
			id=$(echo $file | awk -F'.' '{ print $2 }' | awk -F'-' '{ print $2 }')
			diff=$(($BUILD_NUMBER-$id))
			if (( $diff > $NUM_OF_BUILDS_TO_KEEP )); then
				echo "Removing S3 artifact: $file"
				$S3 rm $file
			fi
		fi
	done
done