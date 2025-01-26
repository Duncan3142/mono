<script lang="ts">
	import { enhance } from "$app/forms"
	// eslint-disable-next-line boundaries/no-ignored -- Unable to resolve
	// import type { PageProps } from "./$types"
	// const { form }: PageProps = $props()
	type Message = { content: string; role: string; timestamp: number }
	let conversation = $state<Array<Message>>([])
</script>

{#each conversation as message (message.timestamp)}
	<div
		class="message"
		class:assistant={message.role === "assistant"}
		class:user={message.role === "user"}
	>
		{message.content}
	</div>
{/each}

<form
	method="POST"
	use:enhance={({ formData }) => {
		const message = formData.get("message")
		conversation =
			typeof message === "string"
				? [...conversation, { content: message, role: "user", timestamp: Date.now() }]
				: conversation
		formData.delete("message")
		formData.set("conversation", JSON.stringify(conversation))

		return async ({ result, update }) => {
			await update()
			alert(JSON.stringify(result))
			if (result.type === "success" && Array.isArray(result.data)) {
				conversation = result.data
			}
		}
	}}
>
	<label>
		Message
		<input contenteditable name="message" type="text" />
	</label>
	<button>Send</button>
</form>
