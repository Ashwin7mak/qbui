#!/bin/bash

cwd=$(dirname $0)
. ${cwd}/functions

TAG_VALUE=$1

if [[ -z "${TAG_VALUE}" ]]; then
  echo "Usage: rdsFindByTag.sh <tag_value>"
  exit 1
fi

accountId=$(get_aws_account_id)
region=$(get_aws_region)

for rdsInstance in $(aws rds describe-db-instances --region us-west-2 --query DBInstances[].DBInstanceIdentifier --output text); do
    resourceArn="arn:aws:rds:us-west-2:${accountId}:db:${rdsInstance}"
    if [[ -n $(aws rds list-tags-for-resource --region ${region} --resource-name ${resourceArn} --query "TagList[?Key=='QBTest'][] | [?Value=='${TAG_VALUE}'].{Value: Value}" --output text) ]]; then
        echo ${rdsInstance}
        break;
    fi
done
