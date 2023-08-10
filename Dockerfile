FROM node:18-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn install & rm -rf dist && yarn build
EXPOSE 4000
CMD ["node", "dist/index.js"]