<script lang="ts">
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<body>
	<nav class="nav">
		<div class="brand">BRAND</div>
		<a href="/login"><button>登入</button></a>
	</nav>

	<main>
		<div class="container">
			<h1>Home</h1>
			<p>Welcome home!</p>
		</div>
	</main>
</body>

<style>
	nav {
		display: flex;
		justify-content: space-between;
	}
</style>
