<script lang="ts">
	import { onMount } from "svelte";
	import MarkdownIt from "markdown-it";
	import hljs from "highlight.js";

	// Define message types
	type Role = "assistant" | "tool" | "user";

	type Message = {
		role: Role;
		content: string;
	};

	// Initialize markdown parser with syntax highlighting
	const md = new MarkdownIt({
		html: false,
		linkify: true,
		typographer: true,
		highlight: function (str: string, lang: string) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return hljs.highlight(str, { language: lang }).value;
				} catch (_) {}
			}
			return ""; // use external default escaping
		},
	});

	// Props
	export let selectedServers: string[] = [];
	export let selectedModel: string = "";

	// Chat state
	let messages: Message[] = [];
	let userInput = "";
	let isLoading = false;
	let availableTools: any[] = [];
	let models: string[] = [];

	// Reference to the messages container
	let messagesContainer: HTMLElement;

	onMount(async () => {
		try {
			// Reset chat session on page load
			await fetch(`/api/chat`, { method: "DELETE" });

			// Fetch available tools
			const toolsRes = await fetch(`/api/tools`);
			if (toolsRes.ok) {
				availableTools = await toolsRes.json();
			}

			// Fetch available models
			const modelsRes = await fetch(`/api/models`);
			if (modelsRes.ok) {
				models = await modelsRes.json();
				if (models.length > 0 && !selectedModel) {
					selectedModel = models[0];
				}
			}
		} catch (error) {
			console.error("Error initializing chat:", error);
		}
	});

	// Function to render markdown content
	function renderMarkdown(content: string) {
		return md.render(content);
	}

	async function sendMessage() {
		if (!userInput.trim() || isLoading || selectedServers.length === 0) return;

		// Add user message to the chat
		messages = [...messages, { role: "user", content: userInput }];
		const currentInput = userInput;
		userInput = "";
		isLoading = true;

		try {
			const response = await fetch(`/api/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: currentInput,
					model: selectedModel,
				}),
			});

			if (response.ok) {
				// Handle streamed response
				const reader = response.body?.getReader();
				if (!reader) {
					throw new Error("Response body is not readable");
				}

				let buffer = "";
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					// Convert the Uint8Array to a string
					const chunk = new TextDecoder().decode(value);
					buffer += chunk;

					// Try to extract complete JSON objects from the buffer
					try {
						const jsonObj = JSON.parse(buffer) as Message;

						// Check if this is an assistant message and if the previous message was also from assistant
						if (
							jsonObj.role === "assistant" &&
							messages.length > 0 &&
							messages[messages.length - 1].role === "assistant"
						) {
							// Accumulate content from assistant messages
							const lastMessage = messages[messages.length - 1];
							lastMessage.content += jsonObj.content;
							// Update messages array to trigger reactivity
							messages = [...messages.slice(0, -1), lastMessage];
						} else {
							// Add as a new message (for tool messages or first assistant message)
							messages = [...messages, jsonObj];
						}

						// Clear the buffer after successfully parsing
						buffer = "";
					} catch (e) {
						// JSON is incomplete, continue reading
					}
				}
			} else {
				// Handle error
				messages = [
					...messages,
					{
						role: "assistant",
						content: "Sorry, there was an error processing your request.",
					},
				];
			}
		} catch (error) {
			console.error("Error sending message:", error);
			messages = [
				...messages,
				{
					role: "assistant",
					content: "Sorry, there was an error connecting to the server.",
				},
			];
		} finally {
			isLoading = false;
		}
	}

	// Watch for changes to messages and scroll
	$: if (messages) {
		// Use setTimeout to ensure DOM is updated before scrolling
		setTimeout(() => {
			scrollToBottom(messagesContainer);
		}, 100);
	}

	const scrollToBottom = async (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: "smooth" });
	};
</script>

<div class="chat-container">
	<div class="messages-container" bind:this={messagesContainer}>
		{#if messages.length === 0}
			<div class="empty-state">
				{#if selectedServers.length === 0}
					<p>Please select at least one server to start chatting</p>
				{:else}
					<p>Start a conversation with the AI</p>
				{/if}
			</div>
		{:else}
			{#each messages as message}
				<div class="message {message.role}">
					{#if message.role === "tool"}
						<div class="tool-label">Tool Output</div>
						<div class="message-content tool-content">
							{message.content}
						</div>
					{:else if message.role === "user"}
						<div class="message-content">
							{message.content}
						</div>
					{:else}
						<div class="message-content markdown-content">
							{@html renderMarkdown(message.content)}
						</div>
					{/if}
				</div>
			{/each}
		{/if}

		{#if isLoading}
			<div class="message assistant loading">
				<div class="loading-indicator">
					<span>●</span><span>●</span><span>●</span>
				</div>
			</div>
		{/if}
	</div>

	<div class="input-container">
		<textarea
			bind:value={userInput}
			placeholder={selectedServers.length === 0
				? "Select at least one server to chat"
				: "Type your message here..."}
			disabled={selectedServers.length === 0}
			on:keydown={(e) =>
				e.key === "Enter" && !e.shiftKey && (sendMessage(), e.preventDefault())}
		></textarea>

		<div class="controls">
			<div class="model-selector">
				<label for="model-select">Model</label>
				<div class="select-wrapper">
					<select
						id="model-select"
						bind:value={selectedModel}
						disabled={isLoading}
					>
						{#each models as model}
							<option value={model}>{model}</option>
						{/each}
					</select>
				</div>
			</div>

			<button
				on:click={sendMessage}
				disabled={isLoading ||
					!userInput.trim() ||
					selectedServers.length === 0}
			>
				Send
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;

		.messages-container {
			flex: 1;
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			width: 100%;
			overflow-y: auto;
			height: calc(100% - 140px);

			.message {
				max-width: 80%;
				padding: 0.75rem 1rem;
				border-radius: 1rem;
				margin-bottom: 0.5rem;
				word-wrap: break-word;

				&.user {
					align-self: flex-end;
					background: #4a86e8;
					color: white;
					border-bottom-right-radius: 0.25rem;
				}

				&.assistant {
					align-self: flex-start;
					background: #f0f0f0;
					border-bottom-left-radius: 0.25rem;
					color: #333;
				}

				&.tool {
					align-self: flex-start;
					background: #e8f5e9;
					border-bottom-left-radius: 0.25rem;
					font-family: monospace;
					white-space: pre-wrap;
					color: #333;
				}

				.message-content {
					max-width: 100%;
					word-wrap: break-word;
				}

				.tool-label {
					font-size: 0.8rem;
					font-weight: bold;
					margin-bottom: 0.25rem;
					color: #2e7d32;
				}
			}
		}
	}

	.input-container {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		border-top: 1px solid #e0e0e0;
		background: #fff;
		gap: 0.5rem;
		width: 100%;
		position: sticky;
		bottom: 0;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		resize: none;
		min-height: 60px;
		font-family: inherit;
		background-color: #f9f9f9;
		color: #333;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	textarea:focus {
		outline: none;
		border-color: #4a86e8;
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.05),
			0 0 0 3px rgba(74, 134, 232, 0.1);
	}

	.controls {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.model-selector {
		position: relative;
		width: 180px;
	}

	.model-selector label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		margin-bottom: 0.25rem;
		color: #555;
	}

	.select-wrapper {
		position: relative;
	}

	.select-wrapper::after {
		content: "";
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 5px solid #666;
		pointer-events: none;
	}

	select {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		font-size: 0.9rem;
		color: #333;
		cursor: pointer;
		appearance: none;
		padding-right: 30px;
		height: 38px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	select:focus {
		outline: none;
		border-color: #4a86e8;
		box-shadow:
			inset 0 1px 3px rgba(0, 0, 0, 0.05),
			0 0 0 3px rgba(74, 134, 232, 0.1);
	}

	select:disabled {
		background-color: #f5f5f5;
		opacity: 0.7;
		cursor: not-allowed;
	}

	button {
		padding: 0.5rem 1.25rem;
		background: #4a86e8;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
		height: 38px;
		transition: background-color 0.2s;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	button:hover:not(:disabled) {
		background: #3a76d8;
	}

	button:active:not(:disabled) {
		background: #2a66c8;
		transform: translateY(1px);
	}

	button:disabled {
		background: #cccccc;
		cursor: not-allowed;
		box-shadow: none;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #888;
	}

	.loading-indicator {
		display: flex;
		gap: 4px;
	}

	.loading-indicator span {
		animation: blink 1.4s infinite both;
	}

	.loading-indicator span:nth-child(2) {
		animation-delay: 0.2s;
	}

	.loading-indicator span:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes blink {
		0% {
			opacity: 0.2;
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0.2;
		}
	}

	.markdown-content {
		:global(p) {
			margin: 0.5rem 0;
		}

		:global(h1),
		:global(h2),
		:global(h3),
		:global(h4),
		:global(h5),
		:global(h6) {
			margin-top: 1rem;
			margin-bottom: 0.5rem;
			line-height: 1.2;
		}

		:global(h1) {
			font-size: 1.5rem;
		}

		:global(h2) {
			font-size: 1.3rem;
		}

		:global(h3) {
			font-size: 1.1rem;
		}

		:global(a) {
			color: #4a86e8;
			text-decoration: none;
		}

		:global(a:hover) {
			text-decoration: underline;
		}

		:global(pre) {
			background: #f6f8fa;
			border-radius: 4px;
			padding: 0.5rem;
			overflow-x: auto;
			margin: 0.5rem 0;
		}

		:global(code) {
			font-family:
				ui-monospace,
				SFMono-Regular,
				SF Mono,
				Menlo,
				Consolas,
				Liberation Mono,
				monospace;
			font-size: 0.9em;
		}

		:global(:not(pre) > code) {
			background: #f6f8fa;
			padding: 0.1em 0.3em;
			border-radius: 3px;
		}

		:global(ul),
		:global(ol) {
			padding-left: 1.5rem;
			margin: 0.5rem 0;
		}

		:global(blockquote) {
			border-left: 3px solid #ddd;
			margin-left: 0;
			padding-left: 1rem;
			color: #666;
		}

		:global(th) {
			background: #f5f5f5;
		}
	}
</style>
