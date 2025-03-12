<script lang="ts">
	import "$/app.css"
	import { ModeWatcher } from "mode-watcher"
	import { ParaglideJS } from "@inlang/paraglide-sveltekit"
	import { i18n } from "$lib/i18n"
	import Header from "$/components/header.svelte"

	let { children } = $props()
</script>

<ModeWatcher defaultMode="dark" />
<ParaglideJS {i18n}>
	<Header />
	{@render children()}
</ParaglideJS>
