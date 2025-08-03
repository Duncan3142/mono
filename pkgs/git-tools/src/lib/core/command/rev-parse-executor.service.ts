import type { Effect } from "effect"
import { Context } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import type Head from "#domain/head"

interface Arguments {
	readonly rev: Reference | Head
	readonly directory: string
}

/**
 * Checkout command service
 */
class RevParseCommandExecutor extends Context.Tag(tag(`command`, `rev-parse-executor`))<
	RevParseCommandExecutor,
	(args: Arguments) => Effect.Effect<string>
>() {}

export default RevParseCommandExecutor
export type { Arguments }
