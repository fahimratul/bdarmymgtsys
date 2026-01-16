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
    if( role_type !== 'officer'){ 
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


window.addEventListener('DOMContentLoaded', () => {
    const username=sessionStorage.getItem('username');
    const rank=sessionStorage.getItem('rank');
    const banumber=sessionStorage.getItem('baNumber');
    document.getElementById('username').textContent='Name: ' + username;
    document.getElementById('rank').textContent=ranklist[rank] ? 'Rank: ' + ranklist[rank] : 'Rank: ' + rank;
    document.getElementById('banumber').textContent='BA Number: ' + banumber;
    if(!username || !rank || !banumber){
        alert('Session expired. Please log in again.');
        window.location.href = 'login.html';
    }
    if (!role || role !== 'lo') {
        console.error('Unauthorized role:', role);
        alert('Session expired. Please log in again.');
        window.location.href = 'login.html';
    }

});


import {showNotification} from './notification.js';

console.log("Officer Script Loaded");

let dataCacheBQMS = {};
let dataCacheBKNCO = {};
let pendingissueCacheBQMS = {};
let newitemCacheBQMS = {};
let pendingissueCacheBKNCO = {};
let newitemCacheBKNCO = {};

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

function loaditemdataBQMS() {
    let datainfo={
        total:0,
        servicable:0,
        unservicable:0,
        issue:0,
        instore:0
    };
    let dbRef = ref(db, 'bqmsinventory/');
    const loadingOverlay = document.getElementById('loadingOverlay');

    get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        dataCacheBQMS = data || {};
        let serial = 1;
        const tableBody = document.getElementById('itemTableBodyBQMS');
        
        if (!tableBody) {
            console.error('itemTableBodyBQMS element not found');
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
        const tableBody = document.getElementById('itemTableBodyBQMS');
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

function loaditemdataBKNCO() {
    let datainfo={
        total:0,
        servicable:0,
        unservicable:0,
        issue:0,
        instore:0
    };
    let dbRef = ref(db, 'bkncoinventory/');
    const loadingOverlay = document.getElementById('loadingOverlay');

    get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        dataCacheBKNCO = data || {};
        let serial = 1;
        const tableBody = document.getElementById('itemTableBodyBKNCO');
        
        if (!tableBody) {
            console.error('itemTableBodyBKNCO element not found');
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
        document.getElementById('totalItemsBKNCO').textContent = datainfo.total;
        document.getElementById('servicableItemsBKNCO').textContent = datainfo.servicable;
        document.getElementById('unservicableItemsBKNCO').textContent = datainfo.unservicable;
        document.getElementById('issuedItemsBKNCO').textContent = datainfo.issue;
        document.getElementById('inStoreItemsBKNCO').textContent = datainfo.instore;
            
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
        const tableBody = document.getElementById('itemTableBodyBKNCO');
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


function loadpendingissueditemdata() {
    let dbRef;
    let dbPendingRef;
    get(dbPendingRef).then((snapshot) => {
        const data = snapshot.val();
        pendingissueCache= data || {};
        let serial = 1;
        const pendingissueitemdiv = document.getElementById('pendingIssuedItemforApproval');
        const tableBody = document.getElementById('pendingIssuedItemTableBody');
        
        if (!tableBody) {
            console.error('itemTableBody element not found');
            return;
        }
        
        let html = '';
        
        // Build table rows
        if (data) {
            for (const key in data) {
                const item = data[key];
                const mainItemData = dataCache[key] || {};
                html += `<tr id="${item.name}" data-key="${key}">
                            <td rowspan="2">${serial}</td>
                            <td>${mainItemData.name}</td>
                            <td>${mainItemData.authorized}</td>
                            <td>${mainItemData.total}</td>
                            <td>${mainItemData.servicable}</td>
                            <td>${mainItemData.unservicable}</td>
                            <td>${mainItemData.issue}</td>
                            <td>${mainItemData.instore}</td>
                            <td rowspan="2">
                            <button class="pendingbtn edit" data-key='${key}'>Edit</button>
                                <button class="pendingbtn approve" data-key='${key}'>Approve</button>
                                <button class="pendingbtn danger" data-key='${key}'>Reject</button>
                            </td>
                        </tr>
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.authorized}</td>
                            <td>${item.total}</td>
                            <td>${item.servicable}</td>
                            <td>${item.unservicable}</td>
                            <td>${item.issue}</td>
                            <td>${item.instore}</td>
                        </tr>`;
                serial += 1;
            }
        } else {
            pendingissueitemdiv.style.display='none';    
        }
        
        tableBody.innerHTML = html;

        tableBody.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                openEditModal(key);
            });
        });
        tableBody.querySelectorAll('.approve').forEach(btn => {
            btn.addEventListener('click', () => {
                showNotification("Approving issued item...", "info", "Please Wait");
                const key = btn.dataset.key;
                approveIssuedItem(key);
            });
        });
        tableBody.querySelectorAll('.danger').forEach(btn => {
            btn.addEventListener('click', () => {
                showNotification("Rejecting issued item...", "info", "Please Wait");
                const key = btn.dataset.key;
                rejectIssuedItem(key);
            });
        });
        
    }).catch((error) => {
        console.error('Error loading data:', error);
    }
    );
}

function loadnewitemdata() {
    let dbRef;
    const loadingOverlay = document.getElementById('loadingOverlay');

    get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        newitemCache = data || {};
        let serial = 1;
        const divNewItem = document.getElementById('pendingNewItemforApproval');
        const tableBody = document.getElementById('pendingNewItemTableBody');
        
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
                            <button class="pendingbtn edit" data-key='${key}'>Edit</button>
                                <button class="pendingbtn approve" data-key='${key}'>Approve</button>
                                <button class="pendingbtn danger" data-key='${key}'>Reject</button>
                            </td>
                        </tr>`;
                serial += 1;
            }
        } else {
            divNewItem.style.display='none';
        }
        
        tableBody.innerHTML = html;
        tableBody.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                openEditModal(key);
            });
        });
        tableBody.querySelectorAll('.approve').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                approveNewItem(key, newitemCache[key]);
            });
        });
        tableBody.querySelectorAll('.danger').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                rejectNewItem(key);
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
        const tableBody = document.getElementById('pendingNewItemTableBody');
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




loaditemdataBQMS();
loaditemdataBKNCO();
console.log("Loading Pending Issued Items for Approval");
// loadpendingissueditemdata();
// console.log("Loading New Items for Approval");
// loadnewitemdata();


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
        update(ref(db, 'cloapproval/issue/engrinventory/' + currentEditKey), updated)
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
        update(ref(db, 'cloapproval/issue/siginventory/' + currentEditKey), updated)
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
        update(ref(db, 'cloapproval/issue/mtinventory/' + currentEditKey), updated)
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
        window.location.href = 'login.html';
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
        remove(ref(db, 'cloapproval/delete/engrinventory/' + currentEditKey))
            .then(() => {
                console.log('Data deleted successfully');
                showNotification('Inventory item is pending for deletion.', 'success', 'Deletion Successful');
                loaditemdata();
            })
            .catch((error) => {
                console.error('Error deleting data:', error);
                showNotification('Error deleting item. Please try again.', 'error', 'Deletion Failed');
            });

    }
    else if(role === 'so') {    
        remove(ref(db, 'cloapproval/delete/siginventory/' + currentEditKey))
        .then(() => {
            console.log('Data deleted successfully');
            showNotification('Inventory item is pending for deletion.', 'success', 'Deletion Successful');
            loaditemdata();
        })
        .catch((error) => {
            console.error('Error deleting data:', error);
            showNotification('Error deleting item. Please try again.', 'error', 'Deletion Failed');
        });
    }
    else{
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        alert('Invalid role. Please log in again.');
        window.location.href = 'login.html';
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


function approveNewItem(key, data) {
    let dbremoveRef;
    if(role === 'eo') {
        set(ref(db, 'cloapproval/new/engrinventory/' + key),{
            name: data.name,
            authorized: data.authorized,
            total: data.total,
            servicable: data.servicable,
            unservicable: data.unservicable,
            issue: data.issue,
            instore: data.instore
        });
        dbremoveRef = ref(db, 'officerapproval/new/engrinventory/' + key);
        showNotification("Item approved successfully! Waiting For Cheif Logistic Officer's Approval", "success", "Success");
    }
    else if(role === 'so') {
        set(ref(db, 'cloapproval/new/siginventory/' + key),{
            name: data.name,
            authorized: data.authorized,
            total: data.total,
            servicable: data.servicable,
            unservicable: data.unservicable,
            issue: data.issue,
            instore: data.instore
        });
        dbremoveRef = ref(db, 'officerapproval/new/siginventory/' + key);
        showNotification("Item approved successfully! Waiting For Cheif Logistic Officer's Approval", "success", "Success");
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        window.location.href = 'login.html';
        return;
    }
    remove(dbremoveRef)
    .then(() => {
        console.log('Pending new item removed successfully after approval');
    })
    .catch((error) => {
        console.error('Error removing pending new item:', error);
    });
    loadnewitemdata();
}


function approveIssuedItem(key, data) {
    let dbremoveRef;
    if(role === 'eo') {
        set(ref(db, 'cloapproval/issue/engrinventory/' + key),{
            name: data.name,
            authorized: data.authorized,
            total: data.total,
            servicable: data.servicable,
            unservicable: data.unservicable,
            issue: data.issue,
            instore: data.instore
        });
        dbremoveRef = ref(db, 'officerapproval/issue/engrinventory/' + key);
        showNotification("Item approved successfully! Waiting For Cheif Logistic Officer's Approval", "success", "Success");
    }
    else if(role === 'so') {
        set(ref(db, 'cloapproval/issue/siginventory/' + key),{
            name: data.name,
            authorized: data.authorized,
            total: data.total,
            servicable: data.servicable,
            unservicable: data.unservicable,
            issue: data.issue,
            instore: data.instore
        });
        dbremoveRef = ref(db, 'officerapproval/issue/siginventory/' + key);
        showNotification("Item approved successfully! Waiting For Cheif Logistic Officer's Approval", "success", "Success");
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        window.location.href = 'login.html';
        return;
    }
    remove(dbremoveRef)
    .then(() => {
        console.log('Pending issued item removed successfully after approval');
    })
    .catch((error) => {
        console.error('Error removing pending new item:', error);
    });
    loadpendingissueditemdata();
}

function rejectNewItem(key) {
    let dbremoveRef;
    if(role === 'eo') {
        dbremoveRef = ref(db, 'officerapproval/new/engrinventory/' + key);
    }
    else if(role === 'so') {
        dbremoveRef = ref(db, 'officerapproval/new/siginventory/' + key);
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        window.location.href = 'login.html';
        return;
    }
    remove(dbremoveRef)
    .then(() => {
        console.log('Pending new item removed successfully after rejection');
        showNotification("Item rejected successfully!", "success", "Success");
        loadnewitemdata();
    })
    .catch((error) => {
        console.error('Error removing pending new item:', error);
    });
    loadnewitemdata();
}


function rejectIssuedItem(key) {
    let dbremoveRef;
    if(role === 'eo') {
        dbremoveRef = ref(db, 'officerapproval/issue/engrinventory/' + key);
    }
    else if(role === 'so') {
        dbremoveRef = ref(db, 'officerapproval/issue/siginventory/' + key);
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        window.location.href = 'login.html';
        return;
    }
    remove(dbremoveRef)
    .then(() => {
        console.log('Pending issued item removed successfully after rejection');
        showNotification("Item rejected successfully!", "success", "Success");
        loadpendingissueditemdata();
    })
    .catch((error) => {
        console.error('Error removing pending issued item:', error);
    });
    loadpendingissueditemdata();
}


document.getElementById('viewbqms')?.addEventListener('click', () => {
    document.getElementById('bqmsInventory').style.display='flex';
    loaditemdataBQMS();
    document.getElementById('bkncoInventory').style.display='none';
    document.getElementById('viewbqms').classList.remove('deactive');
    document.getElementById('viewbqms').classList.add('primary');
    document.getElementById('viewbknco').classList.remove('primary');
    document.getElementById('viewbknco').classList.add('deactive');
});

document.getElementById('viewbknco')?.addEventListener('click', () => {
    document.getElementById('bkncoInventory').style.display='flex';
    document.getElementById('viewbqms').classList.remove('primary');
    document.getElementById('viewbqms').classList.add('deactive');
    document.getElementById('viewbknco').classList.remove('deactive');
    document.getElementById('viewbknco').classList.add('primary');
    loaditemdataBKNCO();
    document.getElementById('bqmsInventory').style.display='none';
});