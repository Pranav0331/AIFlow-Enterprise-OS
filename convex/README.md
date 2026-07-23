# Convex functions

This directory contains your Convex backend: schema, auth, and serverless
functions (queries/mutations). It is deployed independently of this Vite app
via the Convex CLI — see the root `README` / setup instructions for the exact
`npx convex login` / `npx convex dev` / `convex deploy` commands.

The `_generated/` folder is created automatically the first time you run
`npx convex dev` and must not be hand-edited or committed manually before
that — it is intentionally absent from this checkout until you run the CLI
locally.
