all:
	pkg includer.js -o includer
install: includer
	sudo cp includer /usr/local/bin

