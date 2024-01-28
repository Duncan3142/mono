if [ -z "$CI" ]
then
  pnpm exec husky
else
  echo "Skipping husky install in CI environment"
fi
