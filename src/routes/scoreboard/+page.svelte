<script lang="ts">
	import { globalStore } from 'store';
	import { Icon, ChevronDown } from 'svelte-hero-icons';

	let { data } = $props();

	const count = (stat: object, key: string) => (stat as Record<string, number>)[key] ?? 0;
	const sum = (stats: object[], key: string) =>
		stats.reduce((total: number, stat) => total + count(stat, key), 0);

	const columns = [
		{ key: 'totalEasyCorrect', label: 'Easy', color: 'text-easy' },
		{ key: 'totalMediumCorrect', label: 'Medium', color: 'text-medium' },
		{ key: 'totalHardCorrect', label: 'Hard', color: 'text-hard' }
	];

	const grid = 'grid grid-cols-[2.5rem_1fr_3.5rem] items-center gap-3 sm:grid-cols-[3.5rem_1fr_repeat(3,4.5rem)_5.5rem]';
</script>

<svelte:head>
	<title>Scoreboard · Trivia Mania</title>
	<meta name="description" content="View the stats of the top 10 players | Leaderboard" />
</svelte:head>

<section class="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-10" data-testid="scoreboard-container">
	<div class="col mb-6 gap-1">
		<h1 class="text-3xl leading-none">Scoreboard</h1>
		<p class="text-muted">Top 10 players by correct answers. Open a row for the category breakdown.</p>
	</div>

	{#if data.topTen.length > 0}
		<div class={[grid, 'label border-b border-line px-4 pb-2']} aria-hidden="true">
			<span>Rank</span>
			<span>Player</span>
			{#each columns as column}
				<span class="hidden text-right sm:block">{column.label}</span>
			{/each}
			<span class="text-right">Correct</span>
		</div>

		<ol class="col gap-1.5 pt-2">
			{#each data.topTen as { userStats, user, categoryStats }, index}
				{@const you = globalStore.user?.username === user.username}
				<li data-testid={`user-${index}-stat`}>
					<details
						class={[
							'group rounded border transition-colors',
							you ? 'border-amber bg-amber/10' : 'border-line bg-panel hover:bg-raised'
						]}
					>
						<summary class={[grid, 'min-h-16 cursor-pointer list-none px-4 py-2']}>
							<span class={['digits text-2xl leading-none sm:text-3xl', index > 2 && !you && 'text-muted']}>
								{String(index + 1).padStart(2, '0')}
							</span>
							<span class="flex min-w-0 items-center gap-3">
								<img
									src={user.avatar}
									alt=""
									width="40"
									height="40"
									class="hidden size-10 shrink-0 rounded-full object-cover sm:block"
								/>
								<span class="truncate text-lg font-semibold">{user.username}</span>
								{#if you}
									<span class="label rounded bg-amber px-1.5 text-ink">You</span>
								{/if}
								<Icon
									src={ChevronDown}
									size="18"
									class="hidden shrink-0 text-muted transition-transform group-open:rotate-180 sm:block"
								/>
							</span>
							{#each columns as column}
								<span class={['hidden text-right font-display text-xl font-bold sm:block', column.color]}>
									{sum(categoryStats, column.key)}
								</span>
							{/each}
							<span class="digits text-right text-3xl leading-none">{userStats.totalCorrect}</span>
						</summary>

						<div class="border-t border-line px-4 py-3">
							<table class="w-full text-sm">
								<thead>
									<tr class="label text-left">
										<th class="py-1 font-semibold">Category</th>
										{#each columns as column}
											<th class="py-1 text-right font-semibold">{column.label}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each categoryStats as categoryStat}
										<tr class="border-t border-line/60">
											<td class="py-1.5">{categoryStat.category}</td>
											{#each columns as column}
												<td class={['py-1.5 text-right font-semibold', column.color]}>
													{count(categoryStat, column.key)}
												</td>
											{/each}
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</details>
				</li>
			{/each}
		</ol>
	{:else}
		<div class="panel col items-start gap-3 p-6">
			<h2 class="text-xl">The board is empty</h2>
			<p class="text-muted">Nobody has scored yet. Play a round to take first place.</p>
			<a href="/" class="link">Start playing</a>
		</div>
	{/if}
</section>
