# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Purpose

Trivia Mania is a timed trivia quiz game. A player picks a difficulty and one or more categories, answers timed multiple-choice questions, and tracks progress per category on a stats page and against other players on a scoreboard. Questions come from The Trivia API.

## Audience

Primarily a portfolio showcase: the people judging it are recruiters and other developers, who will try a round, sign up, and look at stats and the scoreboard. It must work and feel finished as a real game for anyone who plays it.

## Capabilities

- Difficulty and category selection (preferences remembered in localStorage)
- Timed questions with success and error sound effects
- Accounts: username, email, password; 6-digit email verification code (10-minute expiry, single use, 5 attempts); change email from the verification page
- Per-user stats by category, global scoreboard, account settings (avatar, username, email, password)

## Brand commitments

- Name: "Trivia Mania" (the only fixed brand asset)
- Dark theme is the default
- Answer sound effects (`static/success.mp3`, `static/error.mp3`) stay

## Stack

SvelteKit (Svelte 5 runes), Tailwind CSS 3, Sequelize on SQLite, Bun. Icons from svelte-hero-icons; disclosure/menus from svelte-headlessui.
