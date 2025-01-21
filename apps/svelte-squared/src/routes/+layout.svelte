<script lang="ts">
	import { ParaglideJS } from "@inlang/paraglide-sveltekit"
	import { i18n } from "$lib/i18n"

	let { children } = $props()
</script>

<ParaglideJS {i18n}>
	<h1>Svelte<sup>2</sup></h1>
	<h2>
		<a href="/">Home</a>
		<a href="/demo/lucia">Lucia</a>
		<a href="/demo/paraglide">Paraglide</a>
	</h2>
	{@render children()}
</ParaglideJS>

<style>
	:global(body) {
		font-family: "Teko", sans-serif;
	}
</style>
