# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Firebase persistence

This project can persist study data to Firebase Firestore (in addition to localStorage fallback).

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill Firebase web config values.
3. In Firebase Console, create a Firestore database.
4. Start the app and data will sync using document `app_data/main`.

> Note: current sync uses a single shared document. For per-user isolation, the next step is enabling Firebase Auth and scoping by `uid`.

## Firebase Hosting

This repo is configured for Firebase Hosting on project `missao-prfestacio`.

1. Build the app with `npm run build`.
2. Log in to Firebase CLI with `firebase login`.
3. Deploy Hosting with `npm run firebase:deploy:prod`.

Local helpers included in this repo:

- `dev-local.cmd`: runs Vite dev server using the bundled local Node runtime.
- `preview-local.cmd`: runs Vite preview using the bundled local Node runtime.
- `firebase-local.cmd login`: opens Firebase CLI login using the bundled local Node runtime.
- `firebase-local.cmd deploy --only hosting`: deploys Hosting using the bundled local Node runtime.

Hosting config details:

- build output: `dist`
- SPA rewrite: all routes serve `/index.html`
- Firebase project alias: `missao-prfestacio`
