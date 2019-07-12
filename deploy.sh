#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:golfadas/travel-expenses.git master:gh-pages

cd -
