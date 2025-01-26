<script lang="ts">
	import { enhance } from "$app/forms"
	import Conversation from "$lib/components/conversation.svelte"

	type Message = { content: string; role: string; timestamp: number }
	let conversation = $state<Array<Message>>([])

	let thinking = $state(false)
</script>

<div class={["chat"]}>
	<Conversation {conversation} {thinking} />

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
		<div class="content">
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

		& .question {
			display: flex;
			flex: 1 1 auto;
			align-items: flex-end;
			justify-content: end;
			& .content {
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
