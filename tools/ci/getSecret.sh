#!/bin/bash

# Gets the secret for a given stackname

STACKNAME=$1
SECRET=$2

if [[ -z "${STACKNAME}" || -z ${SECRET} ]]; then
  echo "Usage: getSecret.sh <stack_name> <secret>"
  exit 1
fi

secret_dir="/dev/shm"
if [[ ! -d ${secret_dir} ]]; then
    secret_dir="/tmp"
fi

secret_file=$(mktemp ${secret_dir}/tmp.XXXXXXXXXX)

cwd=$(dirname $0)
. ${cwd}/functions

readonly CMK_ID="alias/iss-qbase-secrets"
readonly SECRETS_CLI_VERSION="2.3.3.0"

accountId=$(get_aws_account_id)
region=$(get_aws_region)

SECRETS_BUCKET="iss-${accountId}-${region}"

secrets get --region ${region} --secret-name ${STACKNAME}/${SECRET} --kms-cmk-id ${CMK_ID} --s3-bucket ${SECRETS_BUCKET} --output ${secret_file} > /dev/null
cat ${secret_file}

rm -f ${secret_file}
