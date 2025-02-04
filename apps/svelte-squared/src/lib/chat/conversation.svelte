<script lang="ts">
	import { type Log } from "./chat.service.svelte"

	interface Props {
		log: Log
		thinking: boolean
	}

	const { log, thinking }: Props = $props()
</script>

<main class={["conversation"]}>
	{#each log as message (message.timestamp)}
		{#if message.hasContent}
			<article class={["message", message.role]}>
				{message.content}
			</article>
		{:else if message.hasError}
			<article class={["message", message.role, "error"]}>
				{message.error}
			</article>
		{/if}
	{/each}
	{#if thinking}
		<div class={["message", "assistant", "thinking"]}>Thinking...</div>
	{/if}
</main>

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

			&.user {
				background-color: #00ffee;
			}
			&.assistant {
				color: #0099ff;
				text-align: right;
			}
			&.error {
				background-color: #ff0000;
				color: #ffffff;
			}
			&.thinking {
				font-style: italic;
				color: #6600ff;
			}
		}
	}
</style>
