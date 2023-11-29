<script lang="ts">
    import Center from "$lib/Center.svelte";
    import { goto } from "$app/navigation";
    export let input = { username: "", password: "" };

    const handleRegister = () => {
        goto("/");
    };
</script>

<Center>
    <br />
    <h1>登入</h1>
    <form method="POST">
        <input
            type="text"
            name="username"
            autocomplete="username"
            required
            placeholder="使用者名稱"
            bind:value={input.username}
        /><br />
        <input
            type="password"
            name="password"
            autocomplete="current-password"
            required
            placeholder="密碼"
            bind:value={input.password}
        />
        <br />
        <button class="button" style="width: 100%" on:click={handleRegister}
            >登入</button
        >
    </form>
</Center>
