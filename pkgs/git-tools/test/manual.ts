import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, ConfigProvider, pipe, Console, LogLevel, Logger } from "effect"
import Git from "#service"
import Fetch from "#case/fetch.service"
import FetchCommand from "#command/fetch.service"
import FetchCommandExecutorLive from "#git/command/fetch-executor.layer"
import PrintRefs from "#case/print-refs.service"
import PrintRefsCommandExecutorLive from "#git/command/print-refs-executor.layer"
import MergeBaseCommandExecutorLive from "#git/command/merge-base-executor.layer"
import RepositoryConfig from "#config/repository-config.service"
import FetchDepthFactory from "#state/fetch-depth-factory.service"
import MergeBase from "#case/merge-base.service"
import { BranchRef } from "#domain/reference"

const ProgramLive = pipe(
	Git.Default,
	Layer.provide(Layer.mergeAll(MergeBase.Default, Fetch.Default, PrintRefs.Default)),
	Layer.provide(FetchDepthFactory.Default),
	Layer.provide(FetchCommand.Default),
	Layer.provide(
		Layer.mergeAll(
			MergeBaseCommandExecutorLive,
			FetchCommandExecutorLive,
			PrintRefsCommandExecutorLive
		)
	),
	Layer.provide(RepositoryConfig.Default),
	Layer.provide(NodeContext.layer)
)

const program = Effect.gen(function* () {
	const git = yield* Git
	return yield* Effect.all([
		git.printRefs({
			level: "Info",
			message: "Print refs test",
		}),
		git
			.mergeBase({
				baseRef: BranchRef({ name: "main" }),
				headRef: BranchRef({ name: "git-effect" }),
			})
			.pipe(Effect.flatMap((baseSha) => Console.log("Merge base found", baseSha))),
	])
}).pipe(
	Effect.provide(ProgramLive),
	Effect.withConfigProvider(
		ConfigProvider.fromMap(
			new Map([
				["DEFAULT_REMOTE_NAME", "origin"],
				["GIT_DIRECTORY", process.cwd()],
			])
		)
	),
	Logger.withMinimumLogLevel(LogLevel.Trace)
)

NodeRuntime.runMain(program.pipe(Effect.exit, Effect.tap(console.log)))
