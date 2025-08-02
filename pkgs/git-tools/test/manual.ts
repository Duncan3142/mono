import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, ConfigProvider, pipe } from "effect"
import Git from "#service"
import Fetch from "#case/fetch.service"
import FetchCommand from "#command/fetch.service"
import FetchCommandExecutorLive from "#git/command/fetch-executor.layer"
import PrintRefs from "#case/print-refs.service"
import PrintRefsCommandExecutorLive from "#git/command/print-refs-executor.layer"
import RepositoryConfig from "#config/repository-config.service"
import FetchDepthFactory from "#state/fetch-depth-factory.service"

const ProgramLive = pipe(
	Git.Default,
	Layer.provide(Fetch.Default),
	Layer.provide(FetchCommand.Default),
	Layer.provide(FetchCommandExecutorLive),
	Layer.provide(PrintRefs.Default),
	Layer.provide(PrintRefsCommandExecutorLive),
	Layer.provide(NodeContext.layer),
	Layer.provide(FetchDepthFactory.Default),
	Layer.provide(RepositoryConfig.Default)
)

const program = Effect.gen(function* () {
	const git = yield* Git
	return yield* git.printRefs({
		level: "Info",
		message: "Print refs test",
	})
}).pipe(
	Effect.provide(ProgramLive),
	Effect.withConfigProvider(
		ConfigProvider.fromMap(
			new Map([
				["DEFAULT_REMOTE_NAME", "origin"],
				["GIT_DIRECTORY", process.cwd()],
			])
		)
	)
)

NodeRuntime.runMain(program.pipe(Effect.exit, Effect.tap(console.log)))
