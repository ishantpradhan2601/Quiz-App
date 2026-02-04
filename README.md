# QuizApp — Deploying to Vercel

This is a simple static Quiz app (HTML/CSS/JS). Below are two easy ways to deploy it on Vercel.

## Prerequisites
- Node.js + npm (for Vercel CLI option)
- Git + GitHub account (for Git-based deployment)
- Vercel account (free tier is fine)

## Option A — Deploy via Git/GitHub (recommended)
1. Initialize a git repo and push to GitHub (one-time):

```bash
cd path/to/QuizApp
git init
git add .
git commit -m "Initial commit"
# Create a repo on GitHub and push, or use the GitHub CLI:
# gh repo create <repo-name> --public --source=. --remote=origin --push
```

2. In Vercel dashboard, click "New Project" → Import your GitHub repo → Deploy. Vercel will detect the static site and publish it.

## Option B — Deploy directly with Vercel CLI
1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login and deploy:

```bash
vercel login
cd path/to/QuizApp
vercel --prod
```

Follow the interactive prompts. The `--prod` flag publishes to production immediately.

## Notes
- The project is a static site (contains `index.html`, `script.js`, `style.css`). No backend is required.
- A sample `vercel.json` is included to ensure Vercel treats the project as static and routes all requests to `index.html`.

## Helpful local dev commands
- Use the Live Server VS Code extension (you already have a port in `.vscode/settings.json`).
- Or run a tiny static server:

```bash
npx serve -s . -l 5502
```

---
If you want, I can initialize git and create the first commit here, or run the Vercel CLI to deploy — which would you like me to do next?