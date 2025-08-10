import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, ConfigProvider, Console, LogLevel, Logger } from "effect"
import { GitToolsLive } from "#layer"

import { Reference } from "#domain"
import { MergeBaseCommand, BranchCommand } from "#command"
import { Repository } from "#domain"
import { RepositoryContext } from "#context"

const ProgramLive = GitToolsLive.pipe(Layer.provide(NodeContext.layer))

const program = Effect.gen(function* () {
	const [printRefs, mergeBase] = yield* Effect.all(
		[BranchCommand.Service, MergeBaseCommand.Service],
		{
			concurrency: "unbounded",
		}
	)
	return yield* Effect.all([
		printRefs(),
		mergeBase({
			baseRef: Reference.Branch({ name: "main" }),
			headRef: Reference.Branch({ name: "git-effect" }),
		}).pipe(Effect.flatMap((baseSha) => Console.log("Merge base found", baseSha))),
	])
}).pipe(
	Effect.provide(ProgramLive),
	Effect.provideService(
		RepositoryContext.Tag,
		Repository.Repository({ directory: process.cwd() })
	),
	Effect.withConfigProvider(ConfigProvider.fromMap(new Map([]))),
	Logger.withMinimumLogLevel(LogLevel.Trace)
)

NodeRuntime.runMain(program.pipe(Effect.exit, Effect.tap(console.log)))
