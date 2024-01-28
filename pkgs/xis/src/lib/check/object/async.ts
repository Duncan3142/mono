import { XisAsync, type ExecResultAsync } from "#core/async.js"
import type { XisObjectIssues, XisObjectOut, XisObjectCtx, XisObjectIn } from "./core.js"
import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { ShapeKeyBase } from "../shape/core.js"
import type { XisBase } from "#core/kernel.js"

export type XisAsyncPropBase = [ShapeKeyBase, XisBase]

export type XisObjectAsyncProps<Schema extends [...Array<XisAsyncPropBase>]> = {
	schema: [...Schema]
}

export interface XisObjectAsyncArgs<Schema extends [...Array<XisAsyncPropBase>]> {
	props: XisObjectAsyncProps<Schema>
}

export class XisObjectAsync<Schema extends [...Array<XisAsyncPropBase>]> extends XisAsync<
	XisObjectIn<Schema>,
	XisObjectIssues<Schema>,
	XisObjectOut<Schema>,
	XisObjectCtx<Schema>
> {
	readonly #props: XisObjectAsyncProps<Schema>

	constructor(args: XisObjectAsyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	override get effect(): Effect {
		return Effect.Transform
	}

	exec(
		args: XisExecArgs<XisObjectIn<Schema>, XisObjectCtx<Schema>>
	): ExecResultAsync<XisObjectIssues<Schema>, XisObjectOut<Schema>> {
		// const { value, ctx, path, locale } = args
		const { schema } = this.#props
		return { args, schema } as any as ExecResultAsync<
			XisObjectIssues<Schema>,
			XisObjectOut<Schema>
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
		// return reduce(results) as ExecResultAsync<
		// 	RecordIssues<KeySchema, ValueSchema>,
		// 	RecordOut<KeySchema, ValueSchema>
		// >
	}
}

export const object = <Schema extends [...Array<XisAsyncPropBase>]>(
	args: XisObjectAsyncArgs<Schema>
): XisObjectAsync<Schema> => new XisObjectAsync(args)
