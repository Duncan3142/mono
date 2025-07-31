import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, ConfigProvider, pipe } from "effect"
import Git from "#service"
import Fetch from "#case/fetch.service"
import FetchCommandLive from "#git/command/fetch.layer"
import PrintRefs from "#case/print-refs.service"
import PrintRefsCommandLive from "#git/command/print-refs.layer"
import RepositoryConfigLive from "#config/repository-config.layer"
import FetchDepthLive from "#state/fetch-depth.layer"

const ProgramLive = pipe(
	Git.Default,
	Layer.provide(Fetch.Default),
	Layer.provide(FetchCommandLive),
	Layer.provide(PrintRefs.Default),
	Layer.provide(PrintRefsCommandLive),
	Layer.provide(NodeContext.layer),
	Layer.provide(FetchDepthLive),
	Layer.provide(RepositoryConfigLive)
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
