import { Layer } from "effect"
import FetchCommand from "#command/fetch.service"
import MergeBaseCommand from "#command/merge-base.service"
import PrintRefsCommand from "#command/print-refs.service"
import RepositoryConfig from "#config/repository-config.service"
import FetchExecutorLive from "#git/executor/fetch.layer"
import MergeBaseExecutorLive from "#git/executor/merge-base.layer"
import PrintRefsExecutorLive from "#git/executor/print-refs.layer"
import FetchDepthFactory from "#state/fetch-depth-factory.service"

const GitToolsLive = Layer.mergeAll(
	FetchCommand.Default,
	MergeBaseCommand.Default,
	PrintRefsCommand.Default
).pipe(
	Layer.provide(
		Layer.mergeAll(FetchExecutorLive, MergeBaseExecutorLive, PrintRefsExecutorLive)
	),
	Layer.provide(FetchDepthFactory.Default),
	Layer.provide(RepositoryConfig.Default)
)

export default GitToolsLive
