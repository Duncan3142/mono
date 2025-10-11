import { Layer } from "effect"
import { GitCommandLive } from "./command/index.ts"
import { GitConfigLive } from "./config/index.ts"
import { GitStateLive } from "./state/index.ts"

const GitCoreLive = Layer.mergeAll(GitCommandLive, GitStateLive).pipe(
	Layer.provide(GitConfigLive)
)

export { GitCoreLive }
