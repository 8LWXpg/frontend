<script lang="ts">
    import Center from "$lib/Center.svelte";
    import LoginForm from "$lib/LoginForm.svelte";
</script>

<Center>
    <h1>註冊</h1>
    <form method="POST">
        <LoginForm />
        <br />
        <button class="button" style="width: 100%">註冊</button>
    </form>
</Center>
