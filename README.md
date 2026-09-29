# onWard

A small, friendly to-do app built with Next.js, Tailwind CSS, and Supabase. Add todos, check them off, filter by list, search, and drag cards to change their order.

## Start the app

1. Install [Node.js](https://nodejs.org/) if it is not already on your computer.
2. Open this project folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run `npm install` once to install the app's packages.
5. Run `npm run dev` to start the app.
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

The first time, the sample todos save only in this browser. You can try the app without making a Supabase account.

## Turn on Supabase sync

1. Create a free project at [supabase.com](https://supabase.com/).
2. In your Supabase project, open **SQL Editor → New query**, copy in [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the `todos` table. If your database already has a `tasks` table from an earlier version, the script renames it and keeps its rows.
3. Open your project's **Project Settings → API** (or **Connect**) page and copy the project URL and publishable/anon key.
4. Make a copy of `.env.example` named `.env.local` in the project folder.
5. Replace the example values in `.env.local` with the URL and key from Supabase:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
   ```

6. Stop the running app with **Ctrl+C** in the terminal, then run `npm run dev` again.

The green dot at the top means the app sees your Supabase settings. Without settings, it automatically saves todos in your browser instead. Todos made in local mode do not automatically move to Supabase.

> **Privacy note:** The included SQL policies make this learning demo easy to try, but anyone with the project URL can read or edit its todos. Don't put private information in a demo project. A real private app should add Supabase Auth and restrict each todo to its owner.

## Learn the project

- `app/page.tsx` contains the screen and task actions (add, complete, filter, search, and reorder).
- `app/globals.css` contains the layout, colors, and responsive styles. The color variables are near the top.
- `lib/supabase.ts` connects to Supabase only after you add the two settings.
- `supabase/schema.sql` creates the database table.

Made for steady little steps. onWard.