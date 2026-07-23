---
name: enter-analytics-auto
description: Preserve and extend Enter website analytics integration without bypassing the SDK.
---

## Rules

- Do not remove or bypass `bootstrapGeneratedSiteAnalytics()`.
- Do not send analytics events with handwritten `fetch()` requests.
- If a custom or conversion event must be added, use the SDK API instead of inventing a new client.
- Never collect input values, passwords, tokens, cookies, or authorization headers as analytics properties.
- Prefer semantic HTML buttons, links, and forms so runtime auto-tracking remains stable.
