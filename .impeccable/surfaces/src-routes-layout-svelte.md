---
version: 1
slug: "src-routes-layout-svelte"
primary_target: "src/routes/+layout.svelte"
related_targets: []
---

# Trivia Mania app shell (all routes)

Mode: operate. Audience: recruiters and developers trying the game; it must also play well as a real game. Every route shares one shell.

## Direction contract

THESIS: A stadium scoreboard at night owns the app. Refuses the category default of pastel rounded quiz cards on grey.

OWN-WORLD: Deep navy ground (not neutral black), royal-blue rail, amber scoreboard digits for every number that counts (clock, score, ranks, totals). Difficulty = team colours: easy teal, medium amber, hard coral. Tall condensed display face for headings and numerals, plain sans for body. Square-ish 6px corners, 1px panel rules.

STORY: Pick difficulty, pick categories, start; answer against a shot clock; see your scoreline, then stats and the board.

FIRST VIEWPORT: Home: rail on top; a step header "1 Difficulty / 2 Categories"; difficulty as three team tiles; category chips with counts; a sticky play bar with the selection summary and PLAY. Play: category and difficulty kicker left, Q n/total right, shot clock centred large, question, 2x2 lettered answers, score strip below.

FORM: Grounded candidate 7 of 7 (arena scoreboard). seed:dbf1106e5811dd8c

SIGNATURE: the shot clock: segmented amber digits with a draining ring, turning coral under 5s. Raises: from the gate board, the player's own row on the leaderboard stays lit; from the timetable rack, rank carried by weight and case before size.
