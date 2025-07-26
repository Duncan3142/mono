import {
	gen as effectGen,
	provide as effectProvide,
	exit as effectExit,
	tap as effectTap,
} from "effect/Effect"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { provide as layerProvide, succeed as layerSucceed } from "effect/Layer"
import GitLive from "#layer"
import Git from "#service"
import FetchLive from "#case/fetch.layer"
import FetchCommandLive from "#git/command/fetch.layer"
import PrintRefsLive from "#case/print-refs.layer"
import PrintRefsCommandLive from "#git/command/print-refs.layer"
import RepositoryConfig from "#config/repository-config.service"

const ProgramLive = GitLive.pipe(
	layerProvide(FetchLive.pipe(layerProvide(FetchCommandLive))),
	layerProvide(PrintRefsLive),
	layerProvide(PrintRefsCommandLive),
	layerProvide(NodeContext.layer),
	layerProvide(
		layerSucceed(RepositoryConfig, {
			defaultRemote: {
				name: "origin",
			},
			directory: process.cwd(),
		})
	)
)

const program = effectGen(function* () {
	const git = yield* Git
	return yield* git.printRefs({
		level: "Info",
		message: "Print refs test",
	})
}).pipe(effectProvide(ProgramLive))

NodeRuntime.runMain(program.pipe(effectExit, effectTap(console.log)))
