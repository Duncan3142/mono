import type { ExCtx, ExIssues, ExIn, ExOut, XisBase } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import type { BuildObjArg, ObjArgBase } from "#util/arg.js"

export type XisChainIn<Chain extends [...Array<XisBase>]> = Chain extends [
	infer First extends XisBase,
	...Array<XisBase>,
]
	? ExIn<First>
	: never

export type XisChainIssues<
	Chain extends [...Array<XisBase>],
	Acc extends XisIssueBase = never,
> = Chain extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? XisChainIssues<Rest, Acc | ExIssues<Next>>
	: Acc

export type XisChainOut<Chain extends [...Array<XisBase>], Acc = never> = Chain extends [
	infer Next extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? XisChainOut<Rest, ExOut<Next>>
	: Acc

export type XisChainCtx<
	Chain extends [...Array<XisBase>],
	Acc extends ObjArgBase = null,
> = Chain extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? XisChainCtx<Rest, BuildObjArg<Acc, ExCtx<Next>>>
	: Acc
