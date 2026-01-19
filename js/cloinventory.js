import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, get, ref,set, update, remove } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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

window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    let role_type = sessionStorage.getItem('role_type');
    if (!role_type) { 
        console.error('Role type not found in session storage.');
        alert('Session expired or unauthorized access. Please log in again.');
        window.location.href = 'login.html';
        return;
    }
    if( role_type !== 'cc' && role_type !== 'clo') { 
        console.error('Unauthorized role type:', role_type);
        alert('Unauthorized access. Please log in with the correct credentials.');
        window.location.href = 'login.html';
        return;
    }
    if (!baNumber) {
        console.error('BA Number not found in local storage.');
        alert('Session expired. Please log in again.');
        window.location.href = 'login.html';
        return;
    }
    console.log('Logged in as BA Number:', baNumber);
});
let ranklist ={
    lt:"Lieutenant",
    capt:"Captain",
    major:"Major",
    ltcol:"Lieutenant Colonel",
    col:"Colonel",
    brig:"Brigadier",
    majorgen:"Major General",
    ltgen:"Lieutenant General",
    gen:"General"
};

 
const role = sessionStorage.getItem('role');
const dept = sessionStorage.getItem('dept');


window.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('title');
    if (dept === 'engr') {
        titleElement.textContent = 'Engineer  Inventory Management';
    } 
    else if (dept === 'sig') {
        titleElement.textContent = 'Signal  Inventory Management';
    }
    else if (dept === 'mt') {
        titleElement.textContent = 'Military Transport Inventory Management';
    }
    else if (dept === 'bknco') {
        titleElement.textContent = 'Barrack  Inventory Management';
    }
    else if (dept === 'bqms') {
        titleElement.textContent = 'BQMS  Inventory Management';
    }
    else {
        console.error('Invalid role: a', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        window.location.href = 'login.html';
        return;
    }
    
});

window.addEventListener('DOMContentLoaded', () => {
    const username=sessionStorage.getItem('username');
    const rank=sessionStorage.getItem('rank');
    const banumber=sessionStorage.getItem('baNumber');
    document.getElementById('username').textContent='Name: ' + username;
    document.getElementById('rank').textContent=ranklist[rank] ? 'Rank: ' + ranklist[rank] : 'Rank: ' + rank;
    document.getElementById('banumber').textContent='BA Number: ' + banumber;
    const titleElement = document.getElementById('title');
    if(role === 'cc'){
        
        titleElement.textContent = 'Welcome , Contingent Commander';
    }
    else if(role === 'clo'){
        
        titleElement.textContent = 'Welcome , Cheif Logistic Officer';
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        window.location.href = 'login.html';
        return;
    }
    
});

import {showNotification} from './notification.js';

console.log("Officer Script Loaded");

let dataCache = {};
let pendingissueCache = {};
let newitemCache = {};

let currentEditKey = null;
const modal = document.getElementById('editModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const deleteItemBtn = document.getElementById('deleteItemBtn');
const editForm = document.getElementById('editForm');
const inputs = {
    name: document.getElementById('editName'),
    authorized: document.getElementById('editAuthorized'),
    total: document.getElementById('edittotal'),
    servicable: document.getElementById('editServicable'),
    unservicable: document.getElementById('editunservicable'),
    issue: document.getElementById('editIssue'),
    instore: document.getElementById('editInstore'),
    deleteitem: document.getElementById('deleteitem')
};




function loaditemdata() {
    let datainfo={
        total:0,
        servicable:0,
        unservicable:0,
        issue:0,
        instore:0
    };
    let dbRef;
    if(dept === 'engr') {
        dbRef = ref(db, 'engrinventory/');
    }
    else if(dept === 'sig') {
        dbRef = ref(db, 'siginventory/');
    }
    else if(dept === 'mt') {
        dbRef = ref(db, 'mtinventory/');
    }
    else if(dept === 'bknco') {
        dbRef = ref(db, 'bkncoinventory/');
    }
    else if(dept === 'bqms') {
        dbRef = ref(db, 'bqmsinventory/');
    }
    else {
        console.error('Invalid role: asda', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        alert('Invalid role. Please log in again.');
        window.location.href = 'login.html';
        return;
    }
    const loadingOverlay = document.getElementById('loadingOverlay');

    get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        dataCache = data || {};
        let serial = 1;
        const tableBody = document.getElementById('itemTableBody');
        
        if (!tableBody) {
            console.error('itemTableBody element not found');
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            return;
        }
        
        let html = '';
        
        // Build table rows
        if (data) {
            for (const key in data) {
                const item = data[key];
                const name = item.name || '';
                const authorized = item.authorized ?? '';
                const total = item.total ?? 0;
                const servicable = item.servicable ?? 0;
                const unservicable = item.unservicable ?? 0;
                const issue = item.issue ?? 0;
                const instore = item.instore ?? 0;
                
                html += `<tr id="${name}" data-key="${key}">
                            <td>${serial}</td>
                            <td>${name}</td>
                            <td>${authorized}</td>
                            <td>${total}</td>
                            <td>${issue}</td>
                            <td>${instore}</td>
                            <td>${servicable}</td>
                            <td>${unservicable}</td>
                        </tr>`;
                serial += 1;
                datainfo.total+=total;
                datainfo.servicable+=servicable;
                datainfo.unservicable+=unservicable;
                datainfo.issue+=issue;
                datainfo.instore+=instore;
            }
        } else {
            html = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: #666;">No inventory data available</td></tr>';
        }
        
        tableBody.innerHTML = html;
        document.getElementById('totalItems').textContent = datainfo.total;
        document.getElementById('servicableItems').textContent = datainfo.servicable;
        document.getElementById('unservicableItems').textContent = datainfo.unservicable;
        document.getElementById('issuedItems').textContent = datainfo.issue;
        document.getElementById('inStoreItems').textContent = datainfo.instore;
            
        // Attach edit handlers
        tableBody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                console.log("Edit button clicked for key:", key);
                openEditModal(key);
            });
        });
        
        // Hide loading overlay after data is loaded
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    }).catch((error) => {
        console.error('Error loading data:', error);
        const tableBody = document.getElementById('itemTableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #e53e3e;">Error loading data. Please refresh the page.</td></tr>';
        }
        // Hide loading overlay even on error
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    });
}



loaditemdata();
console.log("Loading Pending Issued Items for Approval");


function searchItems() {
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('itemTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    const searchTerm = searchInput.value.toLowerCase();

    Array.from(rows).forEach(row => {
        const itemName = row.getAttribute('id');
        if (itemName && itemName.toLowerCase().includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        } 
    });
}

document.getElementById('searchInput')?.addEventListener('keyup', searchItems);

const logoutButton = document.getElementById('logoutButton');



logoutButton?.addEventListener('click', () => {
    sessionStorage.removeItem('baNumber');
    sessionStorage.removeItem('role_type');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('rank');
    window.location.href = 'index.html';
});
