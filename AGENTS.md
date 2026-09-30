# Agent Instructions

## Database Changes and Tests

- Treat every Supabase query or mutation as a database endpoint. Apply these requirements to any API route or server action added later as well.
- Before changing database access, inspect its callers, the Supabase schema, and relevant row-level security policies.
- Write or update focused tests for every database operation. Cover successful responses, empty results where applicable, and database failures.
- Keep coverage for the existing todo operations: load/list todos, create, edit, toggle completion, delete, and reorder. Verify persisted fields and ordering, and verify optimistic UI rollback on failures.
- Prefer the project test runner and test database. If no test runner exists, add a consistent runner and package script before relying on ad-hoc checks.
- Use mocks for isolated failure and response-shape tests. When local Supabase is available, also run integration checks against it; never use production data for tests, and clean up test records.
- Run the relevant tests, `npm run lint`, `npx tsc --noEmit`, and `npm run build` when database behavior changes. If an environment limitation blocks a check, report it and use the closest safe alternative.
- Do not consider a database endpoint verified solely because it compiles. Assert the operation's observable result and its error behavior.