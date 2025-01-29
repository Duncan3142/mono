<script lang="ts">
	// import { USER, type Log, type UserMessage } from "./chat.service"

	// type Props = {
	// 	log: Log
	// 	thinking: boolean
	// }

	// const { log, thinking }: Props = $props()
</script>

<!--
{#snippet userMessage(message: UserMessage)}
	<article class={["message", message.role, message.parsed && "parsed"]}>
		{#if message.parsed}
			{@html message.html}
		{:else}
			<div class={["error"]}>
				{message.error}
			</div>
			<div class={["content"]}>
				{message.content}
			</div>
		{/if}
	</article>
{/snippet}

<main class={["conversation"]}>
	{#each log as entry (entry.timestamp)}
		{#if entry.role === USER}
			{#if entry.parsed}
				{#each entry.contents as content (content.mode)}
					{#if content.parsed}
						<div class={["message", role]}>
							<span class={["thought"]}>{content.html}</span>
						</div>
					{/if}
				{/each}
			{:else if content}
				<div class={["message", role]}>
					<span>{@html content}</span>
				</div>
			{/if}
		{:else if entry.fetched}
			{entry.fetched}
		{:else}
			meow
		{/if}
		<div class={["message", role]}>
			{#each contents as { mode, html } (mode)}
				<span class={[mode]}>{@html html}</span>
			{/each}
		</div>
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
		& .thought {
			font-style: italic;
			color: #6600ff;
			display: block;
		}
	}
</style> -->
