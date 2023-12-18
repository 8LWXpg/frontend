<script lang="ts">
	export let data;
	let showModal = false;
	let tempSettings = { ...data.settings };

	function toggleModal() {
		tempSettings = { ...data.settings };
		showModal = !showModal;
	}
</script>

<svelte:head></svelte:head>

<body>
	<nav>
		<div>Network management system</div>
		<button on:click={toggleModal}>settings</button>
	</nav>
	{#if data.cpuWarning}
		<div class="center warning">CPU Warning</div>
	{/if}

	<h1>{data.cpuWarning}</h1>

	{#if showModal}
		<div class="modal">
			<div class="center settings">
				<form method="post" action="?/save" id="settings">
					<label for="cpu">CPU Utilization Max</label>
					<input
						type="number"
						min="0"
						max="100"
						id="cpu"
						name="cpu"
						bind:value={tempSettings.cpu}
					/>
					<label for="mem">Memory Utilization Max</label>
					<input
						type="number"
						min="0"
						max="100"
						id="mem"
						name="mem"
						bind:value={tempSettings.mem}
					/>
					<label for="bw">Bandwidth Utilization Max</label>
					<input
						type="number"
						min="0"
						max="100"
						id="bw"
						name="bw"
						bind:value={tempSettings.bw}
					/>
					<label for="dly">ICMP Delay</label>
					<input
						type="number"
						id="dly"
						name="dly"
						bind:value={tempSettings.dly}
					/>
					<div class="row">
						<div class="column column-50">
							<button
								form="none"
								on:click={toggleModal}
								style="width: 100%;">Cancel</button
							>
						</div>
						<div class="column column-50">
							<button form="settings" style="width: 100%;"
								>Save
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	{/if}
</body>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		border-bottom: 1pt solid var(--color-foreground);
		margin: 10pt 0 20pt;
	}

	.center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.settings {
		position: fixed;
		top: 10%;
		left: 25%;
		width: 50%;
		height: 80%;
		background-color: var(--color-background);
	}
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.warning {
		color: red;
	}
</style>
