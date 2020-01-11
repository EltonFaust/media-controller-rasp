#!/usr/bin/env bash

sudo fdisk -l

read -p "Is your usb device mounted to /dev/sda1? " -n 1 -r
echo    # (optional) move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
    sudo mkdir /mnt/usb \
        && sudo mount /dev/sda1 /mnt/usb \
        && echo '/dev/sda1 /mnt/usb ntfs defaults 0 0' | sudo tee -a /etc/fstab > /dev/null
fi
