import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { writeFileSync } from 'fs';

// Inicializar Firebase Admin
initializeApp({
    projectId: 'ecossistema-live-d8fa5'
});

const db = getFirestore();

async function getDashboard(clientId) {
    try {
        const docRef = db.collection('dashboards').doc(clientId);
        const doc = await docRef.get();

        if (doc.exists) {
            const data = doc.data();
            const filename = `${clientId}-current.html`;
            writeFileSync(filename, data.html || '');
            console.log(`✅ Dashboard salvo em ${filename}`);
            console.log(`Tamanho: ${(data.html || '').length} caracteres`);
            return data.html;
        } else {
            console.log('❌ Dashboard não encontrado');
            return null;
        }
    } catch (error) {
        console.error('❌ Erro:', error.message);
        return null;
    }
}

const clientId = process.argv[2] || 'goianita';
await getDashboard(clientId);
process.exit(0);
