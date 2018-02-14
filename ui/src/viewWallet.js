
var common = require('./common');
var ether = require('./ether');
var simpleMultiSigCompiled = require('./simpleMultiSigCompiled');
var Buffer = require('buffer/').Buffer;
var BN = require("bn.js");

var walletToSave = null;

var viewWallet = module.exports = {
    doViewWallet: function() {
	makeViewWalletForm();
    },
};


//
// view wallet
//
function makeViewWalletForm() {
    var walletList = common.getWalletList();
    var viewWalletSelector = document.getElementById("viewWalletSelector");
    common.clearDivChildren(viewWalletSelector);
    for (var i = 0; i < walletList.length; ++i) {
	var option = document.createElement("option");
	var wallet = common.getWallet(walletList[i]);
	option.text = wallet.name + ': ' + wallet.contractAddr;
	option.value = wallet.contractAddr;
	viewWalletSelector.appendChild(option);
    }
    viewWalletSelector.onchange = viewWalletSelectorHandler;
    if (walletList.length > 0)
	viewWalletView(walletList[0]);
    // ensure we don't add multiple handlers
    var viewWalletSaveButton = document.getElementById('viewWalletSaveButton');
    viewWalletSaveButton.removeEventListener('click', viewWalletSaveHandler);
    viewWalletSaveButton.addEventListener('click', viewWalletSaveHandler);
}


function viewWalletSelectorHandler() {
    console.log('viewWalletSelectorHandler');
    var viewWalletSelector = document.getElementById("viewWalletSelector");
    var contractAddr = viewWalletSelector.value;
    viewWalletView(contractAddr);
}

function viewWalletView(contractAddr) {
    console.log('viewWalletView: contract = ' + contractAddr);
    var wallet = common.getWallet(contractAddr);
    walletToSave = wallet;
    //init wallet-bar: name/addr, threshold, balance, nonce
    var viewContractNameAddr = document.getElementById('viewContractNameAddr');
    viewContractNameAddr.value = wallet.name + ': ' + wallet.contractAddr;
    var viewContractThreshold = document.getElementById('viewContractThreshold');
    viewContractThreshold.value = 'Threshold: ' + wallet.threshold.toString();
    var viewContractBalance = document.getElementById('viewContractBalance');
    viewContractBalance.value = 'Balance: refreshing...';
    ether.getBalance(wallet.contractAddr, 'szabo', function(balance) {
        var balanceSzabo = parseInt(balance);
        console.log('balanceSzabo = ' + balanceSzabo);
        var balanceETH = (balanceSzabo / common.SZABO_PER_ETH).toFixed(6);
        viewContractBalance.value = 'Balance: ' + balanceETH.toString(10);
    });
    var viewContractNonce = document.getElementById('viewContractNonce');
    viewContractNonce.value = 'Nonce: refreshing...';
    var abi = simpleMultiSigCompiled.abi;
    var contractInstance = ether.getContractInstance(wallet.contractAddr, abi);
    contractInstance.nonce.call(function(err, nonce) {
        console.log('viewWalletView: err = ' + err + ', nonce = ' + nonce);
        viewContractNonce.value = 'Nonce: ' + nonce.toString(10);
    });
    //
    var viewWalletAccountsListDiv = document.getElementById('viewWalletAccountsListDiv');
    common.clearDivChildren(viewWalletAccountsListDiv);
    console.log('viewWalletView: name = ' + wallet.name);
    var viewWalletNameInput = document.getElementById('viewWalletNameInput');
    viewWalletNameInput.value = wallet.name;
    var viewWalletThreshold = document.getElementById('viewWalletThreshold');
    viewWalletThreshold.value = 'Threshold: ' + wallet.threshold.toString();
    var viewWalletAddrInput = document.getElementById('viewWalletAddrInput');
    viewWalletAddrInput.value = wallet.contractAddr;
    listAccounts(wallet.ownerAddrs, wallet.ownerLabels, viewWalletAccountsListDiv);
    viewWalletNameInput.onchange = savableChangeHandler;
    viewWalletSaveButton.disabled = true;
}

function savableChangeHandler() {
    viewWalletSaveButton.disabled = false;
}

function viewWalletSaveHandler() {
    //pick up all fields that might have changed
    var viewWalletNameInput = document.getElementById('viewWalletNameInput');
    walletToSave.name = viewWalletNameInput.value;
    for (var i = 0; i < walletToSave.ownerAddrs.length; ++i)
	walletToSave.ownerLabels[i] = ownerLabelInputs[i].value;
    common.saveWallet(walletToSave);
    viewWalletSaveButton.disabled = true;
    //to redisplay with eg. new name
    viewWalletSelectorHandler();
}


function listAccounts(ownerAddrs, ownerLables, div) {
    if (div.className.indexOf('accountListFormTable') < 0)
	div.className += ' accountListFormTable';
    var form = document.createElement('form');
    form.action = 'javascript:;';
    ownerLabelInputs = [];
    for (var i = 0; i < ownerAddrs.length; ++i) {
	var prompt = document.createElement('input');
	prompt.value = ownerLables[i];
	prompt.disabled = false;
	prompt.size = 20;
	ownerLabelInputs.push(prompt);
	prompt.onchange = savableChangeHandler;
	var acct = document.createElement('input');
	acct.value = ownerAddrs[i];
	acct.disabled = true;
	acct.size = 50;
	addInputToFormTable(prompt, 'accountListTD', acct, 'accountListTD', form);
    }
    div.appendChild(form);
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
