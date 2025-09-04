import { Layer } from "effect"
import { GitCoreLive } from "#duncan3142/git-tools/core"
import { GitExecutorLive } from "#duncan3142/git-tools/git"
import { TelemetryLive } from "#duncan3142/git-tools/telemetry"

const GitToolsLive = GitCoreLive.pipe(
	Layer.provide(GitExecutorLive),
	Layer.provide(TelemetryLive)
)

export { GitToolsLive }
