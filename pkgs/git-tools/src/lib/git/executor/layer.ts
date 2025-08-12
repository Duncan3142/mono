import { Layer } from "effect"
import {
	AddExecutor,
	BranchExecutor,
	CheckoutExecutor,
	CommitExecutor,
	ConfigExecutor,
	FetchExecutor,
	InitExecutor,
	MergeBaseExecutor,
	PushExecutor,
	RemoteExecutor,
	ResetExecutor,
	RevParseExecutor,
	StatusExecutor,
	TagExecutor,
} from "./index.ts"

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
