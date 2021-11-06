
const BigNumber = web3.BigNumber;

function ether (n) {
    return new web3.utils.BN(web3.utils.toWei(n, 'wei'));
  }
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const TestToken = artifacts.require('TestToken');
const TestTokenCrowdsale = artifacts.require('TestTokenCrowdsale');
contract('TestTokenCrowdsale', function([_, wallet, investor1, investor2]) {
    beforeEach(async function () {
      // Token config
      this.name = "TestToken";
      this.symbol = "Test";
      this.decimals = 18;
      // Deploy Token
      this.token = await TestToken.new(
        this.name,
        this.symbol,
        this.decimals
      );
      // Crowdsale config
      this.rate = 300;
      this.wallet = wallet;
      this.crowdsale = await TestTokenCrowdsale.new(
        this.rate,
        this.wallet,
        this.token.address
      );
      await this.token.transfer(this.crowdsale.address, 2000000);
      console.log(TestToken.methods)
  });

  describe('crowdsale', function() {
    it('tracks the rate', async function() {
      const rate = await this.crowdsale.rate();
      rate.toNumber().should.be.bignumber.equal(this.rate);
    });
    it('tracks the wallet', async function() {
      const wallet1 = await this.crowdsale.wallet();
      wallet1.should.equal(this.wallet);
    });
    it('tracks the token', async function() {
      const token = await this.crowdsale.token();
      token.should.equal(this.token.address);
    });
  });

  describe('accepting payments', function() {
    it('should accept payments', async function() {
      const value = ether('1');
      const purchaser = investor2;
      console.log(await this.token.balanceOf(_))
      console.log(await this.token.balanceOf(wallet))
      console.log(await this.token.balanceOf(purchaser))
      console.log(await this.token.balanceOf(investor1))
      // await this.crowdsale.sendTransaction({ value: value, from: investor1 }).should.be.fulfilled;
      await this.crowdsale.buyTokens(investor1, { value: value, from: purchaser }).should.be.fulfilled;
      console.log(await this.token.balanceOf(_))
      console.log(await this.token.balanceOf(wallet))
      console.log(await this.token.balanceOf(purchaser))
      console.log(await this.token.balanceOf(investor1))
    });
  });

});
