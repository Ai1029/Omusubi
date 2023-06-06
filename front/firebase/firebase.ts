// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
    apiKey: "AIzaSyBV5Kbng9n2U38_vpXMkWWhmhUhEDcgpJA",
    authDomain: "omusubi-login.firebaseapp.com",
    projectId: "omusubi-login",
    storageBucket: "omusubi-login.appspot.com",
    messagingSenderId: "1014067615979",
    appId: "1:1014067615979:web:557578f8a78c3ef76086ae",
    measurementId: "G-XJLKKY9H3T"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
  
export { auth };