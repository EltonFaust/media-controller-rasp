#!/usr/bin/env bash

sudo apt-get update \
    && sudo apt-get upgrade \
    && curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - \
    && sudo apt-get install -y git nodejs \
    && git clone https://github.com/EltonFaust/media-controller-rasp.git \
    && git clone https://github.com/goodtft/LCD-show.git \
    && cd media-controller-rasp \
    && npm install \
    && npm run build \
    && cd ../ \
    && chmod -R 755 LCD-show \
    && cd LCD-show \
    && sudo ./LCD35-show
