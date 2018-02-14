//
// common functions -- no dependancies!
//

var common = module.exports = {

    web3: null,
    SZABO_PER_ETH: 1000000,

    //
    // if requireAcct, then not only must mm be installed, but also an acct must be unlocked
    // callback(err, myWeb3)
    //
    checkForMetaMask: function(requireAcct, cb) {
	if (typeof web3 === 'undefined') {
	    cb('You must enable the MetaMask plugin to use this utility', null);
	} else {
	    common.web3 = new Web3(web3.currentProvider);
	    console.log('found metamask');
	    web3.version.getNetwork((err, netId) => {
		if (!!err)
		    cb(err,null)
		else if (false && netId != "1")
		    cb('MetaMask must be set to mainnet!', null);
		else if (!!requireAcct && !web3.eth.accounts[0])
		    cb('To use this utility, a MetaMask account must be unlocked', null);
		else
		    cb(null, common.web3);
	    });
	}
    },


    Wallet: function(name, contractAddr, ownerLabels, ownerAddrs, threshold) {
	this.contractAddr = contractAddr;
	this.threshold = threshold;
	this.ownerAddrs = (!!ownerAddrs) ? ownerAddrs : [];
	this.name = (!!name) ? name : 'unnamed';
	if (!!ownerLabels) {
	    this.ownerLabels = ownerLabels;
	} else {
	    this.ownerLabels = [];
	    for (var i = 0; i < ownerAddrs.length; ++i)
		this.ownerLabels.push('no label');
	}
    },

    getWalletList: function() {
	var savedWallets = {};
	var savedWalletsJSON = localStorage['SavedWallets'];
	if (!!savedWalletsJSON)
	    savedWallets = JSON.parse(savedWalletsJSON);
	return(Object.keys(savedWallets));
    },

    getWallet: function(contractAddr) {
	var wallet = null;
	var walletJSON = localStorage[contractAddr];
	if (!!walletJSON)
	    wallet = JSON.parse(walletJSON);
	return(wallet);
    },

    saveWallet: function(wallet) {
	var walletJSON = JSON.stringify(wallet);
	localStorage[wallet.contractAddr] = walletJSON;
	var savedWallets = {};
	var savedWalletsJSON = localStorage['SavedWallets'];
	if (!!savedWalletsJSON)
	    savedWallets = JSON.parse(savedWalletsJSON);
	savedWallets[wallet.contractAddr] = wallet.name;
	savedWalletsJSON = JSON.stringify(savedWallets);
	localStorage['SavedWallets'] = savedWalletsJSON;
    },

    retrieve_username: function() {
	console.log('in retrieve_username... localStorage["username"] = ' + localStorage["username"]);
	/*
	if (localStorage["username"] == null)
	    bg.bglog('is null');
	else
	    bg.bglog('is not null');
	if (!!localStorage["username"])
	    bg.bglog('!!localStorage["username"] is true');
	else
	    bg.bglog('!!localStorage["username"] is false');
	*/
	callback((!localStorage["username"]) ? "" : localStorage["username"]);
    },


    fetch: function(url, callback) {
	var timeout = false;
	var complete = false;
	var fetch_timer = setTimeout(function() {
	    timeout = true;
	    if (complete == true) {
		return;
	    } else {
		console.log("common.fetch: timeout retrieving " + url);
		callback("", "timeout");
	    }
	}, 15000);
	console.log('common.fetch: fetching ' + url);
	var request = new Request(url);
	fetch(request, { mode: 'cors'} ).then(function(resp) {
	    console.log('common.fetch: got resp = ' + resp + ', status = ' + resp.status + ', (' + resp.statusText + ')');
	    clearTimeout(fetch_timer);
	    complete = true;
	    if (timeout == true) {
		console.log("common.fetch: fetch returned after timeout! url = " + url);
		return;
	    }
	    if (resp.ok) {
		resp.text().then(function(str) {
		    callback(str, "");
		});
	    } else {
		console.log("common.fetch: got err = " + resp.blob());
		callback("", "unknown");
	    }
	}).catch(function(error) {
	    console.log("common.fetch: exeption = " + error);
	    complete = true;
	    callback("", error);
	});
    },


    //callback(err, transactionReceipt)
    waitForTXID: function(txid, desc, statusDiv, callback) {
	var statusCtr = 0;
	var statusText = document.createTextNode('No status yet...');
	//status div starts out hidden
	statusDiv.style.display = "block";
	statusDiv.appendChild(statusText);
	var link = document.createElement('a');
	link.href = 'https://etherscan.io/tx/' + txid;
	link.innerHTML = "<h3>View transaction</h3>";
	link.target = '_blank';
	link.disabled = false;
	statusDiv.appendChild(link);
	var timer = setInterval(function() {
	    statusText.textContent = 'Waiting for ' + desc + ' transaction: ' + ++statusCtr + ' seconds...';
	    if ((statusCtr & 0xf) == 0) {
		common.web3.eth.getTransactionReceipt(txid, function(err, receipt) {
		    if (!!err || !!receipt) {
			if (!err && !!receipt && receipt.status == 0)
			    err = "Transaction Failed with REVERT opcode";
			statusText.textContent = (!!err) ? 'Error in ' + desc + ' transaction: ' + err : desc + ' transaction succeeded!';
			console.log('transaction is in block ' + (!!receipt ? receipt.blockNumber : 'err'));
			//statusText.textContent = desc + ' transaction succeeded!';
			clearInterval(timer);
			callback(err, receipt);
			return;
		    }
		});
	    }
	}, 1000);
    },

    clearDivChildren: function(div) {
	while (div.hasChildNodes()) {
            div.removeChild(div.lastChild);
	}
    },

};
