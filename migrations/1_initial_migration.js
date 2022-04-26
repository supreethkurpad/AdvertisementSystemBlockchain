const AdManager = artifacts.require("./AdManager.sol");

module.exports = function(deployer) {
  deployer.deploy(AdManager);
};
