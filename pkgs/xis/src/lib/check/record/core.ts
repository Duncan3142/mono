import { type BaseTypeIssue } from "#core/base-type.js"
import { type BaseObject, type TruePropertyKey } from "#util/base-type.js"
import type { XisIssueBase } from "#core/error.js"

import { type XisBuildArgs } from "#core/context.js"

import { Right, Either } from "purify-ts/Either"
import {
	mergeIssues,
	type ExArgs,
	type ExExecIssues,
	type ExGuardIssues,
	type ExIn,
	type ExOut,
	type Xis,
	type XisBase,
} from "#core/kernel.js"
import type { ExecResultSync } from "#core/sync.js"

export type PropertyKeyBase = Xis<any, XisIssueBase, XisIssueBase, TruePropertyKey, any>

export type RecordIn<KeySchema extends PropertyKeyBase, ValueSchema extends XisBase> = Record<
	ExIn<KeySchema>,
	ExIn<ValueSchema>
>
export type RecordGuardIssues<KeySchema extends PropertyKeyBase, ValueSchema extends XisBase> =
	| BaseTypeIssue<"object">
	| ExGuardIssues<KeySchema>
	| ExGuardIssues<ValueSchema>

export type RecordExecIssues<KeySchema extends PropertyKeyBase, ValueSchema extends XisBase> =
	| ExExecIssues<KeySchema>
	| ExExecIssues<ValueSchema>

export type RecordOut<KeySchema extends PropertyKeyBase, ValueSchema extends XisBase> = Record<
	ExOut<KeySchema>,
	ExOut<ValueSchema>
>
export type RecordArgs<
	KeySchema extends PropertyKeyBase,
	ValueSchema extends XisBase,
> = XisBuildArgs<ExArgs<KeySchema>, ExArgs<ValueSchema>>

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
