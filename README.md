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

7. In **Authentication → URL Configuration**, add `http://localhost:3000` to the redirect URL allow-list. Add your deployed app URL there too when you publish it.
8. Email magic-link sign-in is enabled by default. To offer Google sign-in, open **Authentication → Providers → Google**, enable it, and add the Google OAuth client ID and secret supplied by Google Cloud.

## Notifications and voice input

- The Profile page can request browser notification permission. It registers the included service worker, which displays incoming Web Push messages.
- To create a push subscription, add a VAPID public key as `NEXT_PUBLIC_VAPID_PUBLIC_KEY` in `.env.local`. A notification service or server endpoint must receive the resulting subscription and send the messages; the browser app stores a local copy for development.
- The microphone button in plan and task title fields uses the browser's Web Speech API. It works in browsers that provide speech recognition and remains optional—typing always works.

The green dot at the top means the app sees your Supabase settings. Without settings, it automatically saves todos in your browser instead. Todos made in local mode do not automatically move to Supabase.

> **Privacy note:** The included SQL policies require a signed-in user and restrict every todo to its owner. Never expose a Supabase service-role key in the browser.

## Learn the project

- `app/page.tsx` contains the screen and task actions (add, complete, filter, search, and reorder).
- `app/globals.css` contains the layout, colors, and responsive styles. The color variables are near the top.
- `lib/supabase.ts` connects to Supabase only after you add the two settings.
- `supabase/schema.sql` creates the database table.

Made for steady little steps. onWard.
