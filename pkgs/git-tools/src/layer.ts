import { Layer } from "effect"
import {
	FetchCommand,
	MergeBaseCommand,
	BranchCommand,
	CheckoutCommand,
	ResetCommand,
	RevParseCommand,
	AddCommand,
	CommitCommand,
	ConfigCommand,
	InitCommand,
	PushCommand,
	RemoteCommand,
	TagCommand,
} from "#duncan3142/git-tools/command"
import { RepositoryConfig } from "#duncan3142/git-tools/config"
import {
	FetchExecutor,
	BranchExecutor,
	CheckoutExecutor,
	MergeBaseExecutor,
	ResetExecutor,
	RevParseExecutor,
	AddExecutor,
	CommitExecutor,
	ConfigExecutor,
	InitExecutor,
	PushExecutor,
	RemoteExecutor,
	TagExecutor,
} from "#duncan3142/git-tools/git"
import { FetchDepthFactory } from "#duncan3142/git-tools/state"

const GitToolsLive = Layer.mergeAll(
	FetchCommand.Default,
	MergeBaseCommand.Default,
	BranchCommand.Default,
	CheckoutCommand.Default,
	ResetCommand.Default,
	RevParseCommand.Default,
	AddCommand.Default,
	CommitCommand.Default,
	ConfigCommand.Default,
	InitCommand.Default,
	PushCommand.Default,
	RemoteCommand.Default,
	TagCommand.Default,
	FetchDepthFactory.Default
).pipe(
	Layer.provide(
		Layer.mergeAll(
			FetchExecutor.Live,
			MergeBaseExecutor.Live,
			BranchExecutor.Live,
			CheckoutExecutor.Live,
			ResetExecutor.Live,
			RevParseExecutor.Live,
			AddExecutor.Live,
			CommitExecutor.Live,
			ConfigExecutor.Live,
			InitExecutor.Live,
			PushExecutor.Live,
			RemoteExecutor.Live,
			TagExecutor.Live
		)
	),
	Layer.provide(RepositoryConfig.Default)
)

export { GitToolsLive }
