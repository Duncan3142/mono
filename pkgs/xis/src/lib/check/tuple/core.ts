import { type XisBuildArgs, type XisOptArgs } from "#core/context.js"

import type { XisIssueBase } from "#core/error.js"

import {
	type XisBase,
	type ExArgs,
	type ExGuardIssues,
	type ExExecIssues,
	type ExIn,
	type ExOut,
	mergeIssues,
} from "#core/kernel.js"

import type { BaseTypeIssue, TupleLengthIssue } from "#core/base-type.js"
import type { ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export type TupleIn<
	Schema extends [...Array<XisBase>],
	Acc extends Array<unknown> = [],
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? TupleIn<Rest, [...Acc, ExIn<Next>]>
	: Acc

export type TupleElementGuardIssues<
	Schema extends [...Array<XisBase>],
	Acc extends XisIssueBase,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? TupleElementGuardIssues<Rest, Acc | ExGuardIssues<Next>>
	: Acc

export type TupleGuardIssues<Schema extends [...Array<XisBase>]> =
	| TupleElementGuardIssues<Schema, never>
	| TupleLengthIssue
	| BaseTypeIssue<"array">

export type TupleElementExecIssues<
	Schema extends [...Array<XisBase>],
	Acc extends XisIssueBase,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? TupleElementExecIssues<Rest, Acc | ExExecIssues<Next>>
	: Acc

export type TupleExecIssues<Schema extends Array<XisBase>> = TupleElementExecIssues<
	Schema,
	never
>

export type TupleOut<
	Schema extends [...Array<XisBase>],
	Acc extends Array<unknown> = [],
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? TupleOut<Rest, [...Acc, ExOut<Next>]>
	: Acc

export type TupleArgs<
	Schema extends [...Array<XisBase>],
	Acc extends XisOptArgs = undefined,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? TupleArgs<Rest, XisBuildArgs<Acc, ExArgs<Next>>>
	: Acc

export const reduce = (
	mapped: Array<ExecResultSync<XisIssueBase, unknown>>
): ExecResultSync<XisIssueBase, Array<unknown>> =>
	mapped.reduce<ExecResultSync<XisIssueBase, Array<unknown>>>(
		(acc, elem) =>
			elem.caseOf({
				Left: (issues) => mergeIssues(acc, issues),
				Right: (next: unknown) => acc.map((base) => [...base, next]),
			}),
		Right([])
	)
