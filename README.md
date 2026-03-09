# Dog Breeder Website Template

A production-ready website template for dog breeders, built with **Next.js 15**, **Sanity CMS**, and **Tailwind CSS**.

Everything — colours, fonts, navigation, contact details, and all content — is managed through the Sanity Studio. No code changes needed per customer.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| CMS | Sanity v3 (embedded Studio at `/studio`) |
| Styling | Tailwind CSS v3 |
| Images | Sanity CDN via `@sanity/image-url` |
| Deployment | Vercel (recommended) |

---

## Local development

### Prerequisites

- Node.js 18.17 or later
- A free [Sanity account](https://sanity.io)

### 1. Clone the repo

```bash
git clone <repo-url>
cd breeder-template
npm install
```

### 2. Create a Sanity project

1. Go to [sanity.io/manage](https://sanity.io/manage) and create a new project
2. Choose the **Production** dataset (created by default)
3. Note your **Project ID** — you'll need it next

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id   # from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

SANITY_API_READ_TOKEN=your-read-token            # see below
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Getting the read token:**

1. Go to [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **Tokens**
2. Add a token with **Viewer** permissions
3. Paste it as `SANITY_API_READ_TOKEN`

### 4. Add localhost as a CORS origin

In [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS origins**, add:

```
http://localhost:3000
```

Check **Allow credentials**.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The embedded Sanity Studio is at [http://localhost:3000/studio](http://localhost:3000/studio).

### 6. Configure the site in the Studio

1. Go to `/studio` → **Site Settings** (in the sidebar)
2. Fill in the breeder's name, contact details, and social links
3. Set brand colours and fonts — these are applied instantly across the site
4. Upload a logo
5. Add navigation links

Then start adding **Dogs**, **Litters**, and **News Posts**.

---

## Deploying to production (Vercel)

### 1. Push to GitHub

Make sure your code is on a GitHub (or GitLab / Bitbucket) repo.

### 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your repo
2. Vercel will auto-detect Next.js — no build settings to change

### 3. Add environment variables

In Vercel → your project → **Settings** → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
| `SANITY_API_READ_TOKEN` | Your Sanity read token (Viewer) |
| `NEXT_PUBLIC_SITE_URL` | `https://yourcustomerdomain.com` |

### 4. Add your production domain as a CORS origin

In [sanity.io/manage](https://sanity.io/manage) → **API** → **CORS origins**, add:

```
https://yourcustomerdomain.com
https://your-project.vercel.app
```

Check **Allow credentials** for both.

### 5. Deploy

Click **Deploy** in Vercel. After the first deploy, every push to `main` triggers an automatic redeploy.

### 6. Connect a custom domain (optional)

In Vercel → your project → **Settings** → **Domains**, add the customer's domain and follow the DNS instructions.

---

## Setting up for a new customer

Each customer gets their own Sanity project so their content is isolated.

Quick checklist:

- [ ] Create a new Sanity project at [sanity.io/manage](https://sanity.io/manage)
- [ ] Create a new Vercel project pointing at this repo
- [ ] Set the five environment variables with the customer's Sanity project ID and token
- [ ] Add CORS origins for the Vercel domain and the customer's custom domain
- [ ] In `/studio` → **Site Settings**, configure name, logo, colours, fonts, and nav
- [ ] Add the customer's dogs, litters, and news posts

---

## Project structure

```
breeder-template/
├── app/
│   ├── (site)/               # Public-facing pages
│   │   ├── page.tsx          # Homepage
│   │   ├── [slug]/           # Generic CMS pages
│   │   ├── dogs/             # Dog listing + individual pages
│   │   ├── litters/          # Litter listing + individual pages
│   │   └── news/             # News listing + individual posts
│   ├── api/contact/          # Contact form API route
│   ├── studio/[[...tool]]/   # Embedded Sanity Studio
│   ├── layout.tsx            # Root layout (fonts, CSS vars from Sanity)
│   └── globals.css           # Base styles + CSS custom properties
├── components/
│   ├── blocks/               # Page builder blocks
│   ├── dog/                  # Dog-specific components
│   ├── litter/               # Litter-specific components
│   ├── news/                 # News card
│   ├── layout/               # Header & Footer
│   └── ui/                   # Shared UI (Gallery, PageHero, etc.)
├── sanity/
│   ├── lib/
│   │   ├── client.ts         # Sanity client
│   │   ├── image.ts          # Image URL builder
│   │   └── queries.ts        # GROQ queries
│   ├── schemas/
│   │   ├── documents/        # siteSettings, page, dog, litter, newsPost
│   │   └── objects/          # pedigreeEntry, pedigreeTree, healthTest, etc.
│   └── structure.ts          # Studio sidebar structure
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## Contact form

The contact form at `/api/contact` validates submissions and logs them to the console. To send real emails, open `app/api/contact/route.ts` and follow the TODO comments to plug in [Resend](https://resend.com) or Nodemailer.

---

## Available scripts

```bash
npm run dev      # Start local dev server
npm run build    # Production build
npm run start    # Start production server locally
npm run lint     # Run ESLint
```
