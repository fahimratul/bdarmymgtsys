
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

import { getDatabase, set, get, ref } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


import {showNotification} from './notification.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
console.log(db);
console.log("Firebase Initialized");



function readUserData(banumber) {
    const dbRef = ref(db, 'users/' + banumber);
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}


function handlelogin() {
    console.log("Login button clicked");
    const banumber = document.getElementById('ba-number').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    console.log(`BA Number: ${banumber}, Password: ${password}, Role: ${role}`);

    const dbRef = ref(db, 'users/' + banumber);
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.password === password && userData.role === role) {
                console.log("Login successful");
                if (role === 'engrnco') {
                    localStorage.setItem('baNumber', banumber);
                    window.location.href = 'engrnco.html';
                }
                else if (role === 'admin') {
                    localStorage.setItem('baNumber', banumber);
                    window.location.href = 'admin.html';
                }
            } else {
                console.log("Invalid password or role");
                showNotification("Invalid password or role", "error", "Login Failed");
            }
        } else {
            console.log("No data available for this BA Number");
            showNotification("No data available for this BA Number", "error", "Login Failed");
        }
    }).catch((error) => {
        console.error(error);
        alert("Error fetching data");
    });
}


const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', handlelogin);




console.log("Event listener added to login button");

