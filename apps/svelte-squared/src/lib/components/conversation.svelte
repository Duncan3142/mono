<script lang="ts">
	import { marked } from "marked"

	type Message = { content: string; role: string; timestamp: number }
	type Props = {
		conversation: Array<Message>
		thinking: boolean
	}
	type MessagePart = "comment" | "thought"

	const { conversation, thinking }: Props = $props()
	let parseError = $state<string | null>(null)

	const setError = (err: Error): never => {
		parseError = err.message
		throw err
	}

	const parser = new DOMParser()
	const parsedConversation = $derived.by(() =>
		conversation.map(({ content, role, timestamp }) => {
			const parsedContent = parser.parseFromString(content, "text/html")
			const body = parsedContent.querySelector("body")

			const contents: Array<{ type: MessagePart; htmlContent: string }> = []
			const addText = (node: ChildNode, type: MessagePart) => {
				if (node.nodeName !== "#text") {
					throw setError(new Error(`Expected text node, got ${node.nodeName}`))
				}
				if (node.textContent === null) {
					return
				}
				const textContent = node.textContent.trim()
				if (textContent === "") {
					return
				}
				const htmlContent = marked.parse(textContent, {
					async: false,
				})
				contents.push({ type, htmlContent })
			}
			body?.childNodes.forEach((node) => {
				switch (node.nodeName) {
					case "#text":
						addText(node, "comment")
						return
					case "THINK": {
						const [child, ...rest] = node.childNodes
						if (typeof child === "undefined" || rest.length > 0) {
							throw setError(
								new Error(
									`Expected single child node, got ${node.childNodes.length} children on ${node.nodeName}`
								)
							)
						}
						addText(child, "thought")
						return
					}
					default:
						throw setError(new Error(`Unknown node type: ${node.nodeName}`))
				}
			})

			return {
				contents,
				role,
				timestamp,
			}
		})
	)
</script>

<div class={["conversation"]}>
	{#if parseError !== null}
		<div class={["error"]}>{parseError}</div>
	{:else}
		{#each parsedConversation as { contents, role, timestamp } (timestamp)}
			<div class={["message", role]}>
				{#each contents as { type, htmlContent } (type)}
					<span class={[type]}>{@html htmlContent}</span>
				{/each}
			</div>
		{/each}
		{#if thinking}
			<div class={["message", "assistant", "thinking"]}>Thinking...</div>
		{/if}
	{/if}
</div>

<style>
	.conversation {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		& .message {
			padding: 0.5rem;
			margin: 0.5rem;
			border-radius: 0.5rem;
			margin-top: 0.5rem;
		}
		& .user {
			background-color: #00ffee;
		}
		& .assistant {
			color: #0099ff;
			text-align: right;
		}
		& .thought {
			font-style: italic;
			color: bisque;
			display: block;
		}
	}
</style>
