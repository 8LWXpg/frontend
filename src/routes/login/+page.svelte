<script lang="ts">
    import Center from "$lib/Center.svelte";
    import { goto } from "$app/navigation";

    const handleRegister = () => {
        goto("/");
    };
</script>

<Center>
    <br />
    <h1>登入</h1>
    <form method="POST" action="?/login">
        <input
            type="text"
            name="username"
            autocomplete="username"
            required
            placeholder="使用者名稱"
        /><br />
        <input
            type="password"
            name="password"
            autocomplete="current-password"
            required
            placeholder="密碼"
        /><br />
        <button class="button" style="width: 100%" on:click={handleRegister}
            >登入</button
        >
    </form>
</Center>
