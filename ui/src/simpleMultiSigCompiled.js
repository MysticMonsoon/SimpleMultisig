/*
 * user interface for simple multisig wallet - written for riverdimes, inc.
 *
 * @author Pratyush Bhatt - 2018
 *
 * abi, bin, help strings relating to simple multisig contract
 *
 */

var SimpleMultiSigCompiled = module.exports = {

    bin:
    '0x6060604052341561000f57600080fd5b60405161097138038061097183398101604052808051906020019091908051820191905050600080600a83511115801561004a575082518411155b8015610057575060008414155b151561006257600080fd5b60009150600090505b825181101561015b578173ffffffffffffffffffffffffffffffffffffffff16838281518110151561009957fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff161115156100c557600080fd5b60016002600085848151811015156100d957fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550828181518110151561014257fe5b906020019060200201519150808060010191505061006b565b8260039080519060200190610171929190610182565b50836001819055505050505061024f565b8280548282559060005260206000209081019282156101fb579160200282015b828111156101fa5782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550916020019190600101906101a2565b5b509050610208919061020c565b5090565b61024c91905b8082111561024857600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101610212565b5090565b90565b6107138061025e6000396000f300606060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806342cde4e814610064578063aa5df9e21461008d578063affed0e0146100f0578063f12d394f14610119575b005b341561006f57600080fd5b61007761025e565b6040518082815260200191505060405180910390f35b341561009857600080fd5b6100ae6004808035906020019091905050610264565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100fb57600080fd5b6101036102a3565b6040518082815260200191505060405180910390f35b341561012457600080fd5b61025c600480803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091908035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506102a9565b005b60015481565b60038181548110151561027357fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60005481565b60008060008060015489511415156102c057600080fd5b875189511480156102d2575089518951145b15156102dd57600080fd5b60197f01000000000000000000000000000000000000000000000000000000000000000260007f0100000000000000000000000000000000000000000000000000000000000000023089898960005460405180887effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152600101877effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526001018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140184815260200183805190602001908083835b60208310151561047d5780518252602082019150602081019050602083039250610458565b6001836020036101000a0380198251168184511680821785525050505050509050018281526020019750505050505050506040518091039020935060009250600091505b600154821015610638576001848b848151811015156104dc57fe5b906020019060200201518b858151811015156104f457fe5b906020019060200201518b8681518110151561050c57fe5b90602001906020020151604051600081526020016040526000604051602001526040518085600019166000191681526020018460ff1660ff16815260200183600019166000191681526020018260001916600019168152602001945050505050602060405160208103908084039060008661646e5a03f1151561058e57600080fd5b50506020604051035190508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1611801561061d5750600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b151561062857600080fd5b80925081806001019250506104c1565b6001600054016000819055508673ffffffffffffffffffffffffffffffffffffffff16868660405180828051906020019080838360005b8381101561068a57808201518184015260208101905061066f565b50505050905090810190601f1680156106b75780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876187965a03f19250505015156106db57600080fd5b505050505050505050505600a165627a7a723058208d6f42d53fd54bc0a866cc32fd97671614d5f297505791de2f49bc08b17070b00029',

    abi:
    '[{"constant":true,"inputs":[],"name":"threshold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ownersArr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nonce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sigV","type":"uint8[]"},{"name":"sigR","type":"bytes32[]"},{"name":"sigS","type":"bytes32[]"},{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"execute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"threshold_","type":"uint256"},{"name":"owners_","type":"address[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]',


    credits:
    '<br/>' +
	'The contract code for this Simple MultiSig Wallet was written by Christian Lundkvist.<br/>' +
	'Many thanks to Mr. Lundkvist for this contribution to the Ethereum community.<p/>' +
	'This front-end (website) code that interfaces-to the Simple MultiSig Wallet was written<br/>' +
	'by Pratush Bhatt, for Riverdimes, Inc. The source code is open-source and is available<br/>' +
	'on <a href="https://github.com/MysticMonsoon/TokenAuction" target="_blank">github</a>.<p/>' +
	'The following copyright notice applies only to the front-end. A similar copyright covers<br/>' +
	'the contract code.<p/>' +
	'<br/>' +
	'<br/>' +
	'  Copyright (c) 2018 Riverdimes, Inc.<br/><br/>' +
	'<br/>' +
	'  Permission is hereby granted, free of charge, to any person obtaining a copy<br/>' +
	'  of this software and associated documentation files (the "Software"), to deal<br/>' +
	'  in the Software without restriction, including without limitation the rights<br/>' +
	'  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell<br/>' +
	'  copies of the Software, and to permit persons to whom the Software is<br/>' +
	'  furnished to do so, subject to the following conditions:<br/>' +
	'<br/>' +
	'  The above copyright notice and this permission notice shall be included in all<br/>' +
	'  copies or substantial portions of the Software.<br/>' +
	'<br/>' +
	'  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR<br/>' +
	'  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,<br/>' +
	'  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE<br/>' +
	'  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER<br/>' +
	'  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,<br/>' +
	'  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE<br/>' +
	'  SOFTWARE.<br/>' +
	'<br/>',


    source:
    '<br/>' +
	'The multi-sig wallet that is deployed by this front-end was compiled from the unmodified Simple MultiSig Wallet Contract written by Christian Lundkvist<br/>' +
	'Mr. Lundkvist presented the idea <a href="https://medium.com/@ChrisLundkvist/exploring-simpler-ethereum-multisig-contracts-b71020c19037" target="_blank">here</a>' +
	'<p/><p/>' +
	'//<br/>' +
	'// Simple MultiSig Wallet Contract by Christian Lundkvist<br/>' +
	'// https://github.com/christianlundkvist/simple-multisig<br/>' +
	'//<br/>' +
	'//<br/>' +
	'//  Copyright (c) 2017 Christian Lundkvist<br/><br/>' +
	'//<br/>' +
	'//  Permission is hereby granted, free of charge, to any person obtaining a copy<br/>' +
	'//  of this software and associated documentation files (the "Software"), to deal<br/>' +
	'//  in the Software without restriction, including without limitation the rights<br/>' +
	'//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell<br/>' +
	'//  copies of the Software, and to permit persons to whom the Software is<br/>' +
	'//  furnished to do so, subject to the following conditions:<br/>' +
	'//<br/>' +
	'//  The above copyright notice and this permission notice shall be included in all<br/>' +
	'//  copies or substantial portions of the Software.<br/>' +
	'//<br/>' +
	'//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR<br/>' +
	'//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,<br/>' +
	'//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE<br/>' +
	'//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER<br/>' +
	'//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,<br/>' +
	'//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE<br/>' +
	'//  SOFTWARE.<br/>' +
	'//<br/>' +
	'pragma solidity 0.4.18;<br/>' +
	'contract SimpleMultiSig {<br/>' +
	'<br/>' +
	'  uint public nonce;                // (only) mutable state<br/>' +
	'  uint public threshold;            // immutable state<br/>' +
	'  mapping (address => bool) isOwner; // immutable state<br/>' +
	'  address[] public ownersArr;        // immutable state<br/>' +
	'<br/>' +
	'  function SimpleMultiSig(uint threshold_, address[] owners_) public {<br/>' +
	'    require(owners_.length <= 10 && threshold_ <= owners_.length && threshold_ != 0);<br/>' +
	'<br/>' +
	'    address lastAdd = address(0);<br/>' +
	'    for (uint i=0; i<owners_.length; i++) {<br/>' +
	'      require(owners_[i] > lastAdd);<br/>' +
	'      isOwner[owners_[i]] = true;<br/>' +
	'      lastAdd = owners_[i];<br/>' +
	'    }<br/>' +
	'    ownersArr = owners_;<br/>' +
	'    threshold = threshold_;<br/>' +
	'  }<br/>' +
	'<br/>' +
	'  // Note that address recovered from signatures must be strictly increasing<br/>' +
	'  function execute(uint8[] sigV, bytes32[] sigR, bytes32[] sigS, address destination, uint value, bytes data) public {<br/>' +
	'    require(sigR.length == threshold);<br/>' +
	'    require(sigR.length == sigS.length && sigR.length == sigV.length);<br/>' +
	'<br/>' +
	'    // Follows ERC191 signature scheme: https://github.com/ethereum/EIPs/issues/191<br/>' +
	'    bytes32 txHash = keccak256(byte(0x19), byte(0), address(this), destination, value, data, nonce);<br/>' +
	'<br/>' +
	'    address lastAdd = address(0); // cannot have address(0) as an owner<br/>' +
	'    for (uint i = 0; i < threshold; i++) {<br/>' +
	'      address recovered = ecrecover(txHash, sigV[i], sigR[i], sigS[i]);<br/>' +
	'      require(recovered > lastAdd && isOwner[recovered]);<br/>' +
	'      lastAdd = recovered;<br/>' +
	'    }<br/>' +
	'<br/>' +
	'    // If we make it here all signatures are accounted for<br/>' +
	'    nonce = nonce + 1;<br/>' +
	'    require(destination.call.value(value)(data));<br/>' +
	'  }<br/>' +
	'<br/>' +
	'  function () public payable {}<br/>' +
	'}<br/>' +
	'<br/>',


    help:
    '<br/>' +
	'<u>What is a MultiSig Wallet?</u><br/>' +
	'A &quot;MultiSig Wallet&quot; is a wallet that requires multiple signatures in order to spend or execute transactions. Standard Ethereum transactions can be thought-of as &quot;single-signature transactions,&quot; because transfers require only one signature -- from the owner of the private key associated with the source Ethereum account. A MultiSig Wallet supports much more complicated transactions that require the signatures of multiple people (accounts) before funds can be transferred out of the wallet (or before the wallet can perform any other sort of transaction). These are often referred to as M-of-N transactions. When you create a MultiSig Wallet you specify which accounts are the &quot;owners;&quot; that is, which accounts have authority to sign transactions (The number of owner accounts is N). You also specify how many signature are needed in order for a transaction to be executed. This is called the &quot;threshold.&quot; (The Threshold is M)<br/>' +
	'Note that anyone can send ETH to a MultiSig Wallet. The wallet can also own ERC20 tokens. However in order to spend the ETH that is within the MultiSig Wallet a special transaction needs to be constructed. That is because the source address is the MultiSig Wallet contract. This front-end can help you construct a transaction to spend the ETH that is within a MultiSig Wallet. The constructed transaction needs to specify a &quot;Nonce,&quot; which is a counter that is maintained within the contract to ensure that transactions cannot be replayed. Also the transaction needs to be signed by at least the number of owners specified by the Threshold.<p/>' +
	'<u>Creating a New MultiSig Wallet</u><br/>' +
	'To create a new MMultiSig Wallet click on the &quot;New Wallet&quot button.<img src="images/new_wallet.png" height="480" width="960"><br/>' +
	'Enter a name for the wallet, and begin adding the Ethereum accounts of the owners. By default the first account is the current MetaMask account, but you can change this. It is recommended that you specify a label for each owner that you add. After you have added all the owners select the Threshold from the dropdown. When you click &quot;Deploy This Wallet,&quot; the contract will be published on the blockchain. After the contract is deployed you can select the wallet to view/edit or to generate a transaction by clicking on the &quot;View Wallet,&quot; or &quot;Transaction&quot; buttons.<p/>' +
	'<u>Importing an Already-Deployed MultiSig Wallet</u><br/>' +
	'In most use-cases for MultiSig Wallets the owner accounts belong to different people. Typically in such a case one person will collect the personal account addresses from all the other owners (for example via email exchanges), and wil create and deploy the wallet. Once the wallet has been deployed the person that created it can send the address of the wallet to all the other owners (again, using email, for example). In order to use the wallet each owner unlocks their Ethereum account in MetaMask and then clicks the &quot;Import Wallet&quot; button. After entering the address of the wallet and clicking the &quot;Load Wallet&quot; button, a screen like this will be displayed:<img src="images/load_wallet.png" height="480" width="960"><br/>' +
	'Note that each owner needs to re-enter the wallet name and the labels for each owner account, since this information is not saved on the blockchain.<p/>' +
	'<u>View/Edit or Share a Wallet</u><br/>' +
	'When you click the &quot;View Wallet&quot; button you can select a saved MultiSig Wallet from the drop-down selector. ' +
	'<img src="images/view_wallet.png" height="480" width="960"><br/>' +
	'When you select a wallet the information bar immediately below the drop-down selector show the wallet contract&apos;s address on the blockchain, the threshold, balance in the wallet (in ETH), and the current nonce (number of completed transactions <i>from</i> the wallet). In the box below the information bar you will see the name of the wallet, the address of the wallet contract on the blockchain, the Threshold, a list of all the owner accounts with and the label for each owner account. If you like, you can edit the wallet name and the labels of the owner accounts, and then re-save the wallet. You cannot edit the account addresses or the threshold, since that information in un-changable in the wallet contract.<br/>' +
	'Tip: After you create a new wallet, to easily share a wallet&apos;s information with other owners, copy the information from this page and email it to the other owners.<p/>' +
	'<u>Creating a Transaction</u><br/>' +
	'Anyone can send ETH to a MultiSig Wallet by using the wallet&apos; contract address as the destination address. However sending ETH <i>out</i> of a multisig wallet requires that you first construct the transaction; then get the requisite number of owners to &quot;sign&quot; the transaction (the number of required owner signatures is specified by the Threshold); and finally submit the tranaction, together with the collected signatures. To start this process click on the &quot;Transaction&quot; button and select the wallet from which you want to send a transaction.' +
	'<img src="images/transaction.png" height="480" width="960"><br/>' +
	'The screenshot above shows a transaction which will send 0.5 ETH (<b>specified in WEI!</b>) to the Ethereum address 0xffcf8fdee72ac11b5c542428b35eef5769c409f0, which is in this case the address of one of the owners. By default the nonce is set to the current nonce in the wallet. While it is possible to set the nonce to some other value, such a transaction could not be executed until after all previous transactions; that is, transactions will only be processed in order, without any skips.<br/>' +
	'If you are one of the owners, and you unlock the MetaMask account that is the owner account, then you will be able to sign the transaction. The screenshot shows the transaction signed by the account with the Ethereum address 0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1. Other owners will need to import the wallet; set up the same transaction; and then sign the transaction. All of the signatures can be collected, for example, via email. Finally after collecting the requisite number of signatures, someone (not necessarily an owner), can submit the transaction by clicking the &quot;Execute this transaction&quot; button.<br/>' +
	'Tips:<br/>' +
	' * You can use an <a href="https://etherconverter.online/" target="_blank">Ether Unit Converter</a> to convert from ETH to WEI -- Remember, you need to specify the transaction value in WEI!<br/>' +
	' * In order to ensure that you have copied the transaction information correctly from another owner, you can compare the transaction hash. It should match exactly.<br/>' +
	' * The information in the &quot;Owner Signatures&quot; box is generally not super confidential -- so it can be shared in an email. That is to say, the private keys of the owner accounts cannot be derived from the signatures. Of course, if other information, such as the owner labels is sensitive, then only share this information through a secure communications medium.' +
    '<br/>',
}
