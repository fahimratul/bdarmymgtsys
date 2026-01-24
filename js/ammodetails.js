import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, get, ref, update , set, remove} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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

let allowedRoles = ['lo', 'cc', 'clo', 'bknco'];

window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    let role = sessionStorage.getItem('role');
    if (!allowedRoles.includes(role)) {
        console.error('Unauthorized role for mto. Access denied.');
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
 


import {showNotification} from './notification.js';
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
    document.getElementById('banumber').textContent='BA Number: ' + banumber;
});

document.getElementById('ammotypeheading').textContent = sessionStorage.getItem('ammotypename') || 'Ammo Details';



let ammodetails ={};
let ammokey ='';
let editlotnokey ='';
function loadammodata() {
    const urlparams = new URLSearchParams(window.location.search);
    ammokey = urlparams.get('ammo');
    let totalquantity=0;
    let insvcquantity=0;
    let unsvcquantity=0;
    let inmagquantity=0;
    let inf1quantity=0;
    let inf2quantity=0;
    let inf3quantity=0;
    let inf4quantity=0;
    let spqquantity=0;
    let bayooquantity=0;
    let drodroquantity=0;
    let rhooquantity=0;
    console.log("Loading Ammo Data " + ammokey);
    const dbref = ref(db, 'ammoindex/'+ ammokey);
    const loadingOverlay = document.getElementById('loadingOverlay');
    get(dbref).then((snapshot) => {
        const data = snapshot.val();
        ammodetails = data || {};
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
                    <tr class="ammo-row" data-key="${key}" style="cursor: pointer;">
                        <td>${ammo.lotno}</td>
                        <td>${ammo.yearofmfr}</td>
                        <td>${ammo.expiryyear}</td>
                        <td>${ammo.totalquantity}</td>
                        <td>${ammo.unsvcquantity}</td>
                        <td>${ammo.insvcquantity}</td>
                        <td>${ammo.inmagquantity}</td>
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
                    </tr>
                `;
                console.log(ammo);
                totalquantity += ammo.totalquantity || 0;
                insvcquantity += ammo.insvcquantity || 0;
                unsvcquantity += ammo.unsvcquantity || 0;
                inmagquantity += ammo.inmagquantity || 0;
                inf1quantity += ammo.inf1quantity || 0;
                inf2quantity += ammo.inf2quantity || 0;
                inf3quantity += ammo.inf3quantity || 0;
                inf4quantity += ammo.inf4quantity || 0;
                spqquantity += ammo.spqquantity || 0;
                bayooquantity += ammo.bayooquantity || 0;
                drodroquantity += ammo.drodroquantity || 0;
                rhooquantity += ammo.rhooquantity || 0;
            }
            html += `
                <tr style="font-weight: bold; background-color: #f0f0f0;">
                    <td colspan="3">Total</td>
                    <td>${totalquantity}</td>
                    <td>${unsvcquantity}</td>
                    <td>${insvcquantity}</td>
                    <td>${inmagquantity}</td>
                    <td>${inf1quantity}</td>
                    <td>${inf2quantity}</td>
                    <td>${inf3quantity}</td>
                    <td>${inf4quantity}</td>
                    <td>${spqquantity}</td>
                    <td>${inf1quantity + inf2quantity + inf3quantity + inf4quantity + spqquantity}</td>
                    <td>${bayooquantity}</td>
                    <td>${drodroquantity}</td>
                    <td>${rhooquantity}</td>
                    <td>${bayooquantity + drodroquantity + rhooquantity}</td>
                </tr>
            `;
        }
        else{
            html = '<tr><td colspan="2">No ammo data found.</td></tr>';
        }
        tableBody.innerHTML = html;
        console.log("Ammo Data Loaded");

        tableBody.querySelectorAll('.ammo-row').forEach(row => {
            row.addEventListener('click', () => {
                const lotnokey = row.getAttribute('data-key');
                showlotdetails(lotnokey);
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


loadammodata();

const logoutButton = document.getElementById('logoutButton');

logoutButton?.addEventListener('click', () => {
    sessionStorage.removeItem('baNumber');
    window.location.href = 'index.html';
});
const addAmmoModal = document.getElementById('addAmmoModal');
function openAddAmmoModal() {
    if (addAmmoModal) {
        addAmmoModal.classList.remove('hidden');
    }
    console.log("Add Ammo Modal Opened");
}

document.getElementById('addAmmoBtn')?.addEventListener('click', openAddAmmoModal);

function closeAddAmmoModal() {
    if (addAmmoModal) {
        addAmmoModal.classList.add('hidden');
    }
    console.log("Add Ammo Modal Closed");
}

document.getElementById('addAmmoCloseBtn')?.addEventListener('click', closeAddAmmoModal);
document.getElementById('closeaddmodal')?.addEventListener('click', closeAddAmmoModal);



function checkAmmoValidation(lotno) {
    const ammoRef = ref(db, 'ammoindex/'+ ammokey+'/' + lotno);
    return get(ammoRef).then((snapshot) => {
        return snapshot.exists();
    });
}

function addAmmo() {
    const lotno = document.getElementById('lotno').value.trim();
    const lotnokey =lotno.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    const yearofmfr = document.getElementById('yearofmfr').value.trim();
    const expiryyear = document.getElementById('expiryyear').value.trim();
    const totalquantity = parseInt(document.getElementById('totalquantity').value.trim(), 10);
    const unsvcquantity = parseInt(document.getElementById('unsvcquantity').value.trim(), 10);
    const insvcquantity = totalquantity - unsvcquantity;
    const inmagquantity = parseInt(document.getElementById('inmagquantity').value.trim(), 10) || 0;
    const inf1quantity = parseInt(document.getElementById('inf1quantity').value.trim(), 10) || 0;
    const inf2quantity = parseInt(document.getElementById('inf2quantity').value.trim(), 10) || 0;
    const inf3quantity = parseInt(document.getElementById('inf3quantity').value.trim(), 10) || 0;
    const inf4quantity = parseInt(document.getElementById('inf4quantity').value.trim(), 10) || 0;
    const spqquantity = parseInt(document.getElementById('spquantity').value.trim(), 10) || 0;
    const bayooquantity = parseInt(document.getElementById('bayooquantity').value.trim(), 10) || 0;
    const drodroquantity = parseInt(document.getElementById('drodroquantity').value.trim(), 10) || 0;
    const rhooquantity = parseInt(document.getElementById('rhooquantity').value.trim(), 10) || 0;
    checkAmmoValidation(lotnokey).then((exists) => {
        if (exists) {
            showNotification("Lot No already exists", "error", "Validation Error");
            return;
        }
        // Add the new ammo lot to the database
        const ammoRef = ref(db, 'ammoindex/' + ammokey + '/' + lotnokey);
        const newAmmoData = {
            lotno: lotno,
            yearofmfr: yearofmfr,
            expiryyear: expiryyear,
            totalquantity: totalquantity,
            unsvcquantity: unsvcquantity,
            insvcquantity: insvcquantity,
            inmagquantity: inmagquantity,
            inf1quantity: inf1quantity,
            inf2quantity: inf2quantity,
            inf3quantity: inf3quantity,
            inf4quantity: inf4quantity,
            spqquantity: spqquantity,
            bayooquantity: bayooquantity,
            drodroquantity: drodroquantity,
            rhooquantity: rhooquantity
        };
        set(ammoRef, newAmmoData)
            .then(() => {
                showNotification("Ammo lot added successfully", "success", "Success");
                closeAddAmmoModal();
                loadammodata();
            })
            .catch((error) => {
                console.error("Error adding ammo lot:", error);
                showNotification("Error adding ammo lot", "error", "Error");
            });
    });
}

document.getElementById('addAmmoSubmitBtn')?.addEventListener('click', addAmmo);




function showlotdetails(lotnokeyvalue) {
    const ammoData = ammodetails[lotnokeyvalue];
    if (!ammoData) {
        showNotification("lot data not found", "error", "Error");
        return;
    }
    editlotnokey = lotnokeyvalue;
    document.getElementById('lotdetailslotno').value = ammoData.lotno;
    document.getElementById('lotdetailsyearofmfr').value = ammoData.yearofmfr;
    document.getElementById('lotdetailsexpiryyear').value = ammoData.expiryyear;
    document.getElementById('lotdetailstotalquantity').value = ammoData.totalquantity;
    document.getElementById('lotdetailsunsvcquantity').value = ammoData.unsvcquantity;
    document.getElementById('lotdetailsinf1quantity').value = ammoData.inf1quantity;
    document.getElementById('lotdetailsinf2quantity').value = ammoData.inf2quantity;
    document.getElementById('lotdetailsinf3quantity').value = ammoData.inf3quantity;
    document.getElementById('lotdetailsinf4quantity').value = ammoData.inf4quantity;
    document.getElementById('lotdetailsspquantity').value = ammoData.spqquantity;
    document.getElementById('lotdetailsbayooquantity').value = ammoData.bayooquantity;
    document.getElementById('lotdetailsdrodroquantity').value = ammoData.drodroquantity;
    document.getElementById('lotdetailsrhooquantity').value = ammoData.rhooquantity;
    const lotDetailsModal = document.getElementById('lotdetailsmodal');
    lotDetailsModal.classList.remove('hidden');
}

function closelotdetailsmodal() {
    const lotDetailsModal = document.getElementById('lotdetailsmodal');
    lotDetailsModal.classList.add('hidden');
}

document.getElementById('closelotdetailsmodal')?.addEventListener('click', closelotdetailsmodal);

document.getElementById('addLotCloseBtn')?.addEventListener('click', closelotdetailsmodal);


document.getElementById('addLotSubmitBtn')?.addEventListener('click', () => {
    updatelotdetails();
});

function updatelotdetails() {
    const lotno = document.getElementById('lotdetailslotno').value.trim();
    const yearofmfr = document.getElementById('lotdetailsyearofmfr').value.trim();
    const expiryyear = document.getElementById('lotdetailsexpiryyear').value.trim();
    const totalquantity = parseInt(document.getElementById('lotdetailstotalquantity').value.trim(), 10);
    const unsvcquantity = parseInt(document.getElementById('lotdetailsunsvcquantity').value.trim(), 10);
    const insvcquantity = totalquantity - unsvcquantity;
    const inf1quantity = parseInt(document.getElementById('lotdetailsinf1quantity').value.trim(), 10) || 0;
    const inf2quantity = parseInt(document.getElementById('lotdetailsinf2quantity').value.trim(), 10) || 0;
    const inf3quantity = parseInt(document.getElementById('lotdetailsinf3quantity').value.trim(), 10) || 0;
    const inf4quantity = parseInt(document.getElementById('lotdetailsinf4quantity').value.trim(), 10) || 0;
    const spqquantity = parseInt(document.getElementById('lotdetailsspquantity').value.trim(), 10) || 0;
    const bayooquantity = parseInt(document.getElementById('lotdetailsbayooquantity').value.trim(), 10) || 0;
    const drodroquantity = parseInt(document.getElementById('lotdetailsdrodroquantity').value.trim(), 10) || 0;
    const rhooquantity = parseInt(document.getElementById('lotdetailsrhooquantity').value.trim(), 10) || 0;
    console.log("Calculating inmagquantity", totalquantity);
    const inmagquantity = totalquantity - ( inf1quantity + inf2quantity + inf3quantity + inf4quantity + spqquantity + bayooquantity + drodroquantity + rhooquantity);
    if (inmagquantity < 0) {
        showNotification("Invalid quantities: In Mag Quantity cannot be negative", "error", "Validation Error");
        return;
    }
    console.log("Updating lot details for " + editlotnokey);
    console.log({
        lotno,
        yearofmfr,
        expiryyear,
        totalquantity,
        unsvcquantity,
        insvcquantity,
        inmagquantity,
        inf1quantity,
        inf2quantity,
        inf3quantity,
        inf4quantity,
        spqquantity,
        bayooquantity,
        drodroquantity,
        rhooquantity
    });
    const ammoRef = ref(db, 'ammoindex/' + ammokey + '/' + editlotnokey);
    const updatedAmmoData = {
        lotno: lotno,
        yearofmfr: yearofmfr,
        expiryyear: expiryyear,
        totalquantity: totalquantity,
        unsvcquantity: unsvcquantity,
        insvcquantity: insvcquantity,
        inmagquantity: inmagquantity,
        inf1quantity: inf1quantity,
        inf2quantity: inf2quantity,
        inf3quantity: inf3quantity,
        inf4quantity: inf4quantity,
        spqquantity: spqquantity,
        bayooquantity: bayooquantity,
        drodroquantity: drodroquantity,
        rhooquantity: rhooquantity
    };
    update(ammoRef, updatedAmmoData).then(() => {
            showNotification("Lot details updated successfully", "success", "Success");
            closelotdetailsmodal();
            loadammodata();
        }
        )
        .catch((error) => {
            console.error("Error updating lot details:", error);
            showNotification("Error updating lot details", "error", "Error");
        });
}






function changePassword() {
    const baNumber = sessionStorage.getItem('baNumber');
    if (!baNumber) {
        console.error('BA Number not found in session storage.');
        window.location.href = 'login.html';
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
                    window.location.href = 'index.html';
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

