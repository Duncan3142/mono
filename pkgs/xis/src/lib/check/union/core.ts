import type { XisIssueBase } from "#core/error.js"
import type { XisBase, ExOut, ExIn } from "#core/kernel.js"
import type { ExecResultSync } from "#core/sync.js"
import type { Same } from "#util/base-type.js"
import { Left } from "purify-ts/Either"

export type XisUnionSchema<
	Union extends [XisBase, XisBase, ...Array<XisBase>],
	Remaining extends [...Array<XisBase>] = Union,
> = Remaining extends [
	infer First extends XisBase,
	infer Second extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? [Same<ExIn<First>, ExIn<Second>>] extends [true]
		? XisUnionSchema<Union, [Second, ...Rest]>
		: never
	: Union

export type UnionIn<Schema extends [...Array<XisBase>], Acc = unknown> = Schema extends [
	infer First extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? UnionIn<Rest, ExIn<First> & Acc>
	: Acc

export type UnionOut<Schema extends [...Array<XisBase>], Acc = never> = Schema extends [
	infer Next extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? UnionOut<Rest, Acc | ExOut<Next>>
	: Acc

export const reduce = (
	mapped: Array<ExecResultSync<XisIssueBase, unknown>>
): ExecResultSync<XisIssueBase, unknown> =>
	mapped.reduce(
		(acc, elem) =>
			elem.chainLeft((issues) => acc.mapLeft((accIssues) => [...accIssues, ...issues])),
		Left([])
	)
