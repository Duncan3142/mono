import type { XisIssue, XisIssueBase } from "#core/error.js"
import {
	type XisBase,
	type ExIssues,
	type ExIn,
	type ExOut,
	mergeIssues,
	type ExCtx,
} from "#core/kernel.js"

import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"
import type { BaseArray, NTuple } from "#util/base-type.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import type { XisExecArgs } from "#core/args.js"
import type { BuildObjArg, ObjArgBase } from "#util/arg.js"

export type TupleIn<
	Schema extends [...Array<XisBase>],
	Acc extends Array<unknown> = [],
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? TupleIn<Rest, [...Acc, ExIn<Next>]>
	: Acc

export type TupleIssues<
	Schema extends [...Array<XisBase>],
	Acc extends XisIssueBase = never,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? TupleIssues<Rest, Acc | ExIssues<Next>>
	: Acc

export type TupleOut<
	Schema extends [...Array<XisBase>],
	Acc extends Array<unknown> = [],
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? TupleOut<Rest, [...Acc, ExOut<Next>]>
	: Acc

export type TupleCtx<
	Schema extends [...Array<XisBase>],
	Acc extends ObjArgBase = null,
> = Schema extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? TupleCtx<Rest, BuildObjArg<Acc, ExCtx<Next>>>
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

export interface NTupleIssue<N extends number> extends XisIssue<"XIS_TUPLE_LENGTH"> {
	expected: N
	actual: number
}

export type NTupleIssues<N extends number> = NTupleIssue<N>

export type NTupleProps<N extends number> = {
	length: N
}

export interface NTupleMessages<N extends number> extends XisMessages<NTupleIssues<N>> {
	XIS_TUPLE_LENGTH: XisMsgBuilder<BaseArray, NTupleProps<N>>
}

export interface IsNTupleArgs<N extends number> {
	props: NTupleProps<N>
	messages: NTupleMessages<N> | null
}

export class IsNTuple<L extends number> extends XisSync<BaseArray, NTupleIssues<L>, NTuple<L>> {
	#props: NTupleProps<L>
	#messages: NTupleMessages<L>
	constructor(args: IsNTupleArgs<L>) {
		super()
		const { props, messages } = args
		this.#props = props
		this.#messages = messages ?? {
			XIS_TUPLE_LENGTH: (args: XisMsgArgs<BaseArray, NTupleProps<L>>): string => {
				const { value, props, path } = args
				const { length } = props
				return `Actual length "${value.length}", expected ${length}, at ${JSON.stringify(path)} `
			},
		}
	}
	exec(args: XisExecArgs<BaseArray>): ExecResultSync<NTupleIssues<L>, NTuple<L>> {
		const { value, path } = args
		const { length } = this.#props

		const message = this.#messages.XIS_TUPLE_LENGTH({
			value,
			path,
			props: this.#props,
			ctx: null,
		})

		return value.length === length
			? Right(value as NTuple<L>)
			: Left([
					{
						name: "XIS_TUPLE_LENGTH",
						path,
						message,
						expected: length,
						actual: value.length,
					},
				])
	}
}
