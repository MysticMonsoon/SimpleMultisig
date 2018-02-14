
//
// fcns related to web3.eth
//
var common = require('./common');
var ethUtils = require('ethereumjs-util');
var ethtx = require('ethereumjs-tx');
var ethabi = require('ethereumjs-abi');
var Buffer = require('buffer/').Buffer;
var BN = require("bn.js");

var ether = module.exports = {


    abi_encode_SimpleMultiSig_parms: function(threshold, owners) {
	if (threshold.startsWith('0x'))
	    threshold = threshold.substring(2);
	console.log('abi_encode_SimpleMultiSig_parms: threshold = ' + threshold + ', owners[0] =  ' + owners[0]);
	encoded = ethabi.rawEncode([ 'uint256', 'address[]' ], [ new BN(threshold, 16), owners ] ).toString('hex');
	console.log('abi_encode_SimpleMultiSig_parms: encoded = ' + encoded);
	return(encoded);
    },

    abi_encode_SimpleMultiSig_execute_parms: function(sigV, sigR, sigS, destination, value, data) {
    },

    //
    // compare function to sort addresses, cuz the SimpleMultiSig contract requires
    // addresses to be ordered.
    //
    addressCompare: function(a, b) {
	if (a.startsWith('0x'))
	    a = a.substring(2);
	if (b.startsWith('0x'))
	    b = b.substring(2);
	var bigA = new BN(a, 16);
	var bigB = new BN(b, 16);
	return(bigA.ucmp(bigB));
    },

    //
    // units: 'szabo' | 'finney' | 'ether'
    //
    getBalance: function(acct, units, callback) {
	if (!acct)
	    acct = common.web3.eth.accounts[0];
	common.web3.eth.getBalance(acct, function (err, balance) {
	    console.log('get_balance bal = ' + balance.toString() + ', type = ' + typeof(balance));
	    callback(common.web3.fromWei(balance, units).toString());
	});
    },

    getNonce: function(acct, callback) {
	console.log('ether.getNonce: acct = ' + acct);
	common.web3.eth.getTransactionCount(acct, 'latest', function(err, nonce) {
	    console.log('ether.getNonce: nonce = ' + nonce);
	    callback(nonce);
	});
    },

    //
    // units: 'szabo' | 'finney' | 'ether'
    //
    send: function(to_addr, size, units, data, gasLimit, callback) {
	var tx = {};
	tx.from = common.web3.eth.accounts[0];
	tx.value = common.web3.toWei(size, units);
	if (!!to_addr)
	    tx.to = to_addr;
	tx.data = data;
	common.web3.eth.estimateGas(tx, function(err, estimatedGas) {
	    console.log('ether.send: estimated gas = ' + estimatedGas);
	    tx.gas = (!!gasLimit) ? gasLimit : Math.floor(estimatedGas * 1.1);
	    console.log('ether.send: calling sendTransaction');
	    common.web3.eth.sendTransaction(tx, callback)
	});
    },

    //
    //txidCallback(err, txid, contractInstace)
    //after you get the txidCallback you still need to wait for the transaction to be mined. at
    //that time get the contract addr from the transactionReceipt.
    //
    deployContract: function(abi, bin, parmsHex, gasLimit, txidCallback) {
	parmsHex = ethUtils.stripHexPrefix(parmsHex);
	var contract = common.web3.eth.contract(JSON.parse(abi));
	console.log('ether.deployContract: contract: ' + contract);
	console.log('ether.deployContract: bin: ' + bin);
	var tx = {};
	tx.from = common.web3.eth.accounts[0];
	tx.value = 0;
	tx.data = bin + parmsHex;
	common.web3.eth.estimateGas(tx, function(err, estimatedGas) {
	    console.log('ether.deployContract: estimated gas = ' + estimatedGas);
	    tx.gas = (!!gasLimit) ? gasLimit : Math.floor(estimatedGas * 1.1);
	    //note: the returned myContractReturned === myContract
	    var myContractReturned = contract.new(tx, function(err, myContract) {
		if (!!err) {
		    console.log('ether.deployContract: err = ' + err);
		    txidCallback(err, null, null);
		} else {
		    console.log('ether.deployContract: txid = ' + myContract.transactionHash);
		    txidCallback(null, myContract.transactionHash, myContract);
		}
	    });
	});
    },

    getContractInstance: function(contractAddr, abi) {
	var contract = common.web3.eth.contract(JSON.parse(abi));
	var contractInstance = contract.at(contractAddr);
	return(contractInstance);
    },

    getContractCreationTx: function(abi, addr, callback) {
	var contract = common.web3.eth.contract(JSON.parse(abi));
	var contractInstance = contract.at(addr);
	console.log('getContractCreationTx: contract at ' + addr + ' instantiated by txid ' + contractInstance.transactionHash);
	callback(contractInstance.transactionHash);
    },


    //
    // get transactions for passed address
    // uses etherscan.io
    // cb(err, txList)
    // note that each object in txList contains:
    // blockNumber, timeStamp, hash, nonce, blockHash, transactionIndex, from, to, value, gas,
    // gasPrice, isError, input, contractAddress, cumulativeGasUsed, gasUsed, confirmations
    //
    getTransactions: function(acct, count, callback) {
	var offset = count;
	var tx_URL = 'https://api.etherscan.io/api?module=account&action=txlist&address=' + acct + '&startblock=0&endblock=99999999&page=1&offset=' + offset + '&sort=desc';
	common.fetch(tx_URL, function(str, err) {
	    if (!str || !!err) {
		console.log('ether.getTransactions: err = ' + err);
		callback(err, null);
	    } else {
		//typical response is:
		//
		// {"status":"1","message":"OK","result":
		//  [
		//   { "blockNumber":"65342", "timeStamp":"1439235315", "hash":"0x621de9a006b56c425d21ee0e04ab25866fff4cf606dd5d03cf677c5eb2172161",
		//     "nonce":"1", "blockHash":"0x889d18b8791f43688d07e0b588e94de746a020d4337c61e5285cd97556a6416e", "transactionIndex":"0",
		//     "from":"0x3fb1cd2cd96c6d5c0b5eb3322d807b34482481d4", "to":"0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae", "value":"0",
		//     "gas":"122269", "gasPrice":"50000000000", "isError":"0", "input":"...","contractAddress":"","cumulativeGasUsed":"122207",
		//     "gasUsed":"122207","confirmations":"4215300"
		//   },
		//	   .....
		//  ]
		// }
		//or
		//null
		console.log('ether.getTransactions: rsp = ' + str);
		var response = JSON.parse(str);
		if (!response || response.status != '1' || response.message != 'OK') {
		    console.log('ether.getTransactions: error!');
		    if (!!response)
			console.log('ether.getTransactions: status = ' + response.status + ', message = ' + response.message);
		    callback('Error in query', null);
		} else {
		    callback(null, response.result);
		}
	    }
	});
    },

    //shorthand to use ecrecover on a hex message and combined ECDSA signature
    //returns recovered address
    ecrecover: function(msgHash, signature) {
	console.log('ether.ecrecover: msgHash = ' + msgHash + ', length = ' + msgHash.length);
	console.log('ether.ecrecover: signature = ' + signature + ', length = ' + signature.length);
	msgHash = ethUtils.stripHexPrefix(msgHash);
	signature = ethUtils.stripHexPrefix(signature);
	var r = '0x' + signature.substring(0, 64);
	var s = '0x' + signature.substring(64, 128);
	var v = '0x' + signature.substring(128, 130);
	console.log('ether.ecrecover: v = ' + v + ', r = ' + r + ', s = ' + s);
	const msgBuf = new Buffer(msgHash, 'hex');
	const pubKey = ethUtils.ecrecover(msgBuf, v, r, s);
	const addrBuf = ethUtils.pubToAddress(pubKey);
	const addr    = ethUtils.bufferToHex(addrBuf);
	console.log('ether.ecrecover: addr = ' + addr);
	return(addr);
    },
};
