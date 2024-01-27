import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right, Left } from "purify-ts/Either"

export type UUID = `${string}-${string}-${string}-${string}-${string}`

const uuidPatterns = {
	1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
	2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
	3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
	4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
	5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
	all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
}

export const Version = {
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	all: "all",
} as const

export type Version = (typeof Version)[keyof typeof Version]

export interface UUIDIssue<V extends Version> extends XisIssue<"XIS_UUID"> {
	expected: V
	received: string
}

export type XisUUIDProps<V extends Version> = {
	version: V
}

export interface XisUUIDMessages<V extends Version> extends XisMessages<UUIDIssue<V>> {
	XIS_UUID: XisMsgBuilder<string, XisUUIDProps<V>>
}

export interface XisUUIDArgs<V extends Version> {
	props: XisUUIDProps<V>
	messages: XisUUIDMessages<V> | null
}

export class XisUUID<V extends Version> extends XisSync<string, UUIDIssue<V>, UUID> {
	#props: XisUUIDProps<V>
	#messages: XisUUIDMessages<V>

	constructor(args: XisUUIDArgs<V>) {
		super()
		const { messages, props } = args
		this.#props = props
		this.#messages = messages ?? {
			XIS_UUID: (args: XisMsgArgs<string, XisUUIDProps<V>>) => {
				const { value, path, props } = args
				return `Expected UUID version ${props.version}, received ${value} at ${JSON.stringify(path)}`
			},
		}
	}

	override get effect(): Effect {
		return Effect.Validate
	}

	exec(args: XisExecArgs<string>): ExecResultSync<UUIDIssue<V>, UUID> {
		const { value, path, locale } = args
		const { version } = this.#props
		const pattern = uuidPatterns[version]
		switch (pattern.test(value)) {
			case true:
				return Right(value as UUID)
			default: {
				const message = this.#messages.XIS_UUID({
					value,
					path,
					locale,
					props: this.#props,
					ctx: null,
				})

				return Left([
					{
						name: "XIS_UUID" as const,
						expected: version,
						received: value,
						message,
						path,
					},
				])
			}
		}
	}
}

export const uuid = <V extends Version>(args: XisUUIDArgs<V>): XisUUID<V> => new XisUUID(args)
