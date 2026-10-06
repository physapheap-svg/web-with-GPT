# Pheap Physa Portfolio — Source Code

This folder contains the source for the portfolio website and its `/admin` dashboard, including the profile photo and CV used by the site.

## Hosting this version

This source is configured for the existing ChatGPT Site / Cloudflare Workers deployment. It uses Cloudflare D1 for saved portfolio content, Cloudflare R2 for uploaded files, and ChatGPT Site sign-in to protect `/admin`.

You can push this folder to a **private GitHub repository** to keep and manage the source. Do not upload the included CV or profile photo to a public repository unless you want those files to be public.

## Vercel

This source is not directly deployable to Vercel as-is. Vercel uses a different runtime and needs replacements for Cloudflare D1/R2 and ChatGPT Site sign-in. The website and admin dashboard need those changes before importing this project into Vercel.

## Project details

- Framework: Vinext + Vite
- Node.js: 22.13 or later
- Main site: `app/`
- Admin dashboard: `app/admin/`
- Profile photo and CV: `public/assets/`
- Database schema and migration: `db/` and `drizzle/`

The portfolio's uploaded content is stored in the live site's database and is not included in this source archive.
