import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, ConfigProvider } from "effect"
import GitLive from "#layer"
import Git from "#service"
import FetchLive from "#case/fetch.layer"
import FetchCommandLive from "#git/command/fetch.layer"
import PrintRefsLive from "#case/print-refs.layer"
import PrintRefsCommandLive from "#git/command/print-refs.layer"
import RepositoryConfigLive from "#config/repository-config.layer"
import FetchDepthLive from "#state/fetch-depth.layer"

const ProgramLive = GitLive.pipe(
	Layer.provide(FetchLive),
	Layer.provide(FetchCommandLive),
	Layer.provide(PrintRefsLive),
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
