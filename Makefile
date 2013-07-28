BIN = ./node_modules/.bin
MOCHA = $(BIN)/mocha
ISTANBUL = $(BIN)/istanbul
JSHINT = $(BIN)/jshint
JSCS = $(BIN)/jscs
NPM = npm

.PHONY: test
test: node_modules
	npm run-script func-test

.PHONY: validate
validate: lint test

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .

.PHONY: node_modules
node_modules:
	@$(NPM) install
