ARG NGINX_IMAGE_VERSION=1.21.6-alpine
FROM docker.m.daocloud.io/nginx:${NGINX_IMAGE_VERSION}

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk -U upgrade

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./scripts/startup.sh /usr/share

RUN chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

RUN chmod a+x /usr/share/startup.sh && chown nginx /etc/nginx

EXPOSE 8443

USER nginx

CMD /usr/share/startup.sh && nginx -g 'daemon off;'
