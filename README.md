##Scaffold for generic node API server

#### Pre-Requisites
In order for this application to work it assumes you have

1. Node >= 4.x installed
2. MongoDB >= 3.x w/SSL installed and running
3. Redis >= 3.x installed and running

####Setup

1. Once you have cloned the project please run `npm install`
2. Add the following environment variables
    - `NODE_ENV=local`
3. To run use `node_modules/babel-cli/bin/babel-node.js` and point to `src/index.js`

####Building for Distribution
`npm run build`

####Generate Documentation
`npm run generate-docs`
