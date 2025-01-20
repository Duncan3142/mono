<script lang="ts">
	import { ParaglideJS } from "@inlang/paraglide-sveltekit"
	import { i18n } from "$lib/i18n"

	let { children } = $props()
</script>

<ParaglideJS {i18n}>
	Svelte <sup>2</sup>
	{@render children()}
</ParaglideJS>

<style>
	:global(body) {
		font-family: "Teko", sans-serif;
	}
</style>
