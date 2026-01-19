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
    if( role_type !== 'cc' && role_type !== 'clo') { 
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


// Clear sessionStorage when the site is closed
 
const role = sessionStorage.getItem('role');


window.addEventListener('DOMContentLoaded', () => {
    const username=sessionStorage.getItem('username');
    const rank=sessionStorage.getItem('rank');
    const banumber=sessionStorage.getItem('baNumber');
    document.getElementById('username').textContent='Name: ' + username;
    document.getElementById('rank').textContent=ranklist[rank] ? 'Rank: ' + ranklist[rank] : 'Rank: ' + rank;
    document.getElementById('banumber').textContent='BA Number: ' + banumber;
    const titleElement = document.getElementById('title');
    if(role === 'cc'){
        
        titleElement.textContent = 'Welcome , Contingent Commander';
    }
    else if(role === 'clo'){
        
        titleElement.textContent = 'Welcome , Cheif Logistic Officer';
    }
    else {
        console.error('Invalid role:', role);
        showNotification("Invalid role. Cannot load inventory data.", "error", "Load Failed");
        window.location.href = 'login.html';
        return;
    }
    
});


import {showNotification} from './notification.js';

console.log("Officer Script Loaded");

let dataCache = {
    engr:{},
    sig:{},
    mt:{},
    bknco:{},
    bqms:{}
};

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

function loaditemdata(type, path) {
    let dbRef=ref(db, path);
    let yValues = [0,0,0,0]; // Servicable, Unservicable, Issued, In Store
    let total=0; 


    const loadingOverlay = document.getElementById('loadingOverlay');

    get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        dataCache[type] = data || {};
        
        if (data) {
            for (const key in data) {
                const item = data[key];
                yValues[0] += Number(item.servicable) || 0;
                yValues[1] += Number(item.unservicable) || 0;
                yValues[2] += Number(item.issue) || 0;
                yValues[3] += Number(item.instore) || 0;
                total += Number(item.total) || 0;
            }
        } else {
            console.log('No data available');
        }
        const xValues = ["Servicable", "Unservicable", "Issued", "In Store"];
        const titleText =   type === 'engr' ? 'Engineer Inventory Status' :
                            type === 'sig' ? 'Signal Inventory Status' :
                            type === 'mt' ? 'Military Transport Inventory Status' :
                            type === 'bknco' ? 'BKNCO Inventory Status' :
                            type === 'bqms' ? 'BQMS Inventory Status' :
                             'Inventory Status';
        const piedata = [{labels:xValues, values:yValues, type:"pie"}];
        Plotly.newPlot(type, piedata, {title: titleText});
        document.getElementById(type + '-total').textContent = `Total: ${total}`;
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    }).catch((error) => {
        console.error('Error loading data:', error);
        showNotification("Error loading data. Please try again.", "error", "Load Failed");
        // Hide loading overlay even on error
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 100);
        }
    });
}



loaditemdata('engr', 'engrinventory/');
loaditemdata('sig', 'siginventory/');
loaditemdata('mt', 'mtinventory/');
loaditemdata('bknco', 'bkncoinventory/');
loaditemdata('bqms', 'bqmsinventory/');


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
