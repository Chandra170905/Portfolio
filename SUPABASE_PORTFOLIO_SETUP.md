# Supabase Portfolio Setup

This portfolio now supports a real backend-powered admin flow using:

- Supabase Auth for admin sign-in
- Supabase Postgres for live portfolio content
- Supabase Storage for certificate uploads

## 1. Create a Supabase project

Create a project in your Supabase dashboard.

## 2. Run the SQL setup

Open the SQL editor in Supabase and run:

- [supabase/portfolio_backend.sql](c:/Users/ASUS/OneDrive/Desktop/Chandra/Project/portfolio/supabase/portfolio_backend.sql)

Before running it for production, replace:

- `replace-with-your-admin-email@example.com`

with your real admin email address in lowercase.

## 3. Create the storage bucket

In the Supabase dashboard:

1. Open `Storage`
2. Click `New bucket`
3. Name it `portfolio-media`
4. Set it to `Public`
5. Create the bucket

## 4. Create the admin user

In Supabase Auth:

- create a user with the same email address you added to `portfolio_admins`
- set a password for that user

Recommended:

- disable public signups if this is only for your own admin access
- keep the auth user email the same lowercase address you inserted into `portfolio_admins`

## 5. Add your Supabase keys to the site

Fill the same values into these files:

- [index.html](c:/Users/ASUS/OneDrive/Desktop/Chandra/Project/portfolio/index.html)
- [admin.html](c:/Users/ASUS/OneDrive/Desktop/Chandra/Project/portfolio/admin.html)
- [login.html](c:/Users/ASUS/OneDrive/Desktop/Chandra/Project/portfolio/login.html)

Set:

- `portfolio-supabase-url`
- `portfolio-supabase-anon-key`

Leave the default table and bucket names unless you changed them in SQL.

## 6. Deploy

Push the updated files to GitHub and let your site redeploy.

## 7. First live save

After deployment:

1. Open `login.html`
2. Sign in with the Supabase admin user
3. Open `admin.html`
4. Save any section once

That first save creates or updates the live backend content row.

If the backend is still empty, the admin page first tries to load your current static `index.html` content as the starting point, so your first publish can mirror the site you already deployed.

## Notes

- The public portfolio reads backend data only when Supabase is configured.
- If backend content has not been saved yet, the site falls back to the static HTML content.
- Certificate uploads now go to Supabase Storage instead of browser-only IndexedDB.
