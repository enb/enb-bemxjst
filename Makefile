BIN = node_modules/.bin
MOCHA = $(BIN)/mocha
JSHINT = $(BIN)/jshint
JSCS = $(BIN)/jscs
ENB = $(BIN)/enb
NPM = npm

.PHONY: validate
validate: lint test

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .

.PHONY: test
test: clean build
	$(MOCHA) -u bdd -R spec --recursive test/func

.PHONY: build
build:
	cd test/fixtures/bemhtml && YENV=development ../../../$(ENB) make --no-cache
	cd test/fixtures/bemhtml-old && YENV=development ../../../$(ENB) make --no-cache
	cd test/fixtures/bemtree && YENV=development ../../../$(ENB) make --no-cache
	cd test/fixtures/bemtree-old && YENV=development ../../../$(ENB) make --no-cache

.PHONY: clean
clean:
	cd test/fixtures/bemhtml && ../../../$(ENB) make clean
	cd test/fixtures/bemhtml-old && ../../../$(ENB) make clean
	cd test/fixtures/bemtree && ../../../$(ENB) make clean
	cd test/fixtures/bemtree-old && ../../../$(ENB) make clean
