# Changelog

## [v0.3.5] (unreleased)

### Changed

- Use [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) spec for changelog.
- Moved filters above search-input.
- Use Deno import-map for Deno's std.
- Update std version from `0.190.0` -> `0.192.0`.

### Added

- Review date to card.
- Author to card.
- Styling to code-block for preview.

### Fixed

- Feed-format parsing. Filmpolitiet updated their feeds.

## [v0.3.4] - 2023-06-25

### Fixed

- Bug for test in `scrape_rss_test`.

## [v0.3.3] - 2023-06-25

### Changed

- Auto-scraper now uses RSS.

## [v0.3.2] - 2023-06-22

### Added

- Sleep function for all fetch-requests in order to prevent time-outs.
- Tests.
- Auto-scraper endpoint, `/api/auto-scrape`.
- API-preview for the filters.

### Changed

- Sort reviewers by name in filter-listing.
- Upgraded to Deno Fresh v1.2
- Use PocketBase SDK from ESM instead of NPM.
- Refactored and split scraping into multiple functions.

### Removed

- `constants.ts`, moved stuff into `deno.json`.

### Fixed

- Fixed layout for filters on smaller screens.

## [v0.3.1] - 2023-06-16

### Added

- More smartness to scraping, no more specifying rating and type.

### Changed

- Sort reviewers by name.

## [v0.3.0] - 2023-06-16

### Added

- Header and footer.
- Authors/reviewers.
- Placeholder docs-page.
- `<Select>`-component.

### Changed

- Improved next and prev buttons.
- Filter now remembers what you've already filtered on.
- Page-buttons works with filters.
- Tidy up filter.

## [v0.2.1] - 2023-06-15

### Added

- Recursive scraping.
- Entry type to Card.

## [v0.2.0] - 2023-06-15

### Added

- Repsonsive grid.
- Search and simple filtering.

## [v0.1.4] - 2023-06-15

### Fixed

- Scraping for cover-art if missing.

## [v0.1.3] - 2023-06-15

### Added

- Front-end pages.
- Cover-art scraping.
- Cover-art to Card.
- Dice to cover-art.
