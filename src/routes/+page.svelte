<script lang="ts">
	let showModal = false;
	let cpu = 0;
	let mem = 0;
	let bw = 0;
	let dly = 0;

	let tempCpu = 0;
	let tempMem = 0;
	let tempBw = 0;
	let tempDly = 0;

	function toggleModal() {
		showModal = !showModal;
	}

	function saveSettings() {
		cpu = tempCpu;
		mem = tempMem;
		bw = tempBw;
		dly = tempDly;
		toggleModal();
	}
</script>

<svelte:head></svelte:head>

<body>
	<nav>
		<div>Network management system</div>
		<button on:click={toggleModal}>settings</button>
	</nav>

	{#if showModal}
		<div class="modal">
			<div class="center settings">
				<form>
					<label for="cpu">CPU Utilization Max</label>
					<input
						type="number"
						min="0"
						max="100"
						id="cpu"
						bind:value={tempCpu}
					/>
					<label for="mem">Memory Utilization Max</label>
					<input
						type="number"
						min="0"
						max="100"
						id="mem"
						bind:value={tempMem}
					/>
					<label for="bw">Bandwidth Utilization Max</label>
					<input
						type="number"
						min="0"
						max="100"
						id="bw"
						bind:value={tempBw}
					/>
					<label for="dly">ICMP Delay</label>
					<input type="number" id="dly" bind:value={tempDly} />
					<button on:click={toggleModal}>Cancel</button>
					<button on:click={saveSettings}>Save</button>
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

	.settings-footer {
		display: flex;
		justify-content: flex-end;
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
</style>
