#!/bin/sh
cd ${PWD}/certs
if [ ! -d "./nginx" ]; then
    mkdir nginx
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./nginx/nginx.key \
        -out ./nginx/nginx.crt \
        -subj "/C=KO/ST=Seoul/L=Gaepo-dong/O=42Seoul/CN=localhost"
fi
