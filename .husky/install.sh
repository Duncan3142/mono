if [ -z "$CI" ]
then
  npm exec husky install
else
  echo "Skipping husky install in CI environment"
fi
