# Portfolio Admin Panel

This admin panel allows you to manage your portfolio content without editing code directly. All changes are saved to your browser's local storage.

## Login (Local)

- Open `login.html` (or open `admin.html` and you will be redirected).
- Username: `Chandra05`
- Password: `Chandra#2005`
- Login is stored for the current browser session (auto-expires after ~2 hours).

## Features

### Content Management
- **Projects**: Add, edit, and delete portfolio projects
- **Skills**: Organize skills by categories with tags
- **Certificates**: Manage certificates with descriptions and categories
- **About**: Update personal information and bio
- **Contact**: Manage contact details and social links

### Data Management
- **Export Data**: Download all portfolio data as a JSON backup file
- **Import Data**: Restore portfolio data from a JSON file
- **Clear Data**: Remove all stored data (irreversible)
- **Load Sample Data**: Populate the admin panel with sample content to get started

## How to Use

1. Open `admin.html` in your web browser
2. Navigate between sections using the top navigation buttons
3. Click "Add New" buttons to create content
4. Click "Edit" buttons on existing items to modify them
5. Click "Delete" buttons to remove items
6. Use the Data Management section for backup and restore operations

## Data Storage

All data is stored locally in your browser's localStorage. This means:
- Data persists between browser sessions
- Data is only available on the device/browser where it was saved
- Clearing browser data will remove all saved content

## Backup Your Data

Regularly use the "Export Data" feature to create backup files of your portfolio content. You can restore this data using the "Import Data" feature if needed.

## Getting Started

If you're new to the admin panel:
1. Go to the "Data Management" section
2. Click "Load Sample Data" to populate with example content
3. Explore each section and customize the content to match your portfolio
4. Export your customized data as a backup

## Integration with Main Portfolio

The admin panel manages data that can be integrated with your main portfolio website. The data structure is designed to work seamlessly with the existing portfolio layout.

## Global Game Leaderboard (Supabase Recommended)

By default the game leaderboard is stored in `localStorage` (only on the same device). To make it global across devices/users, use Supabase:

1. Create a Supabase project.
2. In Supabase SQL editor, create a table:

```sql
create table if not exists public.eegg_scores (
  id text primary key,
  name text not null,
  score int not null,
  ts bigint not null
);

alter table public.eegg_scores enable row level security;

create policy "public read scores"
on public.eegg_scores for select
to anon
using (true);

create policy "public insert scores"
on public.eegg_scores for insert
to anon
with check (true);
```

3. In `index.html`, set:
   - `eegg-supabase-url` to your project URL (like `https://xxxx.supabase.co`)
   - `eegg-supabase-anon-key` to your anon public key
   - `eegg-supabase-table` (optional) default is `eegg_scores`

Notes:
- The anon key is meant to be public. RLS policies control what can be read/written.
- This setup allows anyone to insert scores; for stricter anti-cheat you’ll need a server-side function to validate writes.
