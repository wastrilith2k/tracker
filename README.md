# Tracker

A React TypeScript app for tracking events and viewing metrics. Uses Firebase for authentication, Statsig for dynamic configuration, and AWS API Gateway + DynamoDB for event storage and metrics.

## Project Structure

```
tracker/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── config/         # Firebase, AWS, and Statsig configs
│   │   ├── components/     # Shared UI components
│   │   ├── screens/        # Page components (Main, Item, Metrics, Login)
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tsconfig.json
├── lambdas/                # AWS Lambda reference code
│   ├── trackerFunc.js      # Event logging and metrics queries
│   ├── eventsHandler.js    # Event CRUD operations
│   ├── getNamesAndEvents.js
│   └── namesHandler.js     # Name CRUD operations
├── scripts/
│   └── sync-env.sh         # Push .env values to GitHub Secrets / Firebase
├── .github/workflows/      # Firebase Hosting CI/CD
├── firebase.json
├── apphosting.yaml
└── .firebaserc
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd tracker
   ```

2. Install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Create `frontend/.env` with the required variables:
   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_FIREBASE_MEASUREMENT_ID=
   VITE_AWS_INVOKE_URL=
   VITE_STATSIG_CLIENT_KEY=
   VITE_STATSIG_USER_ID=
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Syncing Secrets

The sync script pushes `frontend/.env` values to GitHub Secrets and optionally the Firebase service account:

```bash
# Push everything to GitHub Secrets
bash scripts/sync-env.sh --github-only

# Dry run to see what would be pushed
bash scripts/sync-env.sh --dry-run
```

The service account JSON is stored separately in `frontend/service-account.json` (gitignored) and synced automatically by the script.

## Linting and Formatting

```
cd frontend
npm run lint
npm run format
```
