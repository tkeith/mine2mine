FROM nginx:1.21.4

RUN apt-get update \
  && apt-get install -y apache2-utils python3-certbot-nginx \
  && rm -rf /var/lib/apt/lists/*

CMD ["bash", "/opt/run"]
