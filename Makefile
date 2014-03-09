BIN = node_modules/.bin
MOCHA = $(BIN)/mocha
JSHINT = $(BIN)/jshint
JSCS = $(BIN)/jscs
ENB = $(BIN)/enb

.PHONY: validate
validate: lint test

.PHONY: lint
lint: npm_deps
	$(JSHINT) .
	$(JSCS) -c .jscs.js .

.PHONY: test
test: npm_deps clean examples
	$(MOCHA) test/func

.PHONY: examples
examples: npm_deps
	cd examples/bemhtml && YENV=development ../../$(ENB) make --no-cache
	cd examples/bemhtml-old && YENV=development ../../$(ENB) make --no-cache
	cd examples/bemtree && YENV=development ../../$(ENB) make --no-cache
	cd examples/bemtree-old && YENV=development ../../$(ENB) make --no-cache

.PHONY: clean
clean: npm_deps
	cd examples/bemhtml && ../../$(ENB) make clean
	cd examples/bemhtml-old && ../../$(ENB) make clean
	cd examples/bemtree && ../../$(ENB) make clean
	cd examples/bemtree-old && ../../$(ENB) make clean

.PHONY: npm_deps
npm_deps:
	npm install
