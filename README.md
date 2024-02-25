[![builds.sr.ht status](https://builds.sr.ht/~timharek/filmpolitiet-api/commits/.build.yml.svg)](https://builds.sr.ht/~timharek/filmpolitiet-api/commits/.build.yml?)

# [Filmpolitiet API](https://sr.ht/~timharek/filmpolitiet-api/)

API application made for [Filmpolitiet](https://p3.no/filmpolitiet/)'s reviews.

Live version [filmpolitiet.wyd.no](https://filmpolitiet.wyd.no).

The webapp is made using [Deno][deno], [Fresh][fresh] and SQLite. It's made to
be lightweight and fast.

## Getting started

### Prerequisites

1. [Deno][deno] installed
1. SQLite installed

### Usage

1. Copy the `.env.defaults`, `cp .env.defaults .env` and update the variables
   accordingly.
1. Create a database-file, eg. `data.db` and add the file-path in the `.env`.
1. Start the project with `deno task dev`.

## Deploy to production

Every new [semver][semver] tag results in a new release to production. Production
is running on a [Caddy][caddy]-server on a 1984 Hosting VPS.

## Contributing

Anyone can contribute to Filmpolitiet API. Please refer to the [contribution guidelines][contr]

Send patches to the [mailing list][mailing], report bugs on the [issue-tracker][issues].

[![Made with Fresh](https://fresh.deno.dev/fresh-badge-dark.svg)](https://fresh.deno.dev)

[deno]: https://deno.land
[fresh]: https://fresh.deno.dev
[contr]: https://git.sr.ht/~timharek/filmpolitiet-api/tree/main/item/CONTRIBUTING.md
[issues]: https://todo.sr.ht/~timharek/filmpolitiet-api
[mailing]: https://lists.sr.ht/~timharek/filmpolitiet-api-dev
[semver]: https://semver.org/
[caddy]: https://caddyserver.com/
