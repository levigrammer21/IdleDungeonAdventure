const CACHE="adventure-town-v1.4.0";
const CORE=["./","./index.html","./styles.css","./game.js","./manifest.webmanifest","./img/icon.svg","./img/fantasy-town-map.webp","./img/loot-chest.svg","./img/hero-warrior-bram.webp","./img/hero-wizard-elowen.webp","./img/hero-archer-rowan.webp","./img/hero-druid-mira.webp","./img/hero-assassin-vex.webp","./img/hero-summoner-orin.webp"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return response;}).catch(()=>caches.match(event.request).then(r=>r||caches.match("./index.html"))));
});
