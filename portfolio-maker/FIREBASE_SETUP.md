# Firebase data structure

## Firestore

`portfolios/{uid}`

- `profile`: profile, resume, SNS, and theme form values
- `projects`: project cards with Storage image URLs
- `updatedAt`: server timestamp

Only the authenticated owner can read or write this document.

## Storage

`portfolio-images/{uid}/{fileName}`

Only the authenticated owner can read or upload images. Uploads are limited to image files under 10 MB.

## Deployment

1. Copy `firebase-config.example.js` to `firebase-config.js` and enter the Web app configuration.
2. Copy `.firebaserc.example` to `.firebaserc` and enter the project ID.
3. Enable a Firebase Authentication provider before connecting the browser app.
4. Run `npx firebase-tools deploy --only firestore,storage`.
