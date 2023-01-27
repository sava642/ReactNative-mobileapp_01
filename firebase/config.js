// Import the functions you need from the SDKs you need
// import * as firebase from "firebase";
// import "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
// 	apiKey: "AIzaSyB_4CiMAoBkOLRUIGBLYropH4jQas5iebY",
// 	authDomain: "mobileapp-12901.firebaseapp.com",
// 	projectId: "mobileapp-12901",
// 	storageBucket: "mobileapp-12901.appspot.com",
// 	messagingSenderId: "342505727400",
// 	appId: "1:342505727400:web:9ce488fe83246ceabf699d",
// 	measurementId: "G-0GDP7KVE3B"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = firebase.auth();


// const analytics = getAnalytics(app);
//export { auth };





// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { initializeApp } from 'firebase/app';
// import {
// 	initializeAuth,
// 	getReactNativePersistence
// } from 'firebase/auth/react-native';


import firebase from "firebase/compat";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";

// import firebase from "firebase";
// import "firebase/auth";
// import "firebase/firestore";
// import "firebase/storage";


// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyB_4CiMAoBkOLRUIGBLYropH4jQas5iebY",
	authDomain: "mobileapp-12901.firebaseapp.com",
	projectId: "mobileapp-12901",
	storageBucket: "mobileapp-12901.appspot.com",
	messagingSenderId: "342505727400",
	appId: "1:342505727400:web:9ce488fe83246ceabf699d",
	measurementId: "G-0GDP7KVE3B",
	// apiKey: "AIzaSyDFauNPYaTGMGWKEvyHdTh8m_kfhKDiQuU",
	// authDomain: "rn-social-391ec.firebaseapp.com",
	databaseURL: "https://rn-social-391ec.firebaseio.com",
	// projectId: "rn-social-391ec",
	// storageBucket: "rn-social-391ec.appspot.com",
	// messagingSenderId: "974670373504",
	// appId: "1:974670373504:web:fe01e1286f5ad11ff0fc65",
};
// Initialize Firebase

// const app = initializeApp(firebaseConfig);

// // initialize auth
// const auth = initializeAuth(app, {
// 	persistence: getReactNativePersistence(AsyncStorage)
// });

export default firebase.initializeApp(firebaseConfig);
// export { auth };
// export { app };
//firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth();
// const db = firebase.firestore();
// const storage = firebase.storage();

// export { auth, db, storage };
