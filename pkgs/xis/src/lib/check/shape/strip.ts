import { EitherAsync } from "purify-ts/EitherAsync"
import type { TruePropertyKey } from "#util/base-type.js"
import { CheckSide, addElement as addCtxElement, type XisCtx } from "#core/context.js"
import { XisAsync, type ExecResultAsync, type ParseResultAsync } from "#core/async.js"
import {
	guard,
	reduce,
	type ShapeIn,
	type ShapeGuardIssues,
	type ShapeExecIssues,
	type ShapeOut,
	type ShapeArgs,
	ShapeCheckMode,
	type PassThrough,
	type Strip,
	type Strict,
	type ShapeDefaultMode,
	type BaseProp,
} from "./core.js"

export class XisShapeAsync<
	S extends [...Array<BaseProp>],
	CM extends ShapeCheckMode,
> extends XisAsync<
	ShapeIn<S, CM>,
	ShapeGuardIssues<S, CM>,
	ShapeExecIssues<S, CM>,
	ShapeOut<S, CM>,
	ShapeArgs<S>
> {
	readonly #shape: [...S]

	readonly #mode: CM

	constructor(shp: [...S], mode: CM) {
		super()
		this.#shape = shp
		this.#mode = mode
	}

	get schema(): [...S] {
		return this.#shape
	}

	get mode(): CM {
		return this.#mode
	}

	parse(
		value: unknown,
		ctx: XisCtx<ShapeArgs<S>>
	): ParseResultAsync<ShapeGuardIssues<S, CM>, ShapeExecIssues<S, CM>, ShapeOut<S, CM>> {
		type Res = ParseResultAsync<
			ShapeGuardIssues<S, CM>,
			ShapeExecIssues<S, CM>,
			ShapeOut<S, CM>
		>
		return EitherAsync.liftEither(guard(value, this.#shape, this.#mode, ctx))
			.chain(async ([pending, extra]) => {
				const mapped = await Promise.all(
					pending.map(([key, check, value]) =>
						EitherAsync.fromPromise(() =>
							Promise.resolve(
								check.parse(value, addCtxElement(ctx, { segment: key, side: CheckSide.Value }))
							)
						).map((out) => [key, out] satisfies [TruePropertyKey, unknown])
					)
				)
				return reduce(mapped, extra)
			})
			.run() as Res
	}

	exec(
		value: ShapeIn<S, CM>,
		ctx: XisCtx<ShapeArgs<S>>
	): ExecResultAsync<ShapeExecIssues<S, CM>, ShapeOut<S, CM>> {
		type Res = ExecResultAsync<ShapeExecIssues<S, CM>, ShapeOut<S, CM>>
		return this.parse(value, ctx) as Res
	}

	passThrough(): XisShapeAsync<S, PassThrough> {
		return new XisShapeAsync(this.#shape, ShapeCheckMode.PASS_THROUGH)
	}

	strip(): XisShapeAsync<S, Strip> {
		return new XisShapeAsync(this.#shape, ShapeCheckMode.STRIP)
	}

	strict(): XisShapeAsync<S, Strict> {
		return new XisShapeAsync(this.#shape, ShapeCheckMode.STRICT)
	}
}

export const shape = <S extends [...Array<BaseProp>]>(
	shape: [...S]
): XisShapeAsync<S, ShapeDefaultMode> =>
	new XisShapeAsync<S, ShapeDefaultMode>(shape, ShapeCheckMode.STRIP)
