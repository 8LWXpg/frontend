<script lang="ts">
	import { onMount } from "svelte";

	let cpuWarning = false;
	const url = "http://localhost/zabbix/api_jsonrpc.php";
	const headers = {
		"Content-Type": "application/json-rpc",
	};

	let settings = {
		cpu: 0,
		mem: 0,
		bw: 0,
		dly: 0,
	};

	let showModal = false;
	let tempSettings = { ...settings };

	function toggleModal() {
		tempSettings = { ...settings };
		console.log(settings);
		showModal = !showModal;
	}

	function onSave() {
		settings = { ...tempSettings };
		// getTrigger().then((res) => (cpuWarning = res));
		toggleModal();
	}

	onMount(() => {
		const interval = setInterval(async () => {
			cpuWarning = await getTrigger();
		}, 1000);
		return () => clearInterval(interval);
	});

	async function getToken(): Promise<string> {
		const data = {
			jsonrpc: "2.0",
			method: "user.login",
			params: {
				username: "Admin",
				password: "zabbix",
			},
			id: 1,
		};

		return new Promise((resolve, reject) => {
			fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(data),
			})
				.then((res) => res.json())
				.then((result) => {
					if (result.result) {
						resolve(result.result);
					} else {
						reject("No result found");
					}
				})
				.catch((err) => {
					console.error("Error:", err);
					reject(err);
				});
		});
	}

	async function getTrigger(): Promise<boolean> {
		const data = {
			jsonrpc: "2.0",
			method: "history.get",
			params: {
				output: "extend",
				history: 0,
				itemids: ["50093"],
				sortfield: "clock",
				sortorder: "DESC",
				limit: 1,
			},
			auth: `${await getToken()}`,
			id: 1,
		};

		const response = fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data),
		});
		const body = await response.then((res) => res.json());
		console.log(Number(body.result[0].value) > settings.cpu);
		return Number(body.result[0].value) > settings.cpu;
	}
</script>

<svelte:head></svelte:head>

<body>
	<nav>
		<div>View Problems</div>
		<button on:click={toggleModal}>settings</button>
	</nav>

	<!-- <h1>{cpuWarning}</h1> -->

	{#if cpuWarning}
		<p class="notification is-danger">
			Warning: CPU utilization is above {settings.cpu}%
		</p>
	{/if}

	{#if showModal}
		<div class="modal">
			<div class="center settings">
				<form id="settings">
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
							<button
								form="settings"
								style="width: 100%;"
								on:click={onSave}
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
