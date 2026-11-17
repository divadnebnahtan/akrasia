<script>
	export let data;
</script>

<article class="prose lg:prose-xl max-w-none px-4 mx-auto my-8">
	<svelte:component this={data.post} />
</article>