import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

interface ConfigKV {
	readonly key: string
	readonly value: string
}

type ConfigInput = Data.TaggedEnum<{
	List: object
	Set: ConfigKV
	Add: ConfigKV
}>

const ConfigInput = Data.taggedEnum<ConfigInput>()

type ConfigScope = Data.TaggedEnum<{
	Global: object
	Local: { readonly directory: string }
}>

const ConfigScope = Data.taggedEnum<ConfigScope>()

interface Arguments {
	readonly scope: ConfigScope
	readonly input: ConfigInput
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ConfigExecutor extends Context.Tag(Const.tag(`executor`, `config`))<
	ConfigExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { ConfigExecutor, ConfigInput, ConfigScope }
export type { Arguments }
