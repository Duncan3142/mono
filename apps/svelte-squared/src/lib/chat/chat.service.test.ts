import { describe, it, expect, beforeEach, vi } from "vitest"
import { mock, mockFn, mockReset } from "vitest-mock-extended"
import { Chat, USER, ASSISTANT } from "./chat.service"

describe("Chat Service", () => {
	const mockFetch = mockFn<typeof fetch>()
	let chat = new Chat({ fetch: mockFetch })
	let askSpy = vi.spyOn(chat, "ask")

	beforeEach(() => {
		mockReset(mockFetch)
		chat = new Chat({ fetch: mockFetch })
		askSpy = vi.spyOn(chat, "ask")
	})

	describe("Initial State", () => {
		it("should start with empty log", () => {
			expect(chat.log).toEqual([])
		})

		it("should start with thinking false", () => {
			expect(chat.thinking).toBe(false)
		})
	})

	describe("User Message Processing", () => {
		it("should add parsed user message to log", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('"Bot response"'),
				})
			)

			await chat.ask("Hello")

			const []

			expect(chat.log[0]).toMatchObject({
				role: USER,
				hasContent: true,
				content: {
					parsed: true,
					html: "<p>Hello</p>",
				},
			})
		})

		it("should handle markdown in user messages", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('"Bot response"'),
				})
			)

			await chat.ask("**Bold** text")

			const [userMessage] = chat.log

			expect(userMessage).toMatchObject({
				role: USER,
				content: {
					parsed: true,
					html: "<p><strong>Bold</strong> text</p>",
					hasContent: true,
				},
			})
		})
	})

	describe("Bot Message Processing", () => {
		it("should handle simple bot response", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('"Simple response"'),
				})
			)

			await chat.ask("Hello")

			expect(chat.log[1]).toMatchObject({
				role: ASSISTANT,
				fetched: true,
				parsed: true,
				elements: [
					{
						mode: "comment",
						parsed: true,
						html: "<p>Simple response</p>",
					},
				],
			})
		})

		it("should handle bot response with thought", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('"<think>Thinking...</think>Response"'),
				})
			)

			await chat.ask("Hello")

			expect(chat.log[1]).toMatchObject({
				role: ASSISTANT,
				fetched: true,
				parsed: true,
				elements: [
					{
						mode: "thought",
						parsed: true,
						html: "<p>Thinking...</p>",
					},
					{
						mode: "comment",
						parsed: true,
						html: "<p>Response</p>",
					},
				],
			})
		})
	})

	describe("Error Handling", () => {
		it("should handle fetch errors", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network error"))

			await chat.ask("Hello")

			expect(chat.log[1]).toMatchObject({
				role: ASSISTANT,
				fetched: false,
				hasContent: false,
				error: expect.any(Error),
			})
		})

		it("should handle invalid bot response", async () => {
			mockFetch.mockResolvedValueOnce({
				json: () => Promise.resolve(null),
			})

			await chat.ask("Hello")

			expect(chat.log[1]).toMatchObject({
				role: ASSISTANT,
				fetched: false,
				hasContent: false,
				error: expect.any(Error),
			})
		})
	})

	describe("Thinking State", () => {
		it("should manage thinking state during ask", async () => {
			const states: Array<boolean> = []

			mockFetch.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						states.push(chat.thinking)
						resolve(
							mock<Response>({
								json: () => Promise.resolve('"Response"'),
							})
						)
					})
			)

			states.push(chat.thinking) // before
			await chat.ask("Hello")
			states.push(chat.thinking) // after

			expect(states).toEqual([false, true, false])
		})
	})

	describe("Complex Content", () => {
		it("should handle nested markdown and HTML", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('"**Bold** <em>italic</em> _underscore_"'),
				})
			)

			await chat.ask("Test")
			expect(chat.log[1].elements[0].html).toBe(
				"<p><strong>Bold</strong> <em>italic</em> <em>underscore</em></p>"
			)
		})

		it("should handle code blocks with special chars", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('"`const x = {}<>\\n`"'),
				})
			)

			await chat.ask("Test")
			expect(chat.log[1].elements[0].html).toContain("<code>")
		})
	})

	describe("Special Cases", () => {
		it("should handle empty messages", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('""'),
				})
			)

			await chat.ask("   ")
			expect(chat.log[0].content.hasContent).toBe(false)
			expect(chat.log[1].elements[0].hasContent).toBe(false)
		})

		it("should handle malformed think tags", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('"<think>Incomplete"'),
				})
			)

			await chat.ask("Test")
			expect(chat.log[1]).toMatchObject({
				role: ASSISTANT,
				fetched: true,
				parsed: false,
				hasContent: true,
			})
		})
	})

	describe("Concurrent Behavior", () => {
		it("should handle multiple rapid asks", async () => {
			const responses = ['"R1"', '"R2"', '"R3"']
			responses.forEach((r) =>
				mockFetch.mockResolvedValueOnce(
					mock<Response>({
						json: () => Promise.resolve(r),
					})
				)
			)

			await Promise.all([chat.ask("Q1"), chat.ask("Q2"), chat.ask("Q3")])

			expect(chat.log.length).toBe(6) // 3 questions + 3 responses
			expect(chat.thinking).toBe(false)
		})
	})

	describe("Unicode and Special Characters", () => {
		it("should handle emoji and unicode", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('"Hello 👋 世界"'),
				})
			)

			await chat.ask("Test 🌟")
			expect(chat.log[0].content.html).toContain("🌟")
			expect(chat.log[1].elements[0].html).toContain("👋")
		})

		it("should handle HTML entities", async () => {
			mockFetch.mockResolvedValueOnce(
				mock<Response>({
					json: () => Promise.resolve('"&lt;script&gt;"'),
				})
			)

			await chat.ask("Test")
			expect(chat.log[1].elements[0].html).toContain("&lt;script&gt;")
		})
	})
})
