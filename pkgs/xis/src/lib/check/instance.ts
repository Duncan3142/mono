import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { trueTypeOf } from "#util/base-type.js"
import { Left, Right } from "purify-ts/Either"

export interface InstanceOfIssue extends XisIssue<"XIS_INSTANCE_OF"> {
	expected: string
	received: string
	value: unknown
}

export type Constructor<T> = new (...args: Array<any>) => T

export type InstanceOfProps<T> = {
	ctor: Constructor<T>
}

export type InstanceOfMessageProps<T> = InstanceOfProps<T> & {
	received: string
	value: unknown
}

export interface InstanceOfMessages<T> extends XisMessages<InstanceOfIssue> {
	XIS_INSTANCE_OF: XisMsgBuilder<InstanceOfMessageProps<T>>
}

export interface InstanceOfArgs<T> {
	props: InstanceOfProps<T>
	messages: InstanceOfMessages<T> | null
}

export class XisInstanceOf<T> extends XisSync<unknown, InstanceOfIssue, T> {
	#props: InstanceOfProps<T>
	#messages: InstanceOfMessages<T>
	constructor(args: InstanceOfArgs<T>) {
		super()
		this.#props = args.props
		this.#messages = args.messages ?? {
			XIS_INSTANCE_OF: (args: XisMsgArgs<InstanceOfMessageProps<T>>) => {
				const {
					input: { ctor, received },
				} = args
				return `Expected ${ctor.name}, received ${received}`
			},
		}
	}
	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}
	exec(args: XisExecArgs): ExecResultSync<InstanceOfIssue, T> {
		const { value, path, locale, ctx } = args
		const { ctor } = this.#props
		if (value instanceof ctor) {
			return Right(value)
		}

		const received = value instanceof Object ? value.constructor.name : trueTypeOf(value)

		const message = this.#messages.XIS_INSTANCE_OF({
			input: { ctor, received, value },
			path,
			locale,
			ctx,
		})
		const err = {
			name: "XIS_INSTANCE_OF" as const,
			expected: ctor.name,
			received,
			message,
			value,
			path,
		}
		return Left([err])
	}
}

export const instancei18n = <T>(
	ctor: Constructor<T>,
	messages: InstanceOfMessages<T>
): XisInstanceOf<T> =>
	new XisInstanceOf({
		messages,
		props: {
			ctor,
		},
	})
export const instance = <T>(ctor: Constructor<T>): XisInstanceOf<T> =>
	new XisInstanceOf({
		messages: null,
		props: {
			ctor,
		},
	})
