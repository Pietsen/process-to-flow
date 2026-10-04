#!/bin/sh
set -e

PORT="${PORT:-10000}"
mkdir -p /run/nginx
sed "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/app.conf.template > /etc/nginx/http.d/default.conf

java -jar /app/app.jar &
exec nginx -g 'daemon off;'
