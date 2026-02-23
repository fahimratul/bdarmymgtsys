import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, get, ref, update , remove} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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

let allowedRoles = ['lo', 'cc', 'clo', 'ammonco'];

window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    let role = sessionStorage.getItem('role');
    console.log('User role:', role);
    if (!allowedRoles.includes(role)) {
        console.error('Unauthorized role for ammonco. Access denied.');
        window.location.href = 'index.html';return;
    }
    if (!baNumber) {
        console.error('BA Number not found in local storage.');
        window.location.href = 'index.html';return;
    }
    console.log('Logged in as BA Number:', baNumber);
});
 


import {showNotification} from '../../js/notification.js';
console.log("Script Loaded");


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

const role = sessionStorage.getItem('role');


window.addEventListener('DOMContentLoaded', () => {
    const username=sessionStorage.getItem('username');
    const rank=sessionStorage.getItem('rank');
    const banumber=sessionStorage.getItem('baNumber');
    document.getElementById('username').textContent='Name: ' + username;
    document.getElementById('rank').textContent=ranklist[rank] ? 'Rank: ' + ranklist[rank] : 'Rank: ' + rank;
    if(role === 'ammonco'){

    document.getElementById('banumber').textContent='Army No: ' + banumber;
    }
    else
    {
    document.getElementById('banumber').textContent='BA Number: ' + banumber;
    }
});

let typeofammo ={};
function loadammodata() {
    const dbref = ref(db, 'armsindex/typesofarms');
    const loadingOverlay = document.getElementById('loadingOverlay');
    get(dbref).then((snapshot) => {
        const data = snapshot.val();
        typeofammo = data || {};
        let serial = 1;
        const tableBody = document.getElementById('AmmoTableBody');
        if (!tableBody) {
            console.error('Table body element not found.');
            if(loadingOverlay) loadingOverlay.classList.add('hidden');
            return;
        }
        let html = '';
        if(data){
            for (const key in data) {
                const ammo = data[key];
                html += `
                    <tr class="ammo-row" id="${ammo.name}" data-key="${key}" style="cursor: pointer;">
                        <td>${serial}</td>
                        <td>${ammo.name} <span style="background-color: yellow;"> (${ammo.type})</span></td>
                        <td><button class='delete-btn' onclick="deleteAmmoType('${key}')" style="padding: 4px 8px; background-color: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button></td>
                    </tr>
                `;
                serial++;
            }
        }
        else{
            html = '<tr><td colspan="3">No ammo data found.</td></tr>';
        }
        tableBody.innerHTML = html;
        console.log("Ammo Data Loaded");

        tableBody.querySelectorAll('.ammo-row').forEach(row => {
            row.addEventListener('click', () => {
                const ammoKey = row.getAttribute('data-key');
                sessionStorage.setItem('ammotypename', typeofammo[ammoKey].name);
                window.location.href = `ammodetails.html?ammo=${ammoKey}`;
            });
        });
        if(loadingOverlay) 
            {
                setTimeout(() => {
                    loadingOverlay.classList.add('hidden');
                }, 100);
            }
    }).catch((error) => {
        console.error('Error fetching ammo data:', error);        
        const tableBody = document.getElementById('AmmoTableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="2" style="text-align: center; padding: 2rem; color: #e53e3e;">Error loading data. Please refresh the page.</td></tr>';
        }

        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    });
}   


function deleteAmmoType(ammoKey) {
    if (confirm("Are you sure you want to delete this type of arms? This action cannot be undone.")) {
        const ammoRef = ref(db, 'armsindex/typesofarms/' + ammoKey);
        remove(ammoRef)
            .then(() => {
                remove(ref(db, 'armsindex/' + ammoKey));
                showNotification("Type of Arms deleted successfully", "success", "Deleted");
                loadammodata();
            })
            .catch((error) => {
                console.error("Error deleting Type of Arms:", error);
                showNotification("Error deleting Type of Arms", "error", "Delete Failed");
            }
        );
    }
}



loadammodata();

window.deleteAmmoType = deleteAmmoType;


document.getElementById('searchInput')?.addEventListener('keyup', searchammo);
function searchammo() {
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('AmmoTableBody');
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

const logoutButton = document.getElementById('logoutButton');

logoutButton?.addEventListener('click', () => {
    // sessionStorage.removeItem('baNumber');
    window.location.href = '../index.html';
});
const addAmmoModal = document.getElementById('addAmmoModal');
function openAddAmmoModal() {
    if (addAmmoModal) {
        addAmmoModal.classList.remove('hidden');
    }
    console.log("Add Ammo Modal Opened");
}

document.getElementById('addammobtn')?.addEventListener('click', openAddAmmoModal);

function closeAddAmmoModal() {
    if (addAmmoModal) {
        addAmmoModal.classList.add('hidden');
    }
    console.log("Add Ammo Modal Closed");
}

document.getElementById('addAmmoCloseBtn')?.addEventListener('click', closeAddAmmoModal);
document.getElementById('closeaddmodal')?.addEventListener('click', closeAddAmmoModal);



function checkAmmoValidation(ammoType) {
    const ammoRef = ref(db, 'armsindex/typesofarms/' + ammoType);
    return get(ammoRef).then((snapshot) => {
        return snapshot.exists();
    });
}

function addAmmo() {
    const ammoTypeInput = document.getElementById('ammo-type');
    const ammoTypeValue = ammoTypeInput.value.trim();
    const ammoTypeClassInput = document.getElementById('ammo-typeclass');
    const ammoTypeClassValue = ammoTypeClassInput.value.trim();
    const ammoType = ammoTypeValue.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    if (ammoType === '') {
        showNotification("Type of Arms cannot be empty", "error", "Validation Error");
        return;
    }
    checkAmmoValidation(ammoType).then((exists) => {
        if (exists) {
            showNotification("Type of Arms already exists", "error", "Validation Error");
            return;
        }
        const newAmmoRef = ref(db, 'armsindex/typesofarms/' + ammoType);
        update(newAmmoRef, {
            name: ammoTypeValue,
            type: ammoTypeClassValue
        }).then(() => {
            showNotification("Type of Arms added successfully", "success", "Success");
            ammoTypeInput.value = '';
            closeAddAmmoModal();
            loadammodata();
        }).catch((error) => {
            console.error("Error adding Type of Arms:", error);
            showNotification("Error adding Type of Arms", "error", "Add Failed");
        });
    }).catch((error) => {
        console.error("Error checking Type of Arms:", error);
        showNotification("Error checking Type of Arms", "error", "Error");
    });
}

document.getElementById('addAmmoSubmitBtn')?.addEventListener('click', addAmmo);


function changePassword() {
    const baNumber = sessionStorage.getItem('baNumber');
    if (!baNumber) {
        console.error('BA Number not found in session storage.');
        window.location.href = '../index.html';
        return;
    }
    const currentPassword = document.getElementById('password').value;
    const newPassword = document.getElementById('new-password').value;    
    const confirmPassword = document.getElementById('confirm-password').value;
    if (newPassword !== confirmPassword) {
        showNotification("New passwords do not match", "error", "Validation Error");
        return;
    }
    if (newPassword.length < 6) {
        showNotification("New password must be at least 6 characters long", "error", "Validation Error");
        return;
    }
    const userRef = ref(db, 'users/' + baNumber);
    get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            if (userData.password !== currentPassword) {
                showNotification("Current password is incorrect", "error", "Validation Error");
                return;
            }
            update(userRef, { password: newPassword })
                .then(() => {
                    showNotification("Password changed successfully", "success", "Success");
                    sessionStorage.clear();
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    console.error("Error updating password:", error);
                    showNotification("Error updating password", "error", "Update Failed");
                });
        } else {
            showNotification("User data not found", "error", "Error");
        }
    }).catch((error) => {
        console.error("Error fetching user data:", error);
        showNotification("Error fetching user data", "error", "Error");
    });
}

document.getElementById('passwordChangeSubmitBtn')?.addEventListener('click', changePassword);

