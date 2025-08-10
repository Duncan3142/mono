import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Console, LogLevel, Logger } from "effect"
import { GitToolsLive } from "#duncan3142/git-tools/layer"

import { Reference, Repository } from "#duncan3142/git-tools/domain"
import { MergeBaseCommand, BranchCommand } from "#duncan3142/git-tools/command"
import { RepositoryContext } from "#duncan3142/git-tools/context"

const ProgramLive = GitToolsLive.pipe(Layer.provide(NodeContext.layer))

const program = Effect.gen(function* () {
	const [printRefs, mergeBase] = yield* Effect.all(
		[BranchCommand.BranchCommand, MergeBaseCommand.MergeBaseCommand],
		{
			concurrency: "unbounded",
		}
	)
	return yield* Effect.all([
		printRefs(),
		mergeBase({
			baseRef: Reference.Branch({ name: "main" }),
			headRef: Reference.Tag({ name: "@duncan3142/eslint-config@0.1.4" }),
		}).pipe(Effect.flatMap((baseSha) => Console.log("Merge base found:", baseSha))),
	])
}).pipe(
	Effect.provide(ProgramLive),
	Effect.provideService(
		RepositoryContext.RepositoryContext,
		Repository.Repository({ directory: process.cwd() })
	),
	Logger.withMinimumLogLevel(LogLevel.Trace)
)

NodeRuntime.runMain(program.pipe(Effect.exit, Effect.tap(console.log)))
