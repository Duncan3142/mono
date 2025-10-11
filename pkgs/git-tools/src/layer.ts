import { Layer } from "effect"
import { GitCoreLive } from "#duncan3142/git-tools/core"
import { GitExecutorLive } from "#duncan3142/git-tools/git"

const GitToolsLive = GitCoreLive.pipe(Layer.provide(GitExecutorLive))

export { GitToolsLive }
