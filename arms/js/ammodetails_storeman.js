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

let allowedRoles = ['lo', 'cc', 'clo', 'ammonco'];

window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    let role = sessionStorage.getItem('role');
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
    document.getElementById('banumber').textContent='Amry No: ' + banumber;
});

document.getElementById('ammotypeheading').textContent = sessionStorage.getItem('ammotypename') || 'Ammo Details';



let ammodetails ={};
let ammokey ='';
let editlotnokey ='';
function loadammodata() {
    const urlparams = new URLSearchParams(window.location.search);
    ammokey = urlparams.get('ammo');
    let totalquantity=0;
    let inf1quantity=0;
    let inf2quantity=0;
    let inf3quantity=0;
    let inf4quantity=0;
    let bnhqquantity=0;
    let spqquantity=0;
    let bayooquantity=0;
    let drodroquantity=0;
    let rhooquantity=0;
    console.log("Loading Arms Data " + ammokey);
    const dbref = ref(db, 'armsindex/'+ ammokey);
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
                        <td>${ammo.auth}</td>
                        <td>${ammo.totalquantity}</td>
                        <td>${ammo.inf1quantity}</td>
                        <td>${ammo.inf2quantity}</td>
                        <td>${ammo.inf3quantity}</td>
                        <td>${ammo.inf4quantity}</td>
                        <td>${ammo.spqquantity}</td>
                        <td>${ammo.bnhqquantity}</td>
                        <td>${ammo.inf1quantity + ammo.inf2quantity + ammo.inf3quantity + ammo.inf4quantity+ammo.spqquantity+ammo.bnhqquantity}</td>
                        <td>${ammo.bayooquantity}</td>
                        <td>${ammo.drodroquantity}</td>
                        <td>${ammo.rhooquantity}</td>
                        <td>${ammo.bayooquantity + ammo.drodroquantity + ammo.rhooquantity}</td>
                        <td><button class='delete-btn' onclick="deleteAmmo('${key}')" style="padding: 4px 8px; background-color: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button></td>
                    </tr>
                `;
                console.log(ammo);
                totalquantity += ammo.totalquantity || 0;
                inf1quantity += ammo.inf1quantity || 0;
                inf2quantity += ammo.inf2quantity || 0;
                inf3quantity += ammo.inf3quantity || 0;
                inf4quantity += ammo.inf4quantity || 0;
                spqquantity += ammo.spqquantity || 0;
                bnhqquantity += ammo.bnhqquantity || 0;
                bayooquantity += ammo.bayooquantity || 0;
                drodroquantity += ammo.drodroquantity || 0;
                rhooquantity += ammo.rhooquantity || 0;
            }
            html += `
                <tr style="font-weight: bold; background-color: #f0f0f0;">
                    <td>Total</td>
                    <td>${totalquantity}</td>
                    <td>${inf1quantity}</td>
                    <td>${inf2quantity}</td>
                    <td>${inf3quantity}</td>
                    <td>${inf4quantity}</td>
                    <td>${spqquantity}</td>
                    <td>${bnhqquantity}</td>
                    <td>${inf1quantity + inf2quantity + inf3quantity + inf4quantity + spqquantity + bnhqquantity}</td>
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
    window.location.href = '../index.html';
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
    const ammoRef = ref(db, 'armsindex/'+ ammokey+'/' + lotno);
    return get(ammoRef).then((snapshot) => {
        return snapshot.exists();
    });
}

function addAmmo() {
    const auth = document.getElementById('auth').value.trim();
    const lotnokey =auth.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    const totalquantity = parseInt(document.getElementById('totalquantity').value.trim(), 10);
    
    const inf1quantity = parseInt(document.getElementById('inf1quantity').value.trim(), 10) || 0;
    const inf2quantity = parseInt(document.getElementById('inf2quantity').value.trim(), 10) || 0;
    const inf3quantity = parseInt(document.getElementById('inf3quantity').value.trim(), 10) || 0;
    const inf4quantity = parseInt(document.getElementById('inf4quantity').value.trim(), 10) || 0;
    const spqquantity = parseInt(document.getElementById('spquantity').value.trim(), 10) || 0;
    const bnhqquantity = parseInt(document.getElementById('bnhqquantity').value.trim(), 10) || 0;
    const bayooquantity = parseInt(document.getElementById('bayooquantity').value.trim(), 10) || 0;
    const drodroquantity = parseInt(document.getElementById('drodroquantity').value.trim(), 10) || 0;
    const rhooquantity = parseInt(document.getElementById('rhooquantity').value.trim(), 10) || 0;
    checkAmmoValidation(lotnokey).then((exists) => {
        if (exists) {
            showNotification("Lot No already exists", "error", "Validation Error");
            return;
        }
        // Add the new ammo
        const ammoRef = ref(db, 'officerapproval/newarms/' + ammokey + '/' + lotnokey);
        const newAmmoData = {
            auth: auth,
            totalquantity: totalquantity,
            inf1quantity: inf1quantity,
            inf2quantity: inf2quantity,
            inf3quantity: inf3quantity,
            inf4quantity: inf4quantity,
            spqquantity: spqquantity,
            bnhqquantity: bnhqquantity,
            bayooquantity: bayooquantity,
            drodroquantity: drodroquantity,
            rhooquantity: rhooquantity
        };
        set(ammoRef, newAmmoData)
            .then(() => {
                showNotification("Ammo lot added successfully", "success", "Success");
                closeAddAmmoModal();
                loadammodata();
                // Show print confirmation after successful addition
                setTimeout(() => {
                    printLotDetails(newAmmoData, 'added');
                }, 500);
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
    document.getElementById('lotdetailsauth').value = ammoData.auth;
    document.getElementById('lotdetailstotalquantity').value = ammoData.totalquantity;
    document.getElementById('lotdetailsinf1quantity').value = ammoData.inf1quantity;
    document.getElementById('lotdetailsinf2quantity').value = ammoData.inf2quantity;
    document.getElementById('lotdetailsinf3quantity').value = ammoData.inf3quantity;
    document.getElementById('lotdetailsinf4quantity').value = ammoData.inf4quantity;
    document.getElementById('lotdetailsspquantity').value = ammoData.spqquantity;
    document.getElementById('lotdetailsbnhqquantity').value = ammoData.bnhqquantity;
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
    const auth = document.getElementById('lotdetailsauth').value.trim();
    const totalquantity = parseInt(document.getElementById('lotdetailstotalquantity').value.trim(), 10);
    const inf1quantity = parseInt(document.getElementById('lotdetailsinf1quantity').value.trim(), 10);
    const inf2quantity = parseInt(document.getElementById('lotdetailsinf2quantity').value.trim(), 10);
    const inf3quantity = parseInt(document.getElementById('lotdetailsinf3quantity').value.trim(), 10);
    const inf4quantity = parseInt(document.getElementById('lotdetailsinf4quantity').value.trim(), 10);
    const spqquantity = parseInt(document.getElementById('lotdetailsspquantity').value.trim(), 10);
    const bnhqquantity = parseInt(document.getElementById('lotdetailsbnhqquantity').value.trim(), 10);
    const bayooquantity = parseInt(document.getElementById('lotdetailsbayooquantity').value.trim(), 10) ;
    const drodroquantity = parseInt(document.getElementById('lotdetailsdrodroquantity').value.trim(), 10);
    const rhooquantity = parseInt(document.getElementById('lotdetailsrhooquantity').value.trim(), 10);
    
   
    console.log("Updating lot details for " + editlotnokey);

    const ammoRef = ref(db, 'officerapproval/armsindexupdate/' + ammokey + '/' + editlotnokey);
    
    const updatedAmmoData = {
        auth: auth,
        totalquantity: totalquantity,
        inf1quantity: inf1quantity,
        inf2quantity: inf2quantity,
        inf3quantity: inf3quantity,
        inf4quantity: inf4quantity,
        spqquantity: spqquantity,
        bnhqquantity: bnhqquantity,
        bayooquantity: bayooquantity,
        drodroquantity: drodroquantity,
        rhooquantity: rhooquantity
    };
    update(ammoRef, updatedAmmoData).then(() => {
            showNotification("Lot details updated successfully", "success", "Success");
            closelotdetailsmodal();
            loadammodata();
            // Show print confirmation after successful update
            setTimeout(() => {
                printLotDetails(updatedAmmoData, 'updated');
            }, 500);
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
        window.location.href = '../index.html';return;
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

// Print functionality
function printAmmoDetails() {
    const ammoTypeName = sessionStorage.getItem('ammotypename') || 'Ammo Details';
    const tableBody = document.getElementById('AmmoTableBody');
    const username = sessionStorage.getItem('username');
    const rank = sessionStorage.getItem('rank');
    const baNumber = sessionStorage.getItem('baNumber');
    
    if (!tableBody || !tableBody.innerHTML.trim()) {
        showNotification("No data available to print", "error", "Print Error");
        return;
    }


    let tableRows ='';
    for(let i = 0; i<tableBody.rows.length-1; i++) {
        const row=tableBody.rows[i];
        const cells = row.cells;
        const startdIndex = 0;
        tableRows += '<tr>'
        for(let j = startdIndex; j< cells.length - 1; j++) { // Exclude last cell with delete button 
            tableRows += '<td>' + cells[j].innerHTML + '</td>';
        }
        tableRows += '</tr>';
    }

    tableRows += '<tr style="font-weight: bold; background-color: #f0f0f0;">';
    const totalRow = tableBody.rows[tableBody.rows.length - 1];
    tableRows += '<td>Total</td>';
    for(let k = 1; k < totalRow.cells.length ; k++) { // Exclude last cell
        tableRows += '<td>' + totalRow.cells[k].innerHTML + '</td>';
    }
    tableRows += '</tr>';
    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Get current date and time
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print - ${ammoTypeName}</title>
            <style>
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0.5in;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 10px;
                        margin: 0;
                        padding: 0;
                    }
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    font-size: 12px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 10px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: bold;
                }
                .header h2 {
                    margin: 5px 0;
                    font-size: 16px;
                    color: #000000;
                }
                .info-section {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    font-size: 11px;
                }
                .user-info, .print-info {
                    flex: 1;
                }
                .user-info {
                    text-align: left;
                }
                .print-info {
                    text-align: right;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9px;
                    margin-top: 10px;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 4px;
                    text-align: center;
                }
                th {
                    background-color: #f0f0f0;
                    font-weight: bold;
                    font-size: 8px;
                }
                tr:last-child {
                    font-weight: bold;
                    background-color: #f0f0f0;
                }
                .footer {
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding-top: 5px;
                }
                @media screen {
                    .footer {
                        position: relative;
                        margin-top: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>BANRDB Store Management System</h1>
                <h2>${ammoTypeName} - Detailed Report</h2>
            </div>
            
            <div class="info-section">
                <div class="user-info">
                    <strong>Generated by:</strong><br>
                    Name: ${username || 'N/A'}<br>
                    Rank: ${ranklist[rank] || rank || 'N/A'}<br>
                     ${baNumber || 'N/A'}
                </div>
                <div class="print-info">
                    <strong>Print Details:</strong><br>
                    Date: ${currentDate}<br>
                    Time: ${currentTime}
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th rowspan="2">Lot No</th>
                        <th rowspan="2">Total Quantity</th>
                        <th colspan="7">Kote</th>
                        <th colspan="4">Camp</th>
                    </tr>
                    <tr>
                        <th>Inf-1</th>
                        <th>Inf-2</th>
                        <th>Inf-3</th>
                        <th>Inf-4</th>
                        <th>Sp</th>
                        <th>Bn HQ</th>
                        <th>Total</th>
                        <th>BAYOO</th>
                        <th>DRODRO</th>
                        <th>RHOO</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            
            <div class="footer">
                Generated from BANRDB Store Management System - Confidential Document
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for the content to load, then print
    printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };
}

// Add event listener for print button
document.getElementById('printAmmoBtn')?.addEventListener('click', printAmmoDetails);

// Print individual lot details
// Print individual lot details
function printLotDetails(lotData, action = 'details') {
    const ammoTypeName = sessionStorage.getItem('ammotypename') || 'Ammo Details';
    const username = sessionStorage.getItem('username');
    const rank = sessionStorage.getItem('rank');
    const baNumber = sessionStorage.getItem('baNumber');
    
    if (!lotData) {
        showNotification("No lot data available to print", "error", "Print Error");
        return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Get current date and time
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    const actionTitle = action === 'added' ? 'New Lot Added' : action === 'updated' ? 'Lot Updated' : 'Lot Details';
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print - ${actionTitle} - ${lotData.auth}</title>
            <style>
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0.75in;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        margin: 0;
                        padding: 0;
                    }
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    font-size: 14px;
                    line-height: 1.4;
                }
                .header {
                    text-align: center;
                    margin-bottom: 25px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 15px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: bold;
                }
                .header h2 {
                    margin: 8px 0 5px 0;
                    font-size: 16px;
                    color: #000000;
                }
                .header h3 {
                    margin: 5px 0 0 0;
                    font-size: 14px;
                    color: #444;
                    font-weight: normal;
                }
                .info-section {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    font-size: 12px;
                    border: 1px solid #bdbdbd;
                    padding: 10px;
                    background-color: #ffffff;
                }
                .user-info, .print-info {
                    flex: 1;
                }
                .user-info {
                    text-align: left;
                }
                .print-info {
                    text-align: right;
                }
                .lot-details {
                    margin: 20px 0;
                }
                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .detail-card {
                    border: 1px solid #ddd;
                    padding: 15px;
                    background-color: #ffffff;
                }
                .detail-card h4 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    color: #333;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 5px;
                }
                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    padding: 2px 0;
                }
                .detail-label {
                    font-weight: bold;
                    color: #555;
                }
                .detail-value {
                    color: #000;
                }
                .totals-section {
                    border: 2px solid #000;
                    padding: 15px;
                    margin: 20px 0;
                    background-color: #fff;
                }
                .totals-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 10px;
                }
                .total-item {
                    text-align: center;
                    padding: 8px;
                    border: 1px solid #a2a2a2;
                    background-color: #ffffff;
                }
                .total-label {
                    font-weight: bold;
                    font-size: 12px;
                    color: #333;
                }
                .total-value {
                    font-size: 16px;
                    font-weight: bold;
                    color: #000;
                    margin-top: 5px;
                }
                .action-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                    margin-left: 10px;
                }
                .badge-added {
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                .badge-updated {
                    background-color: #d1ecf1;
                    color: #0c5460;
                    border: 1px solid #bee5eb;
                }
                .footer {
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding-top: 5px;
                }
                @media screen {
                    .footer {
                        position: relative;
                        margin-top: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>BANRDB Store Management System</h1>
                <h2>${ammoTypeName}
                    ${action === 'added' ? '<span class="action-badge badge-added">NEW LOT ADDED</span>' : 
                      action === 'updated' ? '<span class="action-badge badge-updated">LOT UPDATED</span>' : ''}
                </h2>
                <h3>Auth: ${lotData.auth}</h3>
            </div>
            
            <div class="info-section">
                <div class="user-info">
                    <strong>Generated by:</strong><br>
                    Name: ${username || 'N/A'}<br>
                    Rank: ${ranklist[rank] || rank || 'N/A'}<br>
                     ${baNumber || 'N/A'}
                </div>
                <div class="print-info">
                    <strong>Print Details:</strong><br>
                    Date: ${currentDate}<br>
                    Time: ${currentTime}<br>
                    Action: ${actionTitle}
                </div>
            </div>
            
            <div class="details-grid">
                <div class="detail-card">
                    <h4>Basic Information</h4>
                    <div class="detail-item">
                        <span class="detail-label"> Auth:</span>
                        <span class="detail-value">${lotData.auth}</span>
                    </div>
                </div>
                
                <div class="detail-card">
                    <h4>Quantity Status</h4>
                    <div class="detail-item">
                        <span class="detail-label">Total Quantity:</span>
                        <span class="detail-value">${lotData.totalquantity}</span>
                    </div>
                </div>
                
                <div class="detail-card">
                    <h4>Kote Distribution</h4>
                    <div class="detail-item">
                        <span class="detail-label">1 Inf Battalion:</span>
                        <span class="detail-value">${lotData.inf1quantity}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">2 Inf Battalion:</span>
                        <span class="detail-value">${lotData.inf2quantity}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">3 Inf Battalion:</span>
                        <span class="detail-value">${lotData.inf3quantity}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">4 Inf Battalion:</span>
                        <span class="detail-value">${lotData.inf4quantity}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">SP Quantity:</span>
                        <span class="detail-value">${lotData.spqquantity}</span>
                    </div>
                        <div class="detail-item">
                        <span class="detail-label">Bn HQ Quantity:</span>
                        <span class="detail-value">${lotData.bnhqquantity}</span>
                    </div>
                </div>
                
                <div class="detail-card">
                    <h4>Camp Distribution</h4>
                    <div class="detail-item">
                        <span class="detail-label">Bayoo Quantity:</span>
                        <span class="detail-value">${lotData.bayooquantity}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Drodro Quantity:</span>
                        <span class="detail-value">${lotData.drodroquantity}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Rhoo Quantity:</span>
                        <span class="detail-value">${lotData.rhooquantity}</span>
                    </div>
                </div>
            </div>
            
            <div class="totals-section">
                <h4 style="text-align: center; margin-bottom: 15px;">Summary Totals</h4>
                <div class="totals-grid">
                    <div class="total-item">
                        <div class="total-label">Total Kote Distribution</div>
                        <div class="total-value">${lotData.inf1quantity + lotData.inf2quantity + lotData.inf3quantity + lotData.inf4quantity + lotData.spqquantity + lotData.bnhqquantity}</div>
                    </div>
                    <div class="total-item">
                        <div class="total-label">Total Camp Distribution</div>
                        <div class="total-value">${lotData.bayooquantity + lotData.drodroquantity + lotData.rhooquantity}</div>
                    </div>
                    <div class="total-item">
                        <div class="total-label">Total Distributed</div>
                        <div class="total-value">${lotData.inf1quantity + lotData.inf2quantity + lotData.inf3quantity + lotData.inf4quantity + lotData.spqquantity + lotData.bnhqquantity + lotData.bayooquantity + lotData.drodroquantity + lotData.rhooquantity}</div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                Generated from BANRDB Store Management System - Confidential Document
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for the content to load, then print
    printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };
}




