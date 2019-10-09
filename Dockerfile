FROM node:carbon

ENV CHROME_PATH=/usr/bin/google-chrome-stable
ENV NICKJS_NO_SANDBOX=1

RUN apt-get update && \
    curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg --unpack google-chrome-stable_current_amd64.deb && \
    apt-get install -f -y && \
    apt-get clean && \
    rm google-chrome-stable_current_amd64.deb && \
    mkdir -p /skitter

WORKDIR /skitter/scripts
