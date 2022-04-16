const Inbox = artifacts.require('Inbox.sol')

module.exports = function (deployer) {
    deployer.deploy(Inbox, 'Hello, World');
}