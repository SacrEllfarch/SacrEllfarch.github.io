# AGENTS.md

This repository is the source for SacrEllfarch Blog, a Valaxy static blog using the Sakura theme.

## Project Shape

- `valaxy.config.ts` controls the Valaxy theme, Sakura hero, navbar, colors, and global UI behavior.
- `site.config.ts` controls site metadata such as URL, favicon, author, description, social links, search, and sponsor settings.
- `pages/` contains Markdown pages and posts.
- `pages/posts/` contains blog posts.
- `pages/about/index.md` is the main About page.
- `pages/about/site.md` is the site-building log page.
- `components/` contains local overrides for Sakura theme components.
- `styles/index.scss` contains site-level visual polish and Sakura theme overrides.
- `public/` contains static assets such as images, favicon, avatar, and videos.
- `patches/` contains package patches used by pnpm.

## Commands

Run commands from the WSL repo path:

```bash
cd /home/terchdox/git/Valaxy/thx
```

Use pnpm:

```bash
pnpm dev
pnpm build
pnpm serve
```

`pnpm build` runs `valaxy build --ssg`. It currently emits known Valaxy/Sakura warnings about optional addon imports such as `useAddonWaline`, `useAddonAlgolia`, and `useTwikooWithOptions`; those warnings are pre-existing and are not by themselves a failed build.

## Git Workflow

- Check `git status --short --branch` before editing.
- Commit each meaningful local change so the user has a backup.
- Push only when the user asks to push.
- Never revert user changes unless explicitly requested.
- Keep generated or environment-specific files out of commits.

Useful commands:

```bash
git status --short --branch
git diff
git add <paths>
git commit -m "<message>"
git push origin main
```

## Files To Avoid Committing

These should normally stay untracked or ignored:

- `node_modules/`
- `dist/`
- `.valaxy/`
- generated feed/search files under `public/`, including `feed.xml`, `atom.xml`, `feed.json`, and `valaxy-fuse-list.json`
- Windows metadata files ending in `:Zone.Identifier`
- local env files such as `.env` and `.env.*`
- local videos under `public/videos/*.mp4`

## Blog-Specific Notes

- The homepage hero media pool lives in `valaxy.config.ts` under `heroConfig.urls`.
- `heroConfig.randomUrls` controls whether the homepage randomly chooses a hero wallpaper/media on entry.
- The navbar title is configured through `themeConfig.navbarOptions.title`.
- The custom navbar brand hover effect lives in `styles/index.scss`; do not modify it unless asked.
- The Sakura glitch title effect should follow the theme's original `SakuraGlitchText.vue` behavior unless the user asks for a different effect.
- Homepage post-card layout fixes also live in `styles/index.scss`.
- Article header readability tweaks live in `styles/index.scss` under `.sakura-post-header.has-cover`.

## Editing Guidance

- Prefer small, scoped changes that follow the existing Valaxy/Sakura structure.
- Use existing theme config before adding custom components.
- For visual changes, test with the local preview when possible.
- For Markdown-only documentation changes, a build is optional unless behavior or generated output is affected.
- Preserve Chinese content and UTF-8 encoding.
- Be careful with PowerShell/WSL mojibake in terminal output; inspect actual files rather than trusting garbled console text.
