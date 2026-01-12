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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
console.log(db);
console.log("Firebase Initialized");


const form = document.getElementById('addItemForm');
const banrdb7 = document.getElementById('banrdb7');
const banrdb8 = document.getElementById('banrdb8');
const issue = document.getElementById('issue');
const total = document.getElementById('total');
const balance = document.getElementById('balance');

function toNumber(value) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function recalc() {
    const t = toNumber(banrdb7.value) + toNumber(banrdb8.value);
    const bal = t - toNumber(issue.value);
    total.value = Math.max(t, 0);
    balance.value = Math.max(bal, 0);
}

[banrdb7, banrdb8, issue].forEach(input => {
    input.addEventListener('input', recalc);
});

recalc();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    recalc();

    const payload = {
        name: form.name.value.trim(),
        authorized: form.authorized.value.trim(),
        banrdb7: toNumber(form.banrdb7.value),
        banrdb8: toNumber(form.banrdb8.value),
        issue: toNumber(form.issue.value),
        total: toNumber(total.value),
        balance: toNumber(balance.value)
    };

    console.table(payload);
    writeInventoryItem(payload.name, payload);
    form.reset();
    banrdb7.value = 0;
    banrdb8.value = 0;
    issue.value = 0;
    recalc();
});

function checkInventoryItem(name) {
    const dbRef = ref(db, 'engrinventory/' + name);
    return get(dbRef).then((snapshot) => {
        return snapshot.exists();
    }).catch((error) => {
        console.error(error);
        return false;
    });
}

function writeInventoryItem(name, data) {
    const newname = name.replace(/[\s/]+/g, '_').toLowerCase();
    checkInventoryItem(newname).then((exists) => {
        if (exists) {
            alert("Item with this name already exists!");
        } else {
            set(ref(db, 'engrinventory/' + newname),{
                name: name,
                authorized: data.authorized,
                banrdb7: data.banrdb7,
                banrdb8: data.banrdb8,
                issue: data.issue,
                total: data.total,
                balance: data.balance
            });
            console.log("Inventory item added:", newname);
            alert("Item added successfully!");
        }   
        }).catch((error) => {   
            console.error("Error checking item existence:", error);
            alert("Error adding item. Please try again.");
        });
}   