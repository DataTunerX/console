#!/usr/bin/env sh

absolute_path="/etc/nginx/nginx.conf"

sed -i "s#KUBERNETES_API_SERVER#${API_URL-https://10.29.26.43:6443}#g" ${absolute_path}
