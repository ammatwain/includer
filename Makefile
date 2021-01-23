all:
	pkg innesta.js -o innesta
install: innesta
	sudo cp innesta /usr/local/bin

