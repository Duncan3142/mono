<script lang="ts">
	import { page } from "$app/state"
	import { goto } from "$app/navigation"
	import type { AvailableLanguageTag } from "$lib/paraglide/runtime"
	import { i18n } from "$lib/i18n/i18n"
	import * as m from "$lib/paraglide/messages.js"

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname)
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage)
		goto(localisedPath)
	}
</script>

<h1>{m.hello_world({ name: "SvelteKit User" })}</h1>
<div>
	<button onclick={() => switchToLanguage("en-gb")}>en-gb</button>
</div>
