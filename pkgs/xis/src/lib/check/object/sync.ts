import type { XisIssue, XisIssueBase } from "#core/error.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { BaseObject } from "#util/base-type.js"
import type { XisObjectIssues, XisObjectOut, XisObjectCtx } from "./core.js"
import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"

export type XisSyncPropsSchema<In extends BaseObject> = {
	-readonly [K in keyof In]-?: XisSync<Exclude<In[K], undefined>, XisIssueBase, unknown, any>
}

export interface XisPropsSyncProps<
	In extends BaseObject,
	Schema extends XisSyncPropsSchema<In> = XisSyncPropsSchema<In>,
> {
	schema: Schema
}

export interface XisPropsSyncArgs<
	In extends BaseObject,
	Schema extends XisSyncPropsSchema<In> = XisSyncPropsSchema<In>,
> {
	props: XisPropsSyncProps<In, Schema>
}

export class XisPropsSync<
	In extends BaseObject,
	Schema extends XisSyncPropsSchema<In> = XisSyncPropsSchema<In>,
> extends XisSync<In, XisObjectIssues<Schema>, XisObjectOut<In, Schema>, XisObjectCtx<Schema>> {
	readonly #props: XisPropsSyncProps<In, Schema>

	constructor(args: XisPropsSyncArgs<In, Schema>) {
		super()
		this.#props = args.props
	}

	override get effect(): Effect {
		return Effect.Transform
	}

	exec(
		args: XisExecArgs<In, XisObjectCtx<Schema>>
	): ExecResultSync<XisObjectIssues<Schema>, XisObjectOut<In, Schema>> {
		// const { value, ctx, path, locale } = args
		const { schema } = this.#props
		return { args, schema } as any as ExecResultSync<
			XisObjectIssues<Schema>,
			XisObjectOut<In, Schema>
		>
		// const { value, ctx, locale, path } = args
		// const { keyCheck, valueCheck } = this.#props
		// const sourceEntries = objectEntries(value)
		// const results = sourceEntries.map(([key, val]) => {
		// 	const keyRes = keyCheck.exec({
		// 		value: key,
		// 		locale,
		// 		path: addElement(path, {
		// 			segment: key,
		// 			side: CheckSide.Key,
		// 		}),
		// 		ctx,
		// 	})
		// 	const valRes = valueCheck.exec({
		// 		value: val,
		// 		locale,
		// 		path: addElement(path, {
		// 			segment: key,
		// 			side: CheckSide.Value,
		// 		}),
		// 		ctx,
		// 	})
		// 	return tup(keyRes, valRes)
		// })
		// return reduce(results) as ExecResultSync<
		// 	RecordIssues<KeySchema, ValueSchema>,
		// 	RecordOut<KeySchema, ValueSchema>
		// >
	}
}

export const props = <
	In extends BaseObject,
	Schema extends XisSyncPropsSchema<In> = XisSyncPropsSchema<In>,
>(
	args: XisPropsSyncArgs<In, Schema>
): XisPropsSync<In, Schema> => new XisPropsSync(args)

/* -------------------------------------------------------------------------- */
/*                                    TEST                                    */
/* -------------------------------------------------------------------------- */

export type Shape = {
	foo: number
	bar?: string
	readonly baz: Date
	readonly goo?: boolean
	// woof: bigint
}

export type X = Exclude<undefined, undefined>

export type Props = {
	foo: XisSync<number, XisIssue<"foo">, string, { foo: number }>
	bar: XisSync<string, XisIssue<"bar">, number, { bar: string }>
	baz: XisSync<Date, never, boolean, null>
	goo: XisSync<boolean, XisIssue<"goo">, Date, { goo: boolean }>
	woof: XisSync<string, XisIssue<"woof">, null>
}

export type Out = XisObjectOut<Shape, Props>

export type Iss = XisObjectIssues<Props>

export type Ctx = XisObjectCtx<Props>

let p: Props

export const x = new XisPropsSync<Shape>({
	props: {
		schema: p!,
	},
})

export const t1: [0, 0, 0, 0] = [0, 0, 0, 0]
t1[3] = 0
t1.push(0)
t1[4] = 0
t1.pop()
t1.pop()
export const t2: [0, 0, 0, 0] = t1
