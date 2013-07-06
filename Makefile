BIN = ./node_modules/.bin
MOCHA = $(BIN)/mocha
ISTANBUL = $(BIN)/istanbul
JSHINT = $(BIN)/jshint
JSCS = $(BIN)/jscs

.PHONY: test
test:
	npm run-script build-bemhtml && $(MOCHA) -u bdd -R spec --recursive

.PHONY: validate
validate: lint test

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .
