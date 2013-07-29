BIN = ./node_modules/.bin
MOCHA = $(BIN)/mocha
ISTANBUL = $(BIN)/istanbul
JSHINT = $(BIN)/jshint
JSCS = $(BIN)/jscs
NPM = npm

.PHONY: validate
validate: node_modules lint test

.PHONY: test
test: clean node_modules
	npm run-script func-test

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .

.PHONY: clean
clean:
	npm run-script clean-build

.PHONY: node_modules
node_modules:
	@$(NPM) install
