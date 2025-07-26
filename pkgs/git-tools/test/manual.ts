import {
	gen as effectGen,
	provide as effectProvide,
	exit as effectExit,
	tap as effectTap,
} from "effect/Effect"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { provide as layerProvide } from "effect/Layer"
import GitLive from "#layer"
import Git from "#service"
import FetchLive from "#case/fetch.layer"
import FetchCommandLive from "#git/command/fetch.layer"
import PrintRefsLive from "#case/print-refs.layer"
import PrintRefsCommandLive from "#git/command/print-refs.layer"
import RepositoryConfigLive from "#config/repository-config.layer"

const ProgramLive = GitLive.pipe(
	layerProvide(FetchLive.pipe(layerProvide(FetchCommandLive))),
	layerProvide(PrintRefsLive),
	layerProvide(PrintRefsCommandLive),
	layerProvide(NodeContext.layer),
	layerProvide(RepositoryConfigLive)
)

const program = effectGen(function* () {
	const git = yield* Git
	return yield* git.printRefs({
		level: "Info",
		repoDirectory: process.cwd(),
		message: "Print refs test",
	})
}).pipe(effectProvide(ProgramLive))

NodeRuntime.runMain(program.pipe(effectExit, effectTap(console.log)))
