
ALL:	bundle/index.js   \
	fake

bundle/index.js: src/index.js bundle/loadWallet.js bundle/viewWallet.js bundle/transaction.js bundle/ether.js bundle/simpleMultiSigCompiled.js bundle/common.js
	browserify src/index.js -s index -o bundle/index.js

bundle/loadWallet.js: src/loadWallet.js bundle/ether.js bundle/common.js
	browserify src/loadWallet.js -o bundle/loadWallet.js

bundle/viewWallet.js: src/viewWallet.js bundle/ether.js bundle/common.js
	browserify src/viewWallet.js -o bundle/viewWallet.js

bundle/transaction.js: src/transaction.js bundle/ether.js bundle/simpleMultiSigCompiled.js bundle/common.js
	browserify src/transaction.js -o bundle/transaction.js

bundle/ether.js: src/ether.js bundle/common.js
	browserify src/ether.js -o bundle/ether.js

bundle/simpleMultiSigCompiled.js: src/simpleMultiSigCompiled.js
	browserify src/simpleMultiSigCompiled.js -o bundle/simpleMultiSigCompiled.js

bundle/common.js: src/common.js
	browserify src/common.js -o bundle/common.js

fake:	bundle/index.js bundle/loadWallet.js bundle/viewWallet.js bundle/transaction.js bundle/ether.js bundle/simpleMultiSigCompiled.js bundle/common.js
	./set_timestamp.sh
