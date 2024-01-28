import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { instance } from "#check/instance.js"

const testUrl = new URL("https://example.com")
void it("should pass a matching instance", () => {
	const res = instance(URL).exec(testUrl, {
		args: undefined,
		path: [],
	})

	assertRight(res)
	equal(res.extract(), testUrl)
})

void it("should fail an invalid value", () => {
	const res = instance(Map).exec(null, {
		args: undefined,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "INSTANCE_OF",
			expected: "Map",
			path: [],
			received: "null",
		},
	]

	deepEqual(res.extract(), expected)
})

void it("should fail instance", () => {
	const res = instance(Map).exec(new URL("https://test.com"), {
		args: undefined,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "INSTANCE_OF",
			expected: "Map",
			path: [],
			received: "URL",
		},
	]

	deepEqual(res.extract(), expected)
})

void it("should fail instance", () => {
	const res = instance(Map).exec("test", {
		args: undefined,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "INSTANCE_OF",
			expected: "Map",
			path: [],
			received: "String",
		},
	]

	deepEqual(res.extract(), expected)
})
void it("should fail instance", () => {
	const res = instance(Map).exec(null, {
		args: undefined,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "INSTANCE_OF",
			expected: "Map",
			path: [],
			received: "null",
		},
	]

	deepEqual(res.extract(), expected)
})
void it("should fail instance", () => {
	const res = instance(Map).exec(undefined, {
		args: undefined,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "INSTANCE_OF",
			expected: "Map",
			path: [],
			received: "undefined",
		},
	]

	deepEqual(res.extract(), expected)
})
