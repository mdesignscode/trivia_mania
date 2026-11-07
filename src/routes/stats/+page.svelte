<script lang="ts">
	import { globalStore } from 'store';

	let { data } = $props();
	const ordinal = (n: number) => ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';

	const difficulties = [
		{ key: 'Easy', color: 'text-easy', bar: 'bg-easy' },
		{ key: 'Medium', color: 'text-medium', bar: 'bg-medium' },
		{ key: 'Hard', color: 'text-hard', bar: 'bg-hard' }
	];

	const count = (stat: object, key: string) => (stat as Record<string, number>)[key] ?? 0;
	const pct = (correct: number, total: number) => (total ? Math.round((correct / total) * 100) : 0);
</script>

<svelte:head>
	<title>Your stats · Trivia Mania</title>
	<meta name="description" content="User stats for various categories and difficulties answered" />
</svelte:head>

{#if data.userStats}
	<section
		class="mx-auto col max-w-5xl gap-8 px-4 py-8 md:px-8 md:py-10"
		data-testid="display-user-progress-container"
	>
		<div class="flex items-center gap-4" data-testid="user-header-container">
			<img
				class="size-14 rounded-full object-cover ring-2 ring-line"
				src={globalStore.user?.avatar}
				alt=""
			/>
			<div class="col gap-0.5">
				<h1 class="text-3xl leading-none">{globalStore.user?.username}</h1>
				{#if data.topTenPosition > 0}
					<p class="font-medium text-amber">
						{data.topTenPosition}{ordinal(data.topTenPosition)} on the scoreboard
					</p>
				{:else}
					<p class="text-muted">Not in the top 10 yet</p>
				{/if}
			</div>
		</div>

		<dl class="grid grid-cols-3 divide-x divide-line rounded border border-line bg-panel">
			<div class="col gap-1 p-4 md:p-5">
				<dt class="label">Answered</dt>
				<dd class="digits text-3xl leading-none text-chalk md:text-4xl">{data.userStats.total}</dd>
			</div>
			<div class="col gap-1 p-4 md:p-5">
				<dt class="label">Correct</dt>
				<dd class="digits text-3xl leading-none md:text-4xl">{data.userStats.totalCorrect}</dd>
			</div>
			<div class="col gap-1 p-4 md:p-5">
				<dt class="label">Accuracy</dt>
				<dd class="digits text-3xl leading-none text-chalk md:text-4xl">
					{pct(data.userStats.totalCorrect, data.userStats.total)}<span class="text-xl text-muted">%</span>
				</dd>
			</div>
		</dl>

		<div class="col gap-3">
			<h2 class="text-xl">By category</h2>
			<div class="overflow-x-auto rounded border border-line">
				<table class="w-full min-w-[34rem] text-left">
					<thead class="bg-panel">
						<tr class="label">
							<th class="px-4 py-3 font-semibold">Category</th>
							{#each difficulties as d}
								<th class={['px-4 py-3 text-right font-semibold', d.color]}>{d.key}</th>
							{/each}
							<th class="px-4 py-3 text-right font-semibold">Total</th>
						</tr>
					</thead>
					<tbody>
						{#each data.stats as stat}
							<tr class="border-t border-line">
								<th scope="row" class="px-4 py-3 font-medium">{stat.category}</th>
								{#each difficulties as d}
									{@const total = count(stat, `total${d.key}`)}
									{@const correct = count(stat, `total${d.key}Correct`)}
									<td class="px-4 py-3 text-right">
										{#if total}
											<span class="font-semibold">{correct}</span><span class="text-muted">/{total}</span>
											<span class="ml-auto mt-1 block h-1 w-16 overflow-hidden rounded-full bg-line">
												<span class={['block h-full', d.bar]} style={`width: ${pct(correct, total)}%`}></span>
											</span>
										{:else}
											<span class="text-muted/60">–</span>
										{/if}
									</td>
								{/each}
								<td class="px-4 py-3 text-right">
									<span class="digits text-xl">{stat.totalCorrect}</span><span class="text-muted">/{stat.total}</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>
{:else}
	<section class="mx-auto flex min-h-full max-w-xl flex-col justify-center gap-4 px-4 py-10">
		<h1 class="text-3xl leading-none">No stats yet</h1>
		<p data-testid="no-stats-available" class="text-muted">
			You have not answered any questions yet. Your stats show up here after your first set.
		</p>
		<a class="link self-start" href="/">Play your first set</a>
	</section>
{/if}
