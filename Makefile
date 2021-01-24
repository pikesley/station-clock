PROJECT = $(shell basename $$(pwd))
ID = pikesley/${PROJECT}

PLATFORM ?= laptop

all: build

build: laptop-only
	docker build \
		--tag ${ID} .

run: laptop-only
	docker run \
		--interactive \
		--tty \
		--name ${PROJECT} \
		--volume $(shell pwd):/opt/${PROJECT} \
		--publish 8080:80 \
		--rm \
		${ID} bash

serve: docker-only
	service nginx start

sass: docker-only
	rm d3clock/css/styles.css
	sass d3clock/css/styles.scss d3clock/css/styles.css

###

docker-only:
	@ if [ "${PLATFORM}" != "docker" ] ;\
		then \
			echo "This target can only be run inside the container" ;\
			exit 1 ;\
		fi

laptop-only:
	@ if [ "${PLATFORM}" != "laptop" ] ;\
		then \
			echo "This target can only be run on the laptop" ;\
			exit 1 ;\
		fi
