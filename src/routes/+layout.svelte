<script lang="ts">
	import './layout.css';

	export const prerender = true;

	let { children } = $props();
</script>

{@render children()}
