const BigNumber= web3.BigNumber;

const TestToken = artifacts.require("TestToken");



require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('TestToken', accounts => {
    const _name="TestToken";
    const _symbol="TT";
    const _decimals=18;
    const _totalSupply=1*10**12;

    beforeEach(async function(){
        this.token = await TestToken.new(_name, _symbol, _decimals)
    });


    describe('Token attributes', function(){
        it('has the correct name', async function(){
            const name = await this.token.name();
            name.should.equal(_name);
        });
 
        it('has the correct symbol', async function(){
            const symbol = await this.token.symbol();
            symbol.should.equal(_symbol);
        });

        it('has the correct decimals ', async function(){
            const decimals = await this.token.decimals();
            console.log(decimals);
            decimals.toNumber().should.be.bignumber.equal(_decimals);
        });

        it('has the correct total supply ', async function(){
            const totalSupply = await this.token.totalSupply();
            console.log(totalSupply.toNumber())
            totalSupply.toNumber().should.be.bignumber.equal(_totalSupply);
        });
        
        
    });
});