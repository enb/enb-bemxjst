BIN = ./node_modules/.bin
MOCHA = $(BIN)/mocha
ISTANBUL = $(BIN)/istanbul
JSHINT = $(BIN)/jshint
JSCS = $(BIN)/jscs

.PHONY: test
test:
	npm run-script build-bemhtml && npm run-script build-bemhtml-old &&  $(MOCHA) -u bdd -R spec --recursive

.PHONY: validate
validate: lint test

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .
