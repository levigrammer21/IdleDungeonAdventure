import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  initializeAuth, GoogleAuthProvider, onAuthStateChanged,
  indexedDBLocalPersistence, browserLocalPersistence, signInWithRedirect, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, getDocFromServer, setDoc,
  collection, query, limit, getDocs, serverTimestamp
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

function safeLeaderboardNumber(value,max=1e12){const number=Number(value);return Number.isFinite(number)?Math.max(0,Math.min(max,Math.floor(number))):0;}
function sanitizePublicProfile(profile){
  const heroes=Array.isArray(profile?.heroes)?profile.heroes.slice(0,6).map(hero=>({
    name:String(hero?.name||"Hero").slice(0,24),className:String(hero?.className||"").slice(0,20),level:safeLeaderboardNumber(hero?.level,100),power:safeLeaderboardNumber(hero?.power,10000000),stance:String(hero?.stance||"balanced").slice(0,20),
    bestSkill:hero?.bestSkill?{name:String(hero.bestSkill.name||"").slice(0,24),level:safeLeaderboardNumber(hero.bestSkill.level,100)}:null,
    equipment:Object.fromEntries(["weapon","armor","pet","trinket"].map(slot=>{const item=hero?.equipment?.[slot];return [slot,item?{name:String(item.name||"").slice(0,60),icon:String(item.icon||"").slice(0,8),upgrade:safeLeaderboardNumber(item.upgrade,5),tier:String(item.tier||"").slice(0,30)}:null];}))
  })):[];
  return {guildRank:String(profile?.guildRank||"Guild").slice(0,40),heroes};
}
export async function writeLeaderboard(uid,data){
  if(!auth.currentUser || auth.currentUser.uid!==uid)throw new Error("Leaderboard update blocked: sign in again.");
  const allowedNumbers=["guildPower","totalLevel","totalSkills","totalXP","combatXP","workXP","wealth","treasuryGold","heroGold","guildRevenue","guildReputation","raidWins","dungeonWins","expeditionWins","monsterKills","bossKills","damageDealt","healingDone","nemeses","bestRaidScore","fastestRaidSeconds","highestHeroLevel","highestSkillLevel","skillFarming","skillCooking","skillMining","skillWoodcutting","skillSmithing","skillPlundering","collectionScore","itemsFound","raidUniquesOwned","maxedGear","guildDonations","questsCompleted","achievements","monthlyRaidWins","monthlyDungeonWins","monthlyMonsterKills","monthlyGuildRevenue","monthlyXP"];
  const clean={schemaVersion:2,ownerId:uid,displayName:String(data?.displayName||"Adventurer").slice(0,32),monthKey:String(data?.monthKey||"").slice(0,7),updatedAt:serverTimestamp(),publicProfile:sanitizePublicProfile(data?.publicProfile)};
  for(const key of allowedNumbers)clean[key]=safeLeaderboardNumber(data?.[key],key.includes("Level")||key.startsWith("skill")?5000:1e12);
  if(clean.totalLevel>600||clean.totalSkills>3600||clean.highestHeroLevel>100||clean.highestSkillLevel>100||[clean.skillFarming,clean.skillCooking,clean.skillMining,clean.skillWoodcutting,clean.skillSmithing,clean.skillPlundering].some(value=>value>600))throw new Error("Leaderboard validation rejected impossible level totals.");
  await setDoc(doc(db,"leaderboards",uid),clean,{merge:true});
}

export async function loadLeaderboard(){
  const q=query(collection(db,"leaderboards"),limit(100));
  const snap=await getDocs(q);return snap.docs.map(d=>({id:d.id,...d.data()}));
}
