#!/usr/bin/env bash

npx npm-preinstall --monorepo

docker stop $(docker ps -aq) > /dev/null
docker-compose -f compose.yml up
