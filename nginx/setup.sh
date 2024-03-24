#!/bin/sh
NGINX_DIR=$PWD/nginx/certs
if [ ! -d $NGINX_DIR ]; then
    mkdir -p $NGINX_DIR
    openssl req -x509 -nodes -days 365 \
		-newkey rsa:2048 \
        -keyout $NGINX_DIR/nginx.key \
        -out $NGINX_DIR/nginx.crt \
        -subj "/C=KO/ST=Seoul/L=Gaepo-dong/O=42Seoul/CN=localhost"
fi
