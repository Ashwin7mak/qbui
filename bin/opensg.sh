#!/usr/bin/env bash

# Don't exit on fail for now (as the aws command might fail if the IP already exists, which is OK)
# set -eo pipefail

((!$#)) && echo No arguments supplied! && exit 1

pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd`
popd > /dev/null
. ${SCRIPTPATH}/functions.sh

SG=$1
IP=$(curl http://checkip.amazonaws.com)/32
echo $IP is the IP of the CodeBuild Instance

cmd="aws ec2 authorize-security-group-ingress --group-id ${1} --protocol tcp --port 443 --cidr $IP --region us-west-2"
with_role "arn:aws:iam::723670383381:role/CodePipelineCrossAccountRole-us-west-2" $cmd
