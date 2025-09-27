import { Layer } from "effect"
import { GitCoreLive } from "#duncan3142/git-tools/lib/core"
import { GitExecutorLive } from "#duncan3142/git-tools/lib/git"

const GitToolsLive = GitCoreLive.pipe(Layer.provide(GitExecutorLive))

export { GitToolsLive }
