const CACHE="adventure-town-v2.1.1";
const CORE=[
  "./","./index.html","./styles.css","./game.js","./manifest.webmanifest",
  "./img/icon-192.png","./img/icon-512.png","./img/icon-maskable-512.png","./img/apple-touch-icon.png","./img/fantasy-town-map.webp","./img/loot-chest.svg","./img/ui-icon-atlas.webp",
  "./img/hero-warrior-bram.webp","./img/hero-wizard-elowen.webp","./img/hero-archer-rowan.webp","./img/hero-druid-mira.webp","./img/hero-assassin-vex.webp","./img/hero-summoner-orin.webp",
  "./img/enemy-ashscale-drake.webp","./img/enemy-basilisk-crown.webp","./img/enemy-bone-sentinel.webp","./img/enemy-cinder-golem.webp","./img/enemy-cinderdeep-forgelord.webp","./img/enemy-crownscale-guard.webp","./img/enemy-crypt-sovereign.webp","./img/enemy-dungeon-rat.webp","./img/enemy-duskborn-knight.webp","./img/enemy-eclipse-wyrm.webp","./img/enemy-ember-imp.webp","./img/enemy-glacier-yeti.webp","./img/enemy-gloom-stalker.webp","./img/enemy-grainback-boar.webp","./img/enemy-hollow-treant.webp","./img/enemy-hollow-warden.webp","./img/enemy-hollow-wyrm.webp","./img/enemy-icebound-raider.webp","./img/enemy-meadow-bandit.webp","./img/enemy-moon-eater-spawn.webp","./img/enemy-moss-goblin.webp","./img/enemy-reef-stalker.webp","./img/enemy-rime-wolf.webp","./img/enemy-sanctum-leviathan.webp","./img/enemy-storm-harpy.webp","./img/enemy-stormbound-colossus.webp","./img/enemy-tanglehare.webp","./img/enemy-tempest-titan.webp","./img/enemy-thorn-wolf.webp","./img/enemy-thornroot-matriarch.webp","./img/enemy-thunder-herald.webp","./img/enemy-thunder-roc.webp","./img/enemy-umbral-giant.webp","./img/enemy-venom-oracle.webp","./img/enemy-void-revenant.webp",
  "./img/egg-basilisk-crown.webp","./img/egg-eclipse-wyrm.webp","./img/egg-tempest-titan.webp",
  "./img/pet-basilisk-hatchling.webp","./img/pet-beaver.webp","./img/pet-cow.webp","./img/pet-eclipse-wyrmling.webp","./img/pet-forge-sprite.webp","./img/pet-mole.webp","./img/pet-tempest-whelp.webp",
  "./img/item-sword-starter.webp","./img/item-sword-weak.webp","./img/item-sword-average.webp","./img/item-sword-good.webp","./img/item-sword-great.webp","./img/item-sword-epic.webp","./img/item-sword-legendary.webp","./img/item-sword-divine.webp","./img/item-thornroot-warrior-weapon.webp",
];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(async url=>{const response=await fetch(url,{cache:"reload"});if(response.ok)await cache.put(url,response);}))).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}return response;}).catch(async()=>await caches.match(event.request)||(event.request.mode==="navigate"?caches.match("./index.html"):Response.error())));
});
