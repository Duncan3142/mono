<script lang="ts">
	import { enhance } from "$app/forms"
	import { Chat } from "$lib/chat/chat.service.svelte"
	import Conversation from "$lib/chat/conversation.svelte"

	const chat = new Chat({
		fetch,
	})
</script>

<div class={["chat"]}>
	<Conversation log={chat.log} thinking={chat.thinking} />

	<form
		class={["question"]}
		method="POST"
		use:enhance={({ cancel }) => {
			cancel()
		}}
		on:submit={async (evt) => {
			const form = evt.currentTarget
			const message = form.elements.namedItem("message") as HTMLTextAreaElement
			await chat.ask(message.value)
			form.reset()
			evt.preventDefault()
		}}
	>
		<div class="content">
			<label for="message"> Message </label>
			<textarea id="message" contenteditable name="message"></textarea>
		</div>
		<button>Send</button>
	</form>
</div>
<!--
<style>
	@reference "tailwindcss/theme";

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
</style> -->
