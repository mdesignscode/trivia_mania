<script lang="ts">
	import { colorMap } from 'utils';
	let { data } = $props();
</script>

<svelte:head>
	<title>Scoreboard</title>
	<meta name="description" content="View the stats of the top 10 players | Leaderboard" />
</svelte:head>

<div class="overflow-y-auto p-4" data-testid="scoreboard-container">
	<h1 class="mb-4 text-xl font-semibold">Top 10 Scoreboard</h1>
	{#if data.topTen.length > 0}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.topTen as { userStats, user, categoryStats }, index}
				<div
					class="col max-h-72 gap-3 overflow-y-auto rounded-lg border border-dark bg-gray-200 p-4 shadow-xl dark:border-transparent dark:bg-accent-200"
					data-testid={`user-${index}-stat`}
				>
					<div class="flex items-center">
						<div class="mr-4">
							<img
								src={user.avatar}
								alt={`Avatar for ${user.username}`}
								width={50}
								height={50}
								class="rounded-full"
							/>
						</div>
						<div>
							<p class="text-lg font-semibold md:text-base">
								{index + 1}. {user.username}
							</p>
							<p class="text-gray-500 md:text-sm">
								Total Correct Answers: {userStats.totalCorrect}
							</p>
						</div>
					</div>
					<div class="flex flex-col gap-2">
						{#each categoryStats as categoryStat}
							<div class="col">
								<h3 class="font-semibold text-gray-700 dark:text-gray-600">
									{categoryStat.category} correct answers
								</h3>

								<div class="ml-4 flex gap-1" style={`color: ${colorMap['easy']}`}>
									<h4>Easy:</h4>
									<p>{categoryStat['totalEasyCorrect']}</p>
								</div>
								<div class="ml-4 flex gap-1" style={`color: ${colorMap['medium']}`}>
									<h4>Medium:</h4>
									<p>{categoryStat['totalMediumCorrect']}</p>
								</div>
								<div class="ml-4 flex gap-1" style={`color: ${colorMap['hard']}`}>
									<h4>Hard:</h4>
									<p>{categoryStat['totalHardCorrect']}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<h1 class="text-2xl">There are currently no top ten players</h1>
	{/if}
</div>
