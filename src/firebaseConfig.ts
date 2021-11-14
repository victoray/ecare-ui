import { getApp, getApps, initializeApp } from "firebase/app";
import "firebase/auth";

export const FIREBASE_APP = "ecare";
export const firebaseConfig = {
  apiKey: "AIzaSyAbsbCyQ7FYjJSiapHG2EHsugjSe3TjIT8",
  authDomain: "ecare-2772a.firebaseapp.com",
  projectId: "ecare-2772a",
  storageBucket: "ecare-2772a.appspot.com",
  messagingSenderId: "449886328420",
  appId: "1:449886328420:web:4b4dc0d9e0da305a2e7171",
  measurementId: "G-RME5YR6X2X",
};

console.log(getApps());
if (!getApps().length) {
  console.log("Creating app");
  initializeApp(firebaseConfig);
} else {
  getApp(FIREBASE_APP);
}
