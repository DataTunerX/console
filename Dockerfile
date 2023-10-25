ARG NGINX_IMAGE_VERSION=1.21.6-alpine
FROM docker.m.daocloud.io/nginx:${NGINX_IMAGE_VERSION}

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8443
