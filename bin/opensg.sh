#!/usr/bin/env bash

set -x 

((!$#)) && echo No arguments supplied! && exit 1

. functions.sh

SG=$1

IP=$(curl http://checkip.amazonaws.com)/32
echo $IP of CodeBuild Instance
# Need to add an assume role call here.
cmd="aws ec2 authorize-security-group-ingress --group-id sg-9e809be6 --protocol tcp --port 443 --cidr $IP --region us-west-2"

with_role "arn:aws:iam::723670383381:role/crossaccount-cfn-role" $cmd