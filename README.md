To clone this repo use:

* `git clone -b master ssh://git@github.com/quickbase/qbui.git`

or

* `git clone -b master https://github.com/QuickBase/qbui.git`


For developer instructions to setup and run see <https://github.com/QuickBase/qbui/blob/master/ui/README.md#instructions-to-run-for-development> for details

For running locally make sure you copy

 `qbui/ui/server/src/config/environment/local.js.sample`

 to

 `qbui/ui/server/src/config/environment/local.js`

### Run a CoreUI Stack in AWS
Development environments only.  Please also delete using the instructions below (to clean up the SSL cert).
To bring up stack (each new line is a new command to type):
```
. /<Local Path to AWS repo>/aws/bin/functions
export STACKNAME=<Pick a short stack name>-dev-coreui
export SSL_CN=*.${STACKNAME}.newstack.quickbaserocks.com
export AMI=<Pick an AMI ID> OR USE LATEST $(aws ec2 describe-images --owners self --filters "Name=name,Values=centos-7.2-coreui.v* (Encrypted)" --query "sort_by(Images[], &CreationDate) | [-1].ImageId" --output text)
create_iam_server_cert ${STACKNAME} ${SSL_CN}
aws cloudformation create-stack --stack-name ${STACKNAME} --template-body file://deploy/coreui.json --parameters \
  ParameterKey=paramEC2ImageAMI,ParameterValue=${AMI} \
  ParameterKey=paramEnvironment,ParameterValue=dev \
  --capabilities CAPABILITY_IAM
```

To delete stack (each new line is a new command to type):
```
. /<Local Path to AWS repo>/aws/bin/functions
export STACKNAME=<Previous stack name from above>-dev-coreui
aws cloudformation delete-stack --stack-name ${STACKNAME}
aws cloudformation wait stack-delete-complete --stack-name ${STACKNAME}
sleep 10
delete_iam_server_cert ${STACKNAME}
```