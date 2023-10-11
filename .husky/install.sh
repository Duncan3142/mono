if [ -z "$CI" ]
then
  pnpm exec husky install
else
  echo "Skipping husky install in CI environment"
fi
