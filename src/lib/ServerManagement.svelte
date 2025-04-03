<script lang="ts">
	import { onMount } from "svelte";

	// Server management state
	let servers: string[] = [];
	let isLoading = false;
	let error = "";

	onMount(async () => {
		await fetchServers();
	});

	async function fetchServers() {
		try {
			isLoading = true;
			const response = await fetch(`/api/servers`);
			if (response.ok) {
				servers = await response.json();
			} else {
				error = "Failed to fetch servers";
			}
		} catch (err) {
			error = "Error connecting to server";
			console.error(err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="server-management">
	<h2>Available Servers</h2>

	{#if error}
		<div class="error-message">{error}</div>
	{/if}

	<div class="server-list">
		{#if isLoading && servers.length === 0}
			<p>Loading servers...</p>
		{:else if servers.length === 0}
			<p>
				No servers available. Please contact an administrator to add new
				servers.
			</p>
		{:else}
			<ul>
				{#each servers as server}
					<li>
						<span class="server-name">{server}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.server-management {
		padding: 1rem;
		height: 100%;
		overflow-y: auto;
	}

	.error-message {
		background: #ffebee;
		color: #c62828;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.server-list ul {
		list-style: none;
		padding: 0;
	}

	.server-list li {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		margin-bottom: 0.5rem;
	}

	.server-name {
		font-size: 1rem;
		color: #333;
	}
</style>
