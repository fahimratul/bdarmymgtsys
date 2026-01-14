import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, get, ref, update, remove } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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
        window.location.href = 'storeman_login.html';
        return;
    }
    if( role_type !== 'officer'){ 
        console.error('Unauthorized role type:', role_type);
        alert('Unauthorized access. Please log in with the correct credentials.');
        window.location.href = 'storeman_login.html';
        return;
    }
    if (!baNumber) {
        console.error('BA Number not found in local storage.');
        alert('Session expired. Please log in again.');
        window.location.href = 'storeman_login.html';
        return;
    }
    console.log('Logged in as BA Number:', baNumber);
});

let ranklist ={
    snk:"Sainik",
    lcpl:"Lance Corporal",
    cpl:"Corporal",
    sgt:"Sergeant",
    wo:"Warrant Officer",
    swo:"Senior Warrant Officer",
    mwo:"Master Warrant Officer",
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


// Clear sessionStorage when the site is closed
 
const role = sessionStorage.getItem('role');


window.addEventListener('DOMContentLoaded', () => {
    const username=sessionStorage.getItem('username');
    const rank=sessionStorage.getItem('rank');
    const banumber=sessionStorage.getItem('baNumber');
    document.getElementById('username').textContent='Name: ' + username;
    document.getElementById('rank').textContent=ranklist[rank] ? 'Rank: ' + ranklist[rank] : 'Rank: ' + rank;
    document.getElementById('banumber').textContent='BA Number: ' + banumber;
    const titleElement = document.getElementById('title');
    if (role === 'eo') {
        titleElement.textContent = 'Engineer Officer Inventory Management';
    } 
    else if (role === 'so') {
        titleElement.textContent = 'Signal Officer Inventory Management';
    }
    else if (role === 'mto') {
        titleElement.textContent = 'Military Transport Officer Inventory Management';
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        window.location.href = 'storeman_login.html';
        return;
    }
    
});


import {showNotification} from './notification.js';

console.log("Officer Script Loaded");

let dataCache = {};
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
    if(role === 'eo') {
        dbRef = ref(db, 'engrinventory/');
    }
    else if(role === 'so') {
        dbRef = ref(db, 'siginventory/');
    }
    else if(role === 'mto') {
        dbRef = ref(db, 'mtinventory/');
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        alert('Invalid role. Please log in again.');
        window.location.href = 'storeman_login.html';
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
                            <td>${servicable}</td>
                            <td>${unservicable}</td>
                            <td>${issue}</td>
                            <td>${instore}</td>
                            <td>
                            <button class="edit-btn" data-key='${key}'>Edit</button></td>
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

function openEditModal(key) {
    const item = dataCache?.[key];
    if (!item) return;
    currentEditKey = key;

    inputs.name.value = item.name || '';
    inputs.authorized.value = item.authorized ?? 'NOS';
    inputs.total.value = item.total ?? 0;
    inputs.servicable.value = item.servicable ?? 0;
    inputs.unservicable.value = item.unservicable ?? 0;
    inputs.issue.value = item.issue ?? 0;
    inputs.instore.value = item.instore ?? 0;
    recalcModalTotals();

    modal.classList.remove('hidden');
}

function closeEditModal() {
    modal.classList.add('hidden');
    currentEditKey = null;
    editForm.reset();
    inputs.total.value = '';
    inputs.servicable.value = '';
    inputs.unservicable.value = '';
    inputs.issue.value = '';
    inputs.instore.value = '';
}

function recalcModalTotals() {
    if(Number(inputs.servicable.value) > Number(inputs.total.value)) {
        showNotification('Servicable quantity cannot exceed Total quantity. Adjusting Servicable to match Total.', 'warning', 'Input Adjusted');
        inputs.servicable.value = inputs.total.value;
    }
    if(Number(inputs.issue.value) > Number(inputs.servicable.value)) {
        showNotification('Issued quantity cannot exceed Servicable quantity. Adjusting Issued to match Servicable.', 'warning', 'Input Adjusted');
        inputs.issue.value = inputs.servicable.value;
    }
    const unservicable = (Number(inputs.total.value) || 0) - (Number(inputs.servicable.value) || 0);
    const instore = (Number(inputs.total.value) || 0) - (Number(inputs.issue.value) || 0);
    inputs.unservicable.value = Math.max(unservicable, 0);
    inputs.instore.value = Math.max(instore, 0);
}

[inputs.total, inputs.servicable, inputs.issue].forEach(el => {
    el.addEventListener('input', recalcModalTotals);
});

modalCloseBtn?.addEventListener('click', closeEditModal);
cancelEditBtn?.addEventListener('click', closeEditModal);
modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeEditModal();
});

editForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentEditKey) return;

    const updated = {
        ...dataCache[currentEditKey],
        name: inputs.name.value.trim(),
        authorized: inputs.authorized.value,
        total: Number(inputs.total.value) || 0,
        servicable: Number(inputs.servicable.value) || 0,
        issue: Number(inputs.issue.value) || 0,
        unservicable: Number(inputs.unservicable.value) || 0,
        instore: Number(inputs.instore.value) || 0
    };
    updated.unservicable = updated.total - updated.servicable;
    updated.instore = Math.max(updated.total - updated.issue, 0);

    console.table({ key: currentEditKey, updated });

    if(role === 'eo') {
        update(ref(db, 'engrinventory/' + currentEditKey), updated)
            .then(() => {
                console.log('Data updated successfully');
                showNotification('Inventory item updated successfully.', 'success', 'Update Successful');

                loaditemdata();
            })
            .catch((error) => {
                console.error('Error updating data:', error);
            }); 

    }
    else if(role === 'so') {    
        update(ref(db, 'siginventory/' + currentEditKey), updated)
        .then(() => {
            console.log('Data updated successfully');
            showNotification('Inventory item updated successfully.', 'success', 'Update Successful');

            loaditemdata();
        })
        .catch((error) => {
            console.error('Error updating data:', error);
        }); 
    }
    else if(role === 'mto') {
        update(ref(db, 'mtinventory/' + currentEditKey), updated)
        .then(() => {
            console.log('Data updated successfully');
            showNotification('Inventory item updated successfully.', 'success', 'Update Successful');

            loaditemdata();
        })
        .catch((error) => {
            console.error('Error updating data:', error);
        }); 
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        alert('Invalid role. Please log in again.');
        window.location.href = 'storeman_login.html';
        return;
    }
    closeEditModal();
});

deleteItemBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentEditKey) return;
    if (inputs.deleteitem.value.trim() !== 'CONFIRM') {
        showNotification("To delete the item, please type 'CONFIRM' in the delete field.", "error", "Deletion Failed");
        return;
    }
    
    if(role === 'eo') {
        remove(ref(db, 'engrinventory/' + currentEditKey))
            .then(() => {
                console.log('Data deleted successfully');
                showNotification('Inventory item deleted successfully.', 'success', 'Deletion Successful');
                loaditemdata();
            })
            .catch((error) => {
                console.error('Error deleting data:', error);
                showNotification('Error deleting item. Please try again.', 'error', 'Deletion Failed');
            });

    }
    else if(role === 'so') {    
        remove(ref(db, 'siginventory/' + currentEditKey))
        .then(() => {
            console.log('Data deleted successfully');
            showNotification('Inventory item deleted successfully.', 'success', 'Deletion Successful');
            loaditemdata();
        })
        .catch((error) => {
            console.error('Error deleting data:', error);
            showNotification('Error deleting item. Please try again.', 'error', 'Deletion Failed');
        });
    }
    else if(role === 'mto') {
        remove(ref(db, 'mtinventory/' + currentEditKey))
        .then(() => {
            console.log('Data deleted successfully');
            showNotification('Inventory item deleted successfully.', 'success', 'Deletion Successful');
            loaditemdata();
        })
        .catch((error) => {
            console.error('Error deleting data:', error);
            showNotification('Error deleting item. Please try again.', 'error', 'Deletion Failed');
        });
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        alert('Invalid role. Please log in again.');
        window.location.href = 'storeman_login.html';
        return;
    }
    closeEditModal();
});


const logoutButton = document.getElementById('logoutButton');



logoutButton?.addEventListener('click', () => {
    sessionStorage.removeItem('baNumber');
    sessionStorage.removeItem('role_type');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('rank');
    window.location.href = 'index.html';
});



