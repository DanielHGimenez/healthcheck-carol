FROM node:18.20.8

WORKDIR /app

COPY main.js /app
COPY package-lock.json /app
COPY package.json /app

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# RUN apt-get update
# RUN apt-get install chromium -y
RUN npm i

ENTRYPOINT [ "node", "main.js" ]
