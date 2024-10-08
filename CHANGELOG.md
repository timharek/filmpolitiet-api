# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2024-09-15

### Bug Fixes

- Use proper Atom schema

### Features

- Add proper favicon

### Miscellaneous Tasks

- Simplify
- Cleaner way to check for new release tag

### Refactor

- Use JSR modules instead of /x

## [1.0.0] - 2024-04-25

### Bug Fixes

- Actually return newly created Review

### Features

- Add filter to authors
- Add initial upsert() to Author
- Add update() to Author
- Add Author model tests
- Add updated() to Review
- Add Review model tests

### Miscellaneous Tasks

- Update test step

### Refactor

- Allow no path for SQLite db

## [0.7.5] - 2024-04-25

### Miscellaneous Tasks

- Fix order

## [0.7.4] - 2024-04-25

### Bug Fixes

- Use correct feedUrl

### Miscellaneous Tasks

- Simplify changelog generation

## [0.7.2] - 2024-04-24

### Features

- Add favicon.ico route handler
- Add 404 page
- Add robots.txt

### Miscellaneous Tasks

- Remove boilerplate fresh stuff

### Refactor

- Add better NotFound error message

## [0.7.1] - 2024-04-24

### Bug Fixes

- Typos

### Documentation

- Update README

### Miscellaneous Tasks

- Mirror to GitHub
- Use alpine/edge
- Remove old console.log
- Remove install deno step
- Fix order for checking if new release
- Add automated changelog

### Styling

- Add emoji-flare to Card

## [0.7.0] - 2024-04-12

### Bug Fixes

- HTTP on localhost, HTTPS otherwise

### Features

- Add proper pagination
- Add RSS feed

### Miscellaneous Tasks

- Make fresh config available to `main.ts` and `dev.ts
- Add missing getters
- Add RSS feed to footer and `<head>`

## [0.6.4] - 2024-03-02

### Documentation

- Add CONTRIBUTING steps
- Update README

### Features

- Sort authors ASC
- Add counter to Reviewers
- Add Markdown docs

### Miscellaneous Tasks

- Update deprecated test imports
- Cliff skip release commits

### Performance

- Only resolve new reviews

### Refactor

- Simplify reviewers route
- Rename `getFilter()` -> `generateWhere()`
- Make into object
- Rename stuff `item` -> `review`

## [0.6.3] - 2024-02-24

### Bug Fixes

- Typo again, this time it works

## [0.6.2] - 2024-02-24

### Bug Fixes

- Typo again

## [0.6.1] - 2024-02-24

### Bug Fixes

- Typo

## [0.6.0] - 2024-02-24

### Features

- Better error messages
- Add ZodError handling
- Add pagination to JSON response
- Add sucessfulItem counter

### Miscellaneous Tasks

- Use import-map
- Less duplication of code

### Refactor

- "Entry" -> "Review"

### Styling

- Pluralize

## [0.5.5] - 2024-02-24

### Bug Fixes

- API preview included page=2 on pageNo 1

## [0.5.4] - 2024-02-24

### Bug Fixes

- Deprecation
- Replace `hidden` with `sr-only`

### Styling

- Add emoji-flare
- Add emoji-flare to Select

## [0.5.3] - 2024-02-24

### Features

- Add result count

### Styling

- Use 6 grid columns

## [0.5.2] - 2024-02-24

### Bug Fixes

- Use name
- Typos

### Performance

- Use smaller images

## [0.5.1] - 2024-02-24

### Bug Fixes

- Set default values

## [0.5.0] - 2024-02-24

### Bug Fixes

- Better check if it is movie or tv-show
- Add extra enum record
- Type errors

### Features

- Add initial SQLite model
- Add zod and zod-form-data
- Add upsert method
- Add SECRET env when scraping RSS
- Add "All" option

### Miscellaneous Tasks

- Remove PocketBase from scraping logic
- Use SQLite schema for reviewers/authors route
- Use SQLite schema for entries route
- Remove PocketBase
- Clean up deprecations
- Make filters work for entries route
- Make Where work with entry title
- Add fallbacks
- Make cURL preview work
- Attach issues to TODOs
- Clean up
- Attach issues to TODO
- Add pagination
- Update index route
- Add fallback for `getAuthor()`
- Add env for DB_PATH for SQLite
- Remove more PocketBase stuff
- Remove `filmpolitietId`
- Remove more PocketBase stuff
- Remove unused stuff
- Increment version
- Remove more PocketBase stuff
- Increment version

### Refactor

- Make Where type-safe
- Move API stuff to same endpoint
- Move routes to a more logically location
- Use `type` instead of `interface`

### Testing

- Update

## [0.4.3] - 2023-11-01

### Bug Fixes

- Use content-type for JSON response

## [0.4.2] - 2023-10-08

### Bug Fixes

- Cd into correct dir

## [0.4.1] - 2023-10-08

### Bug Fixes

- Formatting

## [0.4.0] - 2023-10-08

### Bug Fixes

- A11y stuff
- A11y invisible text on dark-mode

### Features

- Add dark-mode
- Simplify footer
- Add git-cliff

### Miscellaneous Tasks

- Change deploy server

### Styling

- Add colors and adjust styling in general
- Add disc to list items
- Add rounded to filter-box

## [0.3.5] - 2023-07-02

### Bug Fixes

- Feed-format

### Features

- Add reviewDate and author

### Miscellaneous Tasks

- Bump dev version
- Change changelog-format
- Update layout
- Use import map for std
- Update std 0.190.0 -> 0.192.0
- Version bump

## [0.3.4] - 2023-06-25

### Bug Fixes

- Update function name

### Miscellaneous Tasks

- Bump dev version

## [0.3.3] - 2023-06-25

### Features

- Auto-scrape with RSS

### Miscellaneous Tasks

- Dev version bump

## [0.3.2] - 2023-06-22

### Bug Fixes

- Sort reviewers
- Add wrap to flex-items

### Features

- Add auto-scraper endpoint
- Add API-preview for the filter

### Miscellaneous Tasks

- Update README
- Upgrade Deno Fresh
- Use PocketBase SDK from ESM instead of NPM
- Add sleep-function to prevent time-outs
- Add test runner
- Move stuff from constants into deno.json
- Version bump

### Refactor

- Split into multiple functions and add tests

## [0.3.1] - 2023-06-16

### Features

- Add rating and type checking

### Miscellaneous Tasks

- Add build badge
- Sort reviewers by name
- Version bump

## [0.3.0] - 2023-06-16

### Features

- Add Header and Footer
- Remember filter after page refresh
- Make page-buttons work with filters
- Add authors/reviewers
- Add docs-placeholder
- Add Select component

### Miscellaneous Tasks

- Add license
- Improve next and prev buttons
- Tidy filter
- Rename pages
- Add first empty
- Update text on index

## [0.2.1] - 2023-06-15

### Features

- Add recursive scraping
- Add entry type to Card

## [0.2.0] - 2023-06-15

### Features

- Add responsive grid
- Add search and simple filtering

### Miscellaneous Tasks

- Version bump

## [0.1.4] - 2023-06-15

### Bug Fixes

- If cover-art is missing

## [0.1.3] - 2023-06-15

### Features

- Add pages
- Add Card component
- Add cover-art scraping
- Add cover-art to Card
- Add dice to cover-art

### Miscellaneous Tasks

- Version bump

## [0.1.2] - 2023-06-15

### Bug Fixes

- Add support for more envs

## [0.1.0] - 2023-06-15

### Bug Fixes

- Ignore correct path
- Formatting

### Documentation

- Update README

### Features

- Upgrade twind to v1
- Add git-hooks
- Add script for downloading latest PocketBase
- Install PocketBase SDK and add middleware
- Add login and logout routes
- Add changelog
- Add initial scraping
- Add author
- Add api endpoint for getting all entires with filters++
- Add CI steps

### Miscellaneous Tasks

- Add start task and linting and formatting
- Add scripts for serving and upgrading PocketBase binary
- Add dotenv defaults
- Run pb and app in paralell
- Remove unused routes
- Remove unused stuff
- Update README

<!-- generated by git-cliff -->
