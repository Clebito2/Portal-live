
const admin = require('firebase-admin');

// Inicializar Firebase Admin
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

async function fixUserAccess() {
    const wrongEmail = "Brunoconsultoriamave@gmail.com";
    const correctEmail = "brunoconsultoriamave@gmail.com";

    console.log(`🔍 Buscando documento incorreto: ${wrongEmail}`);

    const wrongRef = db.collection('userMappings').doc(wrongEmail);
    const correctRef = db.collection('userMappings').doc(correctEmail);

    try {
        const doc = await wrongRef.get();

        if (doc.exists) {
            console.log('✅ Documento incorreto encontrado. Copiando dados...');
            const data = doc.data();

            const newData = {
                ...data,
                email: correctEmail,
                fixedAt: new Date().toISOString()
            };

            await correctRef.set(newData);
            console.log(`✅ Novo documento criado: ${correctEmail}`);

            await wrongRef.delete();
            console.log(`🗑️ Documento antigo removido: ${wrongEmail}`);

            console.log('🎉 SUCESSO! O acesso do usuário foi corrigido.');
        } else {
            console.log('⚠️ Documento com email maiúsculo não encontrado.');

            const docCorrect = await correctRef.get();
            if (docCorrect.exists) {
                console.log('✅ O documento correto JÁ EXISTE em minusculo. Verificando dados...');
            } else {
                console.log('❌ Nenhum documento encontrado. Criando novo...');
                await correctRef.set({
                    clientId: 'The_Catalyst',
                    email: correctEmail,
                    createdAt: new Date().toISOString(),
                    createdBy: 'script_fix'
                });
                console.log('✅ Documento criado manualmente.');
            }
        }
    } catch (error) {
        console.error('❌ Erro no script:', error);
        console.error('Verifique se você tem as credenciais configuradas (gcloud auth application-default login) ou se o firebase-admin esta instalado.');
    }
    process.exit(0);
}

fixUserAccess();
