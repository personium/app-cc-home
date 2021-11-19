FROM nginx:1.21

COPY 30-render-template.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/30-render-template.sh && \
    mkdir -p /opt/src/app-cc-home && mkdir -p /opt/dst/app-cc-home

WORKDIR /opt/src/app-cc-home
ADD src .

COPY nginx-app-cc-home.conf /etc/nginx/conf.d/default.conf
