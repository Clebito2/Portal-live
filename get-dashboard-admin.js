const admin = require('firebase-admin');
const fs = require('fs');

// Inicializar Firebase Admin usando credenciais do projeto
admin.initializeApp({
    projectId: 'ecossistema-live-d8fa5'
});

const db = admin.firestore();

async function getDashboard() {
    try {
        const docRef = db.collection('dashboards').doc('goianita');
        const doc = await docRef.get();

        if (doc.exists) {
            const data = doc.data();
            // Salvar em arquivo para análise
            fs.writeFileSync('goianita-current.html', data.html || '');
            console.log('✅ Dashboard salvo em goianita-current.html');
            console.log(`Tamanho: ${(data.html || '').length} caracteres`);
        } else {
            console.log('❌ Dashboard não encontrado');
        }
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
    process.exit(0);
}

getDashboard();
