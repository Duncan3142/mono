import { EitherAsync } from "purify-ts/EitherAsync"
import {
	XisAsync,
	type ExecEitherAsync,
	type ExecResultAsync,
	type ParseResultAsync,
} from "#core/async.js"
import type { XisCtx, XisCtxBase } from "#core/context.js"
import {
	invoke,
	type ExIn,
	type ExInvoke,
	type ExOut,
	type InvokeMode,
	type XisBase,
	type ExCtx,
} from "#core/kernel.js"

import type {
	XisChainArgs,
	XisChainExecIssues,
	XisChainGuardIssues,
	XisChainIn,
	XisChainOut,
} from "./core.js"
import type { XisIssueBase } from "#core/error.js"

type XisChainSchemaAsync<
	Chain extends [XisBase, ...Array<XisBase>],
	Remaining extends [...Array<XisBase>] = Chain,
> = Remaining extends [
	infer First extends XisBase,
	infer Second extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? [ExOut<First>] extends [ExIn<Second>]
		? XisChainSchemaAsync<Chain, [Second, ...Rest]>
		: never
	: Chain

export class XisChainAsync<
	Chain extends [XisBase, XisBase, ...Array<XisBase>],
> extends XisAsync<
	XisChainIn<Chain>,
	XisChainGuardIssues<Chain>,
	XisChainExecIssues<Chain>,
	XisChainOut<Chain>,
	XisChainArgs<Chain>
> {
	readonly #schema: [...XisChainSchemaAsync<Chain>]

	constructor(schema: [...XisChainSchemaAsync<Chain>]) {
		super()
		this.#schema = schema
	}

	parse(
		value: unknown,
		ctx: XisCtx<XisChainArgs<Chain>>
	): ParseResultAsync<
		XisChainGuardIssues<Chain>,
		XisChainExecIssues<Chain>,
		XisChainOut<Chain>
	> {
		return this.#invoke("parse", value, ctx)
	}

	exec(
		value: XisChainIn<Chain>,
		ctx: XisCtx<XisChainArgs<Chain>>
	): ExecResultAsync<XisChainExecIssues<Chain>, XisChainOut<Chain>> {
		return this.#invoke("exec", value, ctx)
	}

	#invoke<Mode extends InvokeMode>(
		mode: Mode,
		value: unknown,
		ctx: XisCtxBase
	): ExInvoke<this, Mode> {
		type Res = ExInvoke<this, Mode>
		const [first, ...rest] = this.#schema
		const acc: ExecEitherAsync<XisIssueBase, unknown> = EitherAsync.fromPromise(() =>
			Promise.resolve(
				invoke(
					mode,
					first,
					value as ExIn<[...XisChainSchemaAsync<Chain>][0]>,
					ctx as ExCtx<[...XisChainSchemaAsync<Chain>][0]>
				)
			)
		)

		return rest
			.reduce((acc, xis) => acc.chain((input) => Promise.resolve(xis.exec(input, ctx))), acc)
			.run() as Res
	}
}

export const chain = <Chain extends [XisBase, XisBase, ...Array<XisBase>]>(
	schema: [...XisChainSchemaAsync<Chain>]
): XisChainAsync<Chain> => new XisChainAsync(schema)
