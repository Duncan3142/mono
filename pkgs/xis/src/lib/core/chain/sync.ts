import type { XisCtx, XisCtxBase } from "#core/context.js"
import {
	invoke,
	type ExInvoke,
	type InvokeMode,
	type ExIn,
	type ExCtx,
	type ExOut,
} from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"

import {
	XisSync,
	type ExecResultSync,
	type ParseResultSync,
	type XisSyncBase,
} from "#core/sync.js"
import type {
	XisChainArgs,
	XisChainExecIssues,
	XisChainGuardIssues,
	XisChainIn,
	XisChainOut,
} from "./core.js"

type XisChainSchemaSync<
	Chain extends [XisSyncBase, ...Array<XisSyncBase>],
	Remaining extends [...Array<XisSyncBase>] = Chain,
> = Remaining extends [
	infer First extends XisSyncBase,
	infer Second extends XisSyncBase,
	...infer Rest extends Array<XisSyncBase>,
]
	? [ExOut<First>] extends [ExIn<Second>]
		? XisChainSchemaSync<Chain, [Second, ...Rest]>
		: never
	: Chain

export class XisChainSync<
	Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> extends XisSync<
	XisChainIn<Chain>,
	XisChainGuardIssues<Chain>,
	XisChainExecIssues<Chain>,
	XisChainOut<Chain>,
	XisChainArgs<Chain>
> {
	readonly #schema: [...XisChainSchemaSync<Chain>]

	constructor(schema: [...XisChainSchemaSync<Chain>]) {
		super()
		this.#schema = schema
	}

	parse(
		value: unknown,
		ctx: XisCtx<XisChainArgs<Chain>>
	): ParseResultSync<
		XisChainGuardIssues<Chain>,
		XisChainExecIssues<Chain>,
		XisChainOut<Chain>
	> {
		return this.#invoke("parse", value, ctx)
	}

	exec(
		value: XisChainIn<Chain>,
		ctx: XisCtx<XisChainArgs<Chain>>
	): ExecResultSync<XisChainExecIssues<Chain>, XisChainOut<Chain>> {
		return this.#invoke("exec", value, ctx)
	}

	#invoke<Mode extends InvokeMode>(
		mode: Mode,
		value: unknown,
		ctx: XisCtxBase
	): ExInvoke<this, Mode> {
		type Res = ExInvoke<this, Mode>
		const [first, ...rest] = this.#schema
		const acc: ExecResultSync<XisIssueBase, unknown> = invoke(
			mode,
			first,
			value as ExIn<[...XisChainSchemaSync<Chain>][0]>,
			ctx as ExCtx<[...XisChainSchemaSync<Chain>][0]>
		)

		return rest.reduce((acc, xis) => acc.chain((input) => xis.exec(input, ctx)), acc) as Res
	}
}

export const chain = <Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>]>(
	schema: [...XisChainSchemaSync<Chain>]
): XisChainSync<Chain> => new XisChainSync(schema)
