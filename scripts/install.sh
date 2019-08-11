#!/usr/bin/env bash

sudo apt-get update \
    && sudo apt-get upgrade -y \
    && cd /home/pi \
    && echo '@/home/pi/media-controller-rasp/scripts/start.sh' >> /etc/xdg/lxsession/LXDE-pi/autostart \
    && curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - \
    && sudo apt-get install -y git nodejs \
    && git clone https://github.com/EltonFaust/media-controller-rasp.git \
    && git clone https://github.com/goodtft/LCD-show.git \
    && cd media-controller-rasp \
    && npm install \
    && cd ../ \
    && chmod -R 755 LCD-show \
    && cd LCD-show \
    && sudo ./LCD35-show 180 \
    && echo "Reboot in 10" \
    && sleep 10 \
    && reboot
