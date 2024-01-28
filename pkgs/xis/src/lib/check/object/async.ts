import { XisAsync, type ExecResultAsync } from "#core/async.js"
import type {
	XisObjectIssues,
	XisObjectOut,
	XisObjectCtx,
	XisObjectIn,
	XisPropBase,
} from "./core.js"
import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import { exKeyName } from "../shape/core.js"
import { objectEntries, type TruePropertyKey } from "#util/base-type.js"
import { Right } from "purify-ts/Either"
import { CheckSide, addElement } from "#core/path.js"
import { mergeIssues } from "#core/kernel.js"
import { EitherAsync } from "purify-ts/EitherAsync"
import type { ExecResultSync } from "#core/sync.js"

export type XisObjectAsyncProps<Schema extends [...Array<XisPropBase>]> = {
	schema: [...Schema]
}

export interface XisObjectAsyncArgs<Schema extends [...Array<XisPropBase>]> {
	props: XisObjectAsyncProps<Schema>
}

export class XisObjectAsync<Schema extends [...Array<XisPropBase>]> extends XisAsync<
	XisObjectIn<Schema>,
	XisObjectIssues<Schema>,
	XisObjectOut<Schema>,
	typeof Effect.Transform,
	XisObjectCtx<Schema>
> {
	readonly #props: XisObjectAsyncProps<Schema>

	constructor(args: XisObjectAsyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}

	#process(args: XisExecArgs<XisObjectIn<Schema>, XisObjectCtx<Schema>>): Promise<{
		remaining: Map<TruePropertyKey, unknown>
		result: ExecResultSync<XisObjectIssues<Schema>, Map<TruePropertyKey, unknown>>
	}> {
		const { schema } = this.#props
		const { value, ctx, path, locale } = args
		const entries = objectEntries(value)
		return schema.reduce<
			Promise<{
				remaining: Map<TruePropertyKey, unknown>
				result: ExecResultSync<XisObjectIssues<Schema>, Map<TruePropertyKey, unknown>>
			}>
		>(
			async (acc, [key, check]) => {
				const { remaining, result: processed } = await acc
				const keyName = exKeyName(key)
				if (remaining.has(keyName)) {
					const prop = remaining.get(keyName)
					remaining.delete(keyName)
					const res = await EitherAsync.fromPromise(() =>
						Promise.resolve(
							check.exec({
								value: prop,
								ctx,
								path: addElement(path, {
									segment: keyName,
									side: CheckSide.Value,
								}),
								locale,
							})
						)
					)
					const result = res.caseOf({
						Left: (issues) => mergeIssues(processed, issues as XisObjectIssues<Schema>),
						Right: (prop) => processed.map((current) => current.set(keyName, prop)),
					})

					return { remaining, result }
				}

				return {
					remaining,
					result: processed,
				}
			},
			Promise.resolve({
				remaining: new Map(entries),
				result: Right(new Map<TruePropertyKey, unknown>()),
			})
		)
	}

	async exec(
		args: XisExecArgs<XisObjectIn<Schema>, XisObjectCtx<Schema>>
	): ExecResultAsync<XisObjectIssues<Schema>, XisObjectOut<Schema>> {
		const { result, remaining } = await this.#process(args)
		return result.map(
			(entries) => Object.fromEntries([...entries, ...remaining]) as XisObjectOut<Schema>
		)
	}
}

export const object = <Schema extends [...Array<XisPropBase>]>(
	args: XisObjectAsyncArgs<Schema>
): XisObjectAsync<Schema> => new XisObjectAsync(args)
