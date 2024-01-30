import type { ExIn, ExOut, XisBase } from "#core/kernel.js"

export type XisChainSchema<
	Chain extends [XisBase, XisBase, ...Array<XisBase>],
	Remaining extends [...Array<XisBase>] = Chain,
> = Remaining extends [
	infer First extends XisBase,
	infer Second extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? [ExOut<First>] extends [ExIn<Second>]
		? XisChainSchema<Chain, [Second, ...Rest]>
		: never
	: Chain

export type XisChainIn<Chain extends [...Array<XisBase>]> = Chain extends [
	infer First extends XisBase,
	...Array<XisBase>,
]
	? ExIn<First>
	: never

export type XisChainOut<Chain extends [...Array<XisBase>], Acc = never> = Chain extends [
	infer Next extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? XisChainOut<Rest, ExOut<Next>>
	: Acc
