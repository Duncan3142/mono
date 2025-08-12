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
} from "./index.ts"

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
	TagCommand.Default
)

export { GitCommandLive }
