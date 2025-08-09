import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

interface ConfigKV {
	readonly key: string
	readonly value: string
}

type Mode = Data.TaggedEnum<{
	List: object
	Set: ConfigKV
	Add: ConfigKV
}>

const Mode = Data.taggedEnum<Mode>()

type Scope = Data.TaggedEnum<{
	Global: object
	Local: { readonly directory: string }
}>

const Scope = Data.taggedEnum<Scope>()

interface Arguments {
	readonly scope: Scope
	readonly input: Mode
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(Const.tag(`executor`, `config`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag, Mode, Scope }
export type { Arguments }
