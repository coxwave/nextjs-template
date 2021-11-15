test:
	yarn install
	jest --verbose --runInBand --forceExit --config ./jest.config.js 

docs:
	apidoc -i ./src/pages/ -o ./public/docs/ -t ./apidoc-template

clean:
	@rm -rf ./node_modules
	@rm -rf ./.next
	yarn install

build: docs
	next build