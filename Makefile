BIN = ./node_modules/.bin
MOCHA = $(BIN)/mocha
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

.PHONY: build_fixtures
build_fixtures: node_modules
	cd test/fixtures/bemhtml && YENV=development ../../../node_modules/.bin/enb make --no-cache
	cd test/fixtures/bemhtml-old && YENV=development ../../../node_modules/.bin/enb make --no-cache
	cd test/fixtures/bemtree && YENV=development ../../../node_modules/.bin/enb make --no-cache
	cd test/fixtures/bemtree-old && YENV=development ../../../node_modules/.bin/enb make --no-cache

.PHONY: clean
clean:
	npm run-script clean-build

.PHONY: node_modules
node_modules:
	@$(NPM) install
