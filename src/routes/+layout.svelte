<script>
    import { page } from "$app/stores";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    export let data;
</script>

<svelte:head></svelte:head>

<SvelteToast options={{ intro: { y: 0 } }} />

<body>
    <nav>
        <div>Network management system</div>
        {#if $page.route.id === "/login"}
            <a class="button" href="/login/register">註冊</a>
        {:else if data.loggedIn}
            <div>
                <form
                    id="logoutForm"
                    method="POST"
                    action="/?/logout"
                    style="margin: 0;"
                ></form>
            </div>
            <button class="button" form="logoutForm">登出</button>
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

    :root {
        --toastContainerTop: 8rem;
        --toastContainerRight: auto;
        --toastContainerBottom: auto;
        --toastContainerLeft: calc(50vw - 8rem);
    }
</style>
