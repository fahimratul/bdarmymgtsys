
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
console.log("Firebase Initialized");
console.log("Analytics Initialized");
console.log(sessionStorage.getItem('role_type'));

let ranklist={
    officer:["lt","capt","Maj","major","ltcol","col","brig","majorgen","ltgen","gen"],
    bqms:["snk","lcpl","cpl","sgt","wo","swo","mwo"],
    mtjconco:["snk","lcpl","cpl","sgt","wo","swo","mwo"]
}
    

function handlelogin() {
    console.log("Login button clicked");
    const banumber = document.getElementById('ba-number').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    if (!banumber || !password) {
        showNotification("Please fill in all fields", "error", "Login Failed");
        return;
    }

    const dbRef = ref(db, 'users/' + banumber);

    const role_type = sessionStorage.getItem('role_type');

    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const role =userData.role;
            const userRank = userData.rank;
            if (role_type === 'bqms' && !ranklist.bqms.includes(userRank)) {
                console.log("Unauthorized rank for BQMS role");
                showNotification("You are not an authorized BQMS", "error", "Login Failed");
                return;
            }
            else if ((role_type === 'mtjconco') && !ranklist.mtjconco.includes(userRank)) {
                console.log("Unauthorized rank for MT JCO/NCO role");
                showNotification("You are not an authorized MT JCO/NCO", "error", "Login Failed");
                return;
            }
            else if ((role_type ==='officer' || role_type === 'clo' || role_type === 'cc') && !ranklist.officer.includes(userRank)) {
                console.log("Unauthorized rank for Officer role");
                showNotification("You are not an authorized Officer", "error", "Login Failed");
                return;
            }
            else{
                if (userData.password === password) {
                    console.log("Login successful");
                    sessionStorage.setItem('baNumber', banumber);
                    sessionStorage.setItem('role', role);
                    sessionStorage.setItem('username', userData.name);
                    sessionStorage.setItem('rank', userData.rank);
                    if (rememberMe) {
                        localStorage.setItem('baNumber', banumber);
                        localStorage.setItem('password', password);
                        console.log("Credentials saved to localStorage");
                    } else {
                        localStorage.removeItem('baNumber');
                        localStorage.removeItem('password');
                        localStorage.removeItem('role');
                    }
                    console.log(`Redirecting to ${role} dashboard`);
                    if (role_type === 'officer'){
                        if (role === 'lo'){
                            console.log("Redirecting to LO dashboard");
                            window.location.href = 'officer_lo_dashboard.html';
                        }
                        else {
                            console.log("Redirecting to officer dashboard");
                            window.location.href = 'officer_dashboard.html';
                        }
                    } 
                    else if (role_type === 'bqms'){
                        window.location.href ='engrnco.html';
                    
                    } 
                    else if (role_type === 'mtjconco'){
                        window.location.href ='mt_dashboard.html';
                    } 
                    else if (role_type === 'clo' || role_type === 'cc'){
                        window.location.href ='clodashboard.html';
                    }
                    else {
                        console.log("Invalid role in database");
                        showNotification("Invalid role in database", "error", "Login Failed");
                    }

                } else {
                    console.log("Invalid password or role");
                    showNotification("Invalid password or role", "error", "Login Failed");
                }
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

