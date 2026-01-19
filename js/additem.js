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

import {showNotification} from './notification.js';

console.log("Add Item Script Loaded");

window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    let roleType = sessionStorage.getItem('role_type');
    console.log('Role Type from sessionStorage:', roleType);
    
    if (!baNumber) {
        console.error('BA Number not found in session storage.');
        window.location.href = 'index.html';
        return;
    }
    console.log('Logged in as BA Number:', baNumber);

});

const role = sessionStorage.getItem('role');
const loAddItemRole = sessionStorage.getItem('lo_add_item_role');


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
    const newname = name.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    let dbRef;
    if(role === 'engrnco' || role === 'eo') {
        dbRef = ref(db, 'engrinventory/' + newname);
    }
    else if(role === 'signco' || role === 'so') {
        dbRef = ref(db, 'siginventory/' + newname);
    }
    else if(role === 'mtnco' || role === 'mtjco' || role === 'mto') {
        dbRef = ref(db, 'mtinventory/' + newname);
    }
    else if(role === 'bqms') {
        dbRef = ref(db, 'bqmsinventory/' + newname);
    }
    else if(role === 'bknco') {
        dbRef = ref(db, 'bkncoinventory/' + newname);
    }
    else if(role === 'lo') {
        if(loAddItemRole === 'bqms') {
            dbRef = ref(db, 'bqmsinventory/' + newname);
        }
        else if(loAddItemRole === 'bknco') {
            dbRef = ref(db, 'bkncoinventory/' + newname);
        }
        else {
            console.error('Invalid LO add item role:', loAddItemRole);
            showNotification("Invalid role. Cannot check inventory item.", "error", "Check Failed");
            setTimeout(() => {    
                window.location.href = 'login.html';
            }, 500);
            return;
        }
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot check inventory item.", "error", "Check Failed");
        setTimeout(() => {    
            window.location.href = 'login.html';
        }, 500);
        return;
    }
    return get(dbRef).then((snapshot) => {
        return snapshot.exists();
    }).catch((error) => {
        console.error(error);
        return false;
    });
}

function writeInventoryItem(name, data) {
    const newname = name.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    checkInventoryItem(newname).then((exists) => {
        if (exists) {
            console.log("Item with this name already exists:", newname);
            showNotification("Item with this name already exists. Please choose a different name.", "error", "Error");
        } else {    
            if(role === 'engrnco') {
                set(ref(db, 'officerapproval/new/engrinventory/' + newname),{
                name: name,
                authorized: data.authorized,
                total: data.total,
                servicable: data.servicable,
                unservicable: data.unservicable,
                issue: data.issue,
                instore: data.instore
            });
            }
            else if(role === 'signco') {
                set(ref(db, 'officerapproval/new/siginventory/' + newname),{
                name: name,
                authorized: data.authorized,
                total: data.total,
                servicable: data.servicable,
                unservicable: data.unservicable,
                issue: data.issue,
                instore: data.instore
            });
            }
            else if(role === 'mtnco' || role === 'mtjco') {
                set(ref(db, 'officerapproval/new/mtinventory/' + newname),{
                name: name,
                authorized: data.authorized,
                total: data.total,
                servicable: data.servicable,
                unservicable: data.unservicable,
                issue: data.issue,
                instore: data.instore
            });
            }
            else if(role === 'bqms') {
                set(ref(db, 'officerapproval/new/bqmsinventory/' + newname),{
                name: name,
                authorized: data.authorized,
                total: data.total,
                servicable: data.servicable,
                unservicable: data.unservicable,
                issue: data.issue,
                instore: data.instore
            });
            }
            else if(role === 'bknco') {
                set(ref(db, 'officerapproval/new/bkncoinventory/' + newname),{
                name: name,
                authorized: data.authorized,
                total: data.total,
                servicable: data.servicable,
                unservicable: data.unservicable,
                issue: data.issue,
                instore: data.instore
            });
            }
            else if(role === 'eo') {
                set(ref(db, 'cloapproval/new/engrinventory/' + newname),{
                name: name,
                authorized: data.authorized,
                total: data.total,
                servicable: data.servicable,
                unservicable: data.unservicable,
                issue: data.issue,
                instore: data.instore
            });
            }
            else if(role === 'so') {
                set(ref(db, 'cloapproval/new/siginventory/' + newname),{
                name: name,
                authorized: data.authorized,
                total: data.total,
                servicable: data.servicable,
                unservicable: data.unservicable,
                issue: data.issue,
                instore: data.instore
            });
            }
            else if(role === 'mto'){
                set(ref(db, 'cloapproval/new/mtinventory/' + newname),{
                name: name,
                authorized: data.authorized,
                total: data.total,
                servicable: data.servicable,
                unservicable: data.unservicable,
                issue: data.issue,
                instore: data.instore
            });
            }
            else if(role === 'lo') {
                if(loAddItemRole === 'bqms') {
                    set(ref(db, 'cloapproval/new/bqmsinventory/' + newname),{
                    name: name,
                    authorized: data.authorized,
                    total: data.total,
                    servicable: data.servicable,
                    unservicable: data.unservicable,
                    issue: data.issue,
                    instore: data.instore
                });
                }
                else if(loAddItemRole === 'bknco') {
                    set(ref(db, 'cloapproval/new/bkncoinventory/' + newname),{
                    name: name,
                    authorized: data.authorized,
                    total: data.total,
                    servicable: data.servicable,
                    unservicable: data.unservicable,
                    issue: data.issue,
                    instore: data.instore
                });
                }
            }
            else {
                console.error('Invalid role:', role);
                showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
                window.location.href = 'login.html';
                return;
            }
            console.log("Inventory item added:", newname);
            showNotification("Item added successfully!", "success", "Success");
        }   
        }).catch((error) => {   
            console.error("Error checking item existence:", error);
            showNotification("Error adding item. Please try again.", "error", "Error");
        });
}