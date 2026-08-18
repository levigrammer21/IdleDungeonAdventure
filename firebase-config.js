import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence,
  browserLocalPersistence, signInWithRedirect, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, addDoc, deleteDoc, updateDoc,
  collection, query, where, orderBy, limit, onSnapshot, getDocs,
  runTransaction, writeBatch, serverTimestamp
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
  await setDoc(doc(db,"players",uid),{game,ownerId:uid,updatedAt:serverTimestamp()},{merge:true});
}

export async function writeLeaderboard(uid,data){
  await setDoc(doc(db,"leaderboards",uid),{...data,ownerId:uid},{merge:true});
}

export async function loadLeaderboard(){
  const q=query(collection(db,"leaderboards"),orderBy("totalLevel","desc"),limit(50));
  const snap=await getDocs(q);return snap.docs.map(d=>({id:d.id,...d.data()}));
}

export function watchMarket(callback){
  const q=query(collection(db,"marketListings"),where("active","==",true),orderBy("createdAt","desc"),limit(60));
  return onSnapshot(q,s=>callback(s.docs.map(d=>({id:d.id,...d.data()}))),err=>{console.warn(err);callback([]);});
}

export async function createMarketListing(listing){
  if(!auth.currentUser || auth.currentUser.uid!==listing.sellerId)throw new Error("Sign in again to create a listing.");
  await addDoc(collection(db,"marketListings"),{...listing,active:true,createdAt:Date.now(),updatedAt:Date.now()});
}

export async function buyMarketListing(listing,buyerId,buyerName){
  if(!auth.currentUser || auth.currentUser.uid!==buyerId)throw new Error("Sign in again to buy this listing.");
  if(listing.sellerId===buyerId)throw new Error("You already own this listing.");
  const listingRef=doc(db,"marketListings",listing.id);
  const payoutRef=doc(collection(db,"players",listing.sellerId,"payouts"));
  await runTransaction(db,async tx=>{
    const snap=await tx.get(listingRef);if(!snap.exists()||!snap.data().active)throw new Error("This listing is no longer available.");
    const live=snap.data();
    tx.update(listingRef,{active:false,buyerId,buyerName,soldAt:Date.now(),updatedAt:Date.now()});
    tx.set(payoutRef,{listingId:listing.id,sellerId:live.sellerId,buyerId,amount:live.price,itemName:live.itemName,createdAt:Date.now()});
  });
}

export async function cancelMarketListing(listing){
  if(!auth.currentUser || auth.currentUser.uid!==listing.sellerId)throw new Error("Only the seller can cancel this listing.");
  await updateDoc(doc(db,"marketListings",listing.id),{active:false,cancelledAt:Date.now(),updatedAt:Date.now()});
}

export async function claimPayouts(uid){
  if(!auth.currentUser || auth.currentUser.uid!==uid)return {total:0,count:0};
  const snap=await getDocs(collection(db,"players",uid,"payouts"));if(snap.empty)return {total:0,count:0};
  let total=0;const batch=writeBatch(db);for(const d of snap.docs){total+=Number(d.data().amount)||0;batch.delete(d.ref);}await batch.commit();return {total,count:snap.size};
}
