type TagJoin<
	Elements extends [...Array<string>],
	Sep extends string = "/",
	Acc extends string = "",
> = Elements extends []
	? Acc
	: Elements extends [infer Head, ...infer Tail]
		? Head extends string
			? Tail extends Array<string>
				? TagJoin<Tail, Sep, `${Acc}${Sep}${Head}`>
				: never
			: never
		: never

export type { TagJoin }
