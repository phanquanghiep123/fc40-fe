FROM node:latest
LABEL maintainer="Hung Nguyen <hung.nn@3si.vn>"

RUN mkdir -p /app/internals
WORKDIR /app

# Copy all local files into the image.
COPY ./package.json .
COPY ./package-lock.json .
COPY ./internals ./internals

RUN npm install
#fix  vulnerabilities 
RUN npm audit fix
