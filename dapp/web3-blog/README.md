# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
npx hardhat run ./scripts/deploy.js --network polygon
```
## A full stack web3 on-chain blog and CMS

To deploy this app:

1. Clone this repository

```sh
git clone git@github.com:dabit3/full-stack-web3.git
```

2. Install the dependencies

```sh
npm install
```

3. Run the local node

```sh
npx hardhat node
```

4. Deploy to localhost

```sh
npx hardhat run scripts/deploy.js --network localhost
```

5. Start the app

```sh
npm start
```

## TODO
create sticky sessions to avoid having to sign in at every page click 
Plugin the graph protocal for a a more flexible API
 - Example: If many users are actively using the application then we want to be able to only fetch the posts associated with that user 
