# Portfolio Admin Panel

This admin panel now uses a real Supabase-backed workflow for live content updates.

## What Changed

- Admin sign-in uses Supabase Auth
- Portfolio content is stored in Supabase Postgres
- Certificate uploads are stored in Supabase Storage
- The public portfolio reads live backend content when Supabase is configured

## Required Setup

Follow:

- [SUPABASE_PORTFOLIO_SETUP.md](c:/Users/ASUS/OneDrive/Desktop/Chandra/Project/portfolio/SUPABASE_PORTFOLIO_SETUP.md)

Run:

- [supabase/portfolio_backend.sql](c:/Users/ASUS/OneDrive/Desktop/Chandra/Project/portfolio/supabase/portfolio_backend.sql)

## Login

1. Create your admin user in Supabase Auth
2. Add that email to `portfolio_admins`
3. Open `login.html`
4. Sign in with that email and password

## Current Admin Sections

- Projects
- Skills
- Certificates
- Site content

## Notes

- If Supabase is not configured yet, the public site falls back to the static HTML content.
- The first successful save from `admin.html` publishes the content row to the backend.
- If the backend row is empty, the admin page tries to seed itself from the current static `index.html` content first.
- The old browser-only localStorage admin flow is no longer the live source of truth.
