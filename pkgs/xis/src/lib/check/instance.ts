import type { XisIssue } from "#core/error.js"

import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"

import { trueTypeOf } from "#util/base-type.js"

import type { XisArgObjBase } from "#core/context.js"
import { Left, Right } from "purify-ts/Either"

export interface InstanceOfIssue extends XisIssue<"INSTANCE_OF"> {
	expected: string
	received: string
}

export type Constructor<T> = new (...args: Array<any>) => T

export class XisInstanceOf<T> extends XisSync<T, InstanceOfIssue> {
	#ctor: Constructor<T>
	constructor(ctor: Constructor<T>) {
		super()
		this.#ctor = ctor
	}
	parse(value: unknown, ctx: XisArgObjBase): ParseResultSync<InstanceOfIssue, never, T> {
		if (value instanceof this.#ctor) {
			return Right(value)
		}
		const typeName = trueTypeOf(value)
		const received =
			typeName === "null" || typeName === "undefined"
				? String(value)
				: // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					(Object.getPrototypeOf(value).constructor.name as string)
		const err = {
			name: "INSTANCE_OF",
			expected: this.#ctor.name,
			received,
			path: ctx.path,
		} satisfies InstanceOfIssue
		return Left([err])
	}

	exec(value: T): ExecResultSync<never, T> {
		return Right(value)
	}
}

export const instance = <T>(ctor: Constructor<T>): XisInstanceOf<T> => new XisInstanceOf(ctor)
