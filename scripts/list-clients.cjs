const admin = require('firebase-admin');

// Inicializar Firebase Admin
try {
    admin.initializeApp({
        projectId: 'ecossistema-live-d8fa5'
    });
} catch (e) {
    if (!admin.apps.length) {
        process.exit(1);
    }
}

const db = admin.firestore();

async function listClients() {
    console.log('Fetching all clients...');
    try {
        const snapshot = await db.collection('clients').get();
        if (snapshot.empty) {
            console.log('No clients found in Firestore.');
            return;
        }

        console.log('--- CLIENTS IN DB ---');
        snapshot.forEach(doc => {
            console.log(`ID: ${doc.id}, Name: ${doc.data().name}`);
        });
        console.log('---------------------');
    } catch (error) {
        console.error('Error listing clients:', error);
    }
}

listClients();
