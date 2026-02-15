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
console.log('User Role:', role);
const addItemFrom = sessionStorage.getItem('addItemFrom');
console.log('Add Item From:', addItemFrom);

const form = document.getElementById('addItemForm');
const total = document.getElementById('total');
const authorized = document.getElementById('authorized');
const unit = document.getElementById('unit');

function toNumber(value) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let totalValue = toNumber(form.total.value);
    const payload = {
        name: form.name.value.trim(),
        authorized: toNumber(form.authorized.value),
        unit: form.unit.value,
        total: totalValue,
        servicable: totalValue,
        unservicable: 0,
        issue: 0,
        instore: totalValue
    };
    console.table(payload);
    writeInventoryItem(payload.name, payload);
    form.reset();
    total.value = 0;
    authorized.value = 0;
    unit.value = "";
});

function checkInventoryItem(name) {
    const newname = name.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    let dbRef;
    if(role === 'engrnco') {
        dbRef = ref(db, 'engrinventory/main/' + newname);
    }
    else if(role === 'signco' || role === 'so') {
        dbRef = ref(db, 'siginventory/main/' + newname);
    }
    else if(role === 'mtnco' || role === 'mtjco' || role === 'mto') {
        dbRef = ref(db, 'mtinventory/main/' + newname);
    }
    else if(role === 'bqms' || role=== 'lo') {
        dbRef = ref(db, 'bqmsinventory/main/' + newname);
    }
    else if(role === 'bknco') {
        dbRef = ref(db, 'bkncoinventory/main/' + newname);
    }
    else if(role === 'workshop' || role === 'workshopnco') {
        dbRef = ref(db, 'workshop/main/' + newname);
    }
    else if(role === 'eo') {
        if(addItemFrom === 'engr') {
            dbRef = ref(db, 'engrinventory/main/' + newname);
        }
        else  if(addItemFrom ==="bknco") {
            dbRef = ref(db, 'bkncoinventory/main/' + newname);
        }
        else{
            console.error('Invalid add item source for EO:', addItemFrom);
            showNotification("Invalid source for adding item. Cannot check inventory item.", "error", "Check Failed");
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
            return;
        }
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot check inventory item.", "error", "Check Failed");
        setTimeout(() => {    
            window.location.href = 'index.html';
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
                unit: data.unit,
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
                unit: data.unit,
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
                unit: data.unit,
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
                unit: data.unit,
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
                    unit: data.unit,
                    authorized: data.authorized,
                    total: data.total,
                    servicable: data.servicable,
                    unservicable: data.unservicable,
                    issue: data.issue,
                    instore: data.instore
                });
            }
            else if(role === 'workshopnoc') {
                set(ref(db, 'officerapproval/new/workshop/' + newname),{
                    name: name,
                    unit: data.unit,
                    authorized: data.authorized,
                    total: data.total,
                    servicable: data.servicable,
                    unservicable: data.unservicable,
                    issue: data.issue,
                    instore: data.instore
                });
            }
            else if(role === 'eo') {
                if(addItemFrom === 'engr') {
                    set(ref(db, 'engrinventory/main/' + newname),{
                        name: name,
                        unit: data.unit,
                        authorized: data.authorized,
                        total: data.total,
                        servicable: data.servicable,
                        unservicable: data.unservicable,
                        issue: data.issue,
                        instore: data.instore
                    });
                    
                    set(ref(db, 'clo_cc_notifications/' + Date.now()),{
                        from: 'Engineering Inventory',
                        date: new Date().toISOString(),
                        msg: `New inventory item "${name}" has been added by Engineer Officer.`
                    });
                }
                else if(addItemFrom === "bknco"){
                    set(ref(db, 'bkncoinventory/main/' + newname),{
                        name: name,
                        unit: data.unit,
                        authorized: data.authorized,
                        total: data.total,
                        servicable: data.servicable,
                        unservicable: data.unservicable,
                        issue: data.issue,
                        instore: data.instore
                    });
                    set(ref(db, 'clo_cc_notifications/' + Date.now()),{
                        from: 'BKNCO Inventory',
                        date: new Date().toISOString(),
                        msg: `New inventory item "${name}" has been added by BKNCO Officer.`
                    });
                }

            }
            else if(role === 'so') {
                set(ref(db, 'siginventory/main/' + newname),{
                    name: name,
                    unit: data.unit,
                    authorized: data.authorized,
                    total: data.total,
                    servicable: data.servicable,
                    unservicable: data.unservicable,
                    issue: data.issue,
                    instore: data.instore
                });
                set(ref(db, 'clo_cc_notifications/' + Date.now()),{
                    from: 'Signal Inventory',
                    date: new Date().toISOString(),
                    msg: `New inventory item "${name}" has been added by Signal Officer.`
                });
            }
            else if(role === 'mto'){
                set(ref(db, 'mtinventory/main/' + newname),{
                    name: name,
                    unit: data.unit,
                    authorized: data.authorized,
                    total: data.total,
                    servicable: data.servicable,
                    unservicable: data.unservicable,
                    issue: data.issue,
                    instore: data.instore
                });
                set(ref(db, 'clo_cc_notifications/' + Date.now()),{
                    from: 'MT Inventory',
                    date: new Date().toISOString(),
                    msg: `New inventory item "${name}" has been added by  MT Officer.`
                });
            }
            else if(role === 'lo') {
                set(ref(db, 'bqmsinventory/main/' + newname),{
                    name: name,
                    unit: data.unit,
                    authorized: data.authorized,
                    total: data.total,
                    servicable: data.servicable,
                    unservicable: data.unservicable,
                    issue: data.issue,
                    instore: data.instore
                });
                set(ref(db, 'clo_cc_notifications/' + Date.now()),{
                    from: 'BQMS Inventory',
                    date: new Date().toISOString(),
                    msg: `New inventory item "${name}" has been added by  Logistics Officer.`
                });
            }
            else if(role === 'workshop') {
                set(ref(db, 'workshopinventory/main/' + newname),{
                    name: name,
                    unit: data.unit,
                    authorized: data.authorized,
                    total: data.total,
                    servicable: data.servicable,
                    unservicable: data.unservicable,
                    issue: data.issue,
                    instore: data.instore
                });
                set(ref(db, 'clo_cc_notifications/' + Date.now()),{
                    from: 'Workshop Inventory',
                    date: new Date().toISOString(),
                    msg: `New inventory item "${name}" has been added by Workshop Officer.`
                });
            }
            else {
                console.error('Invalid role:', role);
                showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
                window.location.href = 'index.html';
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