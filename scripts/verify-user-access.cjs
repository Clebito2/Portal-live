const admin = require('firebase-admin');

try {
    admin.initializeApp({
        projectId: 'ecossistema-live-d8fa5'
    });
} catch (e) {
    if (!admin.apps.length) process.exit(1);
}

const db = admin.firestore();
const USER_EMAIL = 'marianaoliveira.eng@hotmail.com';

async function verify() {
    console.log(`Checking ${USER_EMAIL}...`);
    const doc = await db.collection('userMappings').doc(USER_EMAIL).get();
    if (!doc.exists) {
        console.log('User doc NOT found.');
    } else {
        console.log('User Data:', JSON.stringify(doc.data(), null, 2));
    }
}

verify();
