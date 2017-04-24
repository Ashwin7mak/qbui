#!/usr/bin/env bash

((!$#)) && echo No arguments supplied! && exit 1
. functions.sh
SG=$1
IP=$(curl http://checkip.amazonaws.com)/32
echo $IP of CodeBuild Instance
cmd="aws ec2 revoke-security-group-ingress --group-id sg-9e809be6 --protocol tcp --port 443 --cidr $IP --region us-west-2"
with_role "arn:aws:iam::723670383381:role/crossaccount-cfn-role" $cmd