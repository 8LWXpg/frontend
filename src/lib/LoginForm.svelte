<script lang="ts">
    export let input = { username: "", password: "" };
</script>

<input
    type="text"
    name="username"
    autocomplete="off"
    required
    placeholder="使用者名稱"
    bind:value={input.username}
/><br />
<input
    type="password"
    name="password"
    autocomplete="off"
    required
    placeholder="密碼"
    bind:value={input.password}
/>
