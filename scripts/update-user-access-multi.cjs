const admin = require('firebase-admin');

// Inicializar Firebase Admin (usando Default Credentials)
try {
    admin.initializeApp({
        projectId: 'ecossistema-live-d8fa5'
    });
} catch (e) {
    if (!admin.apps.length) {
        console.error('Erro ao inicializar Firebase:', e);
        process.exit(1);
    }
}

const db = admin.firestore();

const USER_EMAIL = 'marianaoliveira.eng@hotmail.com';
/* 
  Access IDs: 
  'The_Catalyst' (Already exists)
  'lideranca' (Liderança Antifrágil)
*/
const CLIENT_IDS = ['The_Catalyst', 'lideranca'];
const PRIMARY_CLIENT = 'The_Catalyst';

async function main() {
    try {
        console.log(`🔍 Atualizando acesso para ${USER_EMAIL}...`);

        const userRef = db.collection('userMappings').doc(USER_EMAIL);

        // Verifica se o usuário existe
        const doc = await userRef.get();
        if (!doc.exists) {
            console.log('⚠️ Usuário não encontrado. Criando novo mapeamento...');
        } else {
            console.log('✅ Usuário encontrado.');
        }

        await userRef.set({
            email: USER_EMAIL,
            clientId: PRIMARY_CLIENT, // Cliente padrão (fallback)
            clientIds: CLIENT_IDS,     // Nova lista de acesso
            updatedAt: new Date().toISOString(),
            updatedBy: 'script-multi-access'
        }, { merge: true });

        console.log('🎉 Permissões atualizadas com sucesso!');
        console.log(`📧 Usuário: ${USER_EMAIL}`);
        console.log(`🔐 Acesso concedido a: ${CLIENT_IDS.join(', ')}`);

    } catch (error) {
        console.error('❌ Erro ao atualizar permissões:', error);
    }
}

main();
