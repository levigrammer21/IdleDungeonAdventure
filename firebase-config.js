import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence,
  browserLocalPersistence, signInWithRedirect, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc,
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
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
setPersistence(auth, browserLocalPersistence).catch(console.warn);

export function watchAuth(callback){ return onAuthStateChanged(auth, callback); }
export function googleSignIn(){ return signInWithRedirect(auth, googleProvider); }
export function emailSignIn(email,password){ return signInWithEmailAndPassword(auth,email,password); }
export function emailRegister(email,password){ return createUserWithEmailAndPassword(auth,email,password); }
export function signOutUser(){ return signOut(auth); }

export async function loadGame(uid){
  const snap=await getDoc(doc(db,"players",uid));
  return snap.exists()?snap.data().game:null;
}

export async function saveGame(uid,game){
  if(!auth.currentUser || auth.currentUser.uid!==uid)throw new Error("Cloud save blocked: sign in again.");
  const safeGame=JSON.parse(JSON.stringify(game));
  const ref=doc(db,"players",uid);
  await setDoc(ref,{game:safeGame,ownerId:uid,updatedAt:serverTimestamp()},{merge:true});
  const verify=await getDoc(ref);
  if(!verify.exists() || !verify.data()?.game)throw new Error("Cloud save verification failed: Firebase did not return the saved town.");
  return {updatedAt:Number(verify.data().game?.updatedAt||0)};
}

export async function writeLeaderboard(uid,data){
  await setDoc(doc(db,"leaderboards",uid),{...data,ownerId:uid},{merge:true});
}

export async function loadLeaderboard(){
  const q=query(collection(db,"leaderboards"),orderBy("totalLevel","desc"),limit(50));
  const snap=await getDocs(q);return snap.docs.map(d=>({id:d.id,...d.data()}));
}
