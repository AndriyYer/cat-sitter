import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBx18uVCKFVIipoXteiyWdC_-G97BpRWAo",
    authDomain: "cat-sitting-99e29.firebaseapp.com",
    databaseURL: "https://cat-sitting-99e29-default-rtdb.firebaseio.com",
    projectId: "cat-sitting-99e29",
    storageBucket: "cat-sitting-99e29.firebasestorage.app",
    messagingSenderId: "664911380539",
    appId: "1:664911380539:web:86c0c730731e309ac55c1e",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const getTomorrowsCatSitters = () => {
    return new Promise((resolve, reject) => {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 10);

        const dateKey = tomorrow.toISOString().split("T")[0];
        const dayRef = ref(db, `calendar/${dateKey}`);
        onValue(
            dayRef,
            (snapshot) => {
                const data = snapshot.val();
                resolve(data);
            },
            reject
        );
    });
};
