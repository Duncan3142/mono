import type { XisBuildArgs, XisOptArgs } from "#core/context.js"
import type { ExArgs, ExExecIssues, ExGuardIssues, ExIn, ExOut, XisBase } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"

export type XisChainIn<Chain extends [...Array<XisBase>]> = Chain extends [
	infer First extends XisBase,
	...Array<XisBase>,
]
	? ExIn<First>
	: never

export type XisChainGuardIssues<Chain extends [...Array<XisBase>]> = Chain extends [
	infer First extends XisBase,
	...Array<XisBase>,
]
	? ExGuardIssues<First>
	: never

export type XisChainExecIssues<
	Chain extends [...Array<XisBase>],
	Acc extends XisIssueBase = never,
> = Chain extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? XisChainExecIssues<Rest, Acc | ExExecIssues<Next>>
	: Acc

export type XisChainOut<Chain extends [...Array<XisBase>], Acc = never> = Chain extends [
	infer Next extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? XisChainOut<Rest, ExOut<Next>>
	: Acc

export type XisChainArgs<
	Chain extends [...Array<XisBase>],
	Acc extends XisOptArgs = undefined,
> = Chain extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? XisChainArgs<Rest, XisBuildArgs<Acc, ExArgs<Next>>>
	: Acc
