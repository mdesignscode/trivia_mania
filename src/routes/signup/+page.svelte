<script lang="ts">
	let username = '';
	let password = '';
</script>

<form method="POST">
	<input class="bg-red-800" type="text" bind:value={username} name="username" placeholder="Username" required />
	<input type="password" bind:value={password} name="password" placeholder="Password" required />
	<button type="submit">Sign Up</button>
</form>

