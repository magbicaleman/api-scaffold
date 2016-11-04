FROM node:6.9
ENV NODE_ENV local
ADD . /code
WORKDIR /code
RUN npm install
CMD node_modules/babel-cli/bin/babel-node.js ./src/index.js
