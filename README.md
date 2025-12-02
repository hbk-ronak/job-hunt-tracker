# Job Hunt Tracker

Privacy-focused job application tracker built with Svelte.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 Deploy to GitHub Pages

### Step 1: Update Base Path

In `vite.config.ts`, change the `base` to your repository name:

```typescript
base: '/your-repo-name/', // e.g., '/job-hunt-tracker/'
```

### Step 2: Build

```bash
npm run build
```

This creates the `docs/` folder with your production build.

### Step 3: Commit and Push

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/docs`
4. Click **Save**

Your site will be live at: `https://<username>.github.io/<repo-name>/`

## 🎯 Features

- 📊 Analytics Dashboard
- 🎯 Kanban Board View
- 📋 Table View with Sorting
- 🔍 Search & Filter
- 💾 Local Storage (Privacy-First)
- 📱 Fully Responsive
- 🌙 Dark Mode

## 🛠️ Tech Stack

- Svelte 4
- TypeScript
- Vite
- Material Icons

