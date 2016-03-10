#!/bin/bash

cwd=$(dirname $0)
. ${cwd}/functions

RDS_INSTANCE=$1
KEY_NAME=$2

if [[ -z "${RDS_INSTANCE}" || -z ${KEY_NAME} ]]; then
  echo "Usage: rdsGetTagValue.sh <rds_instance> <key_name>"
  exit 1
fi

accountId=$(get_aws_account_id)
region=$(get_aws_region)
resourceArn="arn:aws:rds:us-west-2:${accountId}:db:${RDS_INSTANCE}"

aws rds list-tags-for-resource --region ${region} --resource-name ${resourceArn} --query "TagList[?Key=='${KEY_NAME}'].{Value: Value}" --output text
