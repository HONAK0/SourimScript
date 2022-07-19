all:
	node src/SourimScript-Runtime.js test.sst
modules:
	sudo npm i prompt-sync
#alld:
#	pkg src/SourimScript-Runtime.js --out-path dist
#	./dist/SourimScript-Runtime-linux test.sst