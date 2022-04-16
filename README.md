# web3
All things web3 related

## Setup 
npm install -g truffle

npm install -g @truffle/hdwallet-provider
### Run
`truffle init`

edit `truffle.config.js` -> version: "0.8.4"

`truffle compile`

`truffle test`

`truffle develop` creates local version blockchain (built-in of ganache)

Note: after deploying, the networks{} key in Inbox.json will change

`migrate --reset` 

`truffle migrate -f 2 --network rinkeby`