import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, set, get, ref} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
console.log("Firebase Initialized");

console.log("Add Item Script Loaded");


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
