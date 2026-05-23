# Production Security Notes

## Environment Files

Keep real secrets in Vercel environment variables or local-only files such as `.env.local`. Do not commit `.env`, `.env.local`, service account JSON files, Firebase Admin SDK keys, `.vercel`, `dist`, or `node_modules`.

If any generated or secret files were ever tracked, remove them from the repository index without deleting local copies:

```bash
git rm --cached .env .env.local
git rm -r --cached dist node_modules .vercel
git rm --cached *service-account*.json *serviceAccount*.json *firebase-admin*.json *adminsdk*.json
git commit -m "Remove generated and secret files from repository"
```

Rotate any secret that was committed before. Removing it from Git history is a separate incident-response task.

## Firebase App Check

The frontend initializes Firebase App Check when `VITE_FIREBASE_RECAPTCHA_ENTERPRISE_SITE_KEY` is configured. Start in Firebase Console monitor mode, verify legitimate traffic, then enforce App Check for Firestore and Storage.

TODO before enforcement:

- Add the production domain in Firebase App Check.
- Set `VITE_FIREBASE_RECAPTCHA_ENTERPRISE_SITE_KEY` in Vercel production and preview environments.
- Use `VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN` only for local development and never commit it.
- After monitoring shows expected traffic, enable enforcement for Firestore and Storage.

## Frontend Visibility

Production assets are minified and hashed, sourcemaps are disabled, and console/debugger calls are dropped. Frontend code cannot be fully hidden in a browser app; the primary security boundary is Firebase Rules, App Check, and server-side/backend validation.
