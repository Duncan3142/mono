import { Layer } from "effect"
import {
	FetchCommand,
	MergeBaseCommand,
	BranchCommand,
	CheckoutCommand,
	ResetCommand,
	RevParseCommand,
} from "#duncan3142/git-tools/command"
import { RepositoryConfig } from "#duncan3142/git-tools/config"
import {
	FetchExecutor,
	BranchExecutor,
	CheckoutExecutor,
	MergeBaseExecutor,
	ResetExecutor,
	RevParseExecutor,
} from "#duncan3142/git-tools/git"
import { FetchDepthFactory } from "#duncan3142/git-tools/state"

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
