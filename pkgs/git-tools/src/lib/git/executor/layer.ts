import { Layer } from "effect"
import * as AddExecutor from "./add.layer.ts"
import * as BranchExecutor from "./branch.layer.ts"
import * as CheckoutExecutor from "./checkout.layer.ts"
import * as CommitExecutor from "./commit.layer.ts"
import * as ConfigExecutor from "./config.layer.ts"
import * as FetchExecutor from "./fetch.layer.ts"
import * as InitExecutor from "./init.layer.ts"
import * as MergeBaseExecutor from "./merge-base.layer.ts"
import * as PushExecutor from "./push.layer.ts"
import * as RemoteExecutor from "./remote.layer.ts"
import * as ResetExecutor from "./reset.layer.ts"
import * as RevParseExecutor from "./rev-parse.layer.ts"
import * as StatusExecutor from "./status.layer.ts"
import * as TagExecutor from "./tag.layer.ts"

const GitExecutorLive = Layer.mergeAll(
	AddExecutor.Live,
	BranchExecutor.Live,
	CheckoutExecutor.Live,
	CommitExecutor.Live,
	ConfigExecutor.Live,
	FetchExecutor.Live,
	InitExecutor.Live,
	MergeBaseExecutor.Live,
	PushExecutor.Live,
	RemoteExecutor.Live,
	ResetExecutor.Live,
	RevParseExecutor.Live,
	StatusExecutor.Live,
	TagExecutor.Live
)

export { GitExecutorLive }
