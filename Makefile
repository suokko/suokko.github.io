BROWSER?=xdg-open
JSCOVERAGE?=jscoverage
PYTHON?=python
SERVER?=/usr/lib/python2.7/SimpleHTTPServer.py

SOURCES=$(wildcard *.js)

TESTFILES=$(shell find test -type f)

all: test

test: coverage/jscoverage.html Makefile start
	${BROWSER} http://localhost:8000/jscoverage.html?test/unittest.html

coverage/jscoverage.html: ${addprefix src/, ${SOURCES}} ${TESTFILES} Makefile
	 ${JSCOVERAGE} --encoding=UTF-8 src coverage
	 cp -r test coverage/

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
	cd coverage && ${PYTHON} ${SERVER} 8000 > /dev/null 2> /dev/null &
	touch start

stop: start
	kill `ps -C python -T -o pid=`
	rm start
