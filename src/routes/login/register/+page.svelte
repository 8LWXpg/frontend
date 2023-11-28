<script lang="ts">
    import Center from "$lib/Center.svelte";
    export let input = { username: "", email: "", password: "" };
</script>

<Center>
    <br />
    <h1>註冊</h1>
    <form method="POST" action="?/register">
        <input
            type="text"
            name="username"
            autocomplete="username"
            required
            placeholder="使用者名稱"
            bind:value={input.username}
        /><br />
        <input
            type="email"
            name="email"
            autocomplete="email"
            required
            placeholder="example@gmail.com"
            bind:value={input.email}
        />
        <br />
        <input
            type="password"
            name="password"
            autocomplete="new-password"
            required
            placeholder="密碼"
            bind:value={input.password}
        />
        <br />
        <a href="/login" class="button" style="width: 100%">註冊</a>
    </form>
</Center>
