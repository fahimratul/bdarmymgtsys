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

console.log("Add Item Script Loaded");


function writeInventoryItem(name, unit, total) {
    const newname = name.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    set(ref(db, 'siginventory/main/' + newname),{
        name: name,
        unit: unit,
        authorized: 0,
        total: total,
        servicable: total,
        unservicable: 0,
        issue: 0,
        instore: total
    }).then(() => {
        console.log("Item Added Successfully");
    }).catch((error) => {
        console.error("Error adding item: ", error);
    });
}