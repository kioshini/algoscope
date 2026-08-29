# Contributing to AlgoScope

Thanks for helping AlgoScope grow. This document describes how to work with the repository so the git history stays clean and reviewable.

## Branch model

We use a small, predictable flow:

- `main` — production. Only receives merged, released, tested code. The GitHub Pages deploy (`deploy.yml`) runs on pushes to `main`.
- `dev` — integration branch. All feature work flows back here. Feature branches branch off `dev` and merge back into `dev`.
- `feature/*` — one branch per change. Name it after the thing you are working on, e.g. `feature/search-ui`, `feature/radix-fix`.

Never commit directly to `main` or `dev`. Small, focused change → review → merge.

## Daily workflow

```bash
# 1. Start from an up-to-date dev
git checkout dev
git pull origin dev

# 2. Create a feature branch
git checkout -b feature/my-change

# 3. Make focused commits
git add <files>
git commit -m "feat: add search filter to library"

# 4. Push and open a Pull Request into dev
git push -u origin feature/my-change
# then open a PR: feature/my-change -> dev
```

When you open the PR, GitHub shows the diff and the CI check (`npm run check`) runs. Review, then merge.

## After a PR merges

```bash
git checkout dev
git pull origin dev
```

If the feature is release-ready and `dev` is stable, it is promoted to `main` with a second review, then the deploy fires.

## Commit conventions

Prefix the subject with a type so history is scannable:

| Prefix      | Used for                                            |
| ----------- | --------------------------------------------------- |
| `feat:`     | a new feature                                       |
| `fix:`      | a bug fix                                           |
| `refactor:` | a code change that adds no feature and fixes no bug |
| `docs:`     | documentation only                                  |
| `chore:`    | maintenance, tooling, dependencies                  |

Keep commits small and focused. Write the subject in the imperative mood ("add", not "added").

## Before you submit

- Run `npm run check` locally — lint, format, unit tests, Python tests, and the production build must all pass.
- Format your changes with `npm run format`.
- Keep changes scoped to the feature. Separate refactors or unrelated fixes belong in their own branch/PR.
- Do not commit generated artifacts: `node_modules/`, `dist/`, `public/pyodide/`, `*.tsbuildinfo`, `__pycache__/`, `*.pyc`.

## Adding an algorithm

The catalog, its contracts, and the remaining roadmap are documented in [`docs/CATALOG_ROADMAP.md`](docs/CATALOG_ROADMAP.md). Match the existing category contract and include executable Python under `src/algorithms/python/`, then add a correctness example.

## Styles

Prettier (single quotes, 120 columns) and ESLint enforce code style. Both run on `npm run check`, so matching the config is enough.

## Got help?

Feel free to open an issue to discuss a change before writing code.
