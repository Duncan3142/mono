import { ConfigProvider } from "effect"

const Test = ConfigProvider.fromMap(
	new Map([["GIT_TOOLS.DEFAULT_REMOTE.URL", "https://cloudgit.com/user/repo.git"]])
)

export { Test }
