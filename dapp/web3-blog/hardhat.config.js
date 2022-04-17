require("@nomiclabs/hardhat-waffle");



/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337 // 1337 is the default localhost for metamask
    },
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      accounts: [process.env.WALLET_PRIVATE_KEY]
    },
  },
  
};
