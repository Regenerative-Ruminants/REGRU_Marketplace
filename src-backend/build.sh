#!/usr/bin/env bash

APP_VERSION=$(cat VERSION)
GIT_REV=$(git rev-parse --short=8 HEAD)
BUILD_VERSION="$APP_VERSION-$GIT_REV"
echo "Building version: $BUILD_VERSION"

docker build -t "regru-api:$BUILD_VERSION" .
