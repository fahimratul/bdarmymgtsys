import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, get, ref,set, update, remove, onValue } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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
    if( role_type !== 'officer' && role_type !== 'clo' && role_type !== 'cc'){ 
        console.error('Unauthorized role type:', role_type);
        alert('Unauthorized access. Please log in with the correct credentials.');
        window.location.href = 'login.html';
        return;
    }
    if (!baNumber) {
        console.error('BA Number not found in session storage.');
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

const urlparams = new URLSearchParams(window.location.search);
const typeKey = urlparams.get('key');

window.addEventListener('DOMContentLoaded', () => {
    const username=sessionStorage.getItem('username');
    const rank=sessionStorage.getItem('rank');
    const banumber=sessionStorage.getItem('baNumber');
    document.getElementById('username').textContent='Name: ' + username;
    document.getElementById('rank').textContent=ranklist[rank] ? 'Rank: ' + ranklist[rank] : 'Rank: ' + rank;
    document.getElementById('banumber').textContent='BA Number: ' + banumber;
    const titleElement = document.getElementById('title');
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



inputs.issue.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentEditKey) return;   
    if(typeKey === 'engr') {
        window.location.href = `itemdetails.html?key=${currentEditKey}&type=engrnco`;
    }
    window.location.href = `itemdetails.html?key=${currentEditKey}&type=bknco`;
});

inputs.unservicable.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentEditKey) return;
    if(typeKey === 'engr') {
        window.location.href = `itemdetails.html?key=${currentEditKey}&type=engrnco`;
    }
    window.location.href = `itemdetails.html?key=${currentEditKey}&type=bknco`;
});


function loaditemdata() {
     
    let dbRef;
    if(typeKey === 'engr') {
        dbRef = ref(db, 'engrinventory/');
    }
    else if(typeKey === 'bqms') {
        dbRef = ref(db, 'bkncoinventory/');
    }
    else {
        console.error('Invalid role:', role);
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
                
                html += `<tr class ="row-data" id="${name}" data-key="${key}" style="cursor: pointer;">
    
                            <td>${serial}</td>
                            <td>${name}</td>
                            <td>${authorized}</td>
                            <td>${total}</td>
                            <td>${issue}</td>
                            <td>${instore}</td>
                            <td>${servicable}</td>
                            <td>${unservicable}</td>
                            <td>
                            <button class="edit-btn" data-key='${key}'>Edit</button>
                            </td>

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
        document.getElementById('serial').textContent = serial-1;
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
        tableBody.querySelectorAll('.row-data').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.classList.contains('edit-btn')) return;
                const key = row.dataset.key;
                console.log("Row clicked for key:", key);
                typeKey === 'engr' ? window.location.href = `itemdetails.html?key=${key}&type=engrnco` : window.location.href = `itemdetails.html?key=${key}&type=bqms`;  
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
            tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: #e53e3e;">Error loading data. Please refresh the page.</td></tr>';
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

    if(typeKey === 'engr') {
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
    else if(typeKey === 'bqms') {    
        update(ref(db, 'bkncoinventory/' + currentEditKey), updated)
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
    
    if(typeKey === 'engr') {
        remove(ref(db, 'engrinventory/' + currentEditKey))
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
    else if(typeKey === 'bqms') {    
        remove(ref(db, 'bkncoinventory/' + currentEditKey))
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



let isssuenotificationDataCache = {};

const issuenotificationbody = document.getElementById('officer_notification_issue');
function loadissuenotifactions() {
    const dbRef = ref(db, 'issuepending/eo');
    get(dbRef).then((snapshot) => {
        isssuenotificationDataCache = snapshot.val();
        let html = '';
        issuenotificationbody.style.display='flex';
        if (isssuenotificationDataCache) {
            for (const key in isssuenotificationDataCache) {
                const notification = isssuenotificationDataCache[key];
                const message = notification.msg || '';
                html += `<div class="msg">
                        <p class="content">${message}<br><br> </p>
                        <button class="accept-btn" data-key="${key}">Accept</button>
                        <button class="reject-btn" data-key="${key}">Reject</button> 
                    </div>`;
            }
            issuenotificationbody.innerHTML = html;
            issuenotificationbody.style.minHeight='max-content';
            console.log("Notifications Loaded");
            console.log(isssuenotificationDataCache);
            // Attach accept/reject handlers
            issuenotificationbody.querySelectorAll('.accept-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.key;
                    acceptissue(key);
                    console.log('Accepted notification with key:', key);
                });
            });
            issuenotificationbody.querySelectorAll('.reject-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.key;
                    rejectissue(key);
                    console.log('Rejected notification with key:', key);
                });
            });
        }
    }).catch((error) => {
        console.error('Error loading notifications:', error);
    });
}


let unsvcnotificationDataCache = {};

const unsvcnotificationbody = document.getElementById('officer_notification_unsvc');
function loadunsvcnotifactions() {
    const dbRef = ref(db, 'unsvcpending/eo');
    get(dbRef).then((snapshot) => {
        unsvcnotificationDataCache = snapshot.val();
        let html = '';
        unsvcnotificationbody.style.display='flex';
        if (unsvcnotificationDataCache) {
            for (const key in unsvcnotificationDataCache) {
                const notification = unsvcnotificationDataCache[key];
                const message = notification.msg || '';
                html += `<div class="msg">
                        <p class="content">${message}<br><br> </p>
                        <button class="accept-btn" data-key="${key}">Accept</button>
                        <button class="reject-btn" data-key="${key}">Reject</button> 
                    </div>`;
            }
            unsvcnotificationbody.innerHTML = html;
            unsvcnotificationbody.style.minHeight='max-content';
            console.log("Notifications Loaded");
            console.log(unsvcnotificationDataCache);
            // Attach accept/reject handlers
            unsvcnotificationbody.querySelectorAll('.accept-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.key;
                    acceptunsvc(key);
                    console.log('Accepted notification with key:', key);
                });
            });
            unsvcnotificationbody.querySelectorAll('.reject-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.key;
                    rejectunsvc(key);
                    console.log('Rejected notification with key:', key);
                });
            });
        }
    }).catch((error) => {
        console.error('Error loading notifications:', error);
    });
} 


if(role==='eo'){
    loadissuenotifactions();
    loadunsvcnotifactions();
}
const issueModal = document.getElementById('issuelistModal');

function acceptissue(key){
    issuenotificationbody.innerHTML = '';
    const issueitem = isssuenotificationDataCache[key];
    const mainitem = dataCache[key];
    if(!issueitem) return;
    const quantity = issueitem.quantity || 0;
    const newissue = (mainitem.issue || 0) + quantity;
    const newInstore = (mainitem.instore || 0) - quantity;
    update(ref(db, 'engrinventory/' + key), {
        issue: newissue,
        instore: newInstore
    }).then(() => {
        console.log('Issue accepted and inventory updated');        
    }).catch((error) => {
        console.error('Error updating inventory for issue acceptance:', error);
    });

    set(ref(db, 'engrinventory/' + key + '/history/'+ Date.now()), {
        date: issueitem.date || '',
        quantity: issueitem.quantity || 0,
        location: issueitem.location || '',
        person: issueitem.person || '',
        issued_by: issueitem.issued_by || '',
    }).then(() => {
        console.log('Issue history recorded successfully');
    }).catch((error) => {
        console.error('Error recording issue history:', error);
    });
    remove(ref(db, 'issuepending/eo/' + key)).then(() => {
        console.log('Issue notification removed successfully');
    }).catch((error) => {
        console.error('Error removing issue notification:', error);
    });
    setTimeout(() => {
        loadissuenotifactions();
        loaditemdata();
        showNotification('Issue request accepted and inventory updated.', 'success', 'Issue Accepted');
    }, 500);
}
function rejectissue(key){
    issuenotificationbody.innerHTML = '';
    remove(ref(db, 'issuepending/eo/' + key)).then(() => {
        console.log('Issue notification removed successfully');
    }).catch((error) => {
        console.error('Error removing issue notification:', error);
    });
    setTimeout(() => {
        showNotification('Issue request rejected.', 'info', 'Issue Rejected');
        loadissuenotifactions();
    }, 500);
}

function acceptunsvc(key){
    unsvcnotificationbody.innerHTML = '';
    const unsvcitem = unsvcnotificationDataCache[key];
    const mainitem = dataCache[key];
    console.log(mainitem, unsvcitem);
    if(!unsvcitem) return;
    const quantity = unsvcitem.quantity || 0;
    const newunservicable = (mainitem.unservicable || 0) + quantity;
    const newservicable = (mainitem.servicable || 0) - quantity;
    
    remove(ref(db, 'unsvcpending/eo/' + key)).then(() => {
        console.log('Unservicable notification removed successfully');
    }).catch((error) => {
        console.error('Error removing unservicable notification:', error);
    });
    update(ref(db, 'engrinventory/' + key), {
        unservicable: newunservicable,
        servicable: newservicable
    }).then(() => {
        console.log('Unservicable accepted and inventory updated');        
    }).catch((error) => {
        console.error('Error updating inventory for unservicable acceptance:', error);
    });
    set(ref(db, 'engrinventory/' + key + '/unsvc/'+ Date.now()), {
        date: unsvcitem.date || '',
        quantity: unsvcitem.quantity || 0,
        reason: unsvcitem.reason || '',
        marked_by: unsvcitem.marked_by || '',
    }).then(() => {
        console.log('Unservicable history recorded successfully');
    }).catch((error) => {
        console.error('Error recording unservicable history:', error);
    });
    setTimeout(() => {
        showNotification('Unservicable request accepted and inventory updated.', 'success', 'Unservicable Accepted');
        loaditemdata();
        loadunsvcnotifactions();
    }, 700);
    loaditemdata();
    loadissuenotifactions();
}
function rejectunsvc(key){
    unsvcnotificationbody.innerHTML = '';
    remove(ref(db, 'unsvcpending/eo/' + key)).then(() => {
        console.log('Unservicable notification removed successfully');
    }).catch((error) => {
        console.error('Error removing unservicable notification:', error);
    });
    setTimeout(() => {
        showNotification('Unservicable request rejected.', 'info', 'Unservicable Rejected');
        loadunsvcnotifactions();
    }, 700);
    loadissuenotifactions();
    loadunsvcnotifactions();
}
