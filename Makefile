BIN = ./node_modules/.bin
MOCHA = $(BIN)/mocha
ISTANBUL = $(BIN)/istanbul
JSHINT = $(BIN)/jshint
JSCS = $(BIN)/jscs
NPM = npm

.PHONY: test
test: node_modules
	npm run-script build-bemhtml && npm run-script build-bemhtml-old &&  $(MOCHA) -u bdd -R spec --recursive

.PHONY: validate
validate: lint test

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .

.PHONY: node_modules
node_modules:
	@$(NPM) install
