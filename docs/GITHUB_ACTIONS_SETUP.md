# GitHub Actions Setup Guide

This guide explains how to configure GitHub Actions to automatically run database migrations on every deployment.

## What This Does

When you push code to the `main` branch:
1. GitHub Actions automatically runs
2. Installs Supabase CLI
3. Links to your production database
4. Runs all pending migrations
5. Vercel then deploys your app (via their GitHub integration)

**You never need to run migrations manually again.**

---

## Setup Instructions

### Step 1: Get Your Supabase Access Token

1. Go to https://supabase.com/dashboard/account/tokens
2. Click **Generate new token**
3. Name it: `GitHub Actions - BookTalent`
4. Copy the token (you'll only see it once)

### Step 2: Get Your Supabase Project Details

1. Go to https://supabase.com
2. Open your production project
3. Click **Settings** (gear icon, bottom left)
4. Click **General**
5. Copy the **Reference ID** (looks like: `abcdefghijklmnop`)
6. Go to **Database** settings
7. Copy or note your **Database Password** (the one you set when creating the project)

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/YOUR_USERNAME/booktalent
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

Add these three secrets:

**Secret 1:**
- Name: `SUPABASE_ACCESS_TOKEN`
- Value: (paste the token from Step 1)

**Secret 2:**
- Name: `SUPABASE_PROJECT_ID`
- Value: (paste the Reference ID from Step 2)

**Secret 3:**
- Name: `SUPABASE_DB_PASSWORD`
- Value: (paste your database password from Step 2)

### Step 4: Push This Workflow File

\`\`\`bash
git add .github/workflows/deploy.yml
git commit -m "Add automated database migrations via GitHub Actions"
git push origin main
\`\`\`

### Step 5: Verify It Works

1. Go to your GitHub repo → **Actions** tab
2. You should see a workflow run called "Deploy with Database Migrations"
3. Click on it to see the progress
4. It should complete successfully (green checkmark)
5. Your migrations are now applied!

---

## How to Use Going Forward

**Every time you need to change the database:**

1. Create a migration file locally:
   \`\`\`bash
   supabase migration new add_new_feature
   \`\`\`

2. Edit the `.sql` file with your changes

3. Push to GitHub:
   \`\`\`bash
   git add .
   git commit -m "Add new feature with database changes"
   git push origin main
   \`\`\`

4. **GitHub Actions automatically:**
   - Runs your new migration
   - Updates production database
   - Vercel deploys your app

**That's it! No manual steps needed.**

---

## Troubleshooting

**If the workflow fails:**

1. Check the Actions tab for error messages
2. Verify all three secrets are set correctly
3. Make sure your migration SQL is valid
4. Check that your Supabase project is accessible

**Common errors:**

- `Error: Invalid access token` → Regenerate token and update secret
- `Error: Project not found` → Check PROJECT_ID is correct
- `Error: Authentication failed` → Verify database password is correct

---

## Security Notes

- Secrets are encrypted and never visible in logs
- Access tokens can be revoked at any time from Supabase dashboard
- Only collaborators with push access to `main` can trigger migrations
- Consider adding branch protection rules for extra safety
