BROWSER?=xdg-open
JSCOVERAGE?=jscoverage
SERVER?=http-server

SOURCES=$(wildcard *.js)

TESTFILES=$(shell find test -type f) \
	$(wildcard *.css)

all: test

test: coverage/jscoverage.html Makefile start
	${BROWSER} http://localhost:8000/test/unittest.html

coverage/deal.js: ${addprefix src/, ${SOURCES}} ${TESTFILES} Makefile coverage
	cp -r test coverage/
	cp $(wildcard *.css) $(wildcard src/*) coverage/

${addprefix src/, ${SOURCES}}: src Makefile

src:
	mkdir -p src

coverage:
	mkdir -p coverage

src/%.js: %.js
	cp $< $@

clean:
	rm -rf src coverage

start: coverage
	${SERVER} $< -p 8000 -a localhost > /dev/null 2> /dev/null & \
		echo "$$!" > start

stop: start
	kill $(shell cat start)
	rm start
