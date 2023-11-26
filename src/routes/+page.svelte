<script lang="ts">
	// @ts-ignore
	import Plot from "svelte-plotly.js";
	import { onMount } from "svelte";
	const max = 100;
	let dataSets = [
		[
			{
				x: [new Date()],
				y: [0],
				type: "scatter",
			},
		],
	];

	function addPlot() {
		dataSets.push([
			{
				x: [new Date()],
				y: [0],
				type: "scatter",
			},
		]);
	}

	function minusPlot() {
		if (dataSets.length > 1) {
			dataSets.pop();
		}
	}

	function updateData() {
		dataSets = dataSets.map((data) => {
			const newRandom = Math.random();
			data[0].y.push(newRandom);
			data[0].x.push(new Date());
			if (data[0].x.length > max) {
				data[0].x.shift();
				data[0].y.shift();
			}
			return [...data];
		});
	}

	onMount(() => {
		setInterval(updateData, 500);
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<p1>Home</p1>

<button on:click={addPlot}>Add Plot</button>
<button on:click={minusPlot}>Minus Plot</button>

<div class="row">
	{#each dataSets as data, i}
		<div class="column">
			<Plot {data} layout={{ width: 500, height: 400 }} />
		</div>
	{/each}
</div>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.column {
		flex: 0 0 30%;
		max-width: 30%;
		margin-bottom: 20px;
	}
</style>
