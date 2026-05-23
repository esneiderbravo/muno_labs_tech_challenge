---
name: docstring-standardizer
description: Review and standardize TS/JS documentation comments across a repository using TSDoc/JSDoc with @param and @returns. Use this whenever the user asks to clean up docs, improve code comments, enforce docstring consistency, document components/utils/methods, or apply project-wide API documentation standards.
---

# Docstring Standardizer

Use this skill to normalize documentation comments in TypeScript/JavaScript codebases, especially React/Next.js projects with components, utility modules, and exported methods.

## Goals

- Enforce one consistent TSDoc/JSDoc style.
- Add missing docstrings for exported APIs and important internal helpers.
- Keep comments accurate, concise, and behavior-focused.
- Avoid noisy or redundant comments.
- Apply changes directly (not just suggestions), then summarize what changed.

## Scope Rules

1. Include: `app/**`, `components/**`, `lib/**`, and other source folders that contain TS/JS.
2. Exclude: `node_modules/**`, build output, generated files, and lockfiles.
3. Prefer editing only files that need docstring improvements.
4. Do not change runtime behavior while editing comments.

## Required Comment Standard

Use block comments in TSDoc/JSDoc style:

```ts
/**
 * One-line summary in imperative or descriptive form.
 *
 * @param userId - Stable unique identifier for the user.
 * @param includeInactive - Whether to include archived records.
 * @returns Active profile data for rendering.
 */
```

### Rules

- First line: clear summary of intent.
- Use `@param` for each meaningful parameter.
- Use `@returns` for non-void return values.
- Use `@throws` only when the function can actually throw.
- For React components, describe purpose and major props.
- Keep tags and wording aligned with actual implementation names/types.
- Do not add fake details or speculative behavior.

## Workflow

1. Discover candidate files with TS/JS exports and public helpers.
2. Review existing comments and detect inconsistencies:
   - Missing docstrings
   - Missing `@param` / `@returns`
   - Outdated or inaccurate descriptions
   - Mixed styles in the same module
3. Edit files directly to standardize comments.
4. Keep changes focused; avoid unrelated refactors.
5. Provide a concise change report grouped by file and symbol.

## Prioritization Heuristic

When the codebase is large, prioritize in this order:

1. Exported functions, classes, and constants used across modules.
2. Reusable utilities in `lib/**` and shared helpers.
3. Components in `components/**` and page-level modules in `app/**`.
4. Internal helpers that are complex, business-critical, or non-obvious.

## Quality Bar

- Comments should explain intent/contract, not restate syntax.
- Avoid boilerplate like “Sets value” unless domain meaning is added.
- Keep summaries short (usually one sentence).
- Prefer precise domain terms from the repository.

## Output Format

After applying updates, return:

1. Files updated.
2. For each file, key symbols documented/standardized.
3. Any intentional skips (with reason).

