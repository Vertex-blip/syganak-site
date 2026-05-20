/**
 * Safe Firebase Cloud Functions architecture for admin push notifications.
 *
 * This file is intentionally an example and is not imported by the Vite app.
 * Do not move Firebase Admin SDK credentials or FCM server keys into frontend code.
 *
 * Deployment sketch:
 * 1. Initialize Firebase Functions in this repository.
 * 2. Install firebase-admin and firebase-functions in the functions package.
 * 3. Copy this logic into functions/index.js or functions/src/index.js.
 * 4. Deploy with Firebase CLI after admin Firestore rules are deployed.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const sendAdminPush = async ({ title, body, clickAction }) => {
  const db = admin.firestore();
  const adminUsers = await db.collection('adminUsers').get();
  const tokenRefs = [];

  adminUsers.forEach((userDoc) => {
    tokenRefs.push(userDoc.ref.collection('notificationTokens').where('enabled', '==', true).get());
  });

  const tokenSnapshots = await Promise.all(tokenRefs);
  const tokens = tokenSnapshots
    .flatMap((snapshot) => snapshot.docs.map((doc) => doc.data().token))
    .filter(Boolean);

  if (!tokens.length) return;

  await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: {
      fcmOptions: { link: clickAction },
      notification: {
        icon: '/logo.png',
        badge: '/logo.png',
      },
    },
    data: {
      click_action: clickAction,
    },
  });
};

exports.notifyNewApplication = functions.firestore
  .document('applications/{id}')
  .onCreate((snapshot) => sendAdminPush({
    title: 'Жаңа өтінім келді',
    body: snapshot.data().fullName || 'Жаңа өтінім',
    clickAction: '/admin/applications',
  }));

exports.notifyNewInquiry = functions.firestore
  .document('inquiries/{id}')
  .onCreate((snapshot) => sendAdminPush({
    title: 'Жаңа сұраныс келді',
    body: snapshot.data().subject || snapshot.data().name || 'Жаңа сұраныс',
    clickAction: '/admin/inquiries',
  }));
