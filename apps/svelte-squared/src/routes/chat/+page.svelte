<script lang="ts">
	import { enhance } from "$app/forms"
	import { marked } from "marked"
	// eslint-disable-next-line boundaries/no-ignored -- Unable to resolve
	// import type { PageProps } from "./$types"
	// const { form }: PageProps = $props()
	type Message = { content: string; role: string; timestamp: number }
	let conversation = $state<Array<Message>>([])
	const parser = new DOMParser()
	const parsedConversation = $derived.by(() =>
		conversation.map(({ content, role, timestamp }) => {
			const parsedContent = parser.parseFromString(content, "text/html")
			const body = parsedContent.querySelector("body")
			const contents: Array<{ type: "text" | "think"; content: string }> = []
			body?.childNodes.forEach((node) => {
				if (node.childNodes.length > 1) {
					throw new Error(
						`Expected leaf node, got ${node.childNodes.length} children on ${node.nodeName}`
					)
				}
				if (node.textContent === null) {
					return
				}
				const textContent = node.textContent.trim()
				if (textContent === "") {
					return
				}
				const content = marked.parse(textContent, {
					async: false,
				})
				switch (node.nodeName) {
					case "#text":
						contents.push({ type: "text", content })
						return
					case "THINK": {
						contents.push({ type: "think", content })
						return
					}
					default:
						throw new Error(`Unknown node type: ${node.nodeName}`)
				}
			})

			return {
				contents,
				role,
				timestamp,
			}
		})
	)
	$inspect(parsedConversation)
	let thinking = $state(false)
</script>

<div class={["chat"]}>
	<div class={["conversation"]}>
		{#each parsedConversation as { contents, role, timestamp } (timestamp)}
			<div class={["message", role]}>
				{#each contents as { type, content } (type)}
					<span class={[type]}>{@html content}</span>
				{/each}
			</div>
		{/each}

		{#if thinking}
			<div class={["message", "assistant"]}>Thinking...</div>
		{/if}
	</div>

	<form
		class={["question"]}
		method="POST"
		use:enhance={({ formData, formElement }) => {
			thinking = true
			formElement.reset()
			const message = formData.get("message")
			conversation =
				typeof message === "string"
					? [...conversation, { content: message, role: "user", timestamp: Date.now() }]
					: conversation
			formData.delete("message")
			formData.set("conversation", JSON.stringify(conversation))

			return async ({ result, update }) => {
				await update()
				if (result.type === "success" && Array.isArray(result.data)) {
					conversation = result.data
				}
				thinking = false
			}
		}}
	>
		<div class="question-text">
			<label for="message"> Message </label>
			<textarea id="message" contenteditable name="message"></textarea>
		</div>
		<button>Send</button>
	</form>
</div>

<style>
	.chat {
		display: flex;
		flex-direction: column;
		height: 100%;

		.conversation {
			flex: 1 1 auto;
			display: flex;
			flex-direction: column;
			overflow: hidden;

			.message {
				padding: 0.5rem;
				margin: 0.5rem;
				border-radius: 0.5rem;

				+ .user {
					background-color: #00ffee;
				}
				+ .assistant {
					color: #0099ff;
					text-align: right;
					:global(think) {
						font-style: italic;
						color: bisque;
						display: block;
					}
					margin-top: 0.5rem;
				}
			}
		}

		.question {
			display: flex;
			flex: 1 1 auto;
			align-items: flex-end;
			justify-content: end;
			& .question-text {
				flex: 2 1 auto;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				& label {
					margin: 0.2rem;
				}
				& textarea {
					resize: none;
					height: 3rem;
					box-sizing: border-box;
					width: 99%;
					margin: 0.2rem;
				}
			}

			& button {
				margin: 0.2rem;
			}
		}
	}
</style>
