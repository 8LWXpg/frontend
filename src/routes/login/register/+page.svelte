<script lang="ts">
    import Center from "$lib/Center.svelte";
</script>

<Center>
    <br />
    <h1>註冊</h1>
    <form method="post" action="?/register">
        <input
            type="text"
            name="username"
            autocomplete="username"
            required
            placeholder="使用者名稱"
        /><br />
        <input
            type="email"
            name="email"
            autocomplete="email"
            required
            placeholder="example@gmail.com"
        /><br />
        <input
            type="password"
            name="password"
            autocomplete="new-password"
            required
            placeholder="密碼"
        />
        <br />
        <!-- <a href="/login"> -->
        <button class="button" style="width: 100%">註冊</button>
        <!-- </a> -->
    </form>
</Center>
