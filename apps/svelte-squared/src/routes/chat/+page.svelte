<script lang="ts">
	import { enhance } from "$app/forms"
	// eslint-disable-next-line boundaries/no-ignored -- Unable to resolve
	// import type { PageProps } from "./$types"
	// const { form }: PageProps = $props()
	type Message = { content: string; role: string; timestamp: number }
	let conversation = $state<Array<Message>>([])
	let thinking = $state(false)
</script>

<div class={["chat"]}>
	<div class={["conversation"]}>
		{#each conversation as { content, role, timestamp } (timestamp)}
			<div class={["message", role]}>
				{content}
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
	}
	.conversation {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.message {
		padding: 0.5rem;
		margin: 0.5rem;
		border-radius: 0.5rem;
	}
	.user {
		background-color: #00ffee;
	}
	.assistant {
		color: #0099ff;
		text-align: right;
	}
	.question {
		display: flex;

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
				height: 3rem;
				width: 100%;
				margin: 0.2rem;
			}
		}

		& button {
			margin: 0.2rem;
		}
	}
</style>
