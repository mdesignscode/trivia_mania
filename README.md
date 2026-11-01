# Trivia Mania

A trivia quiz game. Pick categories and a difficulty, answer timed questions, and track your progress by category on your stats page and against other players on the scoreboard.

Built with SvelteKit, Tailwind CSS and Sequelize on SQLite. The questions come from [The Trivia API](https://the-trivia-api.com).

## Requirements

* [Bun](https://bun.sh)
* Node.js 20 or newer, to run the built server

## Setup

```bash
git clone https://github.com/mdesignscode/trivia_mania
cd trivia_mania
bun install
```

Create a `.env` file with the Gmail account that sends the sign-up verification codes:

```
EMAIL_ADDRESS=you@gmail.com
EMAIL_CODE=your-gmail-app-password
```

## Run

```bash
bun run dev
```

`bun run build` first syncs the database (`database.sqlite`): it creates the tables, loads the questions from `questionsCache.json` (or fetches them when the cache is missing) and adds sample players. Then it builds the app. Start the built server with `bun run start`.

## Test

```bash
bun run test        # run every test once
bun run test:watch  # rerun on changes
bun run check       # type check
```
