import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisCoerceBoolean extends XisSync<unknown, never, never, boolean> {
	parse(value: unknown): ParseResultSync<never, never, boolean> {
		return this.exec(value)
	}

	exec(value: unknown): ExecResultSync<never, boolean> {
		return Right(Boolean(value))
	}
}

export const boolean: XisCoerceBoolean = new XisCoerceBoolean()
