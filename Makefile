SHELL := /bin/bash

build: install
	rm -rf dist

	@# Don't bundle so internal CDK constructs continue working on clients
	pnpm exec tsc --outDir dist

	@# remove all tests from distribution
	@-find -E ./dist -regex '.*\.test\..*|.*__tests.*' -exec rm -rf {} \;

generate-wso2apim-clients:
	rm -rf src/v1/generated
	# nice straightforward usage but more complex types
	pnpm dlx openapi-typescript@5 docs/publisher-v1.yaml --output src/v1/generated/types/publisher.ts
	pnpm dlx openapi-typescript@5 docs/devportal-v1.yaml --output src/v1/generated/types/devportal.ts

	# not so straighforward, but simpler types (that are not working with wso2 schema)
	# pnpm dlx openapi-typescript-codegen -i docs/devportal-v1.yaml -o src/generated/devportal --client axios
	# pnpm dlx openapi-typescript-codegen -i docs/publisher-v1.yaml -o src/generated/publisher --client axios

	# pnpm dlx swagger-typescript-api -p docs/devportal-v1.json -o src/generated/devportal -n myApi.ts

	# not working with pnpm
	# pnpm dlx @openapitools/openapi-generator-cli generate -i docs/devportal-v1.yaml -o src/generated/devportal
	# pnpm dlx @openapitools/openapi-generator-cli generate -i docs/publisher-v1.yaml -o src/generated/publisher

lint:
	pnpm exec eslint ./src --ext .ts
	pnpm audit

test: unit-tests

unit-tests:
	pnpm exec jest --verbose

clean:
	rm -rf node_modules
	rm -rf dist

all: build lint test

install:
	corepack enable
	pnpm install --frozen-lockfile --config.dedupe-peer-dependents=false

publish:
	@if [ "$${NPM_ACCESS_TOKEN}" == "" ]; then \
		echo "env NPM_ACCESS_TOKEN is required"; \
		exit 1; \
	fi

	git config --global user.email "flaviostutz@gmail.com"
	git config --global user.name "Flávio Stutz"
	npm version from-git --no-git-tag-version

	echo "" >> .npmrc
	echo "//registry.npmjs.org/:_authToken=$${NPM_ACCESS_TOKEN}" >> .npmrc
	pnpm publish --no-git-checks
