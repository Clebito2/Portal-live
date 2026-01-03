// Script para buscar dashboard do Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyBFihsqhdG6pbxAT27vUgHe0U3XQbaR1iM",
    authDomain: "ecossistema-live-d8fa5.firebaseapp.com",
    projectId: "ecossistema-live-d8fa5",
    storageBucket: "ecossistema-live-d8fa5.firebasestorage.app",
    messagingSenderId: "511169898560",
    appId: "1:511169898560:web:ecc593eeb951c50619d7a5",
    measurementId: "G-JEM7W7V4VN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getDashboard() {
    try {
        const docRef = doc(db, 'dashboards', 'goianita');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('SUCCESS:START');
            console.log(data.html);
            console.log('SUCCESS:END');
        } else {
            console.log('ERROR: Dashboard não encontrado');
        }
    } catch (error) {
        console.error('ERROR:', error.message);
    }
    process.exit(0);
}

getDashboard();
