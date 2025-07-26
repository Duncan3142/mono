import {
	gen as effectGen,
	provide as effectProvide,
	exit as effectExit,
	tap as effectTap,
} from "effect/Effect"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import GitLive from "#layer"
import Git from "#service"

const program = effectGen(function* () {
	const git = yield* Git
	return yield* git.printRefs({
		level: "Info",
		repoDirectory: process.cwd(),
		message: "Print refs test",
	})
}).pipe(effectProvide(GitLive), effectProvide(NodeContext.layer))

NodeRuntime.runMain(program.pipe(effectExit, effectTap(console.log)))
