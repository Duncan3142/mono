import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisCoerceString extends XisSync<unknown, never, never, string> {
	parse(value: unknown): ParseResultSync<never, never, string> {
		return this.exec(value)
	}

	exec(value: unknown): ExecResultSync<never, string> {
		return Right(String(value))
	}
}

export const string: XisCoerceString = new XisCoerceString()
