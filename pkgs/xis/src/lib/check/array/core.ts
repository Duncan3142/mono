import { Right } from "purify-ts/Either"
import type { XisIssueBase } from "#core/error.js"
import {
	mergeIssues,
	type ExCtx,
	type ExIssues,
	type ExIn,
	type ExOut,
	type XisBase,
} from "#core/kernel.js"
import type { ExecResultSync } from "#core/sync.js"

export type ArrayIn<Schema extends XisBase> = Array<ExIn<Schema>>
export type ArrayIssues<Schema extends XisBase> = ExIssues<Schema>
export type ArrayOut<Schema extends XisBase> = Array<ExOut<Schema>>
export type ArrayCtx<Schema extends XisBase> = ExCtx<Schema>

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
