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
class RevParseExecutor extends Context.Tag(tag(`executor`, `rev-parse`))<
	RevParseExecutor,
	(args: Arguments) => Effect.Effect<string>
>() {}

export default RevParseExecutor
export type { Arguments }
