import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, ConfigProvider, Console, LogLevel, Logger } from "effect"
import GitToolsLive from "#layer"

import { BranchRef } from "#domain/reference"
import PrintRefsCommand from "#command/print-refs.service"
import MergeBaseCommand from "#command/merge-base.service"
import { Repository as RepositoryData } from "#domain/repository"
import Repository from "#context/repository.service"

const ProgramLive = GitToolsLive.pipe(Layer.provide(NodeContext.layer))

const program = Effect.gen(function* () {
	const [printRefs, mergeBase] = yield* Effect.all([PrintRefsCommand, MergeBaseCommand], {
		concurrency: "unbounded",
	})
	return yield* Effect.all([
		printRefs(),
		mergeBase({
			baseRef: BranchRef({ name: "main" }),
			headRef: BranchRef({ name: "git-effect" }),
		}).pipe(Effect.flatMap((baseSha) => Console.log("Merge base found", baseSha))),
	])
}).pipe(
	Effect.provide(ProgramLive),
	Effect.provideService(Repository, RepositoryData({ directory: process.cwd() })),
	Effect.withConfigProvider(ConfigProvider.fromMap(new Map([]))),
	Logger.withMinimumLogLevel(LogLevel.Trace)
)

NodeRuntime.runMain(program.pipe(Effect.exit, Effect.tap(console.log)))
