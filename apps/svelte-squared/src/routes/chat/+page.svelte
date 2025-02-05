<script lang="ts">
	import { enhance } from "$app/forms"
	import { Chat } from "$lib/chat/chat.service.svelte"
	import Conversation from "$lib/chat/conversation.svelte"

	const chat = new Chat({
		fetch,
	})
</script>

<div class={["flex", "flex-col", "h-full"]}>
	<Conversation log={chat.log} thinking={chat.thinking} />

	<form
		class={["flex", "flex-[1_1_auto]", "items-end", "justify-end"]}
		method="POST"
		use:enhance={({ cancel }) => {
			cancel()
		}}
		on:submit={async (evt) => {
			const form = evt.currentTarget
			const message = form.elements.namedItem("message") as HTMLTextAreaElement
			const { value } = message
			form.reset()
			await chat.ask(value)
			evt.preventDefault()
		}}
	>
		<div class={["flex", "flex-[2_1_auto]", "flex-col", "items-start"]}>
			<label class={["m-1"]} for="message"> Message </label>
			<textarea
				class={["resize-none", "h-12", "box-border", "w-99/100", "m-1"]}
				id="message"
				contenteditable
				name="message"
			></textarea>
		</div>
		<button class={["m-1"]}>Send</button>
	</form>
</div>
