#!/bin/bash

if [ -n "$CI_COMMIT_TAG" ]
then
  echo $CI_COMMIT_TAG
else
  pkg_version=$(cat package.json | grep version | head -1 | awk '{ print $2 }' | sed 's/[",]//g')

  echo "v${pkg_version}-dev-$CI_COMMIT_SHORT_SHA"
fi
