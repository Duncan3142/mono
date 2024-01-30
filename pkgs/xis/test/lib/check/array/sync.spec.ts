import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { array } from "#check/array/sync.js"
import { uuid, type UUID } from "#check/string/uuid.js"

import { CheckSide } from "#core/path.js"

const check = array(uuid(4))

void it("should pass a matching array", () => {
	const arr: Array<UUID> = [
		"c8199460-77b1-4b9f-83ee-6abe4c341f07",
		"3da0acd0-68a5-42ae-bd63-e3a06513e3bc",
	]
	const res = check.exec({
		value: arr,
		locale: null,
		ctx: {},
		path: [],
	})
	assertRight(res)
	const expected: ExtractValue<typeof res> = arr
	expect(res.extract()).toEqual(expected)
})

void it("should fail an invalid value", () => {
	const res = check.exec({
		value: ["bad"],
		locale: null,
		ctx: {},
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_UUID",
			expected: 4,
			received: "bad",
			message: 'Expected UUID 4, received "bad"',
			path: [
				{
					segment: 0,
					side: CheckSide.Value,
				},
			],
		},
	]

	expect(res.extract()).toEqual(expected)
})
