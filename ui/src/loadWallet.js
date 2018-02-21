/*
 * user interface for simple multisig wallet - written for riverdimes, inc.
 *
 * @author Pratyush Bhatt - 2018
 *
 * handle wallet import
 *
 */

var common = require('./common');
var ether = require('./ether');
var simpleMultiSigCompiled = require('./simpleMultiSigCompiled');

var walletToSave = null;
var ownerLabelInputs = [];

var loadWallet = module.exports = {
    doLoadWallet: function() {
	makeLoadWalletForm();
    },
};


//
// load wallet
//
function makeLoadWalletForm() {
    var loadWalletAccountsListDiv = document.getElementById('loadWalletAccountsListDiv');
    common.clearDivChildren(loadWalletAccountsListDiv);
    var loadWalletAccountsListHeaderDiv = document.getElementById('loadWalletAccountsListHeaderDiv');
    loadWalletAccountsListHeaderDiv.className = (loadWalletAccountsListHeaderDiv.className).replace('smwVisible', 'smwHidden');
    var loadWalletThresholdDiv = document.getElementById('loadWalletThresholdDiv');
    loadWalletThresholdDiv.className = (loadWalletThresholdDiv.className).replace('smwVisible', 'smwHidden');
    var loadWalletAddrInput = document.getElementById('loadWalletAddrInput');
    loadWalletAddrInput.value = '';
    loadWalletAddrInput.disabled = false;
    // ensure we don't add multiple handlers
    var loadWalletLoadButton = document.getElementById('loadWalletLoadButton');
    loadWalletLoadButton.removeEventListener('click', loadWalletLoadHandler);
    loadWalletLoadButton.addEventListener('click', loadWalletLoadHandler);
    var loadWalletSaveButton = document.getElementById('loadWalletSaveButton');
    loadWalletSaveButton.disabled = true;
    loadWalletSaveButton.removeEventListener('click', loadWalletSaveHandler);
    loadWalletSaveButton.addEventListener('click', loadWalletSaveHandler);
    //
    walletToSave = null;
    var loadWalletNameInput = document.getElementById('loadWalletNameInput');
    loadWalletNameInput.value = 'no name';
}


//
//recursively fill the passed owners array
//
function getOwner(contractInstance, idx, owners, cb) {
    contractInstance.ownersArr.call(idx, function(err, ownerX) {
	console.log('loadWalletLoadHandler: err = ' + err + ', ownersArr(' + idx + ') = ' + ownerX);
	if (!!ownerX && common.web3.isAddress(ownerX)) {
	    owners.push(ownerX);
	    if (idx <= 10) {
		getOwner(contractInstance, idx + 1, owners, cb);
		return;
	    }
	}
	cb();
    });
}

function loadWalletLoadHandler() {
    var loadWalletAddrInput = document.getElementById('loadWalletAddrInput');
    var walletAddr = loadWalletAddrInput.value;
    console.log('loadWalletLoadHandler: walletAddr = ' + walletAddr);
    if (!common.web3.isAddress(walletAddr)) {
	alert('Error!\n\n' + walletAddr + ' is not a valid address!');
	return;
    }
    var abi = simpleMultiSigCompiled.abi;
    var contractInstance = ether.getContractInstance(walletAddr, abi);
    common.web3.eth.getCode(walletAddr, function(err, code) {
	if (!code) {
	    alert('Error:\n\nUnable to read contract at specified address');
	    return
	}
	var ownerAccountList = [];
	var ownerAcctLabels = [];
	getOwner(contractInstance, 0, ownerAccountList, function() {
	    console.log('loadWalletLoadHandler: ownerAccountList.length = ' + ownerAccountList.length);
	    for (var i = 0; i < ownerAccountList.length; ++i)
		ownerAcctLabels.push('no label');
	    contractInstance.threshold.call(function(err, threshold) {
		console.log('loadWalletLoadHandler: err = ' + err + ', threshold = ' + threshold);
		loadWalletAddrInput.disabled = true;
		var loadWalletAccountsListHeaderDiv = document.getElementById('loadWalletAccountsListHeaderDiv');
		loadWalletAccountsListHeaderDiv.className = (loadWalletAccountsListHeaderDiv.className).replace('smwHidden', 'smwVisible');
		var loadWalletThresholdDiv = document.getElementById('loadWalletThresholdDiv');
		loadWalletThresholdDiv.className = (loadWalletThresholdDiv.className).replace('smwHidden', 'smwVisible');
		var loadWalletThreshold = document.getElementById('loadWalletThreshold');
		loadWalletThreshold.value = 'Threshold: ' + threshold.toString();
		listAccounts(ownerAccountList, ownerAcctLabels, loadWalletAccountsListDiv);
		walletToSave = new common.Wallet(null, walletAddr, ownerAcctLabels, ownerAccountList, threshold);
		loadWalletSaveButton.disabled = false;
	    });
	});
    });
}


function loadWalletSaveHandler() {
    //pick up all fields that might have changed
    var loadWalletNameInput = document.getElementById('loadWalletNameInput');
    walletToSave.name = loadWalletNameInput.value;
    for (var i = 0; i < walletToSave.ownerAddrs.length; ++i)
	walletToSave.ownerLabels[i] = ownerLabelInputs[i].value;
    common.saveWallet(walletToSave);
    alert('Wallet Saved');
}


function listAccounts(ownerAddrs, ownerLables, div) {
    common.clearDivChildren(div);
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
