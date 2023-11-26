<script lang="ts">
    import Center from "$lib/Center.svelte";
    import LoginForm from "$lib/LoginForm.svelte";
    export let input = { username: "", password: "" };
</script>

<Center>
    <br />
    <h1>註冊</h1>
    <form method="POST" action="?/register">
        <LoginForm bind:input />
        <br />
        <button class="button" style="width: 100%">註冊</button>
    </form>
</Center>
