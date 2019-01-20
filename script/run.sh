#!/usr/bin/env bash

npx npm-preinstall --monorepo

docker stop $(docker ps -q) > /dev/null $2>/dev/null
docker-compose -f compose.yml up
