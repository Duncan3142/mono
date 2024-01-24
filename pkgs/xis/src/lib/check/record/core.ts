import { type BaseObject, type TruePropertyKey } from "#util/base-type.js"
import type { XisIssueBase } from "#core/error.js"
import { Right, Either } from "purify-ts/Either"
import {
	mergeIssues,
	type ExIssues,
	type ExIn,
	type ExOut,
	type Xis,
	type XisBase,
	type ExCtx,
} from "#core/kernel.js"
import type { ExecResultSync } from "#core/sync.js"
import type { BuildObjArg } from "#util/arg.js"

export type PropertyKeyBase = Xis<any, XisIssueBase, TruePropertyKey, any>

export type RecordIn<KeySchema extends PropertyKeyBase, ValueSchema extends XisBase> = Record<
	ExIn<KeySchema>,
	ExIn<ValueSchema>
>

export type RecordIssues<KeySchema extends PropertyKeyBase, ValueSchema extends XisBase> =
	| ExIssues<KeySchema>
	| ExIssues<ValueSchema>

export type RecordOut<KeySchema extends PropertyKeyBase, ValueSchema extends XisBase> = Record<
	ExOut<KeySchema>,
	ExOut<ValueSchema>
>
export type RecordCtx<
	KeySchema extends PropertyKeyBase,
	ValueSchema extends XisBase,
> = BuildObjArg<ExCtx<KeySchema>, ExCtx<ValueSchema>>

export const reduce = (
	results: Array<
		[ExecResultSync<XisIssueBase, TruePropertyKey>, ExecResultSync<XisIssueBase, unknown>]
	>
): ExecResultSync<XisIssueBase, BaseObject> =>
	results
		.reduce<ExecResultSync<XisIssueBase, Array<[TruePropertyKey, unknown]>>>((acc, pair) => {
			const rights = Either.rights(pair)
			if (rights.length === 2) {
				return acc.map((entries) => [...entries, rights as [TruePropertyKey, unknown]])
			} else {
				const lefts = Either.lefts(pair).flatMap((issues) => issues)
				return mergeIssues(acc, lefts)
			}
		}, Right([]))
		.map((entries) => Object.fromEntries(entries))
