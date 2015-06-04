#!/bin/sh -x
BUCKET=s3://${S3_BUCKET:="quickbase-preprod-software"}
cd ${WORKSPACE}

FILES=$(find -name 'ui-phoenix*.zip')

echo $BUILD_NUMBER > /tmp/ui.latest.version
aws s3 cp /tmp/ui.latest.version $BUCKET/rpms/
rm -f /tmp/ui.latest.version

for file in $FILES; do
    aws s3 cp $file $BUCKET/rpms/ui/
done
