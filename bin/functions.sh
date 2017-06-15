#!/usr/bin/env bash

# Execute a command using a role ARN
function with_role() {
  local role_arn="$1"
  local cmd="${@:2}"
  local CREDS=($(aws sts assume-role --role-arn ${role_arn} --role-session-name test --query Credentials.[AccessKeyId,SecretAccessKey,SessionToken] --output text))
  # Temporarily disable "-x" (if set) so we don't leak the AWS keys
  local save=$(set +o | grep xtrace)
  set +x
  env AWS_ACCESS_KEY_ID=${CREDS[0]} AWS_SECRET_ACCESS_KEY=${CREDS[1]} AWS_SESSION_TOKEN=${CREDS[2]} $cmd
  eval "$save" 2> /dev/null
}
