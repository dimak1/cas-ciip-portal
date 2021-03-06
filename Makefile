SHELL := /usr/bin/env bash
include .pipeline/oc.mk

PATHFINDER_PREFIX := wksv3k
PROJECT_PREFIX := cas-

THIS_FILE := $(lastword $(MAKEFILE_LIST))

.PHONY: help
help: $(call make_help,help,Explains how to use this Makefile)
	@@exit 0

.PHONY: targets
targets: $(call make_help,targets,Lists all targets in this Makefile)
	$(call make_list_targets,$(THIS_FILE))

.PHONY: whoami
whoami: $(call make_help,whoami,Prints the name of the user currently authenticated via `oc`)
	$(call oc_whoami)

.PHONY: project
project: whoami
project: $(call make_help,project,Switches to the desired $$OC_PROJECT namespace)
	$(call oc_project)

.PHONY: lint
lint: $(call make_help,lint,Checks the configured yml template definitions against the remote schema using the tools namespace)
lint: OC_PROJECT=$(OC_TOOLS_PROJECT)
lint: whoami
	$(call oc_lint)

.PHONY: configure
configure: $(call make_help,configure,Configures the tools project namespace for a build)
configure: OC_PROJECT=$(OC_TOOLS_PROJECT)
configure: whoami
	$(call oc_configure)

.PHONY: build_schema
build_schema: $(call make_help,build_schema,Builds the schema source into an image in the tools project namespace)
build_schema: OC_PROJECT=$(OC_TOOLS_PROJECT)
build_schema: whoami
	$(call oc_build,$(PROJECT_PREFIX)ciip-portal-schema)


.PHONY: build_app
build_app: $(call make_help,build_app,Builds the app source into an image in the tools project namespace)
build_app: OC_PROJECT=$(OC_TOOLS_PROJECT)
build_app: whoami
	$(call oc_build,$(PROJECT_PREFIX)ciip-portal-app)

.PHONY: build
build: $(call make_help,build,Builds the source into an image in the tools project namespace)
build: build_schema
build: build_app

PREVIOUS_DEPLOY_SHA1=$(shell $(OC) -n $(OC_PROJECT) get job $(PROJECT_PREFIX)ciip-portal-schema-deploy --ignore-not-found -o go-template='{{index .metadata.labels "cas-pipeline/commit.id"}}')

.PHONY: install
install: whoami
install:
	$(call oc_promote,$(PROJECT_PREFIX)ciip-portal-schema)
	$(call oc_promote,$(PROJECT_PREFIX)ciip-portal-app)
	$(call oc_wait_for_deploy,$(PROJECT_PREFIX)postgres)
	$(if $(PREVIOUS_DEPLOY_SHA1), $(call oc_run_job,$(PROJECT_PREFIX)ciip-portal-schema-revert,GIT_SHA1=$(PREVIOUS_DEPLOY_SHA1)))
	$(call oc_run_job,$(PROJECT_PREFIX)ciip-portal-schema-deploy)
	$(call oc_deploy)
	$(call oc_wait_for_deploy,$(PROJECT_PREFIX)ciip-portal-app)

.PHONY: install_test
install_test: OC_PROJECT=$(OC_TEST_PROJECT)
install_test: install

.PHONY: watch
watch: $(call make_help,watch,configure and start the watchers & dev servers)
watch:
	watchman watch-project .
	watchman -j < .watch-schema-sqitch.json
	watchman -j < .watch-status-schema.json
	watchman -j < .watch-app-yarn.json
	watchman -j < .watch-app-relay.json
	watchman -j < .watch-app-format.json
	watchman -j < .watch-db.json
	watchman -j < .watch-server.json

.PHONY: unwatch
unwatch: $(call make_help,unwatch,shut down the watchers but leave the dev servers running)
unwatch:
	watchman watch-del-all
	watchman shutdown-server
	if command -v launchctl; then launchctl unload ~/Library/LaunchAgents/com.github.facebook.watchman.plist; fi
	kill -9 $(shell cat log/server.pid) || true # stop the watched app server
	pg_ctl stop || true # stop the watched database server

# TODO: delete this target
# ...but maybe it's helpful for debugging watchman itself on a mac?
.PHONY: watch_log
watch_log:
	tail -f /usr/local/var/run/watchman/$(shell whoami)-state/log
