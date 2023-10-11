import type { XisBuildArgs, XisOptArgs } from "#core/context.js"
import type { XisIssueBase } from "#core/error.js"

import type { XisBase, ExArgs, ExOut, ExIn, ExExecIssues, ExGuardIssues } from "#core/kernel.js"
import type { ExecResultSync } from "#core/sync.js"
import { Left } from "purify-ts/Either"

export type UnionIn<Schema extends [...Array<XisBase>], Acc = never> = Schema extends [
	infer Next extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? UnionIn<Rest, Acc | ExIn<Next>>
	: Acc

export type UnionIssues<
	Schema extends [...Array<XisBase>],
	Acc extends XisIssueBase = never,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? UnionIssues<Rest, Acc | ExGuardIssues<Next> | ExExecIssues<Next>>
	: Acc

export type UnionOut<Schema extends [...Array<XisBase>], Acc = never> = Schema extends [
	infer Next extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? UnionOut<Rest, Acc | ExOut<Next>>
	: Acc

export type UnionArgs<
	Schema extends [...Array<XisBase>],
	Acc extends XisOptArgs = undefined,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? UnionArgs<Rest, XisBuildArgs<Acc, ExArgs<Next>>>
	: Acc

export const reduce = (
	mapped: Array<ExecResultSync<XisIssueBase, unknown>>
): ExecResultSync<XisIssueBase, unknown> =>
	mapped.reduce(
		(acc, elem) =>
			elem.chainLeft((issues) => acc.mapLeft((accIssues) => [...accIssues, ...issues])),
		Left([])
	)
