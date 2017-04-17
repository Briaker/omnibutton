import * as firebase from 'firebase';

export const base = firebase.initializeApp({ 
    apiKey: "AIzaSyBVfDgnUi5G_G9nM4Kd-xH6xDiglS-qkmM",
    authDomain: "omnibutton-3ebb3.firebaseapp.com",
    databaseURL: "https://omnibutton-3ebb3.firebaseio.com",
    projectId: "omnibutton-3ebb3",
    storageBucket: "omnibutton-3ebb3.appspot.com",
    messagingSenderId: "68047908685"
});

export const db = base.database();

export const auth = base.auth();
export const storage = base.storage();

export const storageKey = 'b073494c421c14918fd277db41b30a36';

export const isAuthenticated = () => {
    return !!auth.currentUser || !!localStorage.getItem(storageKey);
}