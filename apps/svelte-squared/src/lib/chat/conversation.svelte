<script lang="ts">
	import { USER, type Log } from "./chat.service"

	type Props = {
		log: Log
		thinking: boolean
	}

	const { log, thinking }: Props = $props()
</script>

<main class={["conversation"]}>
	{#each log as message (message.timestamp)}
		{#if message.role === USER}
			{#if message.hasContent}
				<article class={["message", "user"]}>
					{#if message.content.parsed}
						<span class={["parsed"]}>
							{@html message.content.html}
						</span>
					{:else}
						<div class={["error"]}>
							{message.content.error}
						</div>
						<div class={["unparsed"]}>
							{message.content.content}
						</div>
					{/if}
				</article>
			{/if}
		{:else if message.fetched}
			::TODO:: fetched bot message
		{:else}
			::TODO:: unfetched bot message
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
		}
		& .user {
			background-color: #00ffee;
		}
		& .assistant {
			color: #0099ff;
			text-align: right;
		}
		/* & .thought {
			font-style: italic;
			color: #6600ff;
			display: block;
		} */
	}
</style>
