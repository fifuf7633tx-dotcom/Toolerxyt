# Toolerxyt Vercel Website (Password Gate)

## Deploy
1. Extract this ZIP.
2. Upload the files to a GitHub repository.
3. In Vercel, choose **Add New → Project**, import that repository, and deploy.
4. No build command is needed for this static HTML site.

## Files
- `index.html` — website and password prompt
- `vercel.json` — Vercel settings

## Important security note
The requested password gate is implemented in browser-side JavaScript. A static-site password embedded in HTML/JavaScript can be discovered or bypassed by a technically capable visitor. Do not use it to protect sensitive information. For real access control, use server-side authentication or Vercel Deployment Protection.
