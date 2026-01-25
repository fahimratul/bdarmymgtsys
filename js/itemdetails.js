import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase,set, get, ref, update } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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
getAnalytics(app);
const db = getDatabase(app);
console.log(db);
console.log("Firebase Initialized");
let itemKey = null;
let typeKey = null;
let role = sessionStorage.getItem('role');

window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    if (!baNumber) {
        console.error('BA Number not found in local storage.');
        window.location.href = 'login.html';
        return;
    }

    console.log('Logged in as BA Number:', baNumber);
});
 


import {showNotification} from './notification.js';
console.log("Script Loaded");

let dataCache = {};
let currentEditKey = null;



function loaditemsdetails() {
    const urlparams = new URLSearchParams(window.location.search);
    itemKey = urlparams.get('key');
    typeKey = urlparams.get('type');
    console.log('Item Key:', itemKey);
    console.log('Type Key:', typeKey);
    let dbRef ;
    if(typeKey === 'engr'){
        dbRef = ref(db, `engrinventory/`+ itemKey);
    }
    else if(typeKey === 'sig'){
        dbRef = ref(db, `siginventory/`+ itemKey);
    }
    else if(typeKey === 'bknco'){
        dbRef = ref(db, `bkncoinventory/`+ itemKey);
    }
    else if (typeKey === 'bqms'){
        dbRef = ref(db, `bqmsinventory/`+ itemKey);
    }
    else if( typeKey === 'mt'){
        dbRef = ref(db, `mtinventory/`+ itemKey);
    }
    else{
        console.error('Invalid type key:', typeKey);
        return;
    }
    const loadingOverlay = document.getElementById('loadingOverlay');
    get(dbRef).then((snapshot) => {
        dataCache = snapshot.val();
        
        if (dataCache) {
            console.log('Vehicle Data:', dataCache);
            document.getElementById('typeofitem').textContent = dataCache.name || 'N/A';
            document.getElementById('authorized').textContent = dataCache.authorized || 'N/A';
            document.getElementById('held').textContent = dataCache.total || 'N/A';
            document.getElementById('issued').textContent = dataCache.issued || 'N/A';
            document.getElementById('instore').textContent = dataCache.instore || 'N/A';
            document.getElementById('servicable').textContent = dataCache.servicable || 'N/A';
            document.getElementById('unservicable').textContent = dataCache.unservicable || 'N/A';
        } else {
            console.log('No vehicle data available');
        }      
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    }).catch((error) => {
        console.error('Error loading data:', error);
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    });
}



loaditemsdetails();

let itemhistoryCache = {};
function loaditemhistory() {
let dbRef ;
    if(typeKey === 'engr'){
        dbRef = ref(db, `engrinventory/`+ itemKey + `/history`);
    }
    else if(typeKey === 'sig'){
        dbRef = ref(db, `siginventory/`+ itemKey + `/history`);
    }
    else if(typeKey === 'bknco'){
        dbRef = ref(db, `bkncoinventory/`+ itemKey + `/history`);
    }
    else if (typeKey === 'bqms'){
        dbRef = ref(db, `bqmsinventory/`+ itemKey + `/history`);
    }
    else if( typeKey === 'mt'){
        dbRef = ref(db, `mtinventory/`+ itemKey + `/history`);
    }
    else{
        console.error('Invalid type key:', typeKey);
        return;
    }
    const loadingOverlay = document.getElementById('loadingOverlay');
    get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        itemhistoryCache = data || {};
        const tableBody = document.getElementById('history-tbody');
        
        if (!tableBody) {
            console.error('History TableBody element not found');
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            return;
        }
        
        let html = '';
        
        // Build table rows
        if (data) {
            for (const key in data) {
                const record = data[key];
                console.log('History Record:', record, key);
                html += `<tr>
                    <td>${key}</td>
                    <td>${record.date || ''}</td>
                    <td>${record.person || ''}</td>
                    <td>${record.location || ''}</td>
                    <td>${record.quantity || ''}</td>
                    <td><button class="edit-btn" data-key="${key}">Return to Store</button></td>
                </tr>`;
                
                // Format date 
            }
        } else {
            html = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #666;">No history data available</td></tr>';
        }
        tableBody.innerHTML = html; 
        // Attach event listeners to edit buttons
        const editButtons = tableBody.querySelectorAll('.edit-btn');
        editButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const recordKey = e.target.getAttribute('data-key');
                returnItemToStore(recordKey);
            });
        });   
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    }).catch((error) => {
        console.error('Error loading data:', error);
        const tableBody = document.getElementById('history-tbody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #e53e3e;">Error loading data. Please refresh the page.</td></tr>';
        }
        // Hide loading overlay even on error
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    });
}

loaditemhistory();


const issuemodal = document.getElementById('issueModal');
const issueModalCloseBtn = document.getElementById('issueModalCloseBtn');
const cancelIssueBtn = document.getElementById('cancelIssueBtn');
const issueForm = document.getElementById('issueForm');
const issueitembtn = document.getElementById('issueitem');
const markasunservicable = document.getElementById('markasunservicable');


function openIssueModal() {
    document.getElementById('issuedate').valueAsDate = new Date();
    issuemodal.classList.remove('hidden');
}

issueitembtn.addEventListener('click', () => {
    openIssueModal();
});

function closeIssueModal() {
    issuemodal.classList.add('hidden');
}

issueModalCloseBtn.addEventListener('click', closeIssueModal);
cancelIssueBtn.addEventListener('click', closeIssueModal);


function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

issueForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('issuedate').value;
    const person = document.getElementById('issueperson').value;
    const location = document.getElementById('issuelocation').value;
    const quantity = parseInt(document.getElementById('issuequantity').value, 10);
    if (quantity > dataCache.instore) {
        showNotification('Error: Quantity exceeds instore amount', 'error');
        return;
    }
    const newIssued = (dataCache.issued || 0) + quantity;
    const newInstore = (dataCache.instore || 0) - quantity;
    let dbRef ;
    if(typeKey === 'engr'){
        dbRef = ref(db, `engrinventory/`+ itemKey);
    }
    else if(typeKey === 'sig'){
        dbRef = ref(db, `siginventory/`+ itemKey);
    }
    else if(typeKey === 'bknco'){
        dbRef = ref(db, `bkncoinventory/`+ itemKey);
    }
    else if (typeKey === 'bqms'){
        dbRef = ref(db, `bqmsinventory/`+ itemKey);
    }
    else if( typeKey === 'mt'){
        dbRef = ref(db, `mtinventory/`+ itemKey);
    }
    const updates = {};
    updates['issued'] = newIssued;
    updates['instore'] = newInstore;
    const historyKey = `history/${Date.now()}`;
    updates[historyKey] = {
        date: date,
        person: person,
        location: location,
        quantity: quantity
    };
    update(dbRef, updates)
        .then(() => {
            showNotification('Item issued successfully', 'success');
            closeIssueModal();
            loaditemhistory();
        })
        .catch((error) => {
            console.error('Error issuing item:', error);
            showNotification('Error issuing item. Please try again.', 'error');
        });
    set(ref(db, 'clo_cc_notification/'+Date.now()), {
        msg: `Item Issued: ${dataCache.name}, Quantity: ${quantity} to ${person} , Location: ${location}`,
    });
});