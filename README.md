# Lighthouse BSD City — Website

Marketing website for the Lighthouse International Learning Center — BSD City branch.
Hosted on **Vercel** (free). Lead data stored in **Neon DB** (free tier, PostgreSQL).

---

## Project Structure

```
lighthouse_bsd/
├── index.html          ← Single-page website
├── style.css           ← All styles
├── script.js           ← Nav toggle, form submission, scroll animations
├── assets/
│   └── lighthouse-logo-master.png
├── api/
│   └── leads.js        ← Vercel serverless function — saves leads to Neon DB
├── package.json
├── vercel.json
├── .env.example        ← Copy to .env and fill in DATABASE_URL
└── BRAND.md            ← Brand guide (colors, fonts, voice)
```

---

## One-Time Setup

### 1. Create a Neon DB database (free)

1. Go to [console.neon.tech](https://console.neon.tech) and sign up (free).
2. Create a new project — name it `lighthouse-bsd` or anything you like.
3. Go to **Connection Details** → copy the **Connection string** (starts with `postgresql://...`).

### 2. Deploy to Vercel (free)

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.
2. Click **Add New Project** → import this repository (`lighthouse_bsd`).
3. In **Environment Variables**, add:
   - Key: `DATABASE_URL`
   - Value: the connection string you copied from Neon DB
4. Click **Deploy**.

Vercel will give you a public URL (e.g. `https://lighthouse-bsd.vercel.app`) that you can paste into your Instagram bio and Linktree.

### 3. Push this repo to GitHub first (if not done yet)

```bash
cd lighthouse_bsd
git init
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOUR_USERNAME/lighthouse-bsd.git
git push -u origin main
```

---

## Viewing Leads

All enquiry form submissions are saved to the `leads` table in your Neon DB.

To view them:
1. Go to [console.neon.tech](https://console.neon.tech) → your project → **SQL Editor**
2. Run:

```sql
SELECT * FROM leads ORDER BY created_at DESC;
```

---

## Updating the WhatsApp Number

Search `wa.me/6282298168088` in `index.html` and replace with the correct number if it ever changes.

---

## Updating Content

All website text is in `index.html`. Search for the section you want to update and edit the text directly. Vercel will redeploy automatically whenever you push a new commit to GitHub.

---

## Local Development

```bash
# Install dependencies
npm install

# Install Vercel CLI globally (once)
npm install -g vercel

# Run locally (serves static files + API routes)
vercel dev
```

Create a `.env` file from the example first:

```bash
cp .env.example .env
# then paste your DATABASE_URL into .env
```
