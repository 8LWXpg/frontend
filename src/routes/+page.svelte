<script lang="ts">
	// @ts-ignore
	import Plot from "svelte-plotly.js";

	const data = [
		{
			x: [0, 2, 3, 4, 5],
			y: [1, 2, 4, 8, 16],
		},
	];
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main>
	<div>
		<h1>Home</h1>
		<p>Welcome home!</p>
	</div>
	<Plot
		{data}
		layout={{
			margin: { t: 0 },
		}}
		fillParent="width"
		debounce={250}
	/>
</main>

<style>
</style>
