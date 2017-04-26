# Docker for Local Development

## All files in this directory are used by the parent project's Dockerfile

## Install Prerequisites
* [Install and configure the AWS CLI tools for your laptop](https://github.com/QuickBase/aws#getting-an-mfa-enabled-aws-account)
* [Install the Docker for Mac stable channel release](https://docs.docker.com/docker-for-mac/install/)
* __OPTIONAL__: For GUI to view available images and running containers, [install Kitematic](https://github.com/docker/kitematic/releases) from the zip listed here under releases

## Local Stack Lifecycle
    NOTE: the commands below assume the ui dist directory is already populated
* Log into ECR: ```eval $(aws ecr get-login --registry-ids 717266932182)``` . This only needs to be done once a day in most cases.
* .env file manages name of Compose project (currently: ui)
* Refer to ```docker-compose.override.yml.sample``` to further explore local overrides to the default Compose environment
* Build the UI image, deploy a container based on that image and also run it: ```docker-compose up -d --build```
* Stop and delete running containers for service: ```docker-compose down```

## Service
* The health check for the UI should be reachable at ```https://localhost:9447/api/v1/health``` based on the default port assignment in the Compose YAML file.
* The UI in this deployment can be referred to as 'service' and by container name as 'ui_service_1'. For example: ```docker inspect ui_service_1``` will display information about the deployed service container.

## Logs
* Run ```docker-compose logs service``` to obtain the logs emitted by the UI container on startup
* Run ```docker-compose logs --tail=all -f service``` to tail all of the UI logs live
* Run ```tail -f /tmp/log/docker/ui/service/ui*``` locally to tail the UI logs from the container, as well

## Execute Commands
* Run ```docker-compose exec service ${command}``` (where ${command} is any command) to execute a command inside the service container
** Example: ```docker exec -it core_service_1 /bin/ash``` to open an ash shell inside the core container.