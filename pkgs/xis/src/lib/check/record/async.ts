import { objectEntries, tup, type TruePropertyKey } from "#util/base-type.js"
import { type ExOut, type XisBase } from "#core/kernel.js"
import {
	type RecordIn,
	type RecordIssues,
	type RecordOut,
	type RecordCtx,
	reduce,
	type PropertyKeyBase,
} from "./core.js"
import { XisAsync, type ExecResultAsync } from "#core/async.js"
import type { XisExecArgs } from "#core/args.js"
import { addElement, CheckSide } from "#core/path.js"
import type { ExecResultSync } from "#core/sync.js"
import { Effect } from "#core/book-keeping.js"

export interface XisRecordAsyncProps<
	KeySchema extends PropertyKeyBase,
	ValueSchema extends XisBase,
> {
	key: [ExOut<KeySchema>] extends [TruePropertyKey] ? KeySchema : never
	value: ValueSchema
}

export interface XisRecordAsyncArgs<
	KeySchema extends PropertyKeyBase,
	ValueSchema extends XisBase,
> {
	props: XisRecordAsyncProps<KeySchema, ValueSchema>
}

export class XisRecordAsync<
	KeySchema extends PropertyKeyBase,
	ValueSchema extends XisBase,
> extends XisAsync<
	RecordIn<KeySchema, ValueSchema>,
	RecordIssues<KeySchema, ValueSchema>,
	RecordOut<KeySchema, ValueSchema>,
	typeof Effect.Transform,
	RecordCtx<KeySchema, ValueSchema>
> {
	#props: XisRecordAsyncProps<KeySchema, ValueSchema>

	constructor(args: XisRecordAsyncArgs<KeySchema, ValueSchema>) {
		super()
		this.#props = args.props
	}

	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}

	async exec(
		args: XisExecArgs<RecordIn<KeySchema, ValueSchema>, RecordCtx<KeySchema, ValueSchema>>
	): ExecResultAsync<RecordIssues<KeySchema, ValueSchema>, RecordOut<KeySchema, ValueSchema>> {
		const { value, ctx, locale, path } = args
		const { key: keyCheck, value: valueCheck } = this.#props
		const sourceEntries = objectEntries(value)

		const results = await Promise.all(
			sourceEntries.map(async ([key, val]) => {
				const keyRes = keyCheck.exec({
					value: key,
					locale,
					path: addElement(path, {
						segment: key,
						side: CheckSide.Key,
					}),
					ctx,
				})
				const valRes = valueCheck.exec({
					value: val,
					locale,
					path: addElement(path, {
						segment: key,
						side: CheckSide.Value,
					}),
					ctx,
				})

				return tup(await keyRes, await valRes)
			})
		)

		return reduce(results) as ExecResultSync<
			RecordIssues<KeySchema, ValueSchema>,
			RecordOut<KeySchema, ValueSchema>
		>
	}
}

export const record = <KeySchema extends PropertyKeyBase, ValueSchema extends XisBase>(
	schema: XisRecordAsyncProps<KeySchema, ValueSchema>
): XisRecordAsync<KeySchema, ValueSchema> =>
	new XisRecordAsync({
		props: schema,
	})
