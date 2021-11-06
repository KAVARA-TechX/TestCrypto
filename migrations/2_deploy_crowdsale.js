const TestToken = artifacts.require("TestToken");

module.exports = function (deployer) {
    const _name="TestToken";
    const _symbol="TT";
    const _decimals=18;
    deployer.deploy(TestToken, _name, _symbol, _decimals);
};
