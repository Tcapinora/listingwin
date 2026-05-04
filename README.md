# ListingWin

ListingWin is a Next.js MVP for real estate agents preparing listing appraisal presentations.

It helps an agent create a seller-facing presentation with:

- Agent and agency profile
- Property details and pricing story
- Property image uploads
- Signboard and open-home visual mockups
- Brochure, flyer, portal, Instagram, and Facebook previews
- Buyer match and follow-up concepts
- Vendor report and Form 6 explainer concepts

## Local Development

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Production Build

```bash
npm run build
npm run start
```

## Vercel

This project is ready to deploy on Vercel as a Next.js app.

Suggested settings:

- Framework: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: Next.js default

The MVP currently stores listing and profile data in browser localStorage. A production version should replace this with user accounts, a database, and cloud file storage.
