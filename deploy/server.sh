#!/bin/sh
pkill npm
git pull origin master
npm install
PORT=8080 npm start &