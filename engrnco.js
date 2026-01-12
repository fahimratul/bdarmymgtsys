import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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

let dataCache = {};
let currentEditKey = null;
const modal = document.getElementById('editModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editForm = document.getElementById('editForm');
const inputs = {
    name: document.getElementById('editName'),
    authorized: document.getElementById('editAuthorized'),
    banrdb7: document.getElementById('editBanrdb7'),
    banrdb8: document.getElementById('editBanrdb8'),
    total: document.getElementById('editTotal'),
    issue: document.getElementById('editIssue'),
    balance: document.getElementById('editBalance'),
};

function loaditemdata() {
    const dbRef = ref(db, 'engrinventory/');
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
                const banrdb7 = item.banrdb7 ?? 0;
                const banrdb8 = item.banrdb8 ?? 0;
                const total = item.total ?? (banrdb7 + banrdb8);
                const issue = item.issue ?? 0;
                const balance = item.balance ?? (total - issue);
                
                html += `<tr id="${name}" data-key="${key}">
                            <td>${serial}</td>
                            <td>${name}</td>
                            <td>${authorized}</td>
                            <td>${banrdb7}</td>
                            <td>${banrdb8}</td>
                            <td>${total}</td>
                            <td>${issue}</td>
                            <td>${balance}</td>
                            <td><button class="edit-btn" data-key="${key}">Edit</button></td>
                        </tr>`;
                serial += 1;
            }
        } else {
            html = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: #666;">No inventory data available</td></tr>';
        }
        
        tableBody.innerHTML = html;

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
    inputs.authorized.value = item.authorized ?? 0;
    inputs.banrdb7.value = item.banrdb7 ?? 0;
    inputs.banrdb8.value = item.banrdb8 ?? 0;
    inputs.issue.value = item.issue ?? 0;
    recalcModalTotals();

    modal.classList.remove('hidden');
}

function closeEditModal() {
    modal.classList.add('hidden');
    currentEditKey = null;
    editForm.reset();
    inputs.total.value = '';
    inputs.balance.value = '';
}

function recalcModalTotals() {
    const total = (Number(inputs.banrdb7.value) || 0) + (Number(inputs.banrdb8.value) || 0);
    const balance = total - (Number(inputs.issue.value) || 0);
    inputs.total.value = total;
    inputs.balance.value = Math.max(balance, 0);
}

[inputs.banrdb7, inputs.banrdb8, inputs.issue].forEach(el => {
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
        authorized: Number(inputs.authorized.value) || 0,
        banrdb7: Number(inputs.banrdb7.value) || 0,
        banrdb8: Number(inputs.banrdb8.value) || 0,
        issue: Number(inputs.issue.value) || 0,
    };
    updated.total = updated.banrdb7 + updated.banrdb8;
    updated.balance = Math.max(updated.total - updated.issue, 0);

    console.table({ key: currentEditKey, updated });
    alert('Edit captured. Wire this to Firebase update to persist changes.');
    closeEditModal();
});
