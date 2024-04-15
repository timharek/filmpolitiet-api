# Contribution Guidelines

This document contains guidelines for contributing code to aerc. It has to be
followed in order for your patch to be approved and applied.

## Contribution Channels

Anyone can contribute to filmpolitiet-api. First you need to clone the repository and build
the project:

```bash
git clone https://git.sr.ht/~timharek/filmpolitiet-api
cd filmpolitiet-api
deno task setup:srht
deno task setup:hooks
```

Patch the code. Write some tests. Ensure that your code is properly formatted
with `deno fmt`. Ensure that everything builds and works as expected. Ensure
that you did not break anything.

- If applicable, update unit tests.
- If adding a new feature, please consider adding new tests.
- Do not forget to update the docs.
- If your commit brings visible changes for end-users, add an entry in the
  _Unreleased_ section of the
  [CHANGELOG.md](https://git.sr.ht/~timharek/filmpolitiet-api/tree/main/item/CHANGELOG.md)
  file.
- Run the linter using `deno lint`.
- Run the type-checker using `deno task check`.

Once you are happy with your work, you can create a commit (or several
commits). Follow these general rules:

- Limit the first line (title) of the commit message to 60 characters.
- Use a short prefix for the commit title for readability with `git log --oneline`.
- Use the body of the commit message to actually explain what your patch does
  and why it is useful. Even if your patch is a one line fix, the description
  is not limited in length and may span over multiple paragraphs. Use proper
  English syntax, grammar and punctuation.
- Address only one issue/topic per commit.
- Describe your changes in imperative mood, e.g. _"make xyzzy do frotz"_
  instead of _"[This patch] makes xyzzy do frotz"_ or _"[I] changed xyzzy to do
  frotz"_, as if you are giving orders to the codebase to change its behaviour.
- If you are fixing a ticket, use appropriate
  [commit trailers](https://man.sr.ht/git.sr.ht/#referencing-tickets-in-git-commit-messages).
- If you are fixing a regression introduced by another commit, add a `Fixes:`
  trailer with the commit id and its title.
- When in doubt, follow the format and layout of the recent existing commits.

There is a great reference for commit messages in the
[Linux kernel documentation](https://www.kernel.org/doc/html/latest/process/submitting-patches.html#describe-your-changes).

Before sending the patch, you should configure your local clone with sane
defaults using `deno task setup:srht`:

And send the patch to the mailing list (or submit a PR on GitHub) ([step-by-step
instructions][git-send-email-tutorial]):

```bash
git send-email --annotate -1
```

Before your patch can be applied, it needs to be reviewed and approved by
others. They will indicate their approval by replying to your patch with
a [Tested-by, Reviewed-by or Acked-by][linux-review] (see also: [the git
wiki][git-trailers]) trailer. For example:

You can follow the review process via email and on the [web ui][web-ui].

Wait for feedback. Address comments and amend changes to your original commit.
Then you should send a v2 (and maybe a v3, v4, etc.):

```bash
git send-email --annotate v2 -1
```

Be polite, patient and address _all_ of the reviewers' remarks. If you disagree
with something, feel free to discuss it.

Once your patch has been reviewed and approved (and if the maintainer is OK
with it), it will be applied and pushed.

IMPORTANT: Do NOT use `--in-reply-to` when sending followup versions of a patch
set. It causes multiple versions of the same patch to be merged under v1 in the
[web ui][web-ui]

[web-ui]: https://lists.sr.ht/~timharek/filmpolitiet-api-dev/patches
[git-send-email-tutorial]: https://git-send-email.io/
[git-trailers]: https://git.wiki.kernel.org/index.php/CommitMessageConventions
[linux-review]: https://www.kernel.org/doc/html/latest/process/submitting-patches.html#using-reported-by-tested-by-reviewed-by-suggested-by-and-fixes
