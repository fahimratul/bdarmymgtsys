import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, get, ref, update } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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
let vehicleKey = null;
let role = sessionStorage.getItem('role');
window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    if (role !== 'mtjco' && role !== 'mtnco' &&  role !=='mto') {
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

let dataCache = {};
let currentEditKey = null;

let conditionlist={
    alr:"A LR",
    asr:"A SR",
    inmaintenance:"In Maintenance",
    grounded:"Grounded"
};
let classlist={
    classA:"Class A",
    classB:"Class B",
    spl:"Spl Veh",
    sp:"SP Veh",
    watertrailer:"Water Trailer",
    lowbed:"Low Bed/Fuel /Water /Trailer"
};
let camplist={
    bayoo:"BAYOO",
    drodro:"DRODRO",
    rhoo:"RHOO",
    ndromo:"NDROMO"
};


function loadvehicledata() {
    const urlparams = new URLSearchParams(window.location.search);
    vehicleKey = urlparams.get('key');
    const dbRef = ref(db, `vehiclelist/` + vehicleKey);
    const loadingOverlay = document.getElementById('loadingOverlay');
    get(dbRef).then((snapshot) => {
        dataCache = snapshot.val();
        
        if (dataCache) {
            console.log('Vehicle Data:', dataCache);
            document.getElementById('title').textContent = `Vehicle History - ${dataCache.vehicleNumber || ''}`;
            document.getElementById('vehicleNumber').textContent = dataCache.vehicleNumber || '';
            document.getElementById('typeofvehicle').textContent = dataCache.typeofvehicle || '';
            document.getElementById('unnumber').textContent = dataCache.unnumber || '';
            document.getElementById('classtype').textContent = classlist[dataCache.classtype] || dataCache.classtype || '';
            document.getElementById('camp').textContent = camplist[dataCache.camp] || dataCache.camp || '';
            document.getElementById('condition').textContent = conditionlist[dataCache.condition] || dataCache.condition || '';
            // Disable buttons based on condition
            document.getElementById('sendformaintainace').disabled = false;
            document.getElementById('markasgrounded').disabled = false;
            document.getElementById('markasalr').disabled = false;
            document.getElementById('markasasr').disabled = false;

            if(dataCache.condition === 'inmaintenance'){
                document.getElementById('sendformaintainace').disabled = true;
            }
            if(dataCache.condition === 'grounded'){
                document.getElementById('markasgrounded').disabled = true;
            }
            if(dataCache.condition === 'alr'){
                document.getElementById('markasalr').disabled = true;
            }
            if(dataCache.condition === 'asr'){
                document.getElementById('markasasr').disabled = true;
            }
        } else {
            console.log('No vehicle data available');
        }      
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    }).catch((error) => {
        console.error('Error loading data:', error);
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    });
}



loadvehicledata();

let vehiclehistoryCache = {};
function loadvehiclehistory() {

    const dbRef = ref(db, `vehiclelist/`+ vehicleKey +`/history`);
    const loadingOverlay = document.getElementById('loadingOverlay');
    get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        vehiclehistoryCache = data || {};
        const tableBody = document.getElementById('history-tbody');
        
        if (!tableBody) {
            console.error('VehicleTableBody element not found');
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            return;
        }
        
        let html = '';
        
        // Build table rows
        if (data) {
            for (const key in data) {
                const record = data[key];
                console.log('History Record:', record, key);
                html += `<tr>
                    <td>${key}</td>
                    <td>${record.date || ''}</td>
                    <td>${record.event || ''}</td>
                    <td>${record.details || ''}</td>
                </tr>`;
                
                // Format date 
            }
        } else {
            html = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #666;">No history data available</td></tr>';
        }
        tableBody.innerHTML = html;    
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    }).catch((error) => {
        console.error('Error loading data:', error);
        const tableBody = document.getElementById('history-tbody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #e53e3e;">Error loading data. Please refresh the page.</td></tr>';
        }
        // Hide loading overlay even on error
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    });
}


loadvehiclehistory();


const modal = document.getElementById('editModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editForm = document.getElementById('editForm');
const sendmaintenancebtn = document.getElementById('sendformaintainace');
const markasgroundedbtn = document.getElementById('markasgrounded');
const markasalrbtn = document.getElementById('markasalr');
const markasasrbtn = document.getElementById('markasasr');
markasgroundedbtn.addEventListener('click', () => {
    openEditModal("Grounded");
});
markasalrbtn.addEventListener('click', () => {
    openEditModal("Marking as A LR");
});
markasasrbtn.addEventListener('click', () => {
    openEditModal("Marking as A SR");
});
sendmaintenancebtn.addEventListener('click', () => {
    openEditModal("Maintenance");
});



function openEditModal(event) {
    document.getElementById('editevent').value = event || '';
    document.getElementById('editdate').valueAsDate = new Date();
    modal.classList.remove('hidden');
}

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function updateVehicleHistoryRecord(event, details, date) {
    const newKey = Date.now().toString();
    const updates = {};
    updates[`vehiclelist/${vehicleKey}/history/${newKey}`] = {
        event: event,
        details: details,
        date: date
    };

    update(ref(db), updates)
        .then(() => {
            showNotification('Maintenance record added successfully.');
            closeEditModal();
            loadvehiclehistory();
        })
        .catch((error) => {
            console.error('Error adding maintenance record:', error);
        });
}

function updaterecord(event, details, date, msg) {
    if(role==='mtjco' || role==='mtnco'){
        const baNumber = sessionStorage.getItem('baNumber');
        let dbref = ref(db, `officernotification/mto/notifications/${Date.now()}`);
        const notificationData = {
            vehicleKey: vehicleKey,
            event: event,
            details: details,
            date: date,
            msg: 'Vehicle Number ' + vehicleKey + ' '+ msg + ' Details: ' + details,
        };
        update(dbref, notificationData)
        .then(() => {
            console.log('Notification sent to MTO successfully.');
            showNotification('Request sent to MTO successfully.');
            closeEditModal();
        })
        .catch((error) => {
            console.error('Error sending notification to MTO:', error);
        });
    }
    if(role==='mto'){
        let dbref = ref(db, `clo_cc_notification/${Date.now()}`);    
        updateVehicleHistoryRecord(event, details, date);
        const notificationData = {
            msg: 'Vehicle Number ' + vehicleKey + ' '+ msg + ' Details: ' + details,
        };
        update(dbref, notificationData)
        .then(() => {
            console.log('Notification sent to CLOC successfully.');
        })
        .catch((error) => {
            console.error('Error sending notification to CLOC:', error);
        });
        dbref = ref(db, `vehiclelist/`+vehicleKey);
        update(dbref, {condition: event === 'Maintenance' ? 'inmaintenance' : event === 'Grounded' ? 'grounded' : event === 'Marking as A LR' ? 'alr' : event === 'Marking as A SR' ? 'asr' : dataCache.condition})
        .then(() => {
            loadvehicledata();
            console.log('Vehicle condition updated to In Maintenance.');
        })
        .catch((error) => {
            console.error('Error updating vehicle condition:', error);
        });
    }
}


document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const event = document.getElementById('editevent').value;
    const details = document.getElementById('editdetails').value;
    const date = document.getElementById('editdate').value;
    if(event === 'Maintenance'){
        updaterecord(event, details, date, "has request for maintenance.");
    } else if(event === 'Grounded'){
        updaterecord(event, details, date, "has request for to be marked as Grounded.");
    } else if(event === 'Marking as A LR'){
        updaterecord(event, details, date, "has request for to be marked as A LR.");
    } else if(event === 'Marking as A SR'){
        updaterecord(event, details, date, "has request for to be marked as A SR.");
    }
    closeEditModal();
});


function closeEditModal() {
    modal.classList.add('hidden');
}

modalCloseBtn.addEventListener('click', closeEditModal);
cancelEditBtn.addEventListener('click', closeEditModal);


