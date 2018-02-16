
var common = require('./common');
var ether = require('./ether');
var simpleMultiSigCompiled = require('./simpleMultiSigCompiled');
var Buffer = require('buffer/').Buffer;
var BN = require("bn.js");
const keccak = require('keccakjs');
var ethUtils = require('ethereumjs-util');
const web3Utils = require('web3-utils');

var walletToSave = null;
var mySigInput = null;
var ownerSigInputs = [];
var transaction = module.exports = {
    doTransaction: function() {
        makeTransactionForm();
    },
};


//
// select the wallet upon which we will execute the transaction
//
function makeTransactionForm() {
    var walletList = common.getWalletList();
    var transactionWalletSelector = document.getElementById("transactionWalletSelector");
    common.clearDivChildren(transactionWalletSelector);
    for (var i = 0; i < walletList.length; ++i) {
        var option = document.createElement("option");
        var wallet = common.getWallet(walletList[i]);
        option.text = wallet.name + ': ' + wallet.contractAddr;
        option.value = wallet.contractAddr;
        transactionWalletSelector.appendChild(option);
    }
    transactionWalletSelector.onchange = transactionWalletSelectorHandler;
    if (walletList.length > 0)
	transactionWalletSelectorHandler();
    // ensure we don't add multiple handlers
    var transactionSignButton = document.getElementById('transactionSignButton');
    transactionSignButton.removeEventListener('click', signHandler);
    transactionSignButton.addEventListener('click', signHandler);
    var transactionExecuteButton = document.getElementById('transactionExecuteButton');
    transactionExecuteButton.removeEventListener('click', executeHandler);
    transactionExecuteButton.addEventListener('click', executeHandler);
    transactionExecuteButton.disabled = true;
}


function transactionWalletSelectorHandler() {
    console.log('transactionWalletSelectorHandler');
    var statusDiv = document.getElementById('statusDiv');
    statusDiv.className = '';
    //everything else is initialized in transactionWalletView
    var transactionTransactionHashInput = document.getElementById('transactionTransactionHashInput');
    transactionTransactionHashInput.value = '';
    var transactionWalletSelector = document.getElementById("transactionWalletSelector");
    var contractAddr = transactionWalletSelector.value;
    transactionWalletView(contractAddr);
}

function transactionWalletView(contractAddr) {
    console.log('viewWalletView: contract = ' + contractAddr);
    var wallet = common.getWallet(contractAddr);
    walletToSave = wallet;
    //init transaction data
    var transactionTransactionToInput = document.getElementById('transactionTransactionToInput');
    transactionTransactionToInput.value = '';
    transactionTransactionToInput.onchange = hashHandler;
    var transactionTransactionValueInput = document.getElementById('transactionTransactionValueInput');
    transactionTransactionValueInput.value = '';
    transactionTransactionValueInput.onchange = hashHandler;
    var transactionTransactionNonceInput = document.getElementById('transactionTransactionNonceInput');
    transactionTransactionNonceInput.value = '';
    transactionTransactionNonceInput.onchange = hashHandler;
    var transactionTransactionData = document.getElementById('transactionTransactionData');
    transactionTransactionData.value = '';
    transactionTransactionData.onchange = hashHandler;
    //transaction wallet-bar: name/addr, threshold, balance, nonce
    var transactionContractNameAddr = document.getElementById('transactionContractNameAddr');
    transactionContractNameAddr.value = wallet.name + ': ' + wallet.contractAddr;
    var transactionContractThreshold = document.getElementById('transactionContractThreshold');
    transactionContractThreshold.value = 'Threshold: ' + wallet.threshold.toString();
    var transactionContractBalance = document.getElementById('transactionContractBalance');
    transactionContractBalance.value = 'Balance: refreshing...';
    ether.getBalance(wallet.contractAddr, 'szabo', function(balance) {
        var balanceSzabo = parseInt(balance);
        console.log('balanceSzabo = ' + balanceSzabo);
        var balanceETH = (balanceSzabo / common.SZABO_PER_ETH).toFixed(6);
        transactionContractBalance.value = 'Balance: ' + balanceETH.toString(10);
    });
    var transactionContractNonce = document.getElementById('transactionContractNonce');
    transactionContractNonce.value = 'Nonce: refreshing...';
    var abi = simpleMultiSigCompiled.abi;
    var contractInstance = ether.getContractInstance(wallet.contractAddr, abi);
    contractInstance.nonce.call(function(err, nonce) {
        console.log('viewWalletView: err = ' + err + ', nonce = ' + nonce);
        transactionContractNonce.value = 'Nonce: ' + nonce.toString(10);
        transactionTransactionNonceInput.value = nonce.toString(10);
    });
    //
    var transactionAccountsListDiv = document.getElementById('transactionAccountsListDiv');
    common.clearDivChildren(viewWalletAccountsListDiv);
    listAccounts(wallet.ownerAddrs, wallet.ownerLabels, transactionAccountsListDiv);
    viewWalletSaveButton.disabled = true;
}

function executeHandler() {
    console.log('executeHandler');
    //function execute(uint8[] sigV, bytes32[] sigR, bytes32[] sigS, address destination, uint value, bytes data)
    var sigR = [];
    var sigS = [];
    var sigV = [];
    var transactionTransactionToInput = document.getElementById('transactionTransactionToInput');
    var transactionTransactionValueInput = document.getElementById('transactionTransactionValueInput');
    var transactionTransactionData = document.getElementById('transactionTransactionData');
    var destination = transactionTransactionToInput.value;
    var value = transactionTransactionValueInput.value;
    var data = transactionTransactionData.value;
    for (var i = 0; i < ownerSigInputs.length; ++i) {
        var sig = ownerSigInputs[i].value;
	sig = ethUtils.stripHexPrefix(sig);
        var r = sig.substring(0, 64);
        var s = sig.substring(64, 128);
        var v = sig.substring(128, 130);
        var vBN = new BN(v);
        sigR.push(r);
        sigS.push(s);
        sigV.push(vBN);
    }
    var abi = simpleMultiSigCompiled.abi;
    var contractInstance = ether.getContractInstance(walletToSave.contractAddr, abi);
    contractInstance.execute(sigV, sigR, sigS, destination, value, data, function(err, txid) {
        console.log('executeHandler: err = ' + err + ', txid = ' + txid);
	if (!!err || !txid) {
	    alert('Error in multisig transaction!\n\n' + err);
	} else {
	    var statusDiv = document.getElementById('statusDiv');
	    var statusContentDiv = document.getElementById('statusContentDiv');
	    statusDiv.className = 'finalresultstable';
	    common.waitForTXID(txid, 'multisig transaction', statusDiv, statusContentDiv, function(err, receipt) {
		console.log('executeHandler: receipt.status =  ' + receipt.status + ' (1 => success)');
		transactionWalletSelectorHandler();
	    });
	}
    });
}

function hashHandler() {
    var transactionTransactionToInput = document.getElementById('transactionTransactionToInput');
    var transactionTransactionValueInput = document.getElementById('transactionTransactionValueInput');
    var value = transactionTransactionValueInput.value;
    var valueHex = common.web3.toHex(value);
    var transactionTransactionData = document.getElementById('transactionTransactionData');
    var data = transactionTransactionData.value;
    var transactionTransactionNonceInput = document.getElementById('transactionTransactionNonceInput');
    var nonce = transactionTransactionNonceInput.value;
    var nonceHex = common.web3.toHex(nonce);
    //bytes32 txHash = keccak256(byte(0x19), byte(0), address(this), destination, value, data, nonce);
    try {
        var destination = transactionTransactionToInput.value;
        var txHashHex = web3Utils.soliditySha3({type: 'uint8',    value: '0x19'},
					       {type: 'uint8',    value: '0x00'},
					       {type: 'address',  value: walletToSave.contractAddr},
					       {type: 'address',  value: destination},
					       {type: 'uint',     value: valueHex},
					       {type: 'bytes',    value: data},
					       {type: 'uint',     value: nonceHex});
        var transactionTransactionHashInput = document.getElementById('transactionTransactionHashInput');
        transactionTransactionHashInput.value = txHashHex;
        if (!!mySigInput) {
            mySigInput.value = '';
            transactionSignButton.disabled = false;
        }
    } catch (err) {
        alert('Error comupting transaction hash:\n\n' + err + '\n\nCheck transaction data...');
    }
}


function sigHandler() {
    var transactionTransactionHashInput = document.getElementById('transactionTransactionHashInput');
    var hexMsg = transactionTransactionHashInput.value;
    var sigCount = 0;
    for (var i = 0; i < ownerSigInputs.length; ++i) {
        var sig = ownerSigInputs[i].value;
        if (!!sig) {
            var addr = ether.ecrecover(hexMsg, sig);
            console.log('sigHandler: got addr = ' + addr + ' from sig #' + i);
            if (addr === walletToSave.ownerAddrs[i]) {
                ++sigCount;
            } else {
                alert('Signature for owner #' + i.toString(10) + ' (' + walletToSave.ownerLabels[i] + ') does not match!\n\n' +
                      'Either the sinature is from a different account, or the transaction that was signed is different from ' +
                      'the currently displayed transaction.');
            }
        }
    }
    var transactionExecuteButton = document.getElementById('transactionExecuteButton');
    transactionExecuteButton.disabled = (sigCount >= walletToSave.threshold) ? false : true;
}

function signHandler() {
    var transactionTransactionHashInput = document.getElementById('transactionTransactionHashInput');
    var hexMsg = transactionTransactionHashInput.value;
    if (!!hexMsg && !!mySigInput) {
        common.web3.eth.sign(common.web3.eth.accounts[0], hexMsg, function(err, sig) {
            console.log('signHandler: got err = ' + err + ', sig = ' + sig);
            mySigInput.value = sig;
            sigHandler();
        });
    }
}


function listAccounts(ownerAddrs, ownerLables, div) {
    common.clearDivChildren(div);
    var transactionSignButton = document.getElementById('transactionSignButton');
    transactionSignButton.disabled = true;
    if (div.className.indexOf('accountListFormTable') < 0)
        div.className += ' accountListFormTable';
    var form = document.createElement('form');
    form.action = 'javascript:;';
    ownerSigInputs = [];
    mySigInput = null;
    for (var i = 0; i < ownerAddrs.length; ++i) {
        var prompt = document.createElement('input');
        prompt.value = ownerLables[i];
        prompt.disabled = true;
        prompt.size = 20;
        var acct = document.createElement('input');
        acct.value = ownerAddrs[i];
        acct.disabled = true;
        acct.size = 50;
        var sig = document.createElement('textarea');
        sig.value = '';
        sig.disabled = false;
        sig.rows = 2;
        sig.cols = 65;
        sig.onchange = sigHandler;
        sig.style['text-overflow'] = 'ellipsis';
        ownerSigInputs.push(sig);
        if (ownerAddrs[i].trim() == common.web3.eth.accounts[0]) {
            mySigInput = sig;
            sig.disabled = true;
        }
        var inputs = [ prompt, acct, sig ];
        var classes = [ 'accountListTD', 'accountListTD', 'accountListTD' ];
        addInputToFormTable(inputs, classes, form);
    }
    div.appendChild(form);
}



function addInputToFormTable(inputs, classes, f) {
    var d;
    var s;
    var t;
    (d = document.createElement("div")).className = 'tr';
    for (var i = 0; i < inputs.length; ++i) {
        var input = inputs[i];
        var inputClass = classes[i];
        if (!!input) {
            (s = document.createElement("span")).className = inputClass;
            s.appendChild(input);
            d.appendChild(s);
        }
    }
    f.appendChild(d);
}
