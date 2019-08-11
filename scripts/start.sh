#!/usr/bin/env bash

cd "$(dirname "$0")/../"

# https://www.christianengvall.se/check-for-changes-on-remote-origin-git-repository/

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" != "master" ]
then
    echo -e Not on master. Aborting.
    exit 0
fi

git fetch

HEADHASH=$(git rev-parse HEAD)
UPSTREAMHASH=$(git rev-parse master@{upstream})

if [ "$HEADHASH" != "$UPSTREAMHASH" ]
then
    DIFFFILES=$(git diff --name-status master origin/master)

    git pull origin master

    if [[ $DIFFFILES == *"package.json"* ]]; then
        npm i
    fi
fi

npm run start
sleep 5
shutdown -t now
