const admin = require('firebase-admin');

// Initialize Firebase Admin with Application Default Credentials
try {
    if (!admin.apps.length) {
        admin.initializeApp({
            projectId: 'ecossistema-live-d8fa5'
        });
    }
} catch (e) {
    console.error('Erro ao inicializar Firebase:', e);
    process.exit(1);
}

const db = admin.firestore();

async function updateMarianaAccess() {
    const email = 'marianaoliveira.eng@hotmail.com';
    const normalizedEmail = email.toLowerCase();

    console.log(`Checking mapping for ${email}...`);

    try {
        const docRef = db.collection('userMappings').doc(normalizedEmail);
        const doc = await docRef.get();

        const data = {
            email: normalizedEmail,
            clientId: 'The_Catalyst', // Primary
            clientIds: ['The_Catalyst', 'lideranca'], // Multi-access
            createdBy: 'SystemScript',
            role: 'client',
            updatedAt: new Date().toISOString()
        };

        if (doc.exists) {
            console.log('Document exists. Updating...');
            await docRef.set(data, { merge: true });
        } else {
            console.log('Document does not exist. Creating...');
            await docRef.set({
                createdAt: new Date().toISOString(),
                ...data
            });
        }

        console.log('✅ Success! User mapping updated in Firestore.');
        console.log('New Data:', data);

    } catch (error) {
        console.error('❌ Error updating user mapping:', error);
    }
    process.exit(0);
}

updateMarianaAccess();
