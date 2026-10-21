# Toolerxyt Vercel Website + Admin Password Manager

## Features
- Website visitors must enter a password to unlock the main page.
- Admin page at `/admin/password-890` lets an authorized admin add/list/delete site passwords.
- Passwords are stored in Upstash Redis, not browser localStorage.
- Admin API is protected by a server-side `ADMIN_SECRET`.

## Setup required before deployment
This project requires a Redis database. Use an Upstash Redis database and add these Vercel Project → Settings → Environment Variables:

- `UPSTASH_REDIS_REST_URL` — Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis REST token
- `ADMIN_SECRET` — create a long, unique secret for the admin panel (do not use the URL path as the only protection)

Redeploy after adding environment variables.

## Deploy
1. Upload this folder's contents to a GitHub repository.
2. In Vercel choose **Add New → Project** and import that repository.
3. Add the three environment variables above.
4. Deploy. The API file `api/passwords.js` runs as a Vercel Function.
5. Open `https://YOUR-DOMAIN/admin/password-890`, enter the `ADMIN_SECRET`, then add passwords.
6. To initially allow site access, add the first site password in the admin page.

## Important
- The admin URL path is not authentication by itself; keep `ADMIN_SECRET` private.
- If no password exists yet, the site stays locked until the admin adds one.
- Do not put the admin secret in `index.html` or public GitHub files.
- The admin list displays passwords to the authenticated admin. Use unique passwords and rotate them when needed.
