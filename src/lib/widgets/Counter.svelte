<script>
	let count = 0;
</script>

<button on:click={() => count += 1}>
	Clicked {count} times
</button>

<style>
	button {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
		cursor: pointer;
	}
</style>