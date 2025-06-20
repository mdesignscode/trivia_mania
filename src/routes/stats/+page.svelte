<script lang="ts">
	import { colorMap } from 'utils';
	import { globalStore } from 'store';

	let { data } = $props();
	const ordinal = (n) => ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
	const difficultiesMap = {
		easy: 'Easy',
		medium: 'Medium',
		hard: 'Hard'
	};
</script>

<svelte:head>
	<title>My Stats</title>
	<meta name="description" content="User stats for various categories and difficulties answered" />
</svelte:head>

{#if data.userStats}
	<div
		class="col mx-auto w-11/12 gap-4 overflow-y-auto py-4 text-gray-800 dark:text-light"
		data-testid="display-user-progress-container"
	>
		<div class="flex items-center gap-5" data-testid="user-header-container">
			<img
				class="rounded-full"
				width={50}
				height={50}
				src={globalStore.user.avatar}
				alt="user avatar icon"
			/>

			<h1 class="text-lg">{globalStore.user.username}</h1>
		</div>

		<h2>This is your progress</h2>
		{#if data.topTenPosition > 0}
			<em class="text-accent-100">
				Congratulations you are {data.topTenPosition}{ordinal(data.topTenPosition)} in the Leader board
			</em>
		{/if}

		<h3>Total questions answered: {data.userStats.total}</h3>
		<h3>Total correct answers: {data.userStats.totalCorrect}</h3>

		<div class="col gap-3 md:flex-row">
			{#each ['easy', 'medium', 'hard'] as difficulty}
				{#if data.stats.some((stat) => stat[`total${difficultiesMap[difficulty]}`])}
					<div
						class="col gap-3 rounded-lg border-2 p-4 md:flex-1"
						style={`border-color: ${colorMap[difficulty]}`}
					>
						<strong style={`color: ${colorMap[difficulty]}`}>
							{difficultiesMap[difficulty]}
						</strong>

						{#each data.stats as stat}
							<div class="col gap-1">
								<p>{stat.category}</p>

								<div class="ml-auto w-[95%] text-base">
									<div class="flex justify-between">
										<p>Total answered</p>
										<p>{stat[`total${difficultiesMap[difficulty]}`]}</p>
									</div>
									<div class="flex justify-between">
										<p>Correct answered</p>
										<p>{stat[`total${difficultiesMap[difficulty]}Correct`]}</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	</div>
{:else}
	<div class="p-4">
		<h2 data-testid="no-stats-available">
			You have not answered any questions yet.{' '}
			<a class="text-gray-600 decoration-solid hover:text-gray-800 hover:underline" href="/">
				Click here to play
			</a>
			.
		</h2>
	</div>
{/if}
