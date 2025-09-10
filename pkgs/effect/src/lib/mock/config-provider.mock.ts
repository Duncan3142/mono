import { ConfigProvider } from "effect"

const Test = ConfigProvider.fromMap(
	new Map([["OTEL.URL", "https://cloudgit.com/user/repo.git"]])
)

export { Test }
