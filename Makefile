E2E_URL ?=
PKGNAME ?= $(shell cat package.json \
  | grep name \
  | head -1 \
  | awk '{ print $$2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

REGISTRY_SERVER_ADDRESS ?= release.daocloud.io
REGISTRY_REPO ?= $(REGISTRY_SERVER_ADDRESS)/datatunerx
REGISTRY_USER_NAME ?=
REGISTRY_PASSWORD ?=

IMAGE_VERSION := $(shell ./scripts/get-version.sh)

.PHONY: lint
lint:
	npm run lint

.PHONY: unit-test
unit-test:
	npm run test:unit:ci

.PHONY: e2e-test
e2e-test:
	npx vue-cli-service test:e2e --headless --url ${E2E_URL}

.PHONY: build-image
build-image:
	ls
	echo "${REGISTRY_SERVER_ADDRESS}"
	echo "${REGISTRY_USER_NAME}"
	echo "${REGISTRY_PASSWORD}"
	export DOCKER_CLI_EXPERIMENTAL=enabled ;\
	! ( docker buildx ls | grep ${PKGNAME}-platform-builder ) && docker buildx create --use --platform=linux/arm64,linux/amd64 --name ${PKGNAME}-platform-builder ;\
	docker buildx build \
			--builder ${PKGNAME}-platform-builder \
			--platform linux/arm64,linux/amd64 \
			--tag $(REGISTRY_REPO)/${PKGNAME}:$(IMAGE_VERSION)  \
			-f Dockerfile \
			--push \
			.

.PHONY: docker-login
docker-login:
	docker login -u "${REGISTRY_USER_NAME}" -p "${REGISTRY_PASSWORD}" "${REGISTRY_SERVER_ADDRESS}"

.PHONY: release
release: docker-login build-image

.PHONY: deploy-dev
deploy-dev:
	kubectl -n datatunerx --kube-config ~/.kube/datatunerx set image deployment/datatunerx-ui datatunerx-ui=$(REGISTRY_REPO)/${PKGNAME}:$(IMAGE_VERSION)