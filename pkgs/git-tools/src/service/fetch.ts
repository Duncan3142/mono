import { type Effect, tap, andThen, reduce, map } from "effect/Effect"
import type { NonEmptyReadonlyArray } from "effect/Array"
import { pipe } from "effect"
import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import type { PlatformError } from "@effect/platform/Error"
import type { UnknownException } from "effect/Cause"
import command from "./fetch/command.ts"
import type { FetchReference } from "./fetch/reference.ts"
import buildReferenceSpecs from "./fetch/reference.ts"
import logReferences from "#service/reference"
import { DEFAULT_DEPTH, DEFAULT_REMOTE } from "#config/consts"
import { Found, type FetchNotFoundError, type WasFound } from "#domain/fetch"
import type { LogReferencesError } from "#domain/reference"

interface Properties {
	refs: NonEmptyReadonlyArray<FetchReference>
	repoDir: string
	remote?: string
	depth?: number
	deepen?: boolean
}

/**
 * Fetches refs the remote repository.
 * @param props - Props object
 * @param props.repoDir - Directory of the repository
 * @param props.refs - Refs to fetch
 * @param props.depth - Depth of the fetch
 * @param props.remote - Remote repository to fetch from
 * @param props.deepen - Whether to deepen the fetch
 * @returns - A promise that resolves when the fetch is complete
 */
const fetchReferences = ({
	refs,
	repoDir,
	remote = DEFAULT_REMOTE,
	depth = DEFAULT_DEPTH,
	deepen = false,
}: Properties): Effect<
	WasFound,
	FetchNotFoundError | LogReferencesError | PlatformError | UnknownException,
	CommandExecutor
> => {
	const specs = buildReferenceSpecs({ refs, remote })
	return pipe(
		logReferences({ repoDirectory: repoDir, level: "Debug", message: "Refs pre fetch" }),
		andThen(
			reduce(specs, Found, (accumulator, referenceSpecs) =>
				pipe(
					command({ remote, repoDir, depth, deepen, refSpecs: referenceSpecs }),
					map((result) => result && accumulator)
				)
			)
		),
		tap(logReferences({ repoDirectory: repoDir, level: "Debug", message: "Refs post fetch" }))
	)
}

export default fetchReferences

export { type FetchReference as FetchRef } from "./fetch/reference.ts"
