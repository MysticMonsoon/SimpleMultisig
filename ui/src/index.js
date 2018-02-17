
//
// deployed @: 0xDceCE8aADcbF7e3C6E8Ec9e9452f9940B4790352
//
var common = require('./common');
var simpleMultiSigCompiled = require('./simpleMultiSigCompiled');
var ether = require('./ether');
var loadWallet = require('./loadWallet');
var viewWallet = require('./viewWallet');
var transaction = require('./transaction');
//
var Buffer = require('buffer/').Buffer;
var BN = require("bn.js");
//
var newWalletAcctList   = [];
var newWalletLabelList  = [];
var modalIsShowing      = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('content loaded');
    common.checkForMetaMask(true, function(err, w3) {
	var yourAccountAddr = document.getElementById('yourAccountAddr');
	var yourAccountBalance = document.getElementById('yourAccountBalance');
	if (!!err) {
	    var newButton = document.getElementById('newButton');
	    newButton.disabled = true;
	    //var loadButton = document.getElementById('loadButton');
	    //loadButton.disabled = true;
	    yourAccountAddr.value = 'No MetaMask Account';
	    yourAccountBalance.value = 'Balance: 0';
	    alert(err);
	} else {
	    yourAccountAddr.value = 'MetaMask Account: ' + w3.eth.accounts[0];
	    ether.getBalance(null, 'szabo', function(balance) {
		var balanceSzabo = parseInt(balance);
		console.log('balanceSzabo = ' + balanceSzabo);
		var balanceETH = (balanceSzabo / common.SZABO_PER_ETH).toFixed(6);
		yourAccountBalance.value = 'Balance: ' + balanceETH.toString(10);
		index.main();
	    });
	}
    });
}, false);


var index = module.exports = {
    main: function() {
	console.log('index.main');
	//force all pages to hidden
	common.hideDiv(document.getElementById('newWalletDiv'));
	common.hideDiv(document.getElementById('loadWalletDiv'));
	common.hideDiv(document.getElementById('viewWalletDiv'));
	common.hideDiv(document.getElementById('transactionDiv'));
	common.hideDiv(document.getElementById('statusDiv'));
	common.hideDiv(document.getElementById('statusContentDiv'));
    },

    onNewButton: function() {
	common.showDiv(document.getElementById('newWalletDiv'));
	common.hideDiv(document.getElementById('loadWalletDiv'));
	common.hideDiv(document.getElementById('viewWalletDiv'));
	common.hideDiv(document.getElementById('transactionDiv'));
	common.hideDiv(document.getElementById('statusDiv'));
	common.hideDiv(document.getElementById('statusContentDiv'));
	//
	newWalletAcctList = [];
	newWalletLabelList = [];
	makeNewWalletForm();
    },

    onLoadButton: function() {
	common.hideDiv(document.getElementById('newWalletDiv'));
	common.showDiv(document.getElementById('loadWalletDiv'));
	common.hideDiv(document.getElementById('viewWalletDiv'));
	common.hideDiv(document.getElementById('transactionDiv'));
	common.hideDiv(document.getElementById('statusDiv'));
	common.hideDiv(document.getElementById('statusContentDiv'));
	loadWallet.doLoadWallet();
    },

    onViewButton: function() {
	common.hideDiv(document.getElementById('newWalletDiv'));
	common.hideDiv(document.getElementById('loadWalletDiv'));
	common.showDiv(document.getElementById('viewWalletDiv'));
	common.hideDiv(document.getElementById('transactionDiv'));
	common.hideDiv(document.getElementById('statusDiv'));
	common.hideDiv(document.getElementById('statusContentDiv'));
	viewWallet.doViewWallet();
    },

    onTransactionButton: function() {
	common.hideDiv(document.getElementById('newWalletDiv'));
	common.hideDiv(document.getElementById('loadWalletDiv'));
	common.hideDiv(document.getElementById('viewWalletDiv'));
	common.showDiv(document.getElementById('transactionDiv'));
	common.hideDiv(document.getElementById('statusDiv'));
	common.hideDiv(document.getElementById('statusContentDiv'));
	transaction.doTransaction()
    },

    onSourceCodeButton: function() {
	doBigModal(simpleMultiSigCompiled.source);
    },

    onCreditsButton: function() {
	doBigModal(simpleMultiSigCompiled.credits);
    },

    onHelpButton: function() {
	doBigModal(simpleMultiSigCompiled.help);
    },

};


//
// new wallet
// called recursively
//
function makeNewWalletForm() {
    common.hideDiv(document.getElementById('statusDiv'));
    common.hideDiv(document.getElementById('statusContentDiv'));
    var newWalletAccountsListDiv = document.getElementById('newWalletAccountsListDiv');
    listAccounts(newWalletAcctList, newWalletLabelList, newWalletAccountsListDiv);
    // set up threshold selector and init new account addr
    var thresholdSelector = document.getElementById("thresholdSelector");
    var addAccountAddrInput = document.getElementById('addAccountAddrInput');
    var addAccountLabelInput = document.getElementById('addAccountLabelInput');
    common.clearDivChildren(thresholdSelector);
    if (newWalletAcctList.length == 0) {
	var option = document.createElement("option");
	option.text = 'Select Threshold';
	option.value = '0';
	thresholdSelector.appendChild(option);
	//no accounts defined, so set default acct to currently active metamask acct
	addAccountAddrInput.value = common.web3.eth.accounts[0];
	addAccountLabelInput.value = 'My Account';
    } else {
	for (var i = 1; i <= newWalletAcctList.length; ++i) {
	    var option = document.createElement("option");
	    option.text = 'Threshold ' + i.toString(10);
	    option.value = i.toString(10);
	    thresholdSelector.appendChild(option);
	}
	//after first account, ensure no artifacts of default acct in input field
	addAccountAddrInput.value = '';
	addAccountLabelInput.value = '';
    }
    // we can be called multiple times. so ensure we don't add multiple handlers
    var addAccountButton = document.getElementById('addAccountButton');
    addAccountButton.removeEventListener('click', newWalletAddAccountHandler);
    addAccountButton.addEventListener('click', newWalletAddAccountHandler);
    //
    var deployNewWalletButton = document.getElementById('deployNewWalletButton');
    deployNewWalletButton.disabled = (newWalletAcctList.length > 0) ? false : true;
    if (!deployNewWalletButton.disabled) {
	deployNewWalletButton.removeEventListener('click', newWalletDeployHandler);
	deployNewWalletButton.addEventListener('click', newWalletDeployHandler);
    }
}

function newWalletDeployHandler() {
    console.log('newWalletDeployHandler');
    var deployNewWalletButton = document.getElementById('deployNewWalletButton');
    deployNewWalletButton.removeEventListener('click', newWalletDeployHandler);
    var abi = simpleMultiSigCompiled.abi;
    var bin = simpleMultiSigCompiled.bin;
    var thresholdSelector = document.getElementById("thresholdSelector");
    var threshold = thresholdSelector.value;
    var sortedAcctList = [];
    for (var i = 0; i < newWalletAcctList.length; ++i)
	sortedAcctList.push(newWalletAcctList[i]);
    if (sortedAcctList.length > 1)
	sortedAcctList.sort(ether.addressCompare);
    console.log('newWalletDeployHandler: threshold = ' + threshold);
    var parmsHex = ether.abi_encode_SimpleMultiSig_parms(threshold.toString(16), sortedAcctList);
    ether.deployContract(abi, bin, parmsHex, 0, function(err, txid, contractInstance) {
	console.log('newWalletDeployHandler: got first callback. txid = ' + txid);
	if (!!err || !txid) {
	    alert('Error in contract deployment transaction!\n\n' + err);
	} else {
	    var statusDiv = document.getElementById('statusDiv');
	    var statusContentDiv = document.getElementById('statusContentDiv');
	    common.waitForTXID(txid, 'wallet deployment', statusDiv, statusContentDiv, function(err, receipt) {
		console.log('newWalletDeployHandler: contract address = ' + receipt.contractAddress);
		//save this wallet
		var addWalletNameInput = document.getElementById('addWalletNameInput');
		var name = addWalletNameInput.value;
		var walletToSave = new common.Wallet(name, receipt.contractAddress, newWalletLabelList, newWalletAcctList, threshold);
		common.saveWallet(walletToSave);
		console.log('newWalletDeployHandler: wallet ' + name + ' saved');
	    });
	}
    });
}

function newWalletAddAccountHandler() {
    var addAccountAddrInput = document.getElementById('addAccountAddrInput');
    var newAccountAddr = addAccountAddrInput.value;
    if (!common.web3.isAddress(newAccountAddr)) {
	alert('Error!\n\n' + newAccountAddr + ' is not a valid address!');
	return;
    }
    for (var i = 0; i < newWalletAcctList.length; ++i) {
	if (newAccountAddr == newWalletAcctList[i]) {
	    alert('Error!\n\n' + newAccountAddr + ' is already an owner!');
	    return;
	}
    }
    var addAccountButton = document.getElementById('addAccountButton');
    addAccountButton.removeEventListener('click', newWalletAddAccountHandler);
    newWalletAcctList.push(newAccountAddr);
    var addAccountLabelInput = document.getElementById('addAccountLabelInput');
    var newAccountLabel = addAccountLabelInput.value;
    if (!newAccountLabel)
	newAccountLabel = 'no label';
    newWalletLabelList.push(newAccountLabel);
    console.log('newWalletAddAccountHandler: newWalletAcctList.length = ' + newWalletAcctList.length);
    makeNewWalletForm();
}



//
// general purpose utils
//
function listAccounts(ownerAddrs, ownerLables, div) {
    common.clearDivChildren(div);
    if (div.className.indexOf('accountListFormTable') < 0)
	div.className += ' accountListFormTable';
    var form = document.createElement('form');
    form.action = 'javascript:;';
    for (var i = 0; i < ownerAddrs.length; ++i) {
	var prompt = document.createElement('input');
	prompt.value = ownerLables[i];
	prompt.disabled = true;
	prompt.size = 20;
	var acct = document.createElement('input');
	acct.value = ownerAddrs[i];
	acct.disabled = true;
	acct.size = 50;
	addInputToFormTable(prompt, 'accountListTD', acct, 'accountListTD', form);
    }
    div.appendChild(form);
}


function doBigModal(content) {
    var bigModalDiv = document.getElementById('bigModalDiv');
    var bigModalClose  = document.getElementById('bigModalClose');
    var modalContentDiv = document.getElementById('modalContentDiv');
    if (modalIsShowing) {
	modalIsShowing = false;
	common.hideDiv(bigModalDiv);
    } else {
	modalContentDiv.innerHTML = content;
	bigModalClose.onclick = function() {
	    modalIsShowing = false;
	    common.hideDiv(bigModalDiv);
	};
	modalIsShowing = true;
	common.showDiv(bigModalDiv);
    }
}


function addInputToFormTable(prompt, promptClass, input, inputClass, f) {
    var d;
    var s;
    var t;
    (d = document.createElement("div")).className = 'tr';
    if (!!prompt) {
	(s = document.createElement("span")).className = promptClass;
	s.appendChild(prompt);
	d.appendChild(s);
    }
    if (!!input) {
	(s = document.createElement("span")).className = inputClass;
	s.appendChild(input);
	d.appendChild(s);
    }
    f.appendChild(d);
}
