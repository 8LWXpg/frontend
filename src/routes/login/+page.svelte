<script lang="ts">
    import LoginForm from "$lib/LoginForm.svelte";
    import Center from "$lib/Center.svelte";
</script>

<Center>
    <br />
    <h1>登入</h1>
    <form method="POST">
        <LoginForm />
        <br />
        <button class="button" style="width: 100%">登入</button>
    </form>
</Center>
