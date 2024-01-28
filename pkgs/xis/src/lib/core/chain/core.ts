import type { ExIn, ExOut, XisBase } from "#core/kernel.js"

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
