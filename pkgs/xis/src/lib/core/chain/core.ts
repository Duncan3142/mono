import type { XisBuildCtx, XisCtxBase } from "#core/context.js"
import type { ExCtx, ExIssues, ExIn, ExOut, XisBase, ExMessages } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import type { XisBuildMessages, XisMessagesBase } from "#core/prop.js"

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

export type XisChainMessages<
	Chain extends [...Array<XisBase>],
	Acc extends XisMessagesBase = null,
> = Chain extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? XisChainMessages<Rest, XisBuildMessages<Acc, ExMessages<Next>>>
	: Acc

export type XisChainCtx<
	Chain extends [...Array<XisBase>],
	Acc extends XisCtxBase = null,
> = Chain extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? XisChainCtx<Rest, XisBuildCtx<Acc, ExCtx<Next>>>
	: Acc
