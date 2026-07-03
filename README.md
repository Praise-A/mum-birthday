# Mum Birthday Site

This project uses:

- `React + Vite` for the public website
- `Express` for public tribute submission and admin moderation
- `Sanity` for content, uploaded tribute images, and tribute records
- a separate Sanity Studio repo for content editing

## What Lives Where

- Public site code: `src/`
- API server code: `api/`
- Sanity Studio: separate repo

## Install

Run these once from the project root:

```bash
npm install
```

## How To Run The App

### Website + API

```bash
npm run dev
```

Runs:

- frontend on `http://127.0.0.1:5173`
- backend on `http://127.0.0.1:3001`

### Website + API + Studio

```bash
npm run dev:all
```

Runs:

- frontend on `http://127.0.0.1:5173`
- backend on `http://127.0.0.1:3001`

## How Tribute Storage Works

- Visitor submissions go to the Express API
- The API uploads any image to Sanity
- The API creates a `tribute` document in Sanity with status `pending`
- The admin page reads pending, approved, and rejected entries through the API
- Approving a tribute changes its Sanity status to `approved`
- The public site only reads tributes whose status is `approved`

## What You Need To Create In Sanity

Create:

- one Sanity project
- one dataset, usually `production`
- one API token with write access

Your separate Studio repo should define these Sanity content types:

- `post`
- `galleryItem`
- `tribute`

You do not need to manually create those schema types in the dashboard as long as the Studio repo contains the schemas.

## How To Connect A Real Sanity Project

### 1. Create the project

Create it from the Sanity dashboard or CLI. The key things you need are:

- `projectId`
- dataset name, usually `production`

### 2. Create a write token

In Sanity:

1. Open your project
2. Go to `API`
3. Open `Tokens`
4. Create a token for this app
5. Give it permissions that allow document writes and asset uploads

Add that token to `.env`:

```env
SANITY_AUTH_TOKEN=your-token-here
```

### 3. Make frontend reads work

Because the public site reads published content directly from Sanity in the browser:

- keep the dataset readable by the frontend
- add CORS origins for:
  - `http://127.0.0.1:5173`
  - `http://localhost:5173`
  - your live frontend domain

If your Sanity dataset is private, the current frontend will not be able to fetch posts, gallery items, and approved tributes directly.

### 4. Fill the env values

Use the same project id and dataset in these two groups:

- `VITE_SANITY_*` for frontend reads
- `SANITY_*` for backend writes and image uploads

Configure the separate Studio repo with the same Sanity project id and dataset.

## Production Notes

### Build the frontend

```bash
npm run build
```

### Start the backend

```bash
npm start
```

### If frontend and API are on different domains

Set:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

## Checks

```bash
npm run lint
npm run test
npm run check
npm run build
```
