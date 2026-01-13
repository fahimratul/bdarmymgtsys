import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, set, get, ref} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


const firebaseConfig = {
apiKey: "AIzaSyCIX-3-GunSudlllY-dFRo943ysFXtBiOk",
authDomain: "bdarmystoremgt.firebaseapp.com",
databaseURL: "https://bdarmystoremgt-default-rtdb.firebaseio.com",
projectId: "bdarmystoremgt",
storageBucket: "bdarmystoremgt.firebasestorage.app",
messagingSenderId: "960978586847",
appId: "1:960978586847:web:afcee2217a1c3c876ead6a",
measurementId: "G-H27M1SNMPX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
console.log("Firebase Initialized");




function writeInventoryItem(name, authorized, total, servicable, unservicable, issue, instore) {
    const newname = name.replace(/[\s/#$\[\].]+/g, '_').toLowerCase();
        set(ref(db, 'mtinventory/' + newname),{
                name: name,
                authorized: authorized,
                total: total,
                servicable: servicable,
                unservicable: unservicable,
                issue: issue,
                instore: instore
            });
            console.log("Inventory item added:", newname);
} 
