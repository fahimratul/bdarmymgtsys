import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase,set,  get, ref, update , remove, onValue} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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

let allowedRoles = ['mtjco', 'mtnco', 'mto','cc', 'clo'];

window.addEventListener('DOMContentLoaded', () => {
    let baNumber = sessionStorage.getItem('baNumber');
    let role = sessionStorage.getItem('role');
    if (!allowedRoles.includes(role)) {
        console.error('Unauthorized role for mto. Access denied.');
        window.location.href = 'index.html';
        return;
    }
    if (!baNumber) {
        console.error('BA Number not found in local storage.');
        window.location.href = 'index.html';
        return;
    }
    console.log('Logged in as BA Number:', baNumber);
});
 


import {showNotification} from './../../js/notification.js';
console.log(" Script Loaded");


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


const role = sessionStorage.getItem('role');


window.addEventListener('DOMContentLoaded', () => {
    const username=sessionStorage.getItem('username');
    const rank=sessionStorage.getItem('rank');
    const banumber=sessionStorage.getItem('baNumber');
    document.getElementById('username').textContent='Name: ' + username;
    document.getElementById('rank').textContent=ranklist[rank] ? 'Rank: ' + ranklist[rank] : 'Rank: ' + rank;
    document.getElementById('banumber').textContent='BA Number: ' + banumber;
});



let vehicleDataCache = {};




function loadvehicledata() {


    const dbRef = ref(db, `vehiclelist/main/`);
    const loadingOverlay = document.getElementById('loadingOverlay');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        vehicleDataCache = data || {};
        let serial = 1;
        const tableBody = document.getElementById('VehicleTableBody');
        let vehicleinfoclass = { 
            classA:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            },
            classB:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            },
            spl:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            },
            sp:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            },
            watertrailer:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            },
            lowbed:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            }
        };
        let vehicleinfo = {
            total:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            },
            bayoo:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            },
            drodro:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            },
            rhoo:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            },
            ndromo:{
                total:0,
                alr:0,
                asr:0,
                inmaintenance:0,
                grounded:0
            }
        };
        if (!tableBody) {
            console.error('VehicleTableBody element not found');
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            return;
        }
        
        let html = '';
        
        // Build table rows
        if (data) {
            for (const key in data) {
                const vehicle = data[key];
                const vehiclenumber = vehicle.vehicleNumber || ''; 
                const unnumber = vehicle.unnumber ?? '';
                const typeofvehicle = vehicle.typeofvehicle ?? '';
                const classtype = vehicle.classtype || '';
                const condition = vehicle.condition || '';
                const camp = vehicle.camp || '';
                // console.log(vehicle);

                html += `<tr id="${key}"data-key="${key}">
                            <td>${serial}</td>
                            <td>${vehiclenumber}</td>
                            <td>${unnumber}</td>
                            <td>${typeofvehicle}</td>
                            <td>${classlist[classtype] || classtype}</td>
                            <td>${conditionlist[condition] || condition}</td>
                            <td>${camplist[camp] || camp}</td>
                            <td><button class="edit-btn" data-key='${key}'>Take Action</button></td>
                            <td><button class="delete-btn" data-key='${key}'>Delete</button></td>
                        </tr>`;
                serial += 1;
                vehicleinfo.total.total+=1;
                if (vehicleinfo.total[condition] !== undefined) vehicleinfo.total[condition]+=1;
                if (vehicleinfo[camp]) {
                    vehicleinfo[camp].total+=1;
                    if (vehicleinfo[camp][condition] !== undefined) vehicleinfo[camp][condition]+=1;
                }
                if (vehicleinfoclass[classtype]) {
                    vehicleinfoclass[classtype].total+=1;
                    if (vehicleinfoclass[classtype][condition] !== undefined) vehicleinfoclass[classtype][condition]+=1;
                }
            }
        } else {
            html = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: #666;">No inventory data available</td></tr>';
        }
        
        tableBody.innerHTML = html;
        document.getElementById('totalVehicles').textContent = vehicleinfo.total.total;
        document.getElementById('ALRVehicles').textContent = vehicleinfo.total.alr;
        document.getElementById('ASRVehicles').textContent = vehicleinfo.total.asr;
        document.getElementById('inMaintenanceVehicles').textContent = vehicleinfo.total.inmaintenance;
        document.getElementById('groundedVehicles').textContent = vehicleinfo.total.grounded;

        for (const camp in camplist) {
            document.getElementById(`totalVehicles${camp}`).innerHTML = `<span>Total</span> ${vehicleinfo[camp].total}`;
            document.getElementById(`ALRVehicles${camp}`).innerHTML = `<span>A LR</span> ${vehicleinfo[camp].alr}`;
            document.getElementById(`ASRVehicles${camp}`).innerHTML = `<span>A SR</span> ${vehicleinfo[camp].asr}`;
            document.getElementById(`inMaintenanceVehicles${camp}`).innerHTML = `<span>Maintenance</span> ${vehicleinfo[camp].inmaintenance}`;
            document.getElementById(`groundedVehicles${camp}`).innerHTML = `<span>Grounded</span> ${vehicleinfo[camp].grounded}`;
            
        }
        for (const classtype in classlist) {
            document.getElementById(`totalVehicles${classtype}`).innerHTML = `<span>Total</span> ${vehicleinfoclass[classtype].total}`;
            document.getElementById(`ALRVehicles${classtype}`).innerHTML = `<span>A LR</span> ${vehicleinfoclass[classtype].alr}`;
            document.getElementById(`ASRVehicles${classtype}`).innerHTML = `<span>A SR</span> ${vehicleinfoclass[classtype].asr}`;
            document.getElementById(`inMaintenanceVehicles${classtype}`).innerHTML = `<span>In Maintenance</span> ${vehicleinfoclass[classtype].inmaintenance}`;
            document.getElementById(`groundedVehicles${classtype}`).innerHTML = `<span>Grounded</span> ${vehicleinfoclass[classtype].grounded}`;    
        }
        // Attach edit handlers
        tableBody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                vehiclehistoryload(key);
            });
        });
        tableBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                if (confirm('Are you sure you want to delete this vehicle?')) {
                    const dbRef = ref(db, `vehiclelist/main/` + key);
                    remove(dbRef).then(() => {
                        remove(ref(db, `vehiclelist/` + key)).catch((error) => {
                            console.error('Error removing vehicle from list:', error);
                        });
                        console.log('Vehicle deleted successfully');
                        showNotification('Vehicle deleted successfully', 'success', 'Deletion Successful');
                        loadvehicledata();
                    }).catch((error) => {
                        console.error('Error deleting vehicle:', error);
                        showNotification('Error deleting vehicle', 'error', 'Deletion Failed');
                    });
                }
            });
        });


        
        // Hide loading overlay after data is loaded
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    },(error) => {
        console.error('Error loading data:', error);
        const tableBody = document.getElementById('VehicleTableBody');
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
let notificationDataCache = {};

const notificationbody = document.getElementById('officer_notification');
function loadnotifactions() {
    const dbRef = ref(db, 'officernotification/mto/notifications');
    onValue(dbRef, (snapshot) => {
        notificationDataCache = snapshot.val();
        let html = '';
        notificationbody.style.display='flex';
        if (notificationDataCache) {
            for (const key in notificationDataCache) {
                const notification = notificationDataCache[key];
                const message = notification.msg || '';
                html += `<div class="msg" id="notification-${key}">
                        <p class="content">${message}<br><br> </p>
                        <button class="accept-btn" data-key="${key}">Accept</button>
                        <button class="reject-btn" data-key="${key}">Reject</button> 
                    </div>`;
            }
            notificationbody.innerHTML = html;
            notificationbody.style.minHeight='max-content';
            console.log("Notifications Loaded");
            console.log(notificationDataCache);
            // Attach accept/reject handlers
            notificationbody.querySelectorAll('.accept-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.key;
                    acceptNotificationMTO(key);
                    console.log('Accepted notification with key:', key);
                });
            });
            notificationbody.querySelectorAll('.reject-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.key;
                    rejectNotificationMTO(key);
                    console.log('Rejected notification with key:', key);
                });
            });
        }
    },(error) => {
        console.error('Error loading notifications:', error);
    });
}


let vehicledeletenotificationDataCache = {};
function loadvehicledeletenotifications() {
    const dbRef = ref(db, 'vehicledeleted');
    onValue(dbRef, (snapshot) => {
        vehicledeletenotificationDataCache = snapshot.val();
        let html = '';
        document.getElementById('vehicledeletenotification').style.display='flex';
        if(vehicledeletenotificationDataCache) {
            for (const key in vehicledeletenotificationDataCache) {
                const notification = vehicledeletenotificationDataCache[key];
                const message = notification.msg || '';
                html+=`<div class="msg" id="vehicledelete-notification-${key}">
                        <p class="content">${message}<br><br> </p>
                        <button class="accept-btn" onclick="acceptVehicleDelete('${key}')">Delete</button>
                        <button class="reject-btn" onclick="rejectVehicleDelete('${key}')">Cancel</button> 
                    </div>`;
            }
            document.getElementById('vehicledeletenotification').innerHTML = html;
        }
    },(error) => {
        console.error('Error loading vehicle delete notifications:', error);
    });
}

function acceptVehicleDelete(key) {
    const dbRef = ref(db, `vehiclelist/main/` + key);
                    remove(dbRef).then(() => {
                        remove(ref(db, `vehiclelist/` + key)).catch((error) => {
                            console.error('Error removing vehicle from list:', error);
                        });
                        console.log('Vehicle deleted successfully');
                        showNotification('Vehicle deleted successfully', 'success', 'Deletion Successful');
                        loadvehicledata();
                    }).catch((error) => {
                        console.error('Error deleting vehicle:', error);
                        showNotification('Error deleting vehicle', 'error', 'Deletion Failed');
                    });
    const dbref = ref(db, 'vehicledeleted/' + key);
    remove(dbref)
    .then(() => {
        console.log('Vehicle delete notification removed successfully after acceptance.');
    })
    .catch((error) => {
        console.error('Error removing vehicle delete notification:', error);
    });
    document.getElementById('vehicledelete-notification-'+key).remove();
}

function rejectVehicleDelete(key) {
    const dbref = ref(db, 'vehicledeleted/' + key);
    remove(dbref)
    .then(() => {
        console.log('Vehicle delete notification removed successfully after rejection.');
        showNotification('Vehicle delete request rejected successfully.', 'success', 'Rejection Successful');
        loadvehicledeletenotifications();
    })
    .catch((error) => {
        console.error('Error removing vehicle delete notification:', error);
        showNotification('Failed to reject vehicle delete request. Please try again later.', 'error', 'Rejection Failed');
    });
    document.getElementById('vehicledelete-notification-'+key).remove();
}


window.acceptVehicleDelete = acceptVehicleDelete;
window.rejectVehicleDelete = rejectVehicleDelete;




let campchangeNotificationDataCache = {};

function loadcampchangeNotifications() {
    const dbRef = ref(db, 'officerapproval/campchange/');
    onValue(dbRef, (snapshot) => {
        campchangeNotificationDataCache = snapshot.val();
        let html = '';
        document.getElementById('campchange_notification').style.display='flex';
        if (campchangeNotificationDataCache) {
            for (const key in campchangeNotificationDataCache) {
                const notification = campchangeNotificationDataCache[key];
                const message = notification.msg || '';
                html += `<div class="msg" id="campchange-notification-${key}">
                        <p class="content">${message}<br><br> </p>
                        <button class="accept-btn" data-key="${key}">Accept</button>
                        <button class="reject-btn" data-key="${key}">Reject</button> 
                    </div>`;
            }
            notificationbody.innerHTML = html;
            notificationbody.style.minHeight='max-content';
            console.log("Notifications Loaded");
            console.log(campchangeNotificationDataCache);
            // Attach accept/reject handlers
            notificationbody.querySelectorAll('.accept-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.key;
                    acceptCampchange(key);
                    console.log('Accepted notification with key:', key);
                });
            });
            notificationbody.querySelectorAll('.reject-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.key;
                    rejectCampchange(key);
                    console.log('Rejected notification with key:', key);
                });
            });
        }
    },(error) => {
        console.error('Error loading notifications:', error);
    });
}

if(role==='mto'){
    loadnotifactions();
    loadcampchangeNotifications();
    loadvehicledeletenotifications();
}
function acceptCampchange(key) {
    const notification = campchangeNotificationDataCache?.[key];
    if (!notification) {
        console.error('Notification data not found for key:', key);
        return;
    }
    const vehiclekey = key;
    const newCamp = notification.camp;
    const dbRef = ref(db, `vehiclelist/main/` + vehiclekey);
    update(dbRef, {camp: newCamp})
    .then(() => {
        console.log('Vehicle camp updated successfully.');
        showNotification('Vehicle camp updated successfully.', 'success', 'Update Successful');
    })
    .catch((error) => {
        console.error('Error updating vehicle camp:', error);
        showNotification('Failed to update vehicle camp. Please try again later.', 'error', 'Update Failed');
    });
    const notificationKey = key;
    const dbref = ref(db, 'officerapproval/campchange/' + notificationKey);
    remove(dbref)
    .then(() => {
        console.log('Notification removed successfully after accepting camp change.');
    })
    .catch((error) => {
        console.error('Error removing notification:', error);
    });


    set(ref(db, `clo_cc_notification/${Date.now()}`), {
        msg: 'BA-'+ vehiclekey+ ' has been approved for camp change to ' + camplist[newCamp],
        from: 'MTO',
        date: new Date().toLocaleString()
     }).then(() => {
        console.log('Notification sent to CLOC successfully.');
    }).catch((error) => {
        console.error('Error sending notification to CLOC:', error);
        });    
    set(ref(db, 'clonotification'), true);
    document.getElementById('campchange-notification-'+key).remove();
}
function rejectCampchange(key) {
    const notificationKey = key;
    const dbref = ref(db, 'officerapproval/campchange/' + notificationKey);
    remove(dbref)
    .then(() => {
        console.log('Notification removed successfully after rejecting camp change.');
        showNotification('Camp change request rejected successfully.', 'success', 'Rejection Successful');
        loadcampchangeNotifications();
    })
    .catch((error) => {
        console.error('Error removing notification:', error);
        showNotification('Failed to reject camp change request. Please try again later.', 'error', 'Rejection Failed');
    });
    document.getElementById('campchange-notification-'+key).remove();
    setTimeout(() => {
        loadcampchangeNotifications();
    }, 500);
}        

function updateVehicleHistoryRecord(vehicleKey, event, details, date, notificationKey) {
    const newKey = Date.now().toString();
    const updates = {};
    updates[`vehiclelist/${vehicleKey}/history/${newKey}`] = {
        event: event,
        details: details,
        date: date
    };

    update(ref(db), updates)
        .then(() => {
            let dbref = ref(db, `officernotification/mto/notifications/${notificationKey}`);
            remove(dbref)
            .then(() => {
                console.log('Notification removed successfully after updating history.');    
            })
            .catch((error) => {
                console.error('Error removing notification:', error);
            });
        })
        .catch((error) => {
            console.error('Error adding maintenance record:', error);
        });
    
}
function acceptNotificationMTO(key) {
    let dbref = ref(db, `clo_cc_notification/${Date.now()}`); 
    const notification = notificationDataCache?.[key];
    notificationbody.innerHTML = '';
    console.log(notification);
    const event = notification?.event;
    const details = notification?.details;
    const date = notification?.date;
    const vehiclekey = notification?.vehicleKey;
    const msg = event === 'Maintenance' ? 'has been accepted for Maintenance.' : event === 'Grounded' ? 'has been accepted to be Grounded.' : event === 'Marking as A LR' ? 'has been accepted to be marked as A LR.' : event === 'Marking as A SR' ? 'has been accepted to be marked as A SR.' : '';
    if (!notification) {
        console.error('Notification data not found for key:', key);
        return;
    }   
    updateVehicleHistoryRecord(vehiclekey, event, details, date, key);
    const notificationData = {
        from: 'MT',
        date: new Date().toISOString,
        msg: 'Vehicle Number ' + vehiclekey + ' '+ msg + ' Details: ' + details,
    };
    update(dbref, notificationData)
    .then(() => {
        console.log('Notification sent to CLOC successfully.');
    })
    .catch((error) => {
        console.error('Error sending notification to CLOC:', error);
    });
    dbref = ref(db, `vehiclelist/main/`+vehiclekey);
    update(dbref, {condition: event === 'Maintenance' ? 'inmaintenance' : event === 'Grounded' ? 'grounded' : event === 'Marking as A LR' ? 'alr' : event === 'Marking as A SR' ? 'asr' : dataCache.condition})
    .then(() => {
        console.log('Vehicle condition updated to In Maintenance.');
    })
    .catch((error) => {
        console.error('Error updating vehicle condition:', error);
    });
    loadvehicledata();
    document.getElementById(`notification-${key}`).remove();
}

function rejectNotificationMTO(key) {
    let dbref = ref(db, `officernotification/mto/notifications/${key}`);
    remove(dbref).then(() => {
        console.log('Notification rejected and removed successfully.');
    }).catch((error) => {
        console.error('Error removing notification:', error);
    });
    document.getElementById(`notification-${key}`).remove();
}


loadvehicledata();

function searchVehicles() {
    const searchInput = document.getElementById('searchInputVehicle');
    const tableBody = document.getElementById('VehicleTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    const searchTerm = searchInput.value.toLowerCase();
    Array.from(rows).forEach(row => {
        const vehicleNumber = row.cells[1]?.textContent || '';
        if (vehicleNumber.toLowerCase().includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}


document.getElementById('searchInputVehicle')?.addEventListener('keyup', searchVehicles);


const logoutButton = document.getElementById('logoutButton');

logoutButton?.addEventListener('click', () => {
    sessionStorage.removeItem('baNumber');
    window.location.href = './../index.html';
});


function changePassword() {
    const baNumber = sessionStorage.getItem('baNumber');
    if (!baNumber) {
        console.error('BA Number not found in session storage.');
        window.location.href = './../login.html';
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
                    window.location.href = './../index.html';
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


function filterVehicles() {
    const classFilter = document.getElementById('classFilter')?.value || '';
    const conditionFilter = document.getElementById('conditionFilter')?.value || '';
    const campFilter = document.getElementById('campFilter')?.value || '';
    const tableBody = document.getElementById('VehicleTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const cells = row.getElementsByTagName('td');
        const classtype = cells[4]?.textContent || '';
        const condition = cells[5]?.textContent || '';
        const camp = cells[6]?.textContent || '';

        const matchClass = !classFilter || classtype === classlist[classFilter];
        const matchCondition = !conditionFilter || condition === conditionlist[conditionFilter];
         const matchCamp = !campFilter || camp === camplist[campFilter];

        row.style.display = (matchClass && matchCondition && matchCamp) ? '' : 'none';
    });
}

document.getElementById('classFilter')?.addEventListener('change', filterVehicles);
document.getElementById('conditionFilter')?.addEventListener('change', filterVehicles);
document.getElementById('campFilter')?.addEventListener('change', filterVehicles);

function vehiclehistoryload(key) {
    const vehicle = vehicleDataCache?.[key];
    if (!vehicle) return;
    window.location.href = `vehiclehistory.html?key=${key}`;
}


function filterVehiclesbyclick(classFilter, conditionFilter, campFilter) {
    const tableBody = document.getElementById('VehicleTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const cells = row.getElementsByTagName('td');
        const classtype = cells[4]?.textContent || '';
        const condition = cells[5]?.textContent || '';
        const camp = cells[6]?.textContent || '';

        const matchClass = !classFilter || classtype === classlist[classFilter];
        const matchCondition = !conditionFilter || condition === conditionlist[conditionFilter];
         const matchCamp = !campFilter || camp === camplist[campFilter];

        row.style.display = (matchClass && matchCondition && matchCamp) ? '' : 'none';
    });

    const targetElement = document.getElementById('searchInputVehicle');
    if (targetElement) {
        targetElement.scrollIntoView({
        behavior: 'smooth' // Makes the scroll transition smooth
    });
    }
}



document.getElementById('Allvehicles').addEventListener('click', () => {
    filterVehiclesbyclick('', '', '');
    showNotification('Showing all vehicles', 'info', 'Filter Applied');
});

document.getElementById('alrvehicles').addEventListener('click', () => {
    filterVehiclesbyclick('', 'alr', '');
    showNotification('Showing ALR vehicles', 'info', 'Filter Applied');
});
document.getElementById('asrvehicles').addEventListener('click', () => {
    filterVehiclesbyclick('', 'asr', '');
    showNotification('Showing ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('MaintenanceVehicles').addEventListener('click', () => {
    filterVehiclesbyclick('', 'inmaintenance', '');
    showNotification('Showing Maintenance vehicles', 'info', 'Filter Applied');
}); 
document.getElementById('GroundedVehicles').addEventListener('click', () => {
    filterVehiclesbyclick('', 'grounded', '');
    showNotification('Showing Grounded vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehiclesclassA').addEventListener('click', () => {
    filterVehiclesbyclick('classA', '', '');
    showNotification('Showing Class A vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehiclesclassB').addEventListener('click', () => {
    filterVehiclesbyclick('classB', '', '');
    showNotification('Showing Class B vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehiclesspl').addEventListener('click', () => {
    filterVehiclesbyclick('spl', '', '');
    showNotification('Showing SPL vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehiclessp').addEventListener('click', () => {
    filterVehiclesbyclick('sp', '', '');
    showNotification('Showing SP vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehicleswatertrailer').addEventListener('click', () => {
    filterVehiclesbyclick('watertrailer', '', '');
    showNotification('Showing Water Trailer vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehicleslowbed').addEventListener('click', () => { 
    filterVehiclesbyclick('lowbed', '', '');
    showNotification('Showing Low Bed vehicles', 'info', 'Filter Applied');
});

document.getElementById('ALRVehiclesclassA')?.addEventListener('click', () => {
    filterVehiclesbyclick('classA', 'alr', '');
    showNotification('Showing Class A ALR vehicles', 'info', 'Filter Applied');
});
document.getElementById('ASRVehiclesclassA')?.addEventListener('click', () => {
    filterVehiclesbyclick('classA', 'asr', '');
    showNotification('Showing Class A ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('inMaintenanceVehiclesclassA')?.addEventListener('click', () => {  
    filterVehiclesbyclick('classA', 'inmaintenance', '');
    showNotification('Showing Class A Maintenance vehicles', 'info', 'Filter Applied');
});
document.getElementById('groundedVehiclesclassA')?.addEventListener('click', () => {  
    filterVehiclesbyclick('classA', 'grounded', '');
    showNotification('Showing Class A Grounded vehicles', 'info', 'Filter Applied');
});
document.getElementById('ALRVehiclesclassB')?.addEventListener('click', () => {
    filterVehiclesbyclick('classB', 'alr', '');
    showNotification('Showing Class B ALR vehicles', 'info', 'Filter Applied');
}); 

document.getElementById('ASRVehiclesclassB')?.addEventListener('click', () => {
    filterVehiclesbyclick('classB', 'asr', '');
    showNotification('Showing Class B ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('inMaintenanceVehiclesclassB')?.addEventListener('click', () => {
    filterVehiclesbyclick('classB', 'inmaintenance', '');
    showNotification('Showing Class B Maintenance vehicles', 'info', 'Filter Applied');
});
document.getElementById('groundedVehiclesclassB')?.addEventListener('click', () => {
    filterVehiclesbyclick('classB', 'grounded', '');
    showNotification('Showing Class B Grounded vehicles', 'info', 'Filter Applied');
});
document.getElementById('ALRVehiclesspl')?.addEventListener('click', () => {
    filterVehiclesbyclick('spl', 'alr', '');
    showNotification('Showing SPL ALR vehicles', 'info', 'Filter Applied');
});
document.getElementById('ASRVehiclesspl')?.addEventListener('click', () => {
    filterVehiclesbyclick('spl', 'asr', '');
    showNotification('Showing SPL ASR vehicles', 'info', 'Filter Applied');
}); 
document.getElementById('inMaintenanceVehiclesspl')?.addEventListener('click', () => {
    filterVehiclesbyclick('spl', 'inmaintenance', '');
    showNotification('Showing SPL Maintenance vehicles', 'info', 'Filter Applied');
});

document.getElementById('groundedVehiclesspl')?.addEventListener('click', () => {
    filterVehiclesbyclick('spl', 'grounded', '');
    showNotification('Showing SPL Grounded vehicles', 'info', 'Filter Applied');
});

document.getElementById('ALRVehiclessp')?.addEventListener('click', () => {
    filterVehiclesbyclick('sp', 'alr', '');
    showNotification('Showing SP ALR vehicles', 'info', 'Filter Applied');
});

document.getElementById('ASRVehiclessp')?.addEventListener('click', () => {
    filterVehiclesbyclick('sp', 'asr', '');
    showNotification('Showing SP ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('inMaintenanceVehiclessp')?.addEventListener('click', () => {
    filterVehiclesbyclick('sp', 'inmaintenance', '');
    showNotification('Showing SP Maintenance vehicles', 'info', 'Filter Applied');
}); 
document.getElementById('groundedVehiclessp')?.addEventListener('click', () => {
    filterVehiclesbyclick('sp', 'grounded', '');
    showNotification('Showing SP Grounded vehicles', 'info', 'Filter Applied');
});
document.getElementById('ALRVehicleswatertrailer')?.addEventListener('click', () => {   
    filterVehiclesbyclick('watertrailer', 'alr', '');
    showNotification('Showing Water Trailer ALR vehicles', 'info', 'Filter Applied');
});
document.getElementById('ASRVehicleswatertrailer')?.addEventListener('click', () => {    
    filterVehiclesbyclick('watertrailer', 'asr', '');
    showNotification('Showing Water Trailer ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('inMaintenanceVehicleswatertrailer')?.addEventListener('click', () => {    
    filterVehiclesbyclick('watertrailer', 'inmaintenance', '');
    showNotification('Showing Water Trailer Maintenance vehicles', 'info', 'Filter Applied');
});
document.getElementById('groundedVehicleswatertrailer')?.addEventListener('click', () => {    
    filterVehiclesbyclick('watertrailer', 'grounded', '');
    showNotification('Showing Water Trailer Grounded vehicles', 'info', 'Filter Applied');
});

document.getElementById('ALRVehicleslowbed')?.addEventListener('click', () => {    
    filterVehiclesbyclick('lowbed', 'alr', '');
    showNotification('Showing Low Bed ALR vehicles', 'info', 'Filter Applied');
}); 
document.getElementById('ASRVehicleslowbed')?.addEventListener('click', () => {    
    filterVehiclesbyclick('lowbed', 'asr', '');
    showNotification('Showing Low Bed ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('inMaintenanceVehicleslowbed')?.addEventListener('click', () => {    
    filterVehiclesbyclick('lowbed', 'inmaintenance', '');
    showNotification('Showing Low Bed Maintenance vehicles', 'info', 'Filter Applied');
}); 
document.getElementById('groundedVehicleslowbed')?.addEventListener('click', () => {    
    filterVehiclesbyclick('lowbed', 'grounded', '');
    showNotification('Showing Low Bed Grounded vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehiclesbayoo')?.addEventListener('click', () => {    
    filterVehiclesbyclick('', '', 'bayoo');
    showNotification('Showing Bayoo vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehiclesdrodro')?.addEventListener('click', () => {    
    filterVehiclesbyclick('', '', 'drodro');
    showNotification('Showing Drodro vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehiclesrhoo')?.addEventListener('click', () => {    
    filterVehiclesbyclick('', '', 'rhoo');
    showNotification('Showing Rhoo vehicles', 'info', 'Filter Applied');
});
document.getElementById('totalVehiclesndromo')?.addEventListener('click', () => {    
    filterVehiclesbyclick('', '', 'ndromo');
    showNotification('Showing Ndromo vehicles', 'info', 'Filter Applied');
});

document.getElementById('ALRVehiclesbayoo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'alr', 'bayoo');
    showNotification('Showing Bayoo ALR vehicles', 'info', 'Filter Applied');
});
document.getElementById('ASRVehiclesbayoo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'asr', 'bayoo');
    showNotification('Showing Bayoo ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('inMaintenanceVehiclesbayoo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'inmaintenance', 'bayoo');
    showNotification('Showing Bayoo Maintenance vehicles', 'info', 'Filter Applied');
});
document.getElementById('groundedVehiclesbayoo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'grounded', 'bayoo');
    showNotification('Showing Bayoo Grounded vehicles', 'info', 'Filter Applied');
});
document.getElementById('ALRVehiclesdrodro')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'alr', 'drodro');
    showNotification('Showing Drodro ALR vehicles', 'info', 'Filter Applied');
}); 
document.getElementById('ASRVehiclesdrodro')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'asr', 'drodro');     
    showNotification('Showing Drodro ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('inMaintenanceVehiclesdrodro')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'inmaintenance', 'drodro');
    showNotification('Showing Drodro Maintenance vehicles', 'info', 'Filter Applied');
});
document.getElementById('groundedVehiclesdrodro')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'grounded', 'drodro');
    showNotification('Showing Drodro Grounded vehicles', 'info', 'Filter Applied');
});
document.getElementById('ALRVehiclesrhoo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'alr', 'rhoo');
    showNotification('Showing Rhoo ALR vehicles', 'info', 'Filter Applied');
});
document.getElementById('ASRVehiclesrhoo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'asr', 'rhoo');
    showNotification('Showing Rhoo ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('inMaintenanceVehiclesrhoo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'inmaintenance', 'rhoo'); 
    showNotification('Showing Rhoo Maintenance vehicles', 'info', 'Filter Applied');
});
document.getElementById('groundedVehiclesrhoo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'grounded', 'rhoo');
    showNotification('Showing Rhoo Grounded vehicles', 'info', 'Filter Applied');
});
document.getElementById('ALRVehiclesndromo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'alr', 'ndromo');
    showNotification('Showing Ndromo ALR vehicles', 'info', 'Filter Applied');
}); 
document.getElementById('ASRVehiclesndromo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'asr', 'ndromo');
    showNotification('Showing Ndromo ASR vehicles', 'info', 'Filter Applied');
});
document.getElementById('inMaintenanceVehiclesndromo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'inmaintenance', 'ndromo');
    showNotification('Showing Ndromo Maintenance vehicles', 'info', 'Filter Applied');
}   );  
document.getElementById('groundedVehiclesndromo')?.addEventListener('click', () => {
    filterVehiclesbyclick('', 'grounded', 'ndromo');
    showNotification('Showing Ndromo Grounded vehicles', 'info', 'Filter Applied');
});


