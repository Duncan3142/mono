import { Layer } from "effect"
import { GitCommandLive } from "#duncan3142/git-tools/core"
import { GitExecutorLive } from "#duncan3142/git-tools/git"

const GitToolsLive = GitCommandLive.pipe(Layer.provide(GitExecutorLive))

export { GitToolsLive }
