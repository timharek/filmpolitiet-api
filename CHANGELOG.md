# Changelog

## v0.3.3 (unreleased)

## v0.3.2

- Sort reviewers by name in filter-listing.
- Fixed layout for filters on smaller screens.
- Upgraded to Deno Fresh v1.2
- Use PocketBase SDK from ESM instead of NPM.
- Added sleep function for all fetch-requests in order to prevent time-outs.
- Added tests.
- Refactored and split scraping into multiple functions.
- Removed need for `constants.ts`, moved stuff into `deno.json`.
- Added auto-scraper endpoint, `/api/auto-scrape`.
- Added a API-preview for the filter.

## v0.3.1

- Sort reviewers by name.
- Added more smartness to scraping, no more specifying rating and type.

## v0.3.0

- Added header and footer.
- Improved next and prev buttons.
- Filter now remembers what you've already filtered on.
- Page-buttons works with filters.
- Tidy up filter.
- Added authors/reviewers.
- Added placeholder docs-page.
- Added Select component.

## v0.2.1

- Added recursive scraping.
- Added entry type to Card.

## v0.2.0

- Added repsonsive grid.
- Added search and simple filtering.

## v0.1.4

- Fixed scraping for cover-art if missing.

## v0.1.3

- Added front-end pages.
- Added cover-art scraping.
- Added cover-art to Card.
- Added dice to cover-art.
