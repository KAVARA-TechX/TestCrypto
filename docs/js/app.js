App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 100000000000000,
    tokensSold:0,
    tokensAvailable: 750000,
  
    init: function() {
      console.log("App initialized...")
      return App.initWeb3();
    },
  
    initWeb3: function() {
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContracts();
    },
  
    initContracts: function() {
      $.getJSON("TestTokenSale.json", function(TestTokenSale) {
        App.contracts.TestTokenSale = TruffleContract(TestTokenSale);
        App.contracts.TestTokenSale.setProvider(App.web3Provider);
        App.contracts.TestTokenSale.deployed().then(function(TestTokenSale) {
          console.log("Kavara Token Sale Address:", TestTokenSale.address);
        });
      }).done(function() {
        $.getJSON("TestToken.json", function(TestToken) {
          App.contracts.TestToken = TruffleContract(TestToken);
          App.contracts.TestToken.setProvider(App.web3Provider);
          App.contracts.TestToken.deployed().then(function(TestToken) {
            console.log("Kavara Token Address:", TestToken.address);
          });
  
          App.listenForEvents();
          return App.render();
        });
      })
    },

    listenForEvents: function() {
      App.contracts.TestTokenSale.deployed().then(function(instance) {
        instance.Sell({}, {
          fromBlock: 0,
          toBlock: 'latest',
        }).watch(function(error, event) {
          console.log("event triggered", event);
          App.render();
        })
      })
    },
  
    render: function() {
      if (App.loading) {
        return;
      }
      App.loading = true;
  
      var loader  = $('#loader');
      var content = $('#content');
  
      loader.show();
      content.hide();
  
      // Load account data
      if(web3.currentProvider.enable){
        //For metamask
        web3.currentProvider.enable().then(function(acc){
            App.account = acc[0];
            $("#accountAddress").html("Your Account: " + App.account);
        });
      } 
      else{
        App.account = web3.eth.accounts[0];
        $("#accountAddress").html("Your Account: " + App.account);
      }
      // Load token sale contract
      App.contracts.TestTokenSale.deployed().then(function(instance) {
        TestTokenSaleInstance = instance;
        return TestTokenSaleInstance.tokenPrice();
      }).then(async function(tokenPrice) {
        App.tokenPrice = tokenPrice;
        $('.token-price').html(await web3.fromWei(App.tokenPrice, "wei").toNumber());
        return TestTokenSaleInstance.tokensSold();
      }).then(function(tokensSold) {
        App.tokensSold = tokensSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);
        var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + '%');
        App.contracts.TestToken.deployed().then(function(instance) {
          TestTokenInstance = instance;
          return TestTokenInstance.balanceOf(App.account);
        }).then(function(balance) {
          $('.Kavara-balance').html(balance.toNumber());
          App.loading = false;
          loader.hide();
          content.show();
        })
      })
      
    },

    buyTokens: function() {
      $('#content').hide();
      $('#loader').show();
      var numberOfTokens = $('#numberOfTokens').val();
      App.contracts.TestTokenSale.deployed().then(function(instance) {
        return instance.buyTokens(numberOfTokens, {
          from: App.account,
          value: numberOfTokens * App.tokenPrice// Gas limit
        });
      }).then(function(result) {
        console.log("Tokens bought...")
        $('form').trigger('reset')
        window.location.reload() // reset number of tokens in form
        // Wait for Sell event
        // check for discord webhook
      });
    }
  }
  $(function() {
    $(window).load(function() {
      App.init();
    })
  });