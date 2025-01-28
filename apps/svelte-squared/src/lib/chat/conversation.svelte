<script lang="ts">
	import type { ParsedLog } from "./chat.service"

	type Props = {
		conversation: ParsedLog
		thinking: boolean
	}

	const { conversation, thinking }: Props = $props()
</script>

<div class={["conversation"]}>
	{#each conversation as { contents, role, timestamp } (timestamp)}
		<div class={["message", role]}>
			{#each contents as { mode, html } (mode)}
				<span class={[mode]}>{@html html}</span>
			{/each}
		</div>
	{/each}
	{#if thinking}
		<div class={["message", "assistant", "thinking"]}>Thinking...</div>
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
			color: #6600ff;
			display: block;
		}
	}
</style>
