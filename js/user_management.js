import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, get, ref, remove } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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
    let roleType = sessionStorage.getItem('role_type');
    console.log('Role Type from sessionStorage:', roleType);
    if (!roleType || roleType !== 'officer') {
        console.error('Unauthorized access. Redirecting to login.');
        window.location.href = 'login.html';
        return;
    }
    if (!baNumber) {
        console.error('BA Number not found in local storage.');
        window.location.href = 'login.html';
        return;
    }
    console.log('Logged in as BA Number:', baNumber);
});

let userrole ={
    engrnco:"Storeman (Engineer)",
    signco:"Storeman (Signal)",
    bqms:"Battalion Quartermaster Sergeant",
    bknco:"Barrack NCO",
    mtnco:"MT NCO",
    mtjco:"MT JCO",
    cc:"Contingent Commander",
    clo:"Cheif Logistics Officer",
    lo:"Logistics Officer",
    so:"Signals Officer",
    eo:"Engineer Officer",
    mto:"Military Transport Officer"
}

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
}

import {showNotification} from './notification.js';
console.log("User management Script Loaded");

let role = sessionStorage.getItem('role');

function loaditemdata() {
    const dbRef = ref(db, 'users/');
    const loadingOverlay = document.getElementById('loadingOverlay');
    let undercommandrole = {};
    if(role === 'eo'){
        undercommandrole = ['engrnco'];
    }
    else if(role === 'so'){
        undercommandrole = ['signco'];
    }
    else if (role === 'lo'){
        undercommandrole = ['bqms', 'bknco'];
    }
    else if (role === 'mto'){
        undercommandrole = ['mtnco', 'mtjco'];
    }
    else{
        undercommandrole = null; // CLO and above can see all
    }


    get(dbRef).then((snapshot) => {
        const data = snapshot.val();
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
                if (undercommandrole && !undercommandrole.includes(item.role)) {
                    continue; // Skip users not under command
                }
                const banumber = item.baNumber || '';
                const rank = item.rank || '';
                const name = item.name || '';
                const role = item.role || '';
                html += `<tr id="${banumber}" data-key="${key}">
                            <td>${serial}</td>
                            <td>${banumber}</td>
                            <td>${ranklist[rank] || rank}</td>
                            <td>${name}</td>
                            <td>${userrole[role] || role}</td>
                            <td><button class="delete-btn" id="delete-btn" data-key='${key}'>Delete</button></td>
                        </tr>`;
                serial += 1;
            }
        } else {
            html = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: #666;">No inventory data available</td></tr>';
        }
        
        tableBody.innerHTML = html;
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

document.getElementById('itemTableBody')?.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'delete-btn') {
        const key = event.target.getAttribute('data-key');
        if (key) {
            deleteUser(key);
        } else {
            console.error('No key found for deletion');
        }
    }
});

function deleteUser(key) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }   
    const userRef = ref(db, 'users/' + key);
    remove(userRef).then(() => {
        showNotification('User deleted successfully', 'success');
        loaditemdata();
    }).catch((error) => {
        console.error('Error deleting user:', error);
        showNotification('Error deleting user. Please try again.', 'error');
    });
}




