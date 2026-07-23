# Welcome to your Enter project

[![Built with enter.pro](https://img.shields.io/badge/Build%20with-Enter.pro-FC5776?style=for-the-badge&labelColor=1F1F1F)](https://enter.pro)

*Automatically synced with your [enter.pro](https://enter.pro) workspace* 

---

## Overview

This repository is automatically linked to your app on [enter.pro](https://enter.pro).  
Every change you make in Enter will be reflected here — and any updates you push to this repo will sync back seamlessly.  

Enter.pro helps you **build, edit, and deploy full-stack web apps by prompting**.  
Just describe what you want — Enter turns ideas into production-ready code.

---

## Project URLs

**Live app:** https://<project-id>-latest.preview.enter.pro  
**Edit & build in Enter:** https://enter.pro/project/<project-id>


---

## Continue building

Keep developing your app directly in [Enter.pro](https://enter.pro/project/<project-id>).  
Prompt new features, refine the UI, or connect integrations — all changes are versioned and synced automatically to GitHub.

---

## Local development

Prefer to work locally? You can clone this repo and start developing right away:

```bash
# Step 1: Clone your project repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate into the project folder
cd <YOUR_PROJECT_NAME>

# Step 3: Install all dependencies
pnpm install

# Step 4: Start the local development server
pnpm dev
```

Push your commits — Enter.pro will automatically detect and sync your latest changes.

---

## i18n

This template ships a minimal browser-side i18n baseline built on:

- `i18next`
- `react-i18next`
- `i18next-http-backend`
- `i18next-browser-languagedetector`

### Source-of-truth files

The template only owns three pieces of i18n data:

- `i18n.config.json` — language manifest (`fallbackLng`, `languages[].{code,label,detect,dir}`)
- `public/locales/{code}.json` — flat dotted-key translations, one file per language
- `src/i18n/config.ts` + `src/i18n/util.ts` — runtime entry and pure helpers
- `src/components/language-switcher.tsx` — neutral-themed UI sample

### Runtime behavior

- reads the manifest from `i18n.config.json`
- loads translations from `public/locales/{code}.json` via `i18next-http-backend`
- detects language from cookie, browser, then html tag; caches in the `i18next` cookie
- normalizes unsupported languages to `fallbackLng` (no invalid values stored in cookies)
- syncs `<html lang>` and `<html dir>` on init and on `languageChanged`
- treats keys as flat strings: both `keySeparator` and `nsSeparator` are disabled

### Using translations in components

Import directly from `react-i18next`. No project-specific hook or cast is needed.

```tsx
import { useTranslation } from "react-i18next";

const Title = () => {
  const { t } = useTranslation();
  return <h1>{t("home.hero.title")}</h1>;
};
```

For language switching, the `i18n` instance also comes from `useTranslation()`:

```tsx
const { i18n } = useTranslation();
void i18n.changeLanguage("zh-CN");
```

`languageOptions`, `normalizeLanguage`, `getLanguageDirection`, and `fallbackLng` can be imported from `@/i18n/config` (re-exports from `util.ts`).

### Adding a language

1. Add an entry under `languages` in `i18n.config.json` with `code`, `label`, `detect`, `dir`.
2. Create `public/locales/{code}.json` with the same key set as `public/locales/{fallbackLng}.json`.
3. Translate values, preserving any `{{variables}}` and `<tag>...</tag>` structures.

### Adding a translation key

1. Add the key to `public/locales/{fallbackLng}.json` first.
2. Add the same key to every other locale file with its translated value.
3. Use it via `t("group.key")` in components.

### Backend handoff (temporary in-repo files)

The following files are **temporary copies kept in the repo only until backend integration is complete**. The backend will eventually own validation, statistics, completion-rate dashboards, scan-for-new-strings, and auto-translate. After that integration lands, these files (and the corresponding `package.json` scripts) will be removed:

- `scripts/check-i18n.mjs`, `scripts/scan-i18n.mjs`, `scripts/i18n-utils.mjs`, `scripts/i18n-source-usage.mjs`
- `i18n.scan.json`
- `reports/i18n/`
- `docs/i18n-agent-spec.md`, `docs/i18n-contract.md`
- `package.json` scripts: `i18n:check`, `i18n:scan`, and the `check` aggregate

Until removed, you can still run `pnpm i18n:check` and `pnpm i18n:scan` locally; the canonical computation is the backend's responsibility.

---

## Tech stack

This project uses:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

---

## Deployment

To deploy, open your Enter.pro project and click "Publish"

Your app will automatically build and go live at your production URL.

---

✨ Keep prompting, keep building — Enter.pro handles the rest.
