#!/bin/sh -x
NUM_OF_BUILDS_TO_KEEP=5
BUCKET=s3://${S3_BUCKET:="quickbase-preprod-software"}
SERVICES="ui"
for service in $SERVICES; do
    aws s3 ls $BUCKET/rpms/$service/ | while read -r line; do
        file=$(echo $line | awk '{print $4}')
        if [[ ! -z "$file" ]]; then
            id=$(echo $file | awk 'match($0, /ui-phoenix_[0-9]+\.[0-9]+-([0-9]+)\.zip/, m) { print m[1] }')
            diff=$(($BUILD_NUMBER-$id))
            if (( $diff > $NUM_OF_BUILDS_TO_KEEP )); then
                echo "Removing S3 artifact: $file"
                aws s3 rm $BUCKET/rpms/$service/$file
            fi
        fi
    done
done
