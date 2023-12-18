<script lang="ts">
	let showModal = false;

	function toggleModal() {
		showModal = !showModal;
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
				<!-- Settings page content goes here -->
				<div class="settings-footer">
					<!-- <button on:click={saveSettings}>Save</button> -->
					<button on:click={toggleModal}>Close</button>
				</div>
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
