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

let serial = 1;



function writeInventoryItem(name, unit, held, instore = held) {
    const newname = name.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase() +'_'+serial;
    set(ref(db, 'cimic/main/' + newname),{
        name: name,
        unit: unit,
        authorized: 0,
        total: held,
        servicable: held,
        unservicable: 0,
        issue: 0,
        instore: instore
    }).then(() => {
        console.log("Item Added Successfully"+ serial);
        serial++;
    })
    .catch((error) => {
        console.error("Error adding item: ", error);
        alert("Error adding item: " + error.message);
    });

}
// CIMIC Store - Special Stock Taking
// Unit: BANRDB-8
// Date: December 2025

// Sports Items
writeInventoryItem("Metal Trophy", "Nos", 24);
writeInventoryItem("Medal", "Nos", 130);
writeInventoryItem("Football (Deer)", "Nos", 76);
writeInventoryItem("Football (Color)", "Nos", 27);
writeInventoryItem("Football (Net)", "Nos" ,1);
writeInventoryItem("Volleyball", "Nos", 27);
writeInventoryItem("Volleyball (Net)", "Nos", 20);
writeInventoryItem("Jersey", "Nos", 94);
writeInventoryItem("Flute", "Nos", 20);
writeInventoryItem("Skipping Rope", "Nos", 10);
writeInventoryItem("Daba Set", "Nos" ,3);
writeInventoryItem("Ludo Set", "Nos" ,1);

// Education Items
writeInventoryItem("Pen", "Nos", 10222);
writeInventoryItem("Paper", "Nos", 5123);
writeInventoryItem("Chalk Pencil", "Packet", 180);
writeInventoryItem("Pencil", "Nos", 2000);
writeInventoryItem("Pencil Cutter", "Nos", 800);
writeInventoryItem("Eraser", "Nos", 800);
writeInventoryItem("Color Pencil Box", "Nos", 15);
writeInventoryItem("Geometry Box", "Nos", 97);
writeInventoryItem("School Bag", "Nos", 180);
writeInventoryItem("Water Pot", "Nos", 278);
writeInventoryItem("Clipboard", "Nos", 311);
writeInventoryItem("Office File", "Nos", 500);

// Gift Items
writeInventoryItem("T-Shirt", "Nos", 25);
writeInventoryItem("Helmet", "Nos", 12);
writeInventoryItem("Sunglass", "Nos", 11);
writeInventoryItem("Purse Bag", "Nos" ,4);
writeInventoryItem("Side Bag", "Nos" ,5);
writeInventoryItem("Midwife Kit", "Nos" ,6);
writeInventoryItem("Plastic Mug", "Nos" ,5);
writeInventoryItem("Special Green Tea", "Nos" ,1);