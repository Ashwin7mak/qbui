#!/bin/sh

export http_proxy=http://qypprdproxy02.ie.intuit.net:80
export no_proxy='.intuit.net, .intuit.com, 10.*.*.*, localhost, 127.0.0.1'

BUCKET=s3://quickbase-preprod-software

cd /app/jenkins/workspace/ui_development/
FILES=$(find -name 'ui-phoenix*.zip')
S3=/app/jenkins/s3cmd-1.5.0-rc1/s3cmd

echo $BUILD_NUMBER > /tmp/ui.latest.version

$S3 put /tmp/ui.latest.version $BUCKET/rpms/

for file in $FILES; do
	component=$(echo $file | awk -F'/' '{ print $2 }')
	$S3 put $file $BUCKET/rpms/ui/
done