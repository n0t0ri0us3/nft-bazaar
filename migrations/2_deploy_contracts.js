const nftBazaar = artifacts.require("nftBazaar");

module.exports = function(deployer){
    deployer.deploy(nftBazaar);
};