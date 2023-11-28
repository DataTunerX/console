#!/bin/bash

if [[ $GITHUB_REF == refs/tags/* ]]; then
  # Extract tag name from GITHUB_REF
  tag_name=${GITHUB_REF#refs/tags/}
  echo "$tag_name"
else
  if [ -n "$GITHUB_SHA" ]; then
    short_sha=${GITHUB_SHA::7}
  else
    short_sha=$(git rev-parse --short HEAD)
  fi

  pkg_version=$(cat package.json | grep version | head -1 | awk '{ print $2 }' | sed 's/[",]//g')

  echo "v${pkg_version}-dev-${short_sha}"
fi
