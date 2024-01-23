import type { XisIssueBase } from "#core/error.js"
import type { XisBase, ExOut, ExIn, ExIssues, ExCtx } from "#core/kernel.js"
import type { ExecResultSync } from "#core/sync.js"
import type { BuildObjArg, ObjArgBase } from "#util/arg.js"
import type { Same } from "#util/base-type.js"
import { Left } from "purify-ts/Either"

export type UnionIn<
	Schema extends [...Array<XisBase>],
	Acc = never,
	First = true,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? UnionIn<
			Rest,
			[First] extends [true]
				? ExIn<Next>
				: [Same<Acc, ExIn<Next>>] extends [true]
					? Acc
					: never,
			false
		>
	: Acc

export type UnionIssues<
	Schema extends [...Array<XisBase>],
	Acc extends XisIssueBase = never,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? UnionIssues<Rest, Acc | ExIssues<Next>>
	: Acc

export type UnionOut<Schema extends [...Array<XisBase>], Acc = never> = Schema extends [
	infer Next extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? UnionOut<Rest, Acc | ExOut<Next>>
	: Acc

export type UnionCtx<
	Schema extends [...Array<XisBase>],
	Acc extends ObjArgBase = null,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? UnionCtx<Rest, BuildObjArg<Acc, ExCtx<Next>>>
	: Acc

export const reduce = (
	mapped: Array<ExecResultSync<XisIssueBase, unknown>>
): ExecResultSync<XisIssueBase, unknown> =>
	mapped.reduce(
		(acc, elem) =>
			elem.chainLeft((issues) => acc.mapLeft((accIssues) => [...accIssues, ...issues])),
		Left([])
	)
