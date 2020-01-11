#!/usr/bin/env bash

sudo apt-get update \
    && sudo apt-get upgrade -y \
    && curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - \
    && sudo apt-get install -y git nodejs apt-transport-https exfat-fuse exfat-utils \
    && wget -O - https://dev2day.de/pms/dev2day-pms.gpg.key | sudo apt-key add - \
    && echo "deb https://dev2day.de/pms/ stretch main" | sudo tee /etc/apt/sources.list.d/pms.list \
    && sudo apt-get update \
    && sudo apt-get install -t stretch plexmediaserver-installer \
    && if [ -f /etc/default/plexmediaserver ]; then sudo sed -i 's/PLEX_MEDIA_SERVER_USER\=plex/PLEX_MEDIA_SERVER_USER\=pi/g' /etc/default/plexmediaserver; fi \
    && if [ -f /etc/default/plexmediaserver.prev ]; then sudo sed -i 's/PLEX_MEDIA_SERVER_USER\=plex/PLEX_MEDIA_SERVER_USER\=pi/g' /etc/default/plexmediaserver.prev; fi \
    && cd /home/pi \
    && echo '@/home/pi/media-controller-rasp/scripts/start.sh' >> /etc/xdg/lxsession/LXDE-pi/autostart \
    && git clone https://github.com/EltonFaust/media-controller-rasp.git \
    && git clone https://github.com/goodtft/LCD-show.git \
    && chmod -R 755 LCD-show \
    && cd media-controller-rasp \
    && npm ci \
    && cd ../LCD-show \
    && sudo ./LCD35-show 180 \
    && echo "Reboot in 10" \
    && sleep 10 \
    && reboot

# sudo add-apt-repository -y ppa:transmissionbt/ppa \
#     && sudo apt-get install -y transmission-cli transmission-daemon
