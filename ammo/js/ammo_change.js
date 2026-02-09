import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getDatabase, get, ref, update, remove, push, set, onValue } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import {showNotification} from '../../js/notification.js';

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

let allowedRoles = ['lo'];

window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    let role = sessionStorage.getItem('role');
    console.log('User role:', role);
    
    if (!allowedRoles.includes(role)) {
        console.error('Unauthorized role for ammo changes. Access denied.');
        window.location.href = '../login.html';
        return;
    }
    
    if (!baNumber) {
        console.error('BA Number not found in local storage.');
        window.location.href = '../login.html';
        return;
    }
    
    console.log('Logged in as BA Number:', baNumber);
    initializePage();
});

let ranklist = {
    snk: "Sainik",
    lcpl: "Lance Corporal",
    cpl: "Corporal",
    sgt: "Sergeant",
    wo: "Warrant Officer",
    swo: "Senior Warrant Officer",
    mwo: "Master Warrant Officer",
    lt: "Lieutenant",
    capt: "Captain",
    major: "Major",
    ltcol: "Lieutenant Colonel",
    col: "Colonel",
    brig: "Brigadier",
    majorgen: "Major General",
    ltgen: "Lieutenant General",
    gen: "General"
};

// Global variables
let pendingData = {
    newArrivals: {},
    pendingLots: {},
    lotUpdates: {}
};


function initializePage() {
    // Set user info
    const username = sessionStorage.getItem('username');
    const rank = sessionStorage.getItem('rank');
    const banumber = sessionStorage.getItem('baNumber');
    
    if (username && rank && banumber) {
        document.getElementById('username').textContent = 'Name: ' + username;
        document.getElementById('rank').textContent = ranklist[rank] ? 'Rank: ' + ranklist[rank] : 'Rank: ' + rank;
        document.getElementById('banumber').textContent = 'BA Number: ' + banumber;
    }
    
    // Load pending data
    loadPendingData();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Hide loading overlay after a short delay
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }, 100);
}

function loadPendingData() {
    console.log('Loading pending ammo data...');
    
    // Load new ammo arrivals
    loadNewArrivals();
    
    // Load pending lots added by ammo NCO
    loadPendingLots();
    
    // Load lot updates
    loadLotUpdates();
}

function loadNewArrivals() {
    const dbRef = ref(db, 'officerapproval/typesofammo/');
    
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        pendingData.newArrivals = data || {};
        
        const tableBody = document.getElementById('newAmmoTableBody');
        const table = document.getElementById('newAmmoTable');
        const emptyState = document.getElementById('newAmmoEmpty');
        const countElement = document.getElementById('newAmmoCount');
        
        if (!data || Object.keys(data).length === 0) {
            table.style.display = 'none';
            emptyState.style.display = 'block';
            countElement.textContent = '0';
            return;
        }
        
        let html = '';
        let serialNumber = 1;
        const count = Object.keys(data).length;
        
        for (const key in data) {
            const item = data[key];
            html += `
                <tr>
                    <td>${serialNumber++}</td>
                    <td>${item.name || 'N/A'} <span style="background-color:yellow;"> ${item.type} </span></td>

                    <td>
                        <div class="action-buttons">
                            <button class="btn-small btn-approve" onclick="acceptnew('${key}')">Approve</button>
                            <button class="btn-small btn-reject" onclick="rejectnew('${key}')">Reject</button>
                        </div>
                    </td>
                </tr>
            `;
        }
        
        tableBody.innerHTML = html;
        table.style.display = 'table';
        emptyState.style.display = 'none';
        countElement.textContent = count.toString();
        
        updateTotalCount();
    });
}
function acceptnew(key){
    const dbRef = ref(db, 'officerapproval/typesofammo/' + key);
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const item = snapshot.val();
            const newItemRef = ref(db, 'ammoindex/typesofammo/' + key);
            set(newItemRef, item).then(() => {
                remove(dbRef).then(() => {
                    showNotification("Ammo type approved successfully", "success", "Success");
                }).catch((error) => {
                    console.error("Error removing pending ammo type:", error);
                    showNotification("Error removing pending ammo type", "error", "Error");
                });
            }).catch((error) => {
                console.error("Error approving ammo type:", error);
                showNotification("Error approving ammo type", "error", "Error");
            });
        } else {
            showNotification("Ammo type not found", "error", "Error");
        }
    }).catch((error) => {
        console.error("Error fetching ammo type:", error);
        showNotification("Error fetching ammo type", "error", "Error");
    });
}

function rejectnew(key){
    const dbRef = ref(db, 'officerapproval/typesofammo/' + key);
    remove(dbRef).then(() => {
        showNotification("Ammo type rejected successfully", "success", "Success");
    }).catch((error) => {
        console.error("Error rejecting ammo type:", error);
        showNotification("Error rejecting ammo type", "error", "Error");
    });
}

function loadPendingLots() {
    const dbRef = ref(db, 'officerapproval/newammo/');
    
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        pendingData.pendingLots = data || {};
        const tableBody = document.getElementById('pendingLotsTableBody');
        const table = document.getElementById('pendingLotsTable');
        const emptyState = document.getElementById('pendingLotsEmpty');
        const countElement = document.getElementById('pendingLotsCount');
        
        if (!data || Object.keys(data).length === 0) {
            table.style.display = 'none';
            emptyState.style.display = 'block';
            countElement.textContent = '0';
            return;
        }
        
        let html = '';
        let serialNumber = 1;
        const count = Object.keys(data).length;
        for (const key in data) {
            console.log('Processing ammo type key:', key);
            const dbref =ref(db, 'ammoindex/typesofammo/' + key);
            get(dbref).then((snapshot) => {
                const item = snapshot.val();
                console.log('Processing ammo type:', item);
                html += `
                <tr><td colspan=19><strong>Ammo Type: ${item.name || 'N/A'} - ${item.type || 'N/A'}</strong></td></tr>`
                for (const lotKey in data[key]) {
                    const ammo = data[key][lotKey];
                    html += `<tr class="ammo-row" data-key="${key}">
                            <td>${ammo.lotno}</td>
                            <td>${ammo.yearofmfr}</td>
                            <td>${ammo.expiryyear}</td>
                            <td>${ammo.totalquantity}</td>
                            <td>${ammo.unsvcquantity}</td>
                            <td>${ammo.insvcquantity}</td>
                            <td>${ammo.inmagquantity}</td>
                            <td>${ammo.expenditure || 0}</td>
                            <td>${ammo.inf1quantity}</td>
                            <td>${ammo.inf2quantity}</td>
                            <td>${ammo.inf3quantity}</td>
                            <td>${ammo.inf4quantity}</td>
                            <td>${ammo.spqquantity}</td>
                            <td>${ammo.inf1quantity + ammo.inf2quantity + ammo.inf3quantity + ammo.inf4quantity+ammo.spqquantity}</td>
                            <td>${ammo.bayooquantity}</td>
                            <td>${ammo.drodroquantity}</td>
                            <td>${ammo.rhooquantity}</td>
                            <td>${ammo.bayooquantity + ammo.drodroquantity + ammo.rhooquantity}</td>
                            <td>
                            <div class="action-buttons">
                                <button class="btn-small btn-approve" onclick="acceptnewlot('${key}/${lotKey}')">Approve</button>
                                <button class="btn-small btn-reject" onclick="rejectnewlot('${key}/${lotKey}')">Reject</button>
                            </div>
                            </td>
                        </tr>`;
                }
                tableBody.innerHTML = html;
                table.style.display = 'table';
                emptyState.style.display = 'none';
                countElement.textContent = count.toString();
                updateTotalCount();
            });
        }

    });
}

function acceptnewlot(compositeKey){
    const dbRef = ref(db, 'officerapproval/newammo/' + compositeKey);
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const item = snapshot.val();
            const newItemRef = ref(db, 'ammoindex/' + compositeKey);
            set(newItemRef, item).then(() => {
                remove(dbRef).then(() => {
                    showNotification("Ammo lot approved successfully", "success", "Success");
                }).catch((error) => {
                    console.error("Error removing pending ammo lot:", error);
                    showNotification("Error removing pending ammo lot", "error", "Error");
                });
            }).catch((error) => {
                console.error("Error approving ammo lot:", error);
                showNotification("Error approving ammo lot", "error", "Error");
            });
        } else {
            showNotification("Ammo lot not found", "error", "Error");
        }   
    }).catch((error) => {
        console.error("Error fetching ammo lot:", error);
        showNotification("Error fetching ammo lot", "error", "Error");
    });
}


function rejectnewlot(compositeKey){
    const dbRef = ref(db, 'officerapproval/newammo/' + compositeKey);
    remove(dbRef).then(() => {
        showNotification("Ammo lot rejected successfully", "success", "Success");
    }).catch((error) => {
        console.error("Error rejecting ammo lot:", error);
        showNotification("Error rejecting ammo lot", "error", "Error");
    });
}


function loadLotUpdates(){
    const dbRef = ref(db, 'officerapproval/ammoindexupdate/');
    
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        pendingData.lotUpdates = data || {};
        const tableBody = document.getElementById('lotUpdatesTableBody');
        const table = document.getElementById('lotUpdatesTable');
        const emptyState = document.getElementById('lotUpdatesEmpty');
        const countElement = document.getElementById('lotUpdatesCount');
        
        if (!data || Object.keys(data).length === 0) {
            table.style.display = 'none';
            emptyState.style.display = 'block';
            countElement.textContent = '0';
            return;
        }
        
        let html = '';
        let serialNumber = 1;
        const count = Object.keys(data).length;
        for (const key in data) {
            console.log('Processing ammo type key:', key);
            const dbref =ref(db, 'ammoindex/typesofammo/' + key);
            get(dbref).then((snapshot) => {
                const item = snapshot.val();
                console.log('Processing ammo type:', item);
                html += `
                <tr><td colspan=19><strong>Ammo Type: ${item.name || 'N/A'} - ${item.type || 'N/A'}</strong></td></tr>`
                for (const lotKey in data[key]) {
                    const ammo = data[key][lotKey];
                    html += `<tr class="ammo-row" data-key="${key}">
                            <td>${ammo.lotno}</td>
                            <td>${ammo.yearofmfr}</td>
                            <td>${ammo.expiryyear}</td>
                            <td>${ammo.totalquantity}</td>
                            <td>${ammo.unsvcquantity}</td>
                            <td>${ammo.insvcquantity}</td>
                            <td>${ammo.inmagquantity}</td>
                            <td>${ammo.expenditure || 0}</td>
                            <td>${ammo.inf1quantity}</td>
                            <td>${ammo.inf2quantity}</td>
                            <td>${ammo.inf3quantity}</td>
                            <td>${ammo.inf4quantity}</td>
                            <td>${ammo.spqquantity}</td>
                            <td>${ammo.inf1quantity + ammo.inf2quantity + ammo.inf3quantity + ammo.inf4quantity+ammo.spqquantity}</td>
                            <td>${ammo.bayooquantity}</td>
                            <td>${ammo.drodroquantity}</td>
                            <td>${ammo.rhooquantity}</td>
                            <td>${ammo.bayooquantity + ammo.drodroquantity + ammo.rhooquantity}</td>
                            <td>
                            <div class="action-buttons">
                                <button class="btn-small btn-approve" onclick="updatelots('${key}/${lotKey}')">Approve</button>
                                <button class="btn-small btn-reject" onclick="rejectlotupdate('${key}/${lotKey}')">Reject</button>
                            </div>
                            </td>
                        </tr>`;
                }
                tableBody.innerHTML = html;
                table.style.display = 'table';
                emptyState.style.display = 'none';
                countElement.textContent = count.toString();
                updateTotalCount();
            });
        }

    });
}


function updatelots(compositeKey){
    const dbRef = ref(db, 'officerapproval/ammoindexupdate/' + compositeKey);
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const item = snapshot.val();
            const newItemRef = ref(db, 'ammoindex/' + compositeKey);
            set(newItemRef, item).then(() => {
                remove(dbRef).then(() => {
                    showNotification("Ammo lot update approved successfully", "success", "Success");
                }).catch((error) => {
                    console.error("Error removing pending ammo lot update:", error);
                    showNotification("Error removing pending ammo lot update", "error", "Error");
                });
            }).catch((error) => {
                console.error("Error approving ammo lot update:", error);
                showNotification("Error approving ammo lot update", "error", "Error");
            });
        } else {
            showNotification("Ammo lot update not found", "error", "Error");
        }
    }).catch((error) => {
        console.error("Error fetching ammo lot update:", error);
        showNotification("Error fetching ammo lot update", "error", "Error");
    });
}


function rejectlotupdate(compositeKey){
    const dbRef = ref(db, 'officerapproval/ammoindexupdate/' + compositeKey);
    remove(dbRef).then(() => {
        showNotification("Ammo lot update rejected successfully", "success", "Success");
        updateTotalCount();
    }).catch((error) => {
        console.error("Error rejecting ammo lot update:", error);
        showNotification("Error rejecting ammo lot update", "error", "Error");
    });

}





function updateTotalCount() {
    const newCount = Object.keys(pendingData.newArrivals).length;
    const lotsCount = Object.keys(pendingData.pendingLots).length;
    const updatesCount = Object.keys(pendingData.lotUpdates).length;
    const total = newCount + lotsCount + updatesCount;
    
    document.getElementById('totalPendingCount').textContent = total.toString();
}


function changePassword() {
    const baNumber = sessionStorage.getItem('baNumber');
    if (!baNumber) {
        console.error('BA Number not found in session storage.');
        window.location.href = 'lindex.html';return;
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



const logoutButton = document.getElementById('logoutButton');

logoutButton?.addEventListener('click', () => {
    // sessionStorage.removeItem('baNumber');
    window.location.href = '../index.html';
});

window.acceptnew = acceptnew;
window.rejectnew = rejectnew;
window.acceptnewlot = acceptnewlot;
window.rejectnewlot = rejectnewlot;
window.updatelots = updatelots;
window.rejectlotupdate = rejectlotupdate;
