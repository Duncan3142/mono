import { Layer } from "effect"
import {
	FetchCommand,
	MergeBaseCommand,
	BranchCommand,
	CheckoutCommand,
	ResetCommand,
	RevParseCommand,
} from "#command"
import { RepositoryConfig } from "#config"
import {
	FetchExecutor,
	BranchExecutor,
	CheckoutExecutor,
	MergeBaseExecutor,
	ResetExecutor,
	RevParseExecutor,
} from "#git"
import { FetchDepthFactory } from "#state"

const GitToolsLive = Layer.mergeAll(
	FetchCommand.Default,
	MergeBaseCommand.Default,
	BranchCommand.Default,
	CheckoutCommand.Default,
	ResetCommand.Default,
	RevParseCommand.Default
).pipe(
	Layer.provide(
		Layer.mergeAll(
			FetchExecutor.Live,
			MergeBaseExecutor.Live,
			BranchExecutor.Live,
			CheckoutExecutor.Live,
			ResetExecutor.Live,
			RevParseExecutor.Live
		)
	),
	Layer.provide(FetchDepthFactory.Default),
	Layer.provide(RepositoryConfig.Default)
)

export { GitToolsLive }
