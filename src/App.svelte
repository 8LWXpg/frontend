<script lang="ts">
	import ChatUI from "./lib/ChatUI.svelte";
	import ServerManagement from "./lib/ServerManagement.svelte";
	import ToolsDisplay from "./lib/ToolsDisplay.svelte";
	import { onMount } from "svelte";

	// Tab management
	let activeTab = "chat";

	// Chat state
	let servers: string[] = [];
	let selectedServers: string[] = [];
	let selectedModel = "";

	function setActiveTab(tab: string) {
		activeTab = tab;
	}

	onMount(async () => {
		// Check if we have the API URL set
		if (!import.meta.env.VITE_API_URL) {
			console.warn("VITE_API_URL is not set. Please set it in your .env file.");
		}

		try {
			// Fetch available servers
			const serversRes = await fetch(`/api/servers`);
			if (serversRes.ok) {
				servers = await serversRes.json();
				// Select all servers by default
				selectedServers = [...servers];

				// Update server selection on the server
				await updateSelectedServers(selectedServers);
			}
		} catch (error) {
			console.error("Error fetching servers:", error);
		}
	});

	async function updateSelectedServers(servers: string[]) {
		try {
			await fetch(`/api/servers`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(servers),
			});
		} catch (error) {
			console.error("Error updating selected servers:", error);
		}
	}

	async function toggleServer(server: string) {
		if (selectedServers.includes(server)) {
			// Remove if already selected
			selectedServers = selectedServers.filter((s) => s !== server);
		} else {
			// Add if not selected
			selectedServers = [...selectedServers, server];
		}

		// Update server selection on the server
		await updateSelectedServers(selectedServers);
	}

	async function toggleAllServers() {
		if (selectedServers.length === servers.length) {
			// Deselect all if all are selected
			selectedServers = [];
		} else {
			// Select all
			selectedServers = [...servers];
		}

		// Update server selection on the server
		await updateSelectedServers(selectedServers);
	}
</script>

<div class="layout">
	<aside class="layout__aside">
		<div class="logo">
			<h1>AI Database Assistant</h1>
		</div>

		<a
			class="nav-item"
			class:active={activeTab === "chat"}
			href="#chat"
			on:click|preventDefault={() => setActiveTab("chat")}
		>
			<span class="nav-icon">💬</span>
			<span class="nav-label">Chat</span>
		</a>

		<a
			class="nav-item"
			class:active={activeTab === "tools"}
			href="#tools"
			on:click|preventDefault={() => setActiveTab("tools")}
		>
			<span class="nav-icon">🔧</span>
			<span class="nav-label">Available Tools</span>
		</a>

		<a
			class="nav-item"
			class:active={activeTab === "servers"}
			href="#servers"
			on:click|preventDefault={() => setActiveTab("servers")}
		>
			<span class="nav-icon">⚙️</span>
			<span class="nav-label">Server Management</span>
		</a>

		{#if servers.length > 0 && activeTab === "chat"}
			<div class="selection-container">
				<div class="section-header">
					<h3>Servers</h3>
					<button class="toggle-all-btn" on:click={toggleAllServers}>
						{selectedServers.length === servers.length
							? "Deselect All"
							: "Select All"}
					</button>
				</div>

				{#each servers as server}
					<label class="server-checkbox">
						<input
							type="checkbox"
							checked={selectedServers.includes(server)}
							on:change={() => toggleServer(server)}
						/>
						<span class="server-name">{server}</span>
					</label>
				{/each}
			</div>
		{/if}
	</aside>

	<main class="layout__main">
		{#if activeTab === "chat"}
			<ChatUI {selectedServers} {selectedModel} />
		{:else if activeTab === "tools"}
			<ToolsDisplay {servers} />
		{:else if activeTab === "servers"}
			<ServerManagement />
		{/if}
	</main>
</div>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		background-color: #f9f9f9;
		color: #333;
		height: 100vh;
		overflow: hidden;
		box-sizing: border-box;
	}

	:global(*, *:before, *:after) {
		box-sizing: inherit;
	}

	:global(#app) {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.layout {
		display: flex;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		position: relative;

		&__aside {
			width: 250px;
			background: #f5f5f5;
			border-right: 1px solid #e0e0e0;
			padding: 1rem;
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			position: sticky;
			top: 0;
			height: 100vh;
			flex-shrink: 0;
		}

		&__main {
			flex: 1;
			overflow: auto;
			display: flex;
			flex-direction: column;
			max-width: calc(100vw - 250px);
		}
	}

	.logo {
		margin-bottom: 2rem;

		h1 {
			font-size: 1.5rem;
			margin: 0;
			padding: 0;
		}
	}

	.nav-item {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		margin-bottom: 0.5rem;
		border-radius: 8px;
		text-decoration: none;
		color: #333;
		font-weight: 500;

		&:hover {
			background: #e0e0e0;
		}

		&.active {
			background: #4a86e8;
			color: white;
		}
	}

	.nav-icon {
		margin-right: 0.75rem;
		font-size: 1.2rem;
	}

	.selection-container {
		margin-top: 2rem;
		border-top: 1px solid #e0e0e0;
		padding-top: 1rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.toggle-all-btn {
		background: none;
		border: none;
		font-size: 0.8rem;
		color: #4a86e8;
		cursor: pointer;
		padding: 0;
	}

	.server-checkbox {
		display: flex;
		align-items: center;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		cursor: pointer;

		input {
			margin-right: 0.5rem;
		}
	}

	.server-name {
		font-size: 0.9rem;
	}

	h3 {
		font-size: 0.9rem;
		margin: 1rem 0 0.5rem 0;
		color: #555;
	}
</style>
