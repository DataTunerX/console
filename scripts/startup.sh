#!/usr/bin/env sh

absolute_path="/etc/nginx/nginx.conf"

sed -i "s#KUBERNETES_API_SERVER#${KUBERNETES_API_SERVER-https://10.29.26.43:6443}#g" ${absolute_path}
sed -i "s#DATATUNERX_API_SERVER#${DATATUNERX_API_SERVER-http://datatunerx-server.datatunerx-dev.svc.cluster.local/}#g" ${absolute_path}
