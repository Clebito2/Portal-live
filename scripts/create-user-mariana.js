
const admin = require('firebase-admin');

// Inicializar Firebase Admin
// Tenta usar credenciais do ambiente ou padrão
try {
    // Verifica se já existe app inicializado
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
const auth = admin.auth();

async function createUserAndLink() {
    const email = "marianaoliveira.eng@hotmail.com";
    const password = "tempPassword123!"; // Senha temporária, pode ser alterada depois
    const clientId = "The_Catalyst";
    const normalizedEmail = email.toLowerCase();

    console.log(`🚀 Iniciando criação do usuário: ${email}`);

    // 1. Criar ou validar usuário no Firebase Authentication
    let userRecord;
    try {
        try {
            userRecord = await auth.getUserByEmail(email);
            console.log('✅ Usuário já existe no Authentication:', userRecord.uid);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log('👤 Criando novo usuário no Authentication...');
                userRecord = await auth.createUser({
                    email: email,
                    password: password,
                    emailVerified: true
                });
                console.log('✅ Usuário criado com sucesso:', userRecord.uid);
                console.log('🔑 Senha temporária definida:', password);
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('❌ Falha na etapa de Authentication:', error);
        process.exit(1);
    }

    // 2. Criar ou corrigir mapeamento no Firestore
    try {
        console.log(`📝 Verificando mapeamento no Firestore para ${normalizedEmail}...`);

        const mappingRef = db.collection('userMappings').doc(normalizedEmail);
        const doc = await mappingRef.get();

        const mappingData = {
            email: normalizedEmail,
            clientId: clientId,
            createdAt: new Date().toISOString(),
            createdBy: 'script_admin_fix',
            uid: userRecord.uid // Link opcional mas útil
        };

        if (doc.exists) {
            const currentData = doc.data();
            console.log('⚠️ Mapeamento já existe. Atualizando para garantir dados corretos...');
            console.log('Antigo:', currentData);
            await mappingRef.set(mappingData, { merge: true });
        } else {
            console.log('✨ Mapeamento não encontrado. Criando novo...');
            await mappingRef.set(mappingData);
        }

        console.log('✅ Mapeamento salvo com sucesso no Firestore.');
        console.log('Dados:', mappingData);

    } catch (error) {
        console.error('❌ Falha ao criar mapeamento no Firestore:', error);
        process.exit(1);
    }

    console.log('\n🎉 FALAR PARA O USUÁRIO:');
    console.log(`Usuário: ${email}`);
    console.log(`Senha (se criado agora): ${password}`);
    console.log(`Acesso liberado para: ${clientId}`);

    process.exit(0);
}

createUserAndLink();
