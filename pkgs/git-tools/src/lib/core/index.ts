import { Layer } from "effect"
import {
	AddCommand,
	BranchCommand,
	CheckoutCommand,
	CommitCommand,
	ConfigCommand,
	FetchCommand,
	InitCommand,
	MergeBaseCommand,
	PushCommand,
	RemoteCommand,
	ResetCommand,
	RevParseCommand,
	TagCommand,
} from "./command/index.ts"
import { RepositoryConfig } from "./config/index.ts"
import { FetchDepthFactory } from "./state/index.ts"

const GitCommandLive = Layer.mergeAll(
	AddCommand.Default,
	BranchCommand.Default,
	CheckoutCommand.Default,
	CommitCommand.Default,
	ConfigCommand.Default,
	FetchCommand.Default,
	InitCommand.Default,
	MergeBaseCommand.Default,
	PushCommand.Default,
	RemoteCommand.Default,
	ResetCommand.Default,
	RevParseCommand.Default,
	TagCommand.Default,
	FetchDepthFactory.Default
).pipe(Layer.provide(RepositoryConfig.Default))

export * from "./command/index.ts"
export * from "./config/index.ts"
export * from "./const/index.ts"
export * from "./context/index.ts"
export * from "./domain/index.ts"
export * from "./executor/index.ts"
export * from "./state/index.ts"
export { GitCommandLive }
