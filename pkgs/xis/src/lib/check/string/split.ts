import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export type Separator = string | RegExp

interface XisSplitProps {
	separator: Separator
}

interface XisSplitArgs {
	props: XisSplitProps
}

export class XisSplit extends XisSync<string, never, Array<string>> {
	#props: XisSplitProps

	constructor(args: XisSplitArgs) {
		super()
		this.#props = args.props
	}
	override get effect(): Effect {
		return Effect.Transform
	}

	exec(args: XisExecArgs<string>): ExecResultSync<never, Array<string>> {
		const { value } = args
		const { separator } = this.#props
		return Right(value.split(separator))
	}
}

export const split = (separator: Separator = ""): XisSplit =>
	new XisSplit({ props: { separator } })
