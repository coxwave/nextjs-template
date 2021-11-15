test:
	yarn
	jest --forceExit --config ./jest.config.js --maxWorkers=8 --detectOpenHandles

docs:
	apidoc -i ./src/pages/ -o ./public/docs/ -t ./apidoc-template

clean:
	@rm -rf ./node_modules
	@rm -rf ./.next
	yarn install

build: docs
	next build
