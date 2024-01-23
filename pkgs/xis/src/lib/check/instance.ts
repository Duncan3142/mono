import type { XisExecArgs } from "#core/args.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { trueTypeOf } from "#util/base-type.js"
import { Left, Right } from "purify-ts/Either"

export interface InstanceOfIssue extends XisIssue<"XIS_INSTANCE_OF"> {
	expected: string
	received: string
}

export type Constructor<T> = new (...args: Array<any>) => T

export type InstanceOfProps<T> = {
	ctor: Constructor<T>
}

export type InstanceOfMessageProps<T> = InstanceOfProps<T> & {
	received: string
}

export interface InstanceOfMessages<T> extends XisMessages<InstanceOfIssue> {
	XIS_INSTANCE_OF: XisMsgBuilder<unknown, InstanceOfMessageProps<T>>
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
			XIS_INSTANCE_OF: (args: XisMsgArgs<unknown, InstanceOfMessageProps<T>>) => {
				const { props, path } = args
				const { ctor, received } = props
				return `Value "${received}" at ${JSON.stringify(path)} is not an instance of ${ctor.name}`
			},
		}
	}
	exec(args: XisExecArgs): ExecResultSync<InstanceOfIssue, T> {
		const { value, path } = args
		const { ctor } = this.#props
		if (value instanceof this.#props.ctor) {
			return Right(value)
		}
		const typeName = trueTypeOf(value)
		const received =
			typeName === "null" || typeName === "undefined"
				? String(value)
				: // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					((Object.getPrototypeOf(value).constructor?.name ?? "UNKNOWN") as string)
		const message = this.#messages.XIS_INSTANCE_OF({
			value,
			path,
			props: { ...this.#props, received },
			ctx: null,
		})
		const err = {
			name: "XIS_INSTANCE_OF" as const,
			expected: ctor.name,
			received,
			message,
			path,
		}
		return Left([err])
	}
}

export const instance = <T>(args: InstanceOfArgs<T>): XisInstanceOf<T> =>
	new XisInstanceOf(args)
