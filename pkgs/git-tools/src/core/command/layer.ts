import { Layer } from "effect"
import { AddCommand } from "./add.service.ts"
import { BranchCommand } from "./branch.service.ts"
import { CheckoutCommand } from "./checkout.service.ts"
import { CommitCommand } from "./commit.service.ts"
import { ConfigCommand } from "./config.service.ts"
import { FetchCommand } from "./fetch.service.ts"
import { InitCommand } from "./init.service.ts"
import { MergeBaseCommand } from "./merge-base.service.ts"
import { PushCommand } from "./push.service.ts"
import { RemoteCommand } from "./remote.service.ts"
import { ResetCommand } from "./reset.service.ts"
import { RevParseCommand } from "./rev-parse.service.ts"
import { StatusCommand } from "./status.service.ts"
import { TagCommand } from "./tag.service.ts"

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
	StatusCommand.Default,
	TagCommand.Default
)

export { GitCommandLive }
