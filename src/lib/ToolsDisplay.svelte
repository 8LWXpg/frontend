<script lang="ts">
	import { onMount } from "svelte";

	// Props
	export let servers: string[] = [];

	// Types for API response
	interface ToolParameter {
		description?: string;
		type?: string;
	}

	interface ToolFunction {
		name: string;
		description: string;
		parameters: {
			type: string;
			required: string[] | null;
			properties: Record<string, ToolParameter>;
		};
	}

	interface Tool {
		type: string;
		function: ToolFunction;
	}

	// State
	let tools: Tool[] = [];
	let isLoading = false;
	let error = "";
	let expandedServers: Record<string, boolean> = {};

	// Tools organized by server
	let serverTools: Record<string, Tool[]> = {};

	onMount(async () => {
		await fetchTools();
	});

	async function fetchTools() {
		try {
			isLoading = true;
			const response = await fetch(`/api/tools`);
			if (response.ok) {
				tools = await response.json();
				organizeToolsByServer();
			} else {
				error = "Failed to fetch tools";
			}
		} catch (err) {
			error = "Error connecting to server";
			console.error(err);
		} finally {
			isLoading = false;
		}
	}

	function organizeToolsByServer() {
		// Clear existing data
		serverTools = {};

		// First, initialize all servers from the prop with empty arrays
		for (const server of servers) {
			serverTools[server] = [];
			expandedServers[server] = true; // Start expanded
		}

		// Then organize tools by server
		for (const tool of tools) {
			if (tool.type === "function" && tool.function && tool.function.name) {
				const parts = tool.function.name.split("/");
				if (parts.length >= 2) {
					const serverName = parts[0];
					// If this server exists in our list
					if (serverTools[serverName]) {
						serverTools[serverName].push(tool);
					}
				}
			}
		}
	}

	function toggleServer(server: string) {
		expandedServers[server] = !expandedServers[server];
	}
</script>

<div class="tools-container">
	<h2>Available Tools</h2>

	{#if error}
		<div class="error-message">{error}</div>
	{/if}

	{#if isLoading}
		<div class="loading">Loading tools...</div>
	{:else if Object.keys(serverTools).length === 0}
		<p>No tools available.</p>
	{:else}
		<div class="server-tools-list">
			{#each Object.entries(serverTools) as [server, serverToolsList]}
				{#if serverToolsList.length > 0}
					<div class="server-section">
						<div class="server-header" on:click={() => toggleServer(server)}>
							<h3>{server}</h3>
							<span class="expand-icon"
								>{expandedServers[server] ? "▼" : "►"}</span
							>
						</div>

						{#if expandedServers[server]}
							<div class="tools-list">
								{#each serverToolsList as tool}
									<div class="tool-item">
										<div class="tool-name">
											{tool.function.name.split("/").slice(1).join("/")}
										</div>
										<div class="tool-description">
											{tool.function.description}
										</div>

										{#if tool.function.parameters && tool.function.parameters.properties && Object.keys(tool.function.parameters.properties).length > 0}
											<div class="tool-parameters">
												<h4>Parameters:</h4>
												<ul>
													{#each Object.entries(tool.function.parameters.properties) as [paramName, paramDetails]}
														<li>
															<strong>{paramName}</strong>
															{#if paramDetails.description}
																<span>: {paramDetails.description}</span>
															{/if}
														</li>
													{/each}
												</ul>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.tools-container {
		padding: 1rem;
		height: 100%;
		overflow-y: auto;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: #333;
	}

	.error-message {
		background: #ffebee;
		color: #c62828;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.loading {
		color: #666;
		font-style: italic;
	}

	.server-section {
		margin-bottom: 1.5rem;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		overflow: hidden;
	}

	.server-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: #f5f5f5;
		cursor: pointer;
		user-select: none;
	}

	.server-header h3 {
		margin: 0;
		font-size: 1.1rem;
		color: #333;
	}

	.expand-icon {
		font-size: 0.8rem;
		color: #666;
	}

	.tools-list {
		padding: 0.5rem 1rem;
	}

	.tool-item {
		padding: 1rem;
		border-bottom: 1px solid #eee;
	}

	.tool-item:last-child {
		border-bottom: none;
	}

	.tool-name {
		font-weight: bold;
		font-size: 1rem;
		color: #4a86e8;
		margin-bottom: 0.5rem;
	}

	.tool-description {
		white-space: pre-wrap;
		color: #555;
		margin-bottom: 0.75rem;
		font-size: 0.9rem;
	}

	.tool-parameters h4 {
		margin: 0.5rem 0;
		font-size: 0.9rem;
		color: #666;
	}

	.tool-parameters ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.tool-parameters li {
		font-size: 0.85rem;
		margin-bottom: 0.25rem;
	}
</style>
