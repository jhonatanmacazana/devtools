# devtools

Devtools for interacting with the GitHub API.

## Development

You need to have [`pnpm`][1] installed in your system.

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env-template .env
# Then fill in credentials ...

# Generate Prisma Client
pnpm db:generate

# Start development server
pnpm dev
```

If you also want to run tests for the environment:

```bash
# Run dev tests (in another terminal)
pnpm turbo dev:test
```

## TODO List:

- [x] Login with GitHub
- [x] List repositories
- [x] List branches
- [x] Compare mergeable branches
- [ ] Show tips on how to solve merge conflicts
- [x] List reviewers and labels (shared)
- [ ] List reviewers and labels (specific per branch)
- [ ] Create actual PRs for subset of mergeable branches
- [ ] UI-UX
- [ ] Change backend queries to consume the GraphQL GitHub API to reduce calls
- [ ] Add logic with redis to prevent rate-limit from GitHub API
- [ ] ?

<!-- Links -->

[1]: https://pnpm.io/installation
