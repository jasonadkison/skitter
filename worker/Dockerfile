FROM node:carbon
WORKDIR /var/app

ENV NICKJS_NO_SANDBOX=1
ENV CHROME_PATH=/usr/bin/google-chrome-stable

RUN apt-get update && \
    curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg --unpack google-chrome-stable_current_amd64.deb && \
    apt-get install -f -y && \
    apt-get clean && \
    rm google-chrome-stable_current_amd64.deb

COPY package*.json ./

RUN npm install
COPY . .

#EXPOSE 8080
#CMD ["node", "index.js"]
