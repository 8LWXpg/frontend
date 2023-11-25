<script>
    import { page } from "$app/stores";
</script>

<svelte:head></svelte:head>

<body>
    <nav>
        <div>COOL TITLE</div>
        {#if $page.route.id === "/login"}
            <a class="button" href="/">首頁</a>
        {:else}
            <a class="button" href="/login">登入</a>
        {/if}
    </nav>
    <slot />
</body>

<style>
    nav {
        display: flex;
        justify-content: space-between;
        border-bottom: 1pt solid var(--color-foreground);
        margin: 10pt 0 20pt;
    }
</style>
