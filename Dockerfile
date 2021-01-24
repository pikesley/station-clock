FROM ubuntu

ENV PROJECT station-clock
ENV PLATFORM docker

RUN apt-get update && apt-get install -y nginx make

RUN ln -sf /opt/${PROJECT}/nginx/dev-site.conf /etc/nginx/sites-enabled/default

WORKDIR /opt/${PROJECT}
