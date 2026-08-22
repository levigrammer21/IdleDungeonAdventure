import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  initializeAuth, GoogleAuthProvider, onAuthStateChanged,
  indexedDBLocalPersistence, browserLocalPersistence, signInWithRedirect, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, getDocFromServer, setDoc,
  collection, query, orderBy, limit, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBySVprnO3qCV598RJMnvL5PIIfgyLqvfs",
  authDomain: "adventuretown-43666.firebaseapp.com",
  projectId: "adventuretown-43666",
  storageBucket: "adventuretown-43666.firebasestorage.app",
  messagingSenderId: "588325089282",
  appId: "1:588325089282:web:d6e212e755e7ba8c70771b"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app,{persistence:[indexedDBLocalPersistence,browserLocalPersistence]});
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export function watchAuth(callback){ return onAuthStateChanged(auth, callback); }
export function googleSignIn(){ return signInWithRedirect(auth, googleProvider); }
export function emailSignIn(email,password){ return signInWithEmailAndPassword(auth,email,password); }
export function emailRegister(email,password){ return createUserWithEmailAndPassword(auth,email,password); }
export function signOutUser(){ return signOut(auth); }

export async function loadGame(uid){
  if(!auth.currentUser || auth.currentUser.uid!==uid)throw new Error("Cloud load blocked: sign in again.");
  const snap=await getDocFromServer(doc(db,"players",uid));
  return snap.exists()?snap.data().game:null;
}

export async function saveGame(uid,game){
  if(!auth.currentUser || auth.currentUser.uid!==uid)throw new Error("Cloud save blocked: sign in again.");
  const safeGame=JSON.parse(JSON.stringify(game));
  const ref=doc(db,"players",uid);
  await setDoc(ref,{game:safeGame,ownerId:uid,updatedAt:serverTimestamp()},{merge:true});
  const verify=await getDocFromServer(ref);
  const verifiedGame=verify.exists()?verify.data()?.game:null;
  if(!verifiedGame)throw new Error("Cloud save verification failed: Firebase did not return the saved town from the server.");
  if(verifiedGame.cloudRevision!==safeGame.cloudRevision || verifiedGame.cloudSaveId!==safeGame.cloudSaveId)throw new Error("Cloud save verification failed: Firebase returned an older save revision.");
  return {updatedAt:Number(verifiedGame.updatedAt||0),cloudRevision:Number(verifiedGame.cloudRevision||0),cloudSaveId:verifiedGame.cloudSaveId||""};
}

export async function writeLeaderboard(uid,data){
  await setDoc(doc(db,"leaderboards",uid),{...data,ownerId:uid},{merge:true});
}

export async function loadLeaderboard(){
  const q=query(collection(db,"leaderboards"),orderBy("totalLevel","desc"),limit(50));
  const snap=await getDocs(q);return snap.docs.map(d=>({id:d.id,...d.data()}));
}
