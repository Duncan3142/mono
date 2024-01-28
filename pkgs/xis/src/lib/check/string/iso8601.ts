import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { NTuple } from "#util/base-type.js"
import { Left, Right } from "purify-ts/Either"

const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{1,16})Z$/
// type DIGIT = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
// type DIGIT_PAIR = `${DIGIT}${DIGIT}`
// type DIGIT_QUAD = `${DIGIT_PAIR}${DIGIT_PAIR}`
// type ISO8601 =
// 	`${DIGIT_QUAD}-${DIGIT_PAIR}-${DIGIT_PAIR}T${DIGIT_PAIR}:${DIGIT_PAIR}:${DIGIT_PAIR}.${number}Z`

export const Month = {
	Jan: 1,
	Feb: 2,
	Mar: 3,
	Apr: 4,
	May: 5,
	Jun: 6,
	Jul: 7,
	Aug: 8,
	Sep: 9,
	Oct: 10,
	Nov: 11,
	Dec: 12,
} as const

export type Month = (typeof Month)[keyof typeof Month]

export function isISO8601(str: string): boolean {
	const check = regex.exec(str)

	if (check === null) {
		return false
	}

	const [year, month, day, hour, min, sec, _millisecond] = check
		.slice(1)
		.map((elem) => Number.parseInt(elem, 10)) as NTuple<7, number>

	if (year < 1900 || year > 3000) {
		return false
	}

	const leapYear = year % 4 === 0
	const daysInFeb = leapYear ? 29 : 28

	if (day === 0) {
		return false
	}

	switch (month) {
		case Month.Feb:
			if (day > daysInFeb) {
				return false
			}
			break
		case Month.Jan:
		case Month.Mar:
		case Month.May:
		case Month.Jul:
		case Month.Aug:
		case Month.Oct:
		case Month.Dec:
			if (day > 31) {
				return false
			}
			break
		case Month.Apr:
		case Month.Jun:
		case Month.Sep:
		case Month.Nov:
			if (day > 30) {
				return false
			}
			break
		default:
			return false
	}

	if (hour > 23) {
		return false
	}

	if (min > 59 || sec > 59) {
		return false
	}

	return true
}

export interface ISO8601Issue extends XisIssue<"XIS_ISO8601"> {
	received: string
}

export interface XisISO8601Messages extends XisMessages<ISO8601Issue> {
	XIS_ISO8601: XisMsgBuilder<string>
}

export interface XisISO8601Args {
	messages: XisISO8601Messages | null
}

export class XisISO8601 extends XisSync<string, ISO8601Issue> {
	#messages: XisISO8601Messages
	constructor(args: XisISO8601Args) {
		const { messages } = args
		super()
		this.#messages = messages ?? {
			XIS_ISO8601: (args) => {
				const { input, path } = args
				return `Expected ISO8601 string, received ${input} at ${JSON.stringify(path)}`
			},
		}
	}
	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}
	exec(args: XisExecArgs<string>): ExecResultSync<ISO8601Issue, string> {
		const { value, path, locale, ctx } = args
		switch (isISO8601(value)) {
			case true:
				return Right(value)
			case false: {
				const message = this.#messages.XIS_ISO8601({
					input: value,
					path,
					locale,
					ctx,
				})
				return Left([
					{
						name: "XIS_ISO8601",
						message,
						received: value,
						path,
					},
				])
			}
		}
	}
}

export const iso8601i18n = (messages: XisISO8601Messages) =>
	new XisISO8601({
		messages,
	})
export const iso8601 = () => new XisISO8601({ messages: null })
