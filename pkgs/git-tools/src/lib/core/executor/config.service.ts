import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

interface ConfigKV {
	readonly key: string
	readonly value: string
}

type ConfigInput = Data.TaggedEnum<{
	List: object
	Set: ConfigKV
	Add: ConfigKV
}>

const {
	List,
	Set,
	Add,
	$is: $isConfigInput,
	$match: $matchConfigInput,
} = Data.taggedEnum<ConfigInput>()

type ConfigScope = Data.TaggedEnum<{
	Global: object
	Local: { readonly directory: string }
}>

const {
	Global,
	Local,
	$is: $isConfigScope,
	$match: $matchConfigScope,
} = Data.taggedEnum<ConfigScope>()

interface Arguments {
	readonly scope: ConfigScope
	readonly input: ConfigInput
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ConfigExecutor extends Context.Tag(tag(`executor`, `config`))<
	ConfigExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default ConfigExecutor
export {
	Set,
	Add,
	List,
	$isConfigInput,
	$matchConfigInput,
	Global,
	Local,
	$isConfigScope,
	$matchConfigScope,
}
export type { Arguments }
