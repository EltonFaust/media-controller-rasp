#!/usr/bin/env bash

cd /home/pi/media-controller-rasp \
    && git pull origin master \
    && npm i \
    && npm run start
