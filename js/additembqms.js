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

import {showNotification} from './notification.js';

console.log("Add Item Script Loaded");

window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    if (!baNumber) {
        console.error('BA Number not found in session storage.');
        window.location.href = 'index.html';
        return;
    }
    console.log('Logged in as BA Number:', baNumber);
});



const form = document.getElementById('addItemForm');
const total = document.getElementById('total');
const servicable = document.getElementById('servicable');
const issue = document.getElementById('issue');
const unservicable = document.getElementById('unservicable');
const instore = document.getElementById('instore');

function toNumber(value) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function recalc() {
    if(toNumber(servicable.value) > toNumber(total.value)) {
        showNotification('Servicable quantity cannot exceed Total quantity. Adjusting Servicable to match Total.', 'warning', 'Input Adjusted');
        servicable.value = total.value;
    }
    if(toNumber(issue.value) > toNumber(servicable.value)) {
        showNotification('Issue quantity cannot exceed Servicable quantity. Adjusting Issue to match Servicable.', 'warning', 'Input Adjusted');
        issue.value = servicable.value;
    }
    const unservicableValue = toNumber(total.value)-toNumber(servicable.value);

    const instoreValue = toNumber(total.value) - toNumber(issue.value);
    unservicable.value = Math.max(unservicableValue, 0);
    instore.value = Math.max(instoreValue, 0);
}

[total, servicable, issue].forEach(input => {
    input.addEventListener('input', recalc);
});

recalc();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    recalc();

    const payload = {
        name: form.name.value.trim(),
        authorized: form.authorized.value.trim(),
        total: toNumber(form.total.value),
        servicable: toNumber(form.servicable.value),
        unservicable: toNumber(form.unservicable.value),
        issue: toNumber(form.issue.value),
        instore: toNumber(form.instore.value)
    };
    console.table(payload);
    writeInventoryItem(payload.name, payload);
    form.reset();
    total.value = 0;
    servicable.value = 0;
    issue.value = 0;
    recalc();
});

function checkInventoryItem(name) {
    const dbRef = ref(db, 'bqmsinventory/' + name);
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
            console.log("Item with this name already exists:", newname);
            showNotification("Item with this name already exists. Please choose a different name.", "error", "Error");
        } else {
            set(ref(db, 'bqmsinventory/' + newname),{
                name: name,
                authorized: data.authorized,
                total: data.total,
                servicable: data.servicable,
                unservicable: data.unservicable,
                issue: data.issue,
                instore: data.instore
            });
            console.log("Inventory item added:", newname);
            showNotification("Item added successfully!", "success", "Success");
        }   
        }).catch((error) => {   
            console.error("Error checking item existence:", error);
            showNotification("Error adding item. Please try again.", "error", "Error");
        });
}