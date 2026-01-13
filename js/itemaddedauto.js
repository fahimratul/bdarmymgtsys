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




function writeInventoryItem(name, authorized, total, servicable, unservicable, issue, instore) {
    const newname = name.replace(/[\s/#$\[\].]+/g, '_').toLowerCase();
        set(ref(db, 'mtinventory/' + newname),{
                name: name,
                authorized: authorized,
                total: total,
                servicable: servicable,
                unservicable: unservicable,
                issue: issue,
                instore: instore
            });
            console.log("Inventory item added:", newname);
} 

writeInventoryItem("Tool Bag", "Nos", 23, 23, 0, 0, 23);
writeInventoryItem("Jack Mechanical", "Nos", 23, 23, 0, 0, 23);
writeInventoryItem("Jack Handel", "Nos", 31, 31, 0, 0, 31);
writeInventoryItem("Spanner 8×10", "Nos", 20, 20, 0, 0, 20);
writeInventoryItem("Spanner 12×14", "Nos", 4, 4, 0, 0, 4);
writeInventoryItem("Sigaret Lighter", "Nos", 15, 15, 0, 0, 15);
writeInventoryItem("Screwdriver", "Nos", 10, 10, 0, 0, 10);
writeInventoryItem("Adjustable 200mm", "Nos", 14, 14, 0, 0, 14);
writeInventoryItem("Pllers Slip Joint", "Nos", 11, 11, 0, 0, 11);
writeInventoryItem("Wheel brush", "Nos", 38, 38, 0, 0, 38);
writeInventoryItem("Inspection Lamp", "Nos", 31, 31, 0, 0, 31);
writeInventoryItem("Owners manual", "Nos", 92, 92, 0, 0, 92);
writeInventoryItem("Box Spanner", "Nos", 0, 0, 0, 0, 0);
writeInventoryItem("Strips for Securing ammo box", "Nos", 0, 0, 0, 0, 0);
writeInventoryItem("Wheel Stoper", "Nos", 23, 23, 0, 0, 23);
writeInventoryItem("Try pressereguge", "Nos", 19, 19, 0, 0, 19);
writeInventoryItem("Pad lock", "Nos", 12, 12, 0, 0, 12);
writeInventoryItem("Sun visor (Fitted)", "Nos", 50, 50, 0, 0, 50);
writeInventoryItem("Rear view mirror (Fitted)", "Nos", 33, 33, 0, 0, 33);
writeInventoryItem("Driver mirror (LT,RT) (Fitted)", "Nos", 64, 64, 0, 0, 64);
writeInventoryItem("Jack Hydraulic ", "Nos", 13, 13, 0, 0, 13);
writeInventoryItem("Lever long", "Nos", 4, 4, 0, 0, 4);
writeInventoryItem("Allen wrech", "Nos", 6, 6, 0, 0, 6);
writeInventoryItem("Flas light with bag", "Nos", 3, 3, 0, 0, 3);
writeInventoryItem("Fastaid box", "Nos", 3, 3, 0, 0, 3);
writeInventoryItem("Shovel", "Nos", 3, 3, 0, 0, 3);
writeInventoryItem("Axe", "Nos", 3, 3, 0, 0, 3);
writeInventoryItem("Fire Extinguisher ", "Nos", 3, 3, 0, 0, 3);
writeInventoryItem("Try chain", "Nos", 8, 8, 0, 0, 8);
writeInventoryItem("Reflector trialgle", "Nos", 10, 10, 0, 0, 10);
writeInventoryItem("Fuel refueling pump ", "Nos", 2, 2, 0, 0, 2);
writeInventoryItem("Extensions cable ", "Nos", 5, 5, 0, 0, 5);
writeInventoryItem("GPS", "Nos", 3, 3, 0, 0, 3);
writeInventoryItem("Jerricane throttle with jerricane", "Nos", 2, 2, 0, 0, 2);
writeInventoryItem("Owners manual", "Nos", 8, 8, 0, 0, 8);

console.log("All inventory items added.");