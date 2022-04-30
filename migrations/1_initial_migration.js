require('dotenv').config()
const AdManager = artifacts.require("./AdManager.sol");

module.exports = function(deployer) {
  deployer.deploy(AdManager, process.env.OWNER_ADDRESS);
};
