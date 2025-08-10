type Join<
	Elements extends [...Array<string>],
	Sep extends string = "/",
	Acc extends string = "",
> = Elements extends []
	? Acc
	: Elements extends [infer Head, ...infer Tail]
		? Head extends string
			? Tail extends Array<string>
				? Join<Tail, Sep, `${Acc}${Sep}${Head}`>
				: never
			: never
		: never

// eslint-disable-next-line import-x/prefer-default-export -- Type-only export
export type { Join }
