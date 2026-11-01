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

`bun run build` first syncs the database (`database.sqlite`): it creates missing tables and columns, loads the questions from `questionsCache.json` (or fetches them when the cache is missing) and adds sample players. Then it builds the app. Start the built server with `bun run start`.

## Accounts

New players sign up with a username, email and password, then confirm their email with a 6-digit code. A code expires after 10 minutes, works once, and stops working after 5 wrong guesses. A player can request a new code or change their email from the same page; changing it sends a code to the new address.

## Deploy on Render

Create a Web Service from this repository with:

* **Build command:** `bun install && bun run build`
* **Start command:** `bun run start`
* **Environment variables:** `EMAIL_ADDRESS` and `EMAIL_CODE`, as in `.env`

The database is a file in the project folder (see `src/utils/sequelize.ts`), and Render's file system is wiped on every deploy and restart. Accounts and stats only survive if you attach a Render disk and point the database's `storage` path at it.

## Test

```bash
bun run test        # run every test once
bun run test:watch  # rerun on changes
bun run check       # type check
```
