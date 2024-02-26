+++
title = "Documentation"
description = "A description"
+++

I highly suggest having [`jq`][jq] installed so you can do JSON queries on the responses.

## GET `/reviews`

```bash
curl -X GET "https://filmpolitiet.wyd.no/reviews"
```

### Pagination

```bash
curl -X GET "https://filmpolitiet.wyd.no/reviews?page=2"
```

### Specific type of reviews

```bash
curl -X GET "https://filmpolitiet.wyd.no/reviews?type=<type>"
```

Replace `<type>` with either:

- `movie`
- `tv`
- `game`

Example for only movies:

```bash
curl -X GET "https://filmpolitiet.wyd.no/reviews?type=movie"
```

### By rating

You can choose between rating 1 – 6.

```bash
curl -X GET "https://filmpolitiet.wyd.no/reviews?rating=6"
```

### By author

Replace `<authorId>` with the author/reviewer you want to query the reviews for.

```bash
curl -X GET "https://filmpolitiet.wyd.no/reviews?author=<authorId>"
```

NOTE: As of now you cannot query only authors to find their IDs.

### Combined query

Example for querying all movie reviews by Birger Vestmo where the rating is 5.

```bash
curl -X GET "https://filmpolitiet.wyd.no/reviews?type=movie&rating=5&author=1"
```

[jq]: https://jqlang.github.io/jq/
