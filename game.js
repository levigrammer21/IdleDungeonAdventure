const VERSION = "1.6.0";
const SAVE_KEY = "adventure-town-save-v1";
const SETTINGS_KEY = "adventure-town-settings-v1";
const OFFLINE_LIMIT = 12 * 60 * 60;

const STOCK_DEFS = {
  turnip:{ticker:"GTF",name:"Goblin Turnip Futures",icon:"🥬",base:12,volatility:.17,color:"#74a85d",flavor:"Cheap, loud, and allegedly backed by actual turnips."},
  mugworks:{ticker:"MMW",name:"Mithril Mugworks",icon:"🍺",base:145,volatility:.12,color:"#d3a84d",flavor:"The realm's finest dent-proof drinking vessels."},
  dragonfire:{ticker:"DFI",name:"Dragonfire Insurance",icon:"🐉",base:1250,volatility:.09,color:"#c45f46",flavor:"Premiums rise every time a village starts smoking."},
};
const MARKET_TICK_SECONDS=15;
const MARKET_FEE=.02;

const HEROES = [
  { id:"warrior", name:"Bram", className:"Warrior", icon:"🛡️", portrait:"img/hero-warrior-bram.webp", weapon:"Sword", armor:"Warrior Armor", color:"#a94d3f" },
  { id:"wizard", name:"Elowen", className:"Wizard", icon:"🧙", portrait:"img/hero-wizard-elowen.webp", weapon:"Wand", armor:"Wizard Robes", color:"#5a68a9" },
  { id:"archer", name:"Rowan", className:"Archer", icon:"🏹", portrait:"img/hero-archer-rowan.webp", weapon:"Bow", armor:"Archer Armor", color:"#4e8a52" },
  { id:"druid", name:"Mira", className:"Druid", icon:"🌿", portrait:"img/hero-druid-mira.webp", weapon:"Staff", armor:"Druid Garb", color:"#628c6a" },
  { id:"assassin", name:"Vex", className:"Assassin", icon:"🗡️", portrait:"img/hero-assassin-vex.webp", weapon:"Daggers", armor:"Assassin Armor", color:"#755b86" },
  { id:"summoner", name:"Orin", className:"Summoner", icon:"📖", portrait:"img/hero-summoner-orin.webp", weapon:"Tome", armor:"Summoner Robes", color:"#a36f42" },
];

const PARTY_CHAT_LIMIT = 80;
const PARTY_CHAT_MILESTONES = [25,100,250,500,1000,2500,5000,10000,25000,50000,100000];
const WORK_SKILL_NAMES = {farming:"Farming",mining:"Mining",woodcutting:"Woodcutting",smithing:"Smithing"};
const HERO_CHAT_VOICES = {
  warrior:{
    assignment:{idle:"Shield is down. Call when something needs hitting—or carrying.",farm:"A stocked pantry wins more fights than bravado. I'll see to it.",mine:"I'll bring back enough metal to make this sword jealous.",forest:"Trees, axes, honest work. I can do that.",smith:"Good. I trust equipment more when I've watched it being forged.",tavern:"One bowl, one chair, and absolutely no quests until my head clears."},
    danger:["Did someone turn up the difficulty in here, or did my sword get nerfed?","This armor is earning its keep. A little help would still be welcome."],
    combatLevel:level=>`Combat Level ${level}. Harder to knock down, easier to annoy.`,
    workLevel:(skill,level)=>`${skill} Level ${level}. Turns out repetition really does build muscle.`,
    unlock:item=>`${item} is within reach now. Point me at the work.`,
    outdated:(current,best)=>`We're still working ${current}? I can handle ${best} now.`,
    milestone:(amount,item)=>`${amount} ${item}. That's a respectable pile.`,
    combatStart:place=>`${place}. Stay close and let me take the first hit.`,
    clear:(place,gold)=>`${place} cleared. ${gold} Gold in the chest—count it back in town.`,
    rare:item=>`${item}. Finally, something worth the bruises.`,
    broken:item=>`My ${item} is broken. That was not part of the battle plan.`,
  },
  wizard:{
    assignment:{idle:"I have finished reorganizing my notes. Twice. I am available.",farm:"Agriculture is applied alchemy with fewer explosions.",mine:"Every vein tells a geological story. Most of them are very long.",forest:"I'll catalogue what we cut. Waste is simply poor scholarship.",smith:"Heat, pressure, structure—smithing is magic that admits it uses a hammer.",tavern:"Rest is not laziness. It is mana management."},
    danger:["My calculations did not include quite this much bleeding.","A brief defensive adjustment would be academically prudent."],
    combatLevel:level=>`Combat Level ${level}. The practical results agree with the theory.`,
    workLevel:(skill,level)=>`${skill} Level ${level}. My field notes are becoming rather convincing.`,
    unlock:item=>`${item} is unlocked. I have already begun a more efficient procedure.`,
    outdated:(current,best)=>`We have the skill for ${best}, yet I am still processing ${current}. Curious.`,
    milestone:(amount,item)=>`${amount} ${item}, recorded and verified.`,
    combatStart:place=>`Entering ${place}. I have three theories and two of them are dangerous.`,
    clear:(place,gold)=>`${place} complete. The chest contained ${gold} Gold and very little peer review.`,
    rare:item=>`${item}! That changes several of my equipment models.`,
    broken:item=>`The structural integrity of my ${item} has reached exactly zero.`,
  },
  archer:{
    assignment:{idle:"Quiver checked, boots tied. I'm ready.",farm:"I'll keep the rows straight and the pests nervous.",mine:"Not much range in a mine, but I can spot a good seam.",forest:"I know which trees make good bows. The others can relax.",smith:"A balanced tool matters. A balanced weapon matters more.",tavern:"I'll take the quiet corner and keep an eye on the door."},
    danger:["I'm running out of room to dodge—and health to spend.","A clean retreat is still a strategy. Just mentioning it."],
    combatLevel:level=>`Combat Level ${level}. Faster eyes, steadier hands.`,
    workLevel:(skill,level)=>`${skill} Level ${level}. I can see the pattern now.`,
    unlock:item=>`${item} is available. Good—our old route was getting predictable.`,
    outdated:(current,best)=>`I can gather ${best} now. ${current} is starting to feel like target practice.`,
    milestone:(amount,item)=>`${amount} ${item}. I counted on the way back.`,
    combatStart:place=>`I have sightlines on ${place}. Try not to stand in them.`,
    clear:(place,gold)=>`${place} is quiet. Chest count: ${gold} Gold.`,
    rare:item=>`Found ${item}. That one was hidden well.`,
    broken:item=>`My ${item} won't survive another trip. It barely survived this one.`,
  },
  druid:{
    assignment:{idle:"The town is breathing easily. So am I.",farm:"The soil remembers kindness. The harvest usually does too.",mine:"I'll take only what the town needs and leave the mountain stable.",forest:"A careful cut makes room for new growth.",smith:"Even iron has a rhythm if you listen past the hammer.",tavern:"Warm food, good company, and no poison clouds. Lovely."},
    danger:["I can mend wounds, but I would prefer fewer of them.","The roots are holding me up. Barely."],
    combatLevel:level=>`Combat Level ${level}. Stronger roots, steadier heart.`,
    workLevel:(skill,level)=>`${skill} Level ${level}. Practice has taken root.`,
    unlock:item=>`${item} is ready for us now. Let us use it wisely.`,
    outdated:(current,best)=>`${current} still has uses, but I am ready to work with ${best}.`,
    milestone:(amount,item)=>`${amount} ${item}. The town will make good use of every one.`,
    combatStart:place=>`${place} feels unsettled. Stay near me.`,
    clear:(place,gold)=>`${place} can rest again. We recovered ${gold} Gold.`,
    rare:item=>`${item} found us at exactly the right moment.`,
    broken:item=>`My ${item} has given all it can. We should repair it.`,
  },
  assassin:{
    assignment:{idle:"Standing visibly in the town square feels deeply unnatural.",farm:"If anyone asks, these vegetables harvested themselves.",mine:"Dark tunnels, sharp tools, no small talk. Perfect.",forest:"Quiet work. Until the tree falls, anyway.",smith:"I need the edges sharp and the questions dull.",tavern:"I'm not resting. I'm gathering intelligence near the soup."},
    danger:["Either they got stronger or I got significantly more perforated.","I prefer danger behind me, not distributed through my organs."],
    combatLevel:level=>`Combat Level ${level}. I was already dangerous. Now it is documented.`,
    workLevel:(skill,level)=>`${skill} Level ${level}. Please contain your surprise.`,
    unlock:item=>`${item} unlocked. Finally, something less tedious.`,
    outdated:(current,best)=>`Still ${current}? We can work ${best}. I am developing opinions about this.`,
    milestone:(amount,item)=>`${amount} ${item}. I deny counting them.`,
    combatStart:place=>`${place}. I'll find the path nobody is guarding.`,
    clear:(place,gold)=>`${place} handled. ${gold} Gold, no witnesses worth mentioning.`,
    rare:item=>`${item}. I saw it first, which is legally the same as finding it.`,
    broken:item=>`My ${item} broke. Whoever laughs is testing the replacement.`,
  },
  summoner:{
    assignment:{idle:"The spirits and I are ready. Mostly the spirits.",farm:"I asked the seedlings what they need. They were surprisingly specific.",mine:"I can summon help, but apparently the pickaxe builds character.",forest:"The little spirits keep naming the trees. This may take a while.",smith:"The forge sprites have suggestions. Many involve more fire.",tavern:"I ordered for two. My summon insists it counts."},
    danger:["My summons would like everyone to know this is going badly.","I may have brought too many spell pages and not enough armor."],
    combatLevel:level=>`Combat Level ${level}! The spirits are cheering in at least four languages.`,
    workLevel:(skill,level)=>`${skill} Level ${level}! I knew the extra hands would help.`,
    unlock:item=>`${item} is unlocked! I have already told everyone.`,
    outdated:(current,best)=>`We can work ${best} now. Even the spirits are bored of ${current}.`,
    milestone:(amount,item)=>`${amount} ${item}! We made a pile, then the pile waved back.`,
    combatStart:place=>`${place}! Everyone stay together—including anything I summon.`,
    clear:(place,gold)=>`${place} cleared! The chest says ${gold} Gold. Yes, I asked it.`,
    rare:item=>`${item}! I knew today felt unusually sparkly.`,
    broken:item=>`My ${item} broke. The spirits are holding a very small funeral.`,
  },
};

const HERO_CHAT_REPLIES = {
  warrior:{danger:name=>`Stay on your feet, ${name}. I'll pull their attention.`,level:name=>`Well earned, ${name}.`,milestone:name=>`Good work, ${name}. Keep the town supplied.`,rare:name=>`Straight to the Warehouse, ${name}.`,start:name=>`I'm with you, ${name}.`},
  wizard:{danger:name=>`Hold still, ${name}. I am revising the odds.`,level:name=>`The improvement is measurable, ${name}. Nicely done.`,milestone:name=>`I can confirm ${name}'s count. Approximately.`,rare:name=>`Do not touch any runes before I inspect it, ${name}.`,start:name=>`I have prepared contingencies, ${name}.`},
  archer:{danger:name=>`Move left, ${name}. I can cover you there.`,level:name=>`It shows, ${name}.`,milestone:name=>`I saw the last one come in. Nice work, ${name}.`,rare:name=>`Good eye, ${name}.`,start:name=>`I'll watch the edges, ${name}.`},
  druid:{danger:name=>`Breathe, ${name}. Help is close.`,level:name=>`You have grown well, ${name}.`,milestone:name=>`The town is stronger for it, ${name}.`,rare:name=>`It suits you, ${name}.`,start:name=>`We go together, ${name}.`},
  assassin:{danger:name=>`Try not to fall over, ${name}. It complicates the formation.`,level:name=>`Not bad, ${name}. Almost intimidating.`,milestone:name=>`I stopped counting. Glad you didn't, ${name}.`,rare:name=>`Fine. ${name} can carry it—for now.`,start:name=>`I'll be the shadow you pretend not to need, ${name}.`},
  summoner:{danger:name=>`Hang on, ${name}! I am sending everything I have!`,level:name=>`I knew you could do it, ${name}!`,milestone:name=>`That deserves a celebration, ${name}!`,rare:name=>`Can I hold it for one second, ${name}?`,start:name=>`Ready, ${name}! The spirits are too!`},
};

const CLASS_GEAR = [
  {key:"warrior",className:"Warrior",weapon:"Sword",armor:"Warrior Armor",weaponIcon:"⚔️",armorIcon:"🛡️"},
  {key:"wizard",className:"Wizard",weapon:"Wand",armor:"Wizard Robes",weaponIcon:"🪄",armorIcon:"🥼"},
  {key:"archer",className:"Archer",weapon:"Bow",armor:"Archer Armor",weaponIcon:"🏹",armorIcon:"🧥"},
  {key:"druid",className:"Druid",weapon:"Staff",armor:"Druid Garb",weaponIcon:"🌿",armorIcon:"🥻"},
  {key:"assassin",className:"Assassin",weapon:"Daggers",armor:"Assassin Armor",weaponIcon:"🗡️",armorIcon:"🥷"},
  {key:"summoner",className:"Summoner",weapon:"Tome",armor:"Summoner Robes",weaponIcon:"📕",armorIcon:"🧣"},
];
const gearSetPool = prefix => CLASS_GEAR.flatMap(c=>[`${prefix}_${c.key}_weapon`,`${prefix}_${c.key}_armor`]);

const BUILDINGS = {
  farm:{name:"Farm",icon:"🌾",description:"Produces named food items stored in the Warehouse.",baseCost:650,position:[20,36],skill:"farming"},
  mine:{name:"Mine",icon:"⛏️",description:"Produces named metals stored in the Warehouse.",baseCost:700,position:[80,34],skill:"mining"},
  forest:{name:"Forest",icon:"🌲",description:"Produces named woods stored in the Warehouse.",baseCost:625,position:[15,63],skill:"woodcutting"},
  smith:{name:"Blacksmith",icon:"⚒️",description:"Uses exact named metals and woods for equipment and Repair Kits.",baseCost:900,position:[60,70],skill:"smithing"},
  warehouse:{name:"Warehouse",icon:"📦",description:"Stores all loot, resources, and equipment.",baseCost:1100,position:[61,41]},
  market:{name:"Marketplace",icon:"⚖️",description:"Trades player goods and equipment for Gold.",baseCost:1200,position:[39,44]},
  inn:{name:"Inn",icon:"🛏️",description:"Physically restores heroes after defeat.",baseCost:850,position:[79,66]},
  tavern:{name:"Tavern",icon:"🍲",description:"Restores Sanity after battle for a Gold fee.",baseCost:800,position:[35,70]},
};

const ASSIGNMENTS = {
  idle:{name:"Available",icon:"✨",detail:"Ready for a new assignment."},
  farm:{name:"Farming",icon:"🌾",detail:"Produces your selected food item for the Warehouse."},
  mine:{name:"Mining",icon:"⛏️",detail:"Produces your selected metal for the Warehouse."},
  forest:{name:"Woodcutting",icon:"🌲",detail:"Produces your selected wood for the Warehouse."},
  smith:{name:"Smithing",icon:"⚒️",detail:"Uses Scrap Metal + Fallen Branches to make Repair Kits."},
  tavern:{name:"At Tavern",icon:"🍲",detail:"Restoring Sanity to full."},
  inn:{name:"At Inn",icon:"🛏️",detail:"Recovering from defeat."},
  combat:{name:"Fighting",icon:"⚔️",detail:"Away on a combat run."},
};

const COMBAT = {
  meadowWatch:{id:"meadowWatch",category:"expedition",name:"Meadow Watch",short:"Meadow Watch",icon:"🌾",eyebrow:"Starter expedition · Level 1",description:"Guard the farms and learn the rhythm of combat without risking expensive supplies.",requirements:["Combat Level 1+","1–4 heroes","4 Food per hero"],minLevel:1,maxParty:4,duration:30,difficulty:18,food:4,gold:[12,22],xp:30,essenceChance:.03,itemChance:0,pool:[],colors:["#5f843f","#29472f"]},
  whisperwood:{id:"whisperwood",category:"expedition",name:"Whisperwood Trail",short:"Whisperwood",icon:"🧭",eyebrow:"Forest expedition · Level 8",description:"Patrol old forest roads for better Combat XP, Gold, and the first traces of regional Essence.",requirements:["Combat Level 8+","1–4 heroes","7 Food per hero"],minLevel:8,maxParty:4,duration:45,difficulty:55,food:7,gold:[28,50],xp:75,essenceChance:.05,itemChance:.02,pool:["verdantBlade","briarRobes"],colors:["#3d6e4d","#1d3d2a"]},
  frostmarch:{id:"frostmarch",category:"expedition",name:"Frostmarch Pass",short:"Frostmarch",icon:"❄️",eyebrow:"Frozen expedition · Level 18",description:"Push through the frozen pass where Essence and rare Hollow equipment begin to appear.",requirements:["Combat Level 18+","1–4 heroes","10 Food per hero"],minLevel:18,maxParty:4,duration:70,difficulty:110,food:10,gold:[70,115],xp:180,essenceChance:.08,itemChance:.035,pool:["frostBow","healingStaff"],colors:["#517a91","#233d55"]},
  cindertrail:{id:"cindertrail",category:"expedition",name:"Cindertrail Patrol",short:"Cindertrail",icon:"🔥",eyebrow:"Volcanic expedition · Level 35",description:"Cross scorched roads beneath Cinderdeep and return with richer spoils.",requirements:["Combat Level 35+","1–4 heroes","14 Food per hero"],minLevel:35,maxParty:4,duration:100,difficulty:220,food:14,gold:[150,240],xp:420,essenceChance:.10,itemChance:.045,pool:["emberBow","cinderTome"],colors:["#9a5434","#442824"]},
  stormcoast:{id:"stormcoast",category:"expedition",name:"Stormcoast March",short:"Stormcoast",icon:"⚡",eyebrow:"Tempest expedition · Level 55",description:"Hunt along storm-lashed cliffs where stronger regional loot enters circulation.",requirements:["Combat Level 55+","1–4 heroes","18 Food per hero"],minLevel:55,maxParty:4,duration:140,difficulty:420,food:18,gold:[300,470],xp:850,essenceChance:.12,itemChance:.055,pool:["stormStaff","tempestDaggers"],colors:["#536587","#252d4e"]},
  shadowpeaks:{id:"shadowpeaks",category:"expedition",name:"Shadowpeak Ascent",short:"Shadowpeak",icon:"🌑",eyebrow:"Endgame expedition · Level 75",description:"Climb into the dark peaks and prepare for the final raid tier.",requirements:["Combat Level 75+","1–4 heroes","24 Food per hero"],minLevel:75,maxParty:4,duration:190,difficulty:620,food:24,gold:[520,800],xp:1600,essenceChance:.15,itemChance:.065,pool:["voidWand","eclipseTome"],colors:["#544968","#211d31"]},

  thornrootBurrow:{id:"thornrootBurrow",category:"dungeon",name:"Thornroot Burrow",short:"Thornroot",icon:"🌿",eyebrow:"Regional dungeon · Level 10",description:"A solo or duo dungeon beneath the ancient roots, with a complete class set, trinkets, and Raid Key chances.",requirements:["Combat Level 10+","1–2 heroes","2 Essence + 18 Food per hero"],minLevel:10,maxParty:2,duration:75,difficulty:95,food:18,essence:2,gold:[60,95],xp:300,essenceReward:[1,3],itemChance:.12,keyChance:.08,pool:gearSetPool("thornroot"),trinketChance:.06,trinketPool:["luckyAcorn"],killCount:12,colors:["#4b7042","#263e2a"]},
  frozenHollow:{id:"frozenHollow",category:"dungeon",name:"Frozen Hollow",short:"Frozen Hollow",icon:"🗝️",eyebrow:"Regional dungeon · Level 24",description:"A multi-room frozen delve with a complete class set, Essence returns, trinkets, and Raid Keys.",requirements:["Combat Level 24+","1–2 heroes","3 Essence + 35 Food per hero"],minLevel:24,maxParty:2,duration:110,difficulty:190,food:35,essence:3,gold:[180,320],xp:900,essenceReward:[1,5],itemChance:.16,keyChance:.18,pool:gearSetPool("frozen"),trinketChance:.065,trinketPool:["frostSigil"],killCount:18,colors:["#425e76","#1f354a"]},
  cinderdeepVault:{id:"cinderdeepVault",category:"dungeon",name:"Cinderdeep Vault",short:"Cinderdeep",icon:"🌋",eyebrow:"Regional dungeon · Level 45",description:"Descend into a ruined forge for a full fire-forged class set, trinkets, and stronger Key odds.",requirements:["Combat Level 45+","1–2 heroes","5 Essence + 60 Food per hero"],minLevel:45,maxParty:2,duration:160,difficulty:360,food:60,essence:5,gold:[420,680],xp:2200,essenceReward:[3,8],itemChance:.18,keyChance:.24,pool:gearSetPool("cinderdeep"),trinketChance:.07,trinketPool:["emberIdol"],killCount:24,colors:["#83432f","#392321"]},
  sunkenSanctum:{id:"sunkenSanctum",category:"dungeon",name:"Sunken Sanctum",short:"Sunken Sanctum",icon:"🌊",eyebrow:"Regional dungeon · Level 58",description:"Explore a drowned temple with a full tide-forged class set, trinkets, and strong Raid Key odds.",requirements:["Combat Level 58+","1–2 heroes","6 Essence + 75 Food per hero"],minLevel:58,maxParty:2,duration:190,difficulty:510,food:75,essence:6,gold:[610,920],xp:4000,essenceReward:[4,10],itemChance:.19,keyChance:.27,pool:gearSetPool("sunken"),trinketChance:.075,trinketPool:["tidePearl"],killCount:30,colors:["#397383","#203b4a"]},
  stormcrypt:{id:"stormcrypt",category:"dungeon",name:"Storm Crypt",short:"Storm Crypt",icon:"⛈️",eyebrow:"Regional dungeon · Level 70",description:"Break the seals for a full storm-forged class set, trinkets, and the strongest Dungeon Key odds.",requirements:["Combat Level 70+","1–2 heroes","8 Essence + 95 Food per hero"],minLevel:70,maxParty:2,duration:220,difficulty:700,food:95,essence:8,gold:[820,1250],xp:6500,essenceReward:[5,12],itemChance:.20,keyChance:.30,pool:gearSetPool("stormcrypt"),trinketChance:.08,trinketPool:["stormLocket"],killCount:36,colors:["#4e547a","#24263d"]},

  basiliskCrown:{id:"basiliskCrown",category:"raid",name:"Basilisk Crown",short:"Basilisk Raid",icon:"🐲",eyebrow:"First raid · Level 30",description:"A four-hero assault with a 10% chance to enter its complete 12-item rare class table.",requirements:["Combat Level 30+","Up to 4 heroes","1 Raid Key + 8 Essence","80 Food per hero"],minLevel:30,maxParty:4,duration:240,difficulty:650,food:80,essence:8,keys:1,gold:[900,1600],xp:5000,essenceReward:[6,16],itemChance:.10,pool:gearSetPool("basilisk"),eggChance:1/500,eggKey:"basiliskEgg",killCount:45,colors:["#6f4737","#2f2520"]},
  tempestTitan:{id:"tempestTitan",category:"raid",name:"Tempest Titan",short:"Titan Raid",icon:"⚡",eyebrow:"Second raid · Level 60",description:"Challenge a storm giant with a 10% chance to enter its complete 12-item rare class table.",requirements:["Combat Level 60+","Up to 4 heroes","1 Raid Key + 16 Essence","180 Food per hero"],minLevel:60,maxParty:4,duration:420,difficulty:1600,food:180,essence:16,keys:1,gold:[2600,4100],xp:12000,essenceReward:[12,28],itemChance:.10,pool:gearSetPool("tempest"),eggChance:1/500,eggKey:"tempestEgg",killCount:65,colors:["#4d5f83","#252d49"]},
  eclipseWyrm:{id:"eclipseWyrm",category:"raid",name:"Eclipse Wyrm",short:"Eclipse Raid",icon:"🌘",eyebrow:"Endgame raid · Level 90",description:"The current final raid has a 10% chance to enter its complete 12-item rare class table.",requirements:["Combat Level 90+","Up to 4 heroes","2 Raid Keys + 30 Essence","400 Food per hero"],minLevel:90,maxParty:4,duration:720,difficulty:3000,food:400,essence:30,keys:2,gold:[7000,11000],xp:30000,essenceReward:[24,55],itemChance:.10,pool:gearSetPool("eclipse"),eggChance:1/500,eggKey:"eclipseEgg",killCount:90,colors:["#514063","#1e1929"]},
};

const CLASS_COMBAT = {
  Warrior:{speed:2.55,crit:.05,style:"melee",verb:"cleaves",attack:1,defense:1.25,hp:1.2,maxHit:1.05,identity:"Bulwark"},
  Wizard:{speed:2.85,crit:.08,style:"magic",verb:"blasts",attack:1.18,defense:.82,hp:.84,maxHit:1.28,identity:"Arcane burst"},
  Archer:{speed:2.25,crit:.12,style:"ranged",verb:"shoots",attack:1.12,defense:.92,hp:.94,maxHit:1.12,identity:"Precise striker"},
  Druid:{speed:2.7,crit:.06,style:"magic",verb:"strikes",attack:.98,defense:1.04,hp:1.06,maxHit:.94,identity:"Battle healer"},
  Assassin:{speed:1.65,crit:.17,style:"melee",verb:"slashes",attack:1.13,defense:.78,hp:.86,maxHit:1.12,identity:"Fast executioner"},
  Summoner:{speed:2.62,crit:.06,style:"magic",verb:"commands",attack:1.06,defense:.9,hp:.92,maxHit:1.02,identity:"Echo damage"},
};
const COMBAT_STYLE_META={melee:{name:"Melee",icon:"⚔️",color:"#b85a49"},ranged:{name:"Ranged",icon:"🏹",color:"#56845a"},magic:{name:"Magic",icon:"✨",color:"#636bb4"}};
const COMBAT_TRIANGLE={melee:"ranged",ranged:"magic",magic:"melee"};
const ENEMY_COMBAT_STYLES={
  "Tanglehare":"melee","Grainback Boar":"melee","Meadow Bandit":"ranged","Thorn Wolf":"melee","Moss Goblin":"ranged","Hollow Treant":"magic","Rime Wolf":"melee","Icebound Raider":"ranged","Glacier Yeti":"melee","Ember Imp":"magic","Ashscale Drake":"magic","Cinder Golem":"melee","Reef Stalker":"melee","Storm Harpy":"ranged","Thunder Roc":"magic","Gloom Stalker":"melee","Void Revenant":"magic","Umbral Giant":"ranged","Dungeon Rat":"melee","Bone Sentinel":"ranged","Hollow Warden":"magic","Thornroot Matriarch":"ranged","Hollow Wyrm":"magic","Cinderdeep Forgelord":"melee","Sanctum Leviathan":"magic","Crypt Sovereign":"magic","Crownscale Guard":"melee","Venom Oracle":"magic","The Basilisk Crown":"ranged","Stormbound Colossus":"melee","Thunder Herald":"magic","The Tempest Titan":"magic","Duskborn Knight":"melee","Moon-Eater Spawn":"ranged","The Eclipse Wyrm":"magic",
};
const enemyAssetPath=name=>`img/enemy-${name.toLowerCase().replace(/^the\s+/,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}.webp`;
const combatRoom=(name,icon,hp=1,attack=1,defense=1,speed=2.7,boss=false)=>({type:"combat",name,icon,image:enemyAssetPath(name),hp,attack,defense,speed,boss,combatStyle:ENEMY_COMBAT_STYLES[name]||"melee"});
const skillRoom=(name,icon,skill,baseSeconds,description)=>({type:"skill",name,icon,skill,baseSeconds,description});

const COMBAT_LAYOUTS = {
  meadowWatch:[combatRoom("Tanglehare","🐇",.75,.70,.65,2.4),combatRoom("Grainback Boar","🐗",1,.95,.85,2.8),combatRoom("Meadow Bandit","🗡️",1.2,1,1,2.5,true)],
  whisperwood:[combatRoom("Thorn Wolf","🐺",.85,.9,.8,2.2),combatRoom("Moss Goblin","👺",1,1,.9,2.5),combatRoom("Hollow Treant","🌳",1.35,1,1.25,3.1,true)],
  frostmarch:[combatRoom("Rime Wolf","🐺",.9,.9,.8,2.15),combatRoom("Icebound Raider","🪓",1,1.05,1,2.55),combatRoom("Glacier Yeti","🦍",1.4,1.15,1.15,3,true)],
  cindertrail:[combatRoom("Ember Imp","😈",.8,.95,.75,2),combatRoom("Ashscale Drake","🐉",1.05,1.1,1,2.5),combatRoom("Cinder Golem","🗿",1.5,1.15,1.3,3.2,true)],
  stormcoast:[combatRoom("Reef Stalker","🦈",.9,1,.8,2.2),combatRoom("Storm Harpy","🦅",1,1.1,.9,2),combatRoom("Thunder Roc","🌩️",1.45,1.2,1.15,2.8,true)],
  shadowpeaks:[combatRoom("Gloom Stalker","🐈‍⬛",.9,1.1,.85,1.9),combatRoom("Void Revenant","👻",1.1,1.15,1.05,2.45),combatRoom("Umbral Giant","👹",1.55,1.25,1.3,3.15,true)],

  thornrootBurrow:[combatRoom("Dungeon Rat","🐀",.75,.8,.65,2.1),combatRoom("Bone Sentinel","💀",1,1,1,2.7),combatRoom("Hollow Warden","🛡️",1.15,1.05,1.2,2.9),combatRoom("Thornroot Matriarch","🕷️",2.2,1.25,1.25,2.65,true)],
  frozenHollow:[combatRoom("Dungeon Rat","🐀",.75,.8,.65,2.1),combatRoom("Bone Sentinel","💀",1,1,1,2.7),combatRoom("Hollow Warden","🛡️",1.15,1.05,1.2,2.9),combatRoom("Hollow Wyrm","🐉",2.25,1.3,1.25,2.7,true)],
  cinderdeepVault:[combatRoom("Dungeon Rat","🐀",.75,.8,.65,2.1),combatRoom("Bone Sentinel","💀",1,1,1,2.7),combatRoom("Hollow Warden","🛡️",1.15,1.05,1.2,2.9),combatRoom("Cinderdeep Forgelord","🔥",2.35,1.35,1.3,2.8,true)],
  sunkenSanctum:[combatRoom("Dungeon Rat","🐀",.75,.8,.65,2.1),combatRoom("Bone Sentinel","💀",1,1,1,2.7),combatRoom("Hollow Warden","🛡️",1.15,1.05,1.2,2.9),combatRoom("Sanctum Leviathan","🐙",2.45,1.4,1.3,2.85,true)],
  stormcrypt:[combatRoom("Dungeon Rat","🐀",.75,.8,.65,2.1),combatRoom("Bone Sentinel","💀",1,1,1,2.7),combatRoom("Hollow Warden","🛡️",1.15,1.05,1.2,2.9),combatRoom("Crypt Sovereign","👑",2.55,1.45,1.4,2.7,true)],

  basiliskCrown:[combatRoom("Crownscale Guard","🦎",1,1,1,2.35),skillRoom("Briar-Choked Causeway","🌿","woodcutting",210,"Cut a path through living briars."),combatRoom("Venom Oracle","🐍",1.25,1.15,1.1,2.5),skillRoom("Venomroot Garden","🌾","farming",150,"Harvest an antidote before entering the throne den."),combatRoom("The Basilisk Crown","🐲",3.2,1.5,1.35,2.75,true)],
  tempestTitan:[combatRoom("Stormbound Colossus","🗿",1.1,1.05,1.15,2.8),skillRoom("Collapsed Sky-Mine","⛏️","mining",330,"Mine through charged stone and fallen pillars."),combatRoom("Thunder Herald","⚡",1.3,1.2,1,2.15),skillRoom("Shattered Conduit","⚒️","smithing",270,"Reforge the lightning conduit that opens the summit."),combatRoom("The Tempest Titan","🌩️",3.5,1.55,1.45,2.65,true)],
  eclipseWyrm:[combatRoom("Duskborn Knight","🌑",1.2,1.1,1.25,2.45),skillRoom("Shadowroot Barricade","🪵","woodcutting",480,"Hack through roots that regrow in moonless light."),combatRoom("Moon-Eater Spawn","🐉",1.4,1.25,1.1,2.25),skillRoom("Moonstone Seal","💎","mining",420,"Mine the seal without collapsing the Wyrm's lair."),skillRoom("Nightbloom Antidote","🌾","farming",330,"Prepare food and antidotes for the final chamber."),skillRoom("Broken Eclipse Ward","⚒️","smithing",390,"Repair the ancient ward before the eclipse peaks."),combatRoom("The Eclipse Wyrm","🌘",3.9,1.65,1.5,2.55,true)],
};

const ITEMS = {
  rustySword:{name:"Rusty Sword",type:"weapon",className:"Warrior",icon:"🗡️",image:"img/item-sword-starter.webp",tier:"Starter",attack:1,value:40},
  apprenticeWand:{name:"Apprentice Wand",type:"weapon",className:"Wizard",icon:"🪄",tier:"Starter",attack:1,value:40},
  huntingBow:{name:"Hunting Bow",type:"weapon",className:"Archer",icon:"🏹",tier:"Starter",attack:1,value:40},
  oakStaff:{name:"Oak Staff",type:"weapon",className:"Druid",icon:"🪵",tier:"Starter",attack:1,value:40},
  wornDaggers:{name:"Worn Daggers",type:"weapon",className:"Assassin",icon:"🗡️",tier:"Starter",attack:1,value:40},
  noviceTome:{name:"Novice Tome",type:"weapon",className:"Summoner",icon:"📖",tier:"Starter",attack:1,value:40},
  goodSword:{name:"Good Sword",type:"weapon",className:"Warrior",icon:"⚔️",image:"img/item-sword-good.webp",tier:"Good",attack:6,requiredLevel:10,value:520,metalCost:70,woodCost:25},
  goodWand:{name:"Good Wand",type:"weapon",className:"Wizard",icon:"🪄",tier:"Good",attack:6,requiredLevel:10,value:520,metalCost:35,woodCost:60},
  goodBow:{name:"Good Bow",type:"weapon",className:"Archer",icon:"🏹",tier:"Good",attack:6,requiredLevel:10,value:520,metalCost:25,woodCost:70},
  goodStaff:{name:"Good Staff",type:"weapon",className:"Druid",icon:"🌿",tier:"Good",attack:6,requiredLevel:10,value:520,metalCost:20,woodCost:75},
  goodDaggers:{name:"Good Daggers",type:"weapon",className:"Assassin",icon:"🗡️",tier:"Good",attack:6,requiredLevel:10,value:520,metalCost:75,woodCost:20},
  goodTome:{name:"Good Tome",type:"weapon",className:"Summoner",icon:"📕",tier:"Good",attack:6,requiredLevel:10,value:520,metalCost:25,woodCost:65},
  warriorArmor:{name:"Good Warrior Armor",type:"armor",className:"Warrior",icon:"🥋",tier:"Good",defense:8,requiredLevel:10,value:560,metalCost:85,woodCost:20},
  wizardArmor:{name:"Good Wizard Robes",type:"armor",className:"Wizard",icon:"🥼",tier:"Good",defense:8,requiredLevel:10,value:560,metalCost:30,woodCost:65},
  archerArmor:{name:"Good Archer Armor",type:"armor",className:"Archer",icon:"🧥",tier:"Good",defense:8,requiredLevel:10,value:560,metalCost:45,woodCost:50},
  druidArmor:{name:"Good Druid Garb",type:"armor",className:"Druid",icon:"🥻",tier:"Good",defense:8,requiredLevel:10,value:560,metalCost:25,woodCost:70},
  assassinArmor:{name:"Good Assassin Armor",type:"armor",className:"Assassin",icon:"🥷",tier:"Good",defense:8,requiredLevel:10,value:560,metalCost:55,woodCost:40},
  summonerArmor:{name:"Good Summoner Robes",type:"armor",className:"Summoner",icon:"🧣",tier:"Good",defense:8,requiredLevel:10,value:560,metalCost:30,woodCost:65},
  verdantBlade:{name:"Greenwarden’s Edge",type:"weapon",className:"Warrior",icon:"🌿",tier:"Dungeon",attack:8,element:"+2 Nature Damage",requiredLevel:10,value:950,salvage:10,special:true},
  briarRobes:{name:"Raiment of the Briar Saint",type:"armor",className:"Wizard",icon:"🍃",tier:"Dungeon",defense:11,element:"Root ward",requiredLevel:10,value:980,salvage:10,special:true},
  frostBow:{name:"Winterglass",type:"weapon",className:"Archer",icon:"❄️",tier:"Dungeon",attack:10,element:"+2 Frost Damage",requiredLevel:24,value:1800,salvage:16,special:true},
  burningSword:{name:"Emberwrought Oath",type:"weapon",className:"Warrior",icon:"🔥",tier:"Dungeon",attack:11,element:"+2 Fire Damage",requiredLevel:24,value:1900,salvage:16,special:true},
  healingStaff:{name:"Staff of Returning Spring",type:"weapon",className:"Druid",icon:"💚",tier:"Dungeon",attack:9,element:"+8% recovery",requiredLevel:24,value:1750,salvage:15,special:true},
  darkWand:{name:"Nightwhisper",type:"weapon",className:"Wizard",icon:"🌑",tier:"Dungeon",attack:11,element:"+2 Shadow Damage",requiredLevel:24,value:1850,salvage:16,special:true},
  poisonDaggers:{name:"Viper’s Kiss",type:"weapon",className:"Assassin",icon:"☠️",tier:"Dungeon",attack:10,element:"+3 Poison Damage",requiredLevel:24,value:1950,salvage:16,special:true},
  echoTome:{name:"Grimoire of Second Voices",type:"weapon",className:"Summoner",icon:"🔮",tier:"Dungeon",attack:10,element:"+1 summoned echo",requiredLevel:24,value:1900,salvage:16,special:true},
  emberBow:{name:"Ashflight",type:"weapon",className:"Archer",icon:"🏹",tier:"Dungeon",attack:18,element:"+4 Fire Damage",requiredLevel:45,value:4200,salvage:28,special:true},
  cinderTome:{name:"Testament of Living Flame",type:"weapon",className:"Summoner",icon:"📕",tier:"Dungeon",attack:18,element:"Burning summons",requiredLevel:45,value:4300,salvage:28,special:true},
  tideSpear:{name:"Tidecaller’s Crook",type:"weapon",className:"Druid",icon:"🔱",tier:"Dungeon",attack:22,element:"Tidal recovery",requiredLevel:58,value:5900,salvage:35,special:true},
  coralArmor:{name:"Reefking’s Carapace",type:"armor",className:"Warrior",icon:"🪸",tier:"Dungeon",defense:29,element:"Wave ward",requiredLevel:58,value:6100,salvage:36,special:true},
  stormStaff:{name:"Skyroot",type:"weapon",className:"Druid",icon:"⛈️",tier:"Dungeon",attack:25,element:"+6 Lightning Damage",requiredLevel:70,value:7600,salvage:42,special:true},
  tempestDaggers:{name:"Thunderstep Twins",type:"weapon",className:"Assassin",icon:"⚡",tier:"Dungeon",attack:25,element:"Chain lightning",requiredLevel:70,value:7800,salvage:42,special:true},
  basiliskTooth:{name:"The King’s Venom",type:"weapon",className:"Assassin",icon:"🦷",tier:"Raid",attack:15,element:"+30% Crit · +3 Poison",requiredLevel:30,value:12000,salvage:80,special:true,raid:true},
  basiliskPlate:{name:"Stonegaze Carapace",type:"armor",className:"Warrior",icon:"🐲",tier:"Raid",defense:22,element:"Poison ward",requiredLevel:30,value:11500,salvage:75,special:true,raid:true},
  stormbreakerBow:{name:"Thunderhead",type:"weapon",className:"Archer",icon:"🌩️",tier:"Raid",attack:34,element:"+25% Crit · Thunder volley",requiredLevel:60,value:28000,salvage:150,special:true,raid:true},
  titanWard:{name:"Mantle of the Mountain Storm",type:"armor",className:"Druid",icon:"🗿",tier:"Raid",defense:38,element:"Party storm ward",requiredLevel:60,value:27000,salvage:145,special:true,raid:true},
  voidWand:{name:"Scepter of Empty Stars",type:"weapon",className:"Wizard",icon:"🌌",tier:"Raid",attack:48,element:"Void surge",requiredLevel:90,value:68000,salvage:320,special:true,raid:true},
  eclipseTome:{name:"Grimoire of the Devoured Moon",type:"weapon",className:"Summoner",icon:"🌘",tier:"Raid",attack:48,element:"Twin shadow summons",requiredLevel:90,value:70000,salvage:330,special:true,raid:true},
  nightweave:{name:"Shroud Beyond Dawn",type:"armor",className:"Assassin",icon:"🕸️",tier:"Raid",defense:52,element:"Eclipse evasion",requiredLevel:90,value:72000,salvage:340,special:true,raid:true},
};

const LOOT_SET_SPECS = [
  {prefix:"thornroot",name:"Thornroot",tier:"Dungeon",level:10,attack:8,defense:11,value:950,salvage:10,weaponEffect:"+2 Nature Damage",armorEffect:"Root Ward"},
  {prefix:"frozen",name:"Frostbound",tier:"Dungeon",level:24,attack:11,defense:15,value:1850,salvage:16,weaponEffect:"+2 Frost Damage",armorEffect:"Cold Ward"},
  {prefix:"cinderdeep",name:"Cinderdeep",tier:"Dungeon",level:45,attack:18,defense:24,value:4300,salvage:28,weaponEffect:"+4 Fire Damage",armorEffect:"Flame Ward"},
  {prefix:"sunken",name:"Tidecarved",tier:"Dungeon",level:58,attack:22,defense:29,value:6100,salvage:36,weaponEffect:"+5 Tide Damage",armorEffect:"Wave Ward"},
  {prefix:"stormcrypt",name:"Stormcrypt",tier:"Dungeon",level:70,attack:25,defense:34,value:7800,salvage:42,weaponEffect:"+6 Lightning Damage",armorEffect:"Storm Ward"},
  {prefix:"basilisk",name:"Basilisk Crown",tier:"Raid",level:30,attack:15,defense:22,value:12000,salvage:80,weaponEffect:"+3 Poison Damage",armorEffect:"Poison Ward",raid:true},
  {prefix:"tempest",name:"Tempest Titan",tier:"Raid",level:60,attack:34,defense:38,value:28000,salvage:150,weaponEffect:"+5 Thunder Damage",armorEffect:"Titan Ward",raid:true},
  {prefix:"eclipse",name:"Eclipse Wyrm",tier:"Raid",level:90,attack:48,defense:52,value:70000,salvage:330,weaponEffect:"+7 Void Damage",armorEffect:"Eclipse Ward",raid:true},
];

const UNIQUE_ITEM_NAMES = {
  thornroot:{warrior:["Briarheart Cleaver","Ironbark Aegis"],wizard:["Wand of Verdant Whispers","Mosswoven Regalia"],archer:["Thornsong Longbow","Bramblehide Leathers"],druid:["Staff of the Elder Root","Grovekeeper’s Mantle"],assassin:["Needles of the Nightbloom","Shadethorn Raiment"],summoner:["Codex of Crawling Vines","Mycelial Vestments"]},
  frozen:{warrior:["Rimefang","Glacierguard Plate"],wizard:["Winter’s Last Word","Auroraweave Robes"],archer:["Whiteout","Snowstalker Leathers"],druid:["Staff of Sleeping Spring","Frostbloom Mantle"],assassin:["Icicle Twins","Hushfrost Shroud"],summoner:["The Pale Grimoire","Vestments of the Long Night"]},
  cinderdeep:{warrior:["Ashen Oath","Furnaceheart Plate"],wizard:["Emberwake","Cinderseer Robes"],archer:["Pyrestrung","Coalrunner Leathers"],druid:["Staff of Rekindling","Wildfire Mantle"],assassin:["Sootfang Pair","Smokewalker’s Shroud"],summoner:["Codex of Living Flame","Ashcaller Vestments"]},
  sunken:{warrior:["Leviathan’s Wake","Abyssal Shellplate"],wizard:["Pearl of the Drowned Star","Tideoracle Vestments"],archer:["Reefsong","Mariner’s Scalehide"],druid:["Staff of Returning Tides","Kelpweaver Mantle"],assassin:["Undertow","Deepcurrent Shroud"],summoner:["The Barnacled Testament","Vestments of the Drowned Choir"]},
  stormcrypt:{warrior:["Gravethunder","Thunderhead Plate"],wizard:["Wand of the Last Bolt","Stormscribe Regalia"],archer:["Skybreaker","Galehunter Leathers"],druid:["Staff of Roaring Heavens","Cloudshepherd Mantle"],assassin:["Flash and Thunder","Tempestwalker Shroud"],summoner:["Codex of the Unquiet Sky","Vestments of the Storm Choir"]},
  basilisk:{warrior:["Kingsbane, the Stonecutter","Crownscale Bulwark"],wizard:["Scepter of the Petrified Sun","Stonegazer’s Regalia"],archer:["Venomspine","Coilwarden Leathers"],druid:["Staff of the Emerald Tyrant","Crownkeeper’s Mantle"],assassin:["Fang and Falsefang","Shedskin Shroud"],summoner:["The Ophidian Gospel","Vestments of the Thousand Coils"]},
  tempest:{warrior:["Worldsplitter","Titanforged Aegis"],wizard:["Eye of the Supercell","Raiment of the Ninth Thunder"],archer:["Heavenpiercer","Stormchaser Harness"],druid:["Staff of the Walking Storm","Mantle of Bound Lightning"],assassin:["Aftershock","Flashstep Shroud"],summoner:["The Thunderhead Testament","Vestments of the Living Tempest"]},
  eclipse:{warrior:["Duskfall","Eventide Bulwark"],wizard:["The Starless Scepter","Robes Beyond Dawn"],archer:["Night’s Last Arrow","Umbral Horizon Leathers"],druid:["Staff of the Blackened Moon","Moonless Mantle"],assassin:["Nocturne and Silence","Shroud Between Seconds"],summoner:["The Book That Swallowed Light","Vestments of the Final Shadow"]},
};

for(const set of LOOT_SET_SPECS){
  for(const c of CLASS_GEAR){
    const [weaponName,armorName]=UNIQUE_ITEM_NAMES[set.prefix][c.key];
    ITEMS[`${set.prefix}_${c.key}_weapon`]={name:weaponName,type:"weapon",className:c.className,icon:c.weaponIcon,image:`img/item-${set.prefix}-${c.key}-weapon.webp`,tier:set.tier,attack:set.attack,element:set.weaponEffect,requiredLevel:set.level,value:set.value,salvage:set.salvage,special:true,raid:!!set.raid,source:set.name};
    ITEMS[`${set.prefix}_${c.key}_armor`]={name:armorName,type:"armor",className:c.className,icon:c.armorIcon,image:`img/item-${set.prefix}-${c.key}-armor.webp`,tier:set.tier,defense:set.defense,element:set.armorEffect,requiredLevel:set.level,value:set.value,salvage:set.salvage,special:true,raid:!!set.raid,source:set.name};
  }
}

Object.assign(ITEMS,{
  beaverPet:{name:"Beaver",type:"pet",icon:"🦫",image:"img/pet-beaver.webp",tier:"Pet",value:0,soulbound:true,effects:{combatStrength:3,woodDoubleChance:.20},effectText:"+3 combat strength · 20% chance to double the selected Woodcutting item"},
  cowPet:{name:"Cow",type:"pet",icon:"🐄",image:"img/pet-cow.webp",tier:"Pet",value:0,soulbound:true,effects:{combatStrength:2,foodEfficiency:2},effectText:"+2 combat strength · combat food heals +8 HP"},
  molePet:{name:"Mole",type:"pet",icon:"🐾",image:"img/pet-mole.webp",tier:"Pet",value:0,soulbound:true,effects:{combatStrength:2,metalDoubleChance:.15},effectText:"+2 combat strength · 15% chance to double the selected Mining item"},
  forgeSpritePet:{name:"Forge Sprite",type:"pet",icon:"🔥",image:"img/pet-forge-sprite.webp",tier:"Pet",value:0,soulbound:true,effects:{combatStrength:3,smithDoubleChance:.10},effectText:"+3 combat strength · 10% chance to double Repair Kits"},
  basiliskPet:{name:"Basilisk Hatchling",type:"pet",icon:"🐍",image:"img/pet-basilisk-hatchling.webp",tier:"Raid Pet",value:0,soulbound:true,effects:{combatStrength:9,poisonDamage:2},effectText:"+9 combat strength · +2 poison damage"},
  tempestPet:{name:"Tempest Whelp",type:"pet",icon:"⚡",image:"img/pet-tempest-whelp.webp",tier:"Raid Pet",value:0,soulbound:true,effects:{combatStrength:10,lightningDamage:2},effectText:"+10 combat strength · +2 lightning damage"},
  eclipsePet:{name:"Eclipse Wyrmling",type:"pet",icon:"🐉",image:"img/pet-eclipse-wyrmling.webp",tier:"Raid Pet",value:0,soulbound:true,effects:{combatStrength:12,shadowDamage:2},effectText:"+12 combat strength · +2 shadow damage"},
  basiliskEgg:{name:"Basilisk Crown Egg",type:"egg",icon:"🥚",image:"img/egg-basilisk-crown.webp",tier:"Raid Egg",value:0,soulbound:true,hatchesTo:"basiliskPet",effectText:"Hatches into the Basilisk Crown's pet"},
  tempestEgg:{name:"Tempest Titan Egg",type:"egg",icon:"🥚",image:"img/egg-tempest-titan.webp",tier:"Raid Egg",value:0,soulbound:true,hatchesTo:"tempestPet",effectText:"Hatches into a Tempest Whelp"},
  eclipseEgg:{name:"Eclipse Wyrm Egg",type:"egg",icon:"🥚",image:"img/egg-eclipse-wyrm.webp",tier:"Raid Egg",value:0,soulbound:true,hatchesTo:"eclipsePet",effectText:"Hatches into an Eclipse Wyrmling"},
  luckyAcorn:{name:"Lucky Acorn",type:"trinket",icon:"🌰",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{combatStrength:1,woodDoubleChance:.05},effectText:"+1 combat strength · 5% chance to double Wood"},
  frostSigil:{name:"Frost Sigil",type:"trinket",icon:"❄️",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{defense:3},effectText:"+3 defense"},
  emberIdol:{name:"Ember Idol",type:"trinket",icon:"🔥",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{attack:4},effectText:"+4 attack"},
  tidePearl:{name:"Tide Pearl",type:"trinket",icon:"🫧",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{maxHP:8},effectText:"+8 maximum HP"},
  stormLocket:{name:"Storm Locket",type:"trinket",icon:"⚡",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{combatStrength:3},effectText:"+3 combat strength"},
});

const ITEM_ART_ALIASES={
  verdantBlade:"item-verdant-blade.webp",briarRobes:"item-briar-robes.webp",frostBow:"item-frost-bow.webp",healingStaff:"item-healing-staff.webp",emberBow:"item-ember-bow.webp",cinderTome:"item-cinder-tome.webp",stormStaff:"item-storm-staff.webp",tempestDaggers:"item-tempest-daggers.webp",voidWand:"item-void-wand.webp",eclipseTome:"item-eclipse-tome.webp",
  luckyAcorn:"item-lucky-acorn.webp",frostSigil:"item-frost-sigil.webp",emberIdol:"item-ember-idol.webp",tidePearl:"item-tide-pearl.webp",stormLocket:"item-storm-locket.webp",
  burningSword:"item-cinderdeep-warrior-weapon.webp",darkWand:"item-eclipse-wizard-weapon.webp",poisonDaggers:"item-basilisk-assassin-weapon.webp",echoTome:"item-stormcrypt-summoner-weapon.webp",tideSpear:"item-sunken-druid-weapon.webp",coralArmor:"item-sunken-warrior-armor.webp",basiliskTooth:"item-basilisk-assassin-weapon.webp",basiliskPlate:"item-basilisk-warrior-armor.webp",stormbreakerBow:"item-tempest-archer-weapon.webp",titanWard:"item-tempest-druid-armor.webp",nightweave:"item-eclipse-assassin-armor.webp",
};
for(const [key,filename] of Object.entries(ITEM_ART_ALIASES))if(ITEMS[key])ITEMS[key].image=`img/${filename}`;

const RESOURCE_TIERS = {
  food:[
    {id:"starter",tier:"Starter",name:"Foraged Rations",icon:"🥕",level:1,building:1,rank:1,heal:8},
    {id:"weak",tier:"Weak",name:"Simple Meals",icon:"🥣",level:5,building:1,rank:2,heal:16},
    {id:"average",tier:"Average",name:"Hearty Meals",icon:"🍲",level:12,building:2,rank:4,heal:32},
    {id:"good",tier:"Good",name:"Trail Feasts",icon:"🥘",level:25,building:3,rank:7,heal:56},
    {id:"great",tier:"Great",name:"Adventurer Feasts",icon:"🍗",level:40,building:4,rank:11,heal:88},
    {id:"epic",tier:"Epic",name:"Hero's Feasts",icon:"🍖",level:60,building:5,rank:16,heal:128},
    {id:"legendary",tier:"Legendary",name:"Legendary Banquets",icon:"🍱",level:80,building:6,rank:22,heal:176},
    {id:"divine",tier:"Divine",name:"Divine Banquets",icon:"✨",level:100,building:8,rank:30,heal:240},
  ],
  metal:[
    {id:"starter",tier:"Starter",name:"Scrap Metal",icon:"🔩",level:1,building:1,rank:1},
    {id:"weak",tier:"Weak",name:"Copper",icon:"🟠",level:5,building:1,rank:2},
    {id:"average",tier:"Average",name:"Iron",icon:"⚙️",level:12,building:2,rank:4},
    {id:"good",tier:"Good",name:"Steel",icon:"⛓️",level:25,building:3,rank:7},
    {id:"great",tier:"Great",name:"Mithril",icon:"🔷",level:40,building:4,rank:11},
    {id:"epic",tier:"Epic",name:"Adamant",icon:"💠",level:60,building:5,rank:16},
    {id:"legendary",tier:"Legendary",name:"Starsteel",icon:"🌠",level:80,building:6,rank:22},
    {id:"divine",tier:"Divine",name:"Divine Metal",icon:"✨",level:100,building:8,rank:30},
  ],
  wood:[
    {id:"starter",tier:"Starter",name:"Fallen Branches",icon:"🪵",level:1,building:1,rank:1},
    {id:"weak",tier:"Weak",name:"Pine",icon:"🌲",level:5,building:1,rank:2},
    {id:"average",tier:"Average",name:"Oak",icon:"🟤",level:12,building:2,rank:4},
    {id:"good",tier:"Good",name:"Ironwood",icon:"🪓",level:25,building:3,rank:7},
    {id:"great",tier:"Great",name:"Elderwood",icon:"🌳",level:40,building:4,rank:11},
    {id:"epic",tier:"Epic",name:"Moonwood",icon:"🌙",level:60,building:5,rank:16},
    {id:"legendary",tier:"Legendary",name:"Worldwood",icon:"🌐",level:80,building:6,rank:22},
    {id:"divine",tier:"Divine",name:"Divine Timber",icon:"✨",level:100,building:8,rank:30},
  ],
};
const RESOURCE_ASSIGNMENTS={farm:"food",mine:"metal",forest:"wood"};
const UTILITY_RESOURCE_STACKS=[
  {key:"essence",name:"Essence",icon:"✨",tier:"Dungeon Resource",detail:"Used to enter Dungeons and Raids."},
  {key:"keys",name:"Raid Keys",icon:"🗝️",tier:"Dungeon Resource",detail:"Used to open Raid encounters."},
  {key:"repairKits",name:"Repair Kits",icon:"🧰",tier:"Crafted Resource",detail:"Used to restore equipment durability."},
];
const emptyResourceTiers=()=>Object.fromEntries(Object.entries(RESOURCE_TIERS).map(([resource,tiers])=>[resource,Object.fromEntries(tiers.map(t=>[t.id,0]))]));
const TIER_ACTION_SECONDS={starter:10,weak:12,average:15,good:18,great:22,epic:28,legendary:35,divine:45};
const REPAIR_KIT_RECIPE={metalTier:"starter",metalCost:4,woodTier:"starter",woodCost:3};
const NORMAL_GEAR_TIER_SPECS=[
  {id:"starter",combatLevel:1,attack:1,defense:2,costScale:1,weaponValue:40,armorValue:50},
  {id:"weak",combatLevel:3,attack:2,defense:3,costScale:2,weaponValue:120,armorValue:140},
  {id:"average",combatLevel:6,attack:4,defense:5,costScale:3,weaponValue:280,armorValue:310},
  {id:"good",combatLevel:10,attack:6,defense:8,costScale:5,weaponValue:520,armorValue:560},
  {id:"great",combatLevel:20,attack:9,defense:12,costScale:7,weaponValue:1000,armorValue:1100},
  {id:"epic",combatLevel:35,attack:14,defense:18,costScale:10,weaponValue:2200,armorValue:2400},
  {id:"legendary",combatLevel:55,attack:22,defense:28,costScale:14,weaponValue:4800,armorValue:5200},
  {id:"divine",combatLevel:75,attack:32,defense:40,costScale:20,weaponValue:10000,armorValue:10800},
].map(spec=>{const material=RESOURCE_TIERS.metal.find(tier=>tier.id===spec.id);return {...spec,name:material.tier,smithLevel:material.level,building:material.building};});
const NORMAL_GEAR_ARCHETYPES=[
  {key:"warrior",weaponNoun:"Sword",armorNoun:"Plate",weaponMaterial:"metal",armorMaterial:"metal",weaponBase:[14,5],armorBase:[17,4]},
  {key:"wizard",weaponNoun:"Wand",armorNoun:"Robes",weaponMaterial:"wood",armorMaterial:"wood",weaponBase:[7,12],armorBase:[6,13]},
  {key:"archer",weaponNoun:"Bow",armorNoun:"Leathers",weaponMaterial:"wood",armorMaterial:"wood",weaponBase:[5,14],armorBase:[9,10]},
  {key:"druid",weaponNoun:"Staff",armorNoun:"Mantle",weaponMaterial:"wood",armorMaterial:"wood",weaponBase:[4,15],armorBase:[5,14]},
  {key:"assassin",weaponNoun:"Daggers",armorNoun:"Shroud",weaponMaterial:"metal",armorMaterial:"metal",weaponBase:[15,4],armorBase:[11,8]},
  {key:"summoner",weaponNoun:"Tome",armorNoun:"Vestments",weaponMaterial:"wood",armorMaterial:"wood",weaponBase:[5,13],armorBase:[6,13]},
];
const LEGACY_NORMAL_GEAR_KEYS={
  starter:{warrior:{weapon:"rustySword"},wizard:{weapon:"apprenticeWand"},archer:{weapon:"huntingBow"},druid:{weapon:"oakStaff"},assassin:{weapon:"wornDaggers"},summoner:{weapon:"noviceTome"}},
  good:{warrior:{weapon:"goodSword",armor:"warriorArmor"},wizard:{weapon:"goodWand",armor:"wizardArmor"},archer:{weapon:"goodBow",armor:"archerArmor"},druid:{weapon:"goodStaff",armor:"druidArmor"},assassin:{weapon:"goodDaggers",armor:"assassinArmor"},summoner:{weapon:"goodTome",armor:"summonerArmor"}},
};
const NORMAL_GEAR_NAME_MATERIALS={starter:{metal:"Scrapforged",wood:"Branchwoven"},weak:{metal:"Copper",wood:"Pine"},average:{metal:"Iron",wood:"Oak"},good:{metal:"Steel",wood:"Ironwood"},great:{metal:"Mithril",wood:"Elderwood"},epic:{metal:"Adamant",wood:"Moonwood"},legendary:{metal:"Starsteel",wood:"Worldwood"},divine:{metal:"Divine",wood:"Divine"}};
const normalGearKey=(tierId,classKey,slot)=>LEGACY_NORMAL_GEAR_KEYS[tierId]?.[classKey]?.[slot]||`normal_${tierId}_${classKey}_${slot}`;
const normalGearDisplayName=(tier,archetype,slot)=>`${NORMAL_GEAR_NAME_MATERIALS[tier.id][archetype[`${slot}Material`]]} ${archetype[`${slot}Noun`]}`;
const NORMAL_GEAR_RECIPE_KEYS=Object.fromEntries(NORMAL_GEAR_TIER_SPECS.map(tier=>[tier.id,{weapon:[],armor:[]} ]));
for(const tier of NORMAL_GEAR_TIER_SPECS){
  for(const archetype of NORMAL_GEAR_ARCHETYPES){
    const classGear=CLASS_GEAR.find(entry=>entry.key===archetype.key);
    for(const slot of ["weapon","armor"]){
      const key=normalGearKey(tier.id,archetype.key,slot),existing=ITEMS[key]||{},[metalBase,woodBase]=archetype[`${slot}Base`];
      const image=slot==="weapon"&&archetype.key==="warrior"?`img/item-sword-${tier.id}.webp`:`img/item-normal-${tier.id}-${archetype.key}-${slot}.webp`;
      ITEMS[key]={...existing,name:normalGearDisplayName(tier,archetype,slot),type:slot,className:classGear.className,icon:slot==="weapon"?classGear.weaponIcon:classGear.armorIcon,image,tier:tier.name,[slot==="weapon"?"attack":"defense"]:slot==="weapon"?tier.attack:tier.defense,requiredLevel:tier.combatLevel,value:slot==="weapon"?tier.weaponValue:tier.armorValue,recipeTier:tier.id,smithLevel:tier.smithLevel,buildingLevel:tier.building,metalCost:metalBase*tier.costScale,woodCost:woodBase*tier.costScale,normalGear:true};
      NORMAL_GEAR_RECIPE_KEYS[tier.id][slot].push(key);
    }
  }
}
const SKILL_PETS={farm:"cowPet",mine:"molePet",forest:"beaverPet",smith:"forgeSpritePet"};
const SKILL_PET_CHANCE=1/250000;
const HERO_RECORD_DEFAULTS={kills:0,expeditions:0,dungeons:0,raids:0,raidBosses:0,dungeonBosses:0,goldEarned:0,beers:0,defeats:0,itemsFound:0,foodGathered:0,metalMined:0,woodGathered:0,kitsForged:0,workActions:0,secondsActive:0,damageDealt:0,damageTaken:0,healingDone:0,combatActions:0};

const ACHIEVEMENTS = [
  {id:"firstJob",icon:"📋",name:"Everyone Has a Job",description:"Assign all six heroes at once.",test:s=>s.heroes.every(h=>h.assignment!=="idle")},
  {id:"firstWin",icon:"⚔️",name:"Beyond the Gate",description:"Complete an Expedition.",test:s=>s.stats.expeditions>=1},
  {id:"dungeon",icon:"🗝️",name:"Hollow Victor",description:"Complete the Frozen Hollow Dungeon.",test:s=>s.stats.dungeons>=1},
  {id:"raid",icon:"🐲",name:"Basilisk Breaker",description:"Defeat the Basilisk Crown raid.",test:s=>s.stats.raids>=1},
  {id:"special",icon:"❄️",name:"Something Special",description:"Find unique Dungeon equipment.",test:s=>s.inventory.some(i=>ITEMS[i.key]?.special)},
  {id:"prosperity",icon:"🪙",name:"Prosperous Town",description:"Hold 10,000 Gold.",test:s=>s.resources.gold>=10000},
  {id:"master",icon:"🏆",name:"A True Specialist",description:"Reach level 50 in any work skill.",test:s=>s.heroes.some(h=>Object.values(h.skills).some(x=>x.level>=50))},
  {id:"rebuilt",icon:"🏰",name:"Stone and Story",description:"Upgrade every building at least once.",test:s=>Object.values(s.buildings).every(x=>x>=2)},
];

let state;
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") || {};
if(typeof settings.soundEnabled!=="boolean")settings.soundEnabled=true;
let currentUser = null;
let firebaseApi = null;
let marketListings = [];
let leaderboard = [];
let cloudUnsubscribe = null;
let saveTimer = null;
let cloudSaveTimer = null;
let lastCloudSave = 0;
let quietSimulation = false;
let currentView = "town";
let warehouseFilter = "all";
let lastSimulationAt = Date.now();
let lastSlowRender = 0;
let watchedRunId = null;
let lastActiveRunRender = 0;
let combatVisualFrame = null;
let activeSimulationAudit = null;
let activeMapSpeech = null;
let mapSpeechTimer = null;
let heroLeagueMetric = "power";
let audioContext = null;
const soundCooldowns = new Map();
const seenCombatEventIds = new Set();

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
const fmt = n => Math.floor(Number(n)||0).toLocaleString();
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const heroById = id => state.heroes.find(h=>h.id===id);
const itemData = item => ({...ITEMS[item.key],...item});
const xpForLevel = level => Math.floor(55 * Math.pow(level,1.62));
const COMBAT_XP_TOTALS=(()=>{const totals=Array(101).fill(0);let points=0;for(let level=1;level<100;level++){points+=Math.floor(level+300*Math.pow(2,level/7));totals[level+1]=Math.floor(points/4);}return totals;})();
const combatXPForLevel = level => level>=100?0:COMBAT_XP_TOTALS[level+1]-COMBAT_XP_TOTALS[level];
const heroCombatTotalXP = h => COMBAT_XP_TOTALS[clamp(Math.floor(Number(h.level)||1),1,100)]+(Number(h.xp)||0);
const combatXPProgress = h => {const required=combatXPForLevel(h.level),current=h.level>=100?0:clamp(Number(h.xp)||0,0,required),percent=h.level>=100?100:required?current/required*100:0;return {current,required,percent,remaining:Math.max(0,required-current)};};
const SWORD_TIER_IMAGES=Object.fromEntries(["starter","weak","average","good","great","epic","legendary","divine"].map(tier=>[tier,`img/item-sword-${tier}.webp`]));
const assetImage = (src,alt,className,fallback="✦",decorative=false) => `<img class="${className}" src="${escapeHTML(src)}" alt="${decorative?"":escapeHTML(alt)}" ${decorative?'aria-hidden="true" ':""}draggable="false" data-art-fallback="${escapeHTML(fallback)}">`;
const heroImage = (h,className="hero-image") => assetImage(h.portrait,h.name,className,h.icon,true);
const itemImagePath = item => item?.image||(item?.type==="weapon"&&item?.className==="Warrior"?SWORD_TIER_IMAGES[String(item.tier||"").toLowerCase()]:null);
const itemImage = (item,className="item-art") => itemImagePath(item)?assetImage(itemImagePath(item),item.name,className,item.icon):item?.icon||"✦";
const roomImage = (room,className="room-art") => room?.type==="combat"&&room.image?assetImage(room.image,room.name,className,room.icon):room?.icon||"✦";

function assetCatalog(){
  return [...new Set([
    "img/icon.svg","img/fantasy-town-map.webp","img/loot-chest.svg","img/ui-icon-atlas.webp","img/item-thornroot-warrior-weapon.webp",
    ...Object.values(SWORD_TIER_IMAGES),...HEROES.map(h=>h.portrait),...Object.values(COMBAT_LAYOUTS).flatMap(rooms=>rooms.filter(room=>room.type==="combat").map(room=>room.image)),...Object.values(ITEMS).map(item=>item.image).filter(Boolean),
  ])];
}

async function preloadAssets(){
  const assets=assetCatalog(),bar=$("#loadingProgress"),track=$(".loading-track"),count=$("#loadingCount"),failed=[];let complete=0;
  const update=()=>{const pct=assets.length?Math.round(complete/assets.length*100):100;if(bar)bar.style.width=`${pct}%`;if(track){track.setAttribute("aria-valuenow",String(complete));track.setAttribute("aria-valuemax",String(assets.length));}if(count)count.textContent=`${complete} / ${assets.length} assets`;};
  $("#loadingText").textContent="Preparing the town artwork…";update();
  let cursor=0;const load=src=>new Promise(resolve=>{const image=new Image();let settled=false;const timeout=setTimeout(()=>finish(false),15000),finish=ok=>{if(settled)return;settled=true;clearTimeout(timeout);if(!ok)failed.push(src);complete++;update();resolve();};image.onload=()=>finish(true);image.onerror=()=>finish(false);image.src=src;});
  const worker=async()=>{while(cursor<assets.length){const src=assets[cursor++];await load(src);}};
  await Promise.all(Array.from({length:Math.min(10,assets.length)},worker));
  return failed;
}

function recalculateTieredTotal(resource){state.resources[resource]=RESOURCE_TIERS[resource].reduce((total,tier)=>total+Math.floor(state.resourceTiers[resource][tier.id]||0),0);}
function addTieredResource(resource,tierId,units){state.resourceTiers[resource][tierId]=(state.resourceTiers[resource][tierId]||0)+units;recalculateTieredTotal(resource);}
function resourceTierData(resource,tierId){return RESOURCE_TIERS[resource]?.find(tier=>tier.id===tierId)||null;}
function resourceTierCount(resource,tierId){return Math.floor(state.resourceTiers?.[resource]?.[tierId]||0);}
function spendSpecificResource(resource,tierId,amount){amount=Math.max(0,Math.floor(Number(amount)||0));if(resourceTierCount(resource,tierId)<amount)return false;state.resourceTiers[resource][tierId]-=amount;recalculateTieredTotal(resource);return true;}
function unlockedResourceTiers(h,assignment){const resource=RESOURCE_ASSIGNMENTS[assignment],skill=BUILDINGS[assignment]?.skill,buildingLevel=state.buildings[assignment]||1;return resource?RESOURCE_TIERS[resource].filter(t=>(h.skills[skill]?.level||1)>=t.level&&buildingLevel>=t.building):[];}
function resourceTierForHero(h,assignment){const unlocked=unlockedResourceTiers(h,assignment),selected=h.workTiers?.[assignment]||"starter";return unlocked.find(t=>t.id===selected)||unlocked[0]||RESOURCE_TIERS[RESOURCE_ASSIGNMENTS[assignment]]?.[0];}
function workTierPickerHTML(h,assignment){const tiers=unlockedResourceTiers(h,assignment),selected=resourceTierForHero(h,assignment)?.id;return tiers.length?`<label class="work-tier-picker"><span>Exact task</span><select data-work-tier data-hero="${h.id}" data-assignment="${assignment}" aria-label="${escapeHTML(h.name)} ${ASSIGNMENTS[assignment].name} task">${tiers.map(t=>`<option value="${t.id}" ${t.id===selected?"selected":""}>${t.icon} ${escapeHTML(t.name)} · ${TIER_ACTION_SECONDS[t.id]}s base</option>`).join("")}</select></label>`:"";}

function createCombatRunState(combatId,heroIds,autoRepeat=true,id=uid()){
  return {id,combatId,heroIds:[...heroIds],autoRepeat,startedAt:Date.now(),cycle:1,roomIndex:0,roomState:null,heroTimers:{},heroStats:Object.fromEntries(heroIds.map(heroId=>[heroId,{damage:0,taken:0,healing:0,attacks:0,hits:0,crits:0}])),enemyTimer:0,enemy:null,elapsed:0,cycleElapsed:0,kills:0,cycles:0,foodEaten:0,damageDealt:0,damageTaken:0,recentEvents:[],lastReward:"No chest opened yet"};
}

function migrateCombatRun(saved,combatId,heroIds,heroes){
  const base=createCombatRunState(combatId,heroIds,saved.autoRepeat!==false,saved.id||uid()),cfg=COMBAT[combatId],layout=COMBAT_LAYOUTS[combatId]||[],roomIndex=clamp(Math.floor(Number(saved.roomIndex)||0),0,Math.max(0,layout.length-1)),room=layout[roomIndex];
  const nonnegative=(value,fallback=0)=>Math.max(0,Number.isFinite(Number(value))?Number(value):fallback);
  const run={...base,...saved,id:base.id,combatId,heroIds:[...heroIds],autoRepeat:saved.autoRepeat!==false,startedAt:nonnegative(saved.startedAt,base.startedAt),cycle:Math.max(1,Math.floor(nonnegative(saved.cycle,1))),roomIndex,heroTimers:{},heroStats:{},enemyTimer:nonnegative(saved.enemyTimer),enemy:null,roomState:null,elapsed:nonnegative(saved.elapsed),cycleElapsed:nonnegative(saved.cycleElapsed),kills:Math.floor(nonnegative(saved.kills)),cycles:Math.floor(nonnegative(saved.cycles)),foodEaten:Math.floor(nonnegative(saved.foodEaten)),damageDealt:nonnegative(saved.damageDealt),damageTaken:nonnegative(saved.damageTaken),recentEvents:Array.isArray(saved.recentEvents)?saved.recentEvents.slice(-30):[],lastReward:String(saved.lastReward||base.lastReward)};
  const statHeroIds=new Set([...heroIds,...Object.keys(saved.heroStats||{}).filter(id=>heroes.some(hero=>hero.id===id))]);for(const id of statHeroIds){const current=saved.heroStats?.[id]||{};run.heroStats[id]={damage:nonnegative(current.damage),taken:nonnegative(current.taken),healing:nonnegative(current.healing),attacks:Math.floor(nonnegative(current.attacks)),hits:Math.floor(nonnegative(current.hits)),crits:Math.floor(nonnegative(current.crits))};}
  for(const id of heroIds){const hero=heroes.find(h=>h.id===id);run.heroTimers[id]=nonnegative(saved.heroTimers?.[id],hero?heroAttackSpeed(hero):2.6);}
  if(room?.type==="skill"&&saved.roomState?.type==="skill"){
    const total=Math.max(.01,nonnegative(saved.roomState.total,room.baseSeconds));run.roomState={type:"skill",total,remaining:clamp(nonnegative(saved.roomState.remaining,total),0,total),effective:nonnegative(saved.roomState.effective,1),leaderId:heroIds.includes(saved.roomState.leaderId)?saved.roomState.leaderId:heroIds[0]||null};
  }else if(room?.type==="combat"&&saved.roomState?.type==="combat"&&saved.enemy){
    const canonical=createEnemy(cfg,room),maxHP=Math.max(1,nonnegative(saved.enemy.maxHP,canonical.maxHP));
    run.enemy={...canonical,...saved.enemy,name:room.name,icon:room.icon,image:room.image,boss:!!room.boss,room,maxHP,hp:clamp(nonnegative(saved.enemy.hp,maxHP),0,maxHP),attack:nonnegative(saved.enemy.attack,canonical.attack),defense:nonnegative(saved.enemy.defense,canonical.defense),maxHit:nonnegative(saved.enemy.maxHit,canonical.maxHit),speed:Math.max(.1,nonnegative(saved.enemy.speed,canonical.speed)),attacks:Math.floor(nonnegative(saved.enemy.attacks)),status:{...(saved.enemy.status||{})}};run.roomState={type:"combat"};
  }
  return run;
}

function freshState(){
  return {
    version:VERSION, combatXpCurve:1, townName:"Briarwatch", createdAt:Date.now(), updatedAt:Date.now(), lastTick:Date.now(), randomSeed:987654321,
    resources:{gold:0,food:0,metal:0,wood:0,essence:0,keys:0,repairKits:0}, resourceTiers:emptyResourceTiers(),
    buildings:{farm:1,mine:1,forest:1,smith:1,warehouse:1,market:1,inn:1,tavern:1},
    heroes:HEROES.map((h,i)=>({ ...h, level:1,xp:0,sanity:100,hp:Math.round(100*(CLASS_COMBAT[h.className]?.hp||1)),assignment:"idle", recoveryUntil:0,workProgress:0,workTiers:{farm:"starter",mine:"starter",forest:"starter"},records:{...HERO_RECORD_DEFAULTS},
      skills:{farming:{level:1,xp:0},mining:{level:1,xp:0},woodcutting:{level:1,xp:0},smithing:{level:1,xp:0}},
      equipment:{weapon:{key:["rustySword","apprenticeWand","huntingBow","oakStaff","wornDaggers","noviceTome"][i],durability:100},armor:null,pet:null,trinket:null}
    })),
    inventory:[], combatRuns:[], notifications:[{id:uid(),time:Date.now(),title:"The town awakens",text:"Your six adventurers are ready. Every choice of how they spend their time will shape Briarwatch."}],
    partyChat:starterPartyChat(), chatMeta:{lastReadAt:0,ambientProgress:0,nextAmbientAt:55,lastSpeakerId:null,cooldowns:{}},
    stockMarket:freshStockMarket(),
    achievements:[], stats:{expeditions:0,dungeons:0,raids:0,defeats:0,goldEarned:0,itemsFound:0,marketSales:0,offlineSeconds:0},
    pendingFractions:{food:0,metal:0,wood:0,kits:0}, settings:{autoSave:true,reducedMotion:false},
  };
}

function migrate(raw){
  const base=freshState();
  if(!raw || !raw.heroes) return base;
  const merged={...base,...raw,version:VERSION,resources:{...base.resources,...raw.resources},buildings:{...base.buildings,...raw.buildings},stats:{...base.stats,...raw.stats},pendingFractions:{...base.pendingFractions,...raw.pendingFractions}};
  merged.resourceTiers=emptyResourceTiers();
  for(const [resource,tiers] of Object.entries(RESOURCE_TIERS)){
    let fractionalItems=0;
    if(raw.resourceTiers?.[resource])for(const tier of tiers){const amount=Math.max(0,Number(raw.resourceTiers[resource][tier.id])||0);merged.resourceTiers[resource][tier.id]=Math.floor(amount);fractionalItems+=amount-Math.floor(amount);}
    else merged.resourceTiers[resource].starter=Math.floor(Math.max(0,Number(raw.resources?.[resource])||0));
    merged.resourceTiers[resource].starter+=Math.round(fractionalItems);
    merged.resources[resource]=tiers.reduce((total,tier)=>total+merged.resourceTiers[resource][tier.id],0);
  }
  merged.heroes=base.heroes.map(b=>{const h=raw.heroes.find(x=>x.id===b.id)||{},skills=Object.fromEntries(Object.entries(b.skills).map(([key,value])=>[key,{...value,...(h.skills?.[key]||{})}])),level=clamp(Math.floor(Number(h.level)||1),1,100),legacyProgress=raw.combatXpCurve===1?null:clamp((Number(h.xp)||0)/Math.max(1,xpForLevel(level)),0,.999999),xp=level>=100?0:legacyProgress===null?clamp(Number(h.xp)||0,0,combatXPForLevel(level)-1):Math.floor(combatXPForLevel(level)*legacyProgress);return {...b,...h,level,xp,portrait:b.portrait,workProgress:Math.max(0,Number(h.workProgress)||0),workTiers:{...b.workTiers,...(h.workTiers||{})},records:{...HERO_RECORD_DEFAULTS,...(h.records||{})},skills,equipment:{...b.equipment,...(h.equipment||{})}}});
  merged.combatXpCurve=1;
  merged.inventory=Array.isArray(raw.inventory)?raw.inventory:[];
  const legacyCombat={expedition:"meadowWatch",dungeon:"frozenHollow",raid:"basiliskCrown"};
  merged.combatRuns=(Array.isArray(raw.combatRuns)?raw.combatRuns:[]).map(r=>{const combatId=r.combatId||legacyCombat[r.type]||r.type;if(!COMBAT[combatId])return null;const heroIds=(r.heroIds||[]).filter(id=>merged.heroes.some(h=>h.id===id&&(h.hp||0)>0));return heroIds.length?migrateCombatRun(r,combatId,heroIds,merged.heroes):null;}).filter(Boolean);
  const activeIds=new Set(merged.combatRuns.flatMap(r=>r.heroIds));for(const h of merged.heroes){if(activeIds.has(h.id))h.assignment="combat";else if(h.assignment==="combat")h.assignment="idle";h.hp=clamp(Number(h.hp??heroMaxHP(h)),0,heroMaxHP(h));}
  merged.notifications=Array.isArray(raw.notifications)?raw.notifications:base.notifications;
  merged.partyChat=(Array.isArray(raw.partyChat)?raw.partyChat:base.partyChat).filter(message=>message&&merged.heroes.some(hero=>hero.id===message.heroId)&&typeof message.text==="string").slice(-PARTY_CHAT_LIMIT);
  merged.chatMeta={...base.chatMeta,...(raw.chatMeta||{}),cooldowns:{...base.chatMeta.cooldowns,...(raw.chatMeta?.cooldowns||{})}};
  merged.stockMarket=migrateStockMarket(raw.stockMarket,base.stockMarket);
  return merged;
}

function random(){
  let x=state.randomSeed|0; x^=x<<13; x^=x>>>17; x^=x<<5; state.randomSeed=x|0; return (x>>>0)/4294967296;
}

function freshStockMarket(){
  return {seed:246813579,tickProgress:0,realized:0,stocks:Object.fromEntries(Object.entries(STOCK_DEFS).map(([id,def])=>[id,{price:def.base,previous:def.base,history:[def.base],owned:0,costBasis:0}]))};
}
function migrateStockMarket(saved,fallback=freshStockMarket()){
  const market={...fallback,...(saved||{}),seed:Number(saved?.seed)||fallback.seed,tickProgress:clamp(Number(saved?.tickProgress)||0,0,MARKET_TICK_SECONDS),realized:Number(saved?.realized)||0,stocks:{}};
  for(const [id,def] of Object.entries(STOCK_DEFS)){const value=saved?.stocks?.[id]||fallback.stocks[id],price=clamp(Number(value.price)||def.base,def.base*.18,def.base*5),history=(Array.isArray(value.history)?value.history:[price]).map(Number).filter(Number.isFinite).slice(-48);market.stocks[id]={price,previous:Number(value.previous)||price,history:history.length?history:[price],owned:Math.max(0,Math.floor(Number(value.owned)||0)),costBasis:Math.max(0,Number(value.costBasis)||0)};}return market;
}
function marketRandom(){let x=state.stockMarket.seed|0;x^=x<<13;x^=x>>>17;x^=x<<5;state.stockMarket.seed=x|0;return (x>>>0)/4294967296;}
function processStockMarket(seconds){
  const market=state.stockMarket;market.tickProgress+=seconds;let ticks=0;
  while(market.tickProgress>=MARKET_TICK_SECONDS&&ticks++<3000){market.tickProgress-=MARKET_TICK_SECONDS;for(const [id,def] of Object.entries(STOCK_DEFS)){const stock=market.stocks[id],noise=(marketRandom()+marketRandom()+marketRandom()-1.5)*def.volatility,meanPull=((def.base-stock.price)/def.base)*.018,shock=marketRandom()<.035?(marketRandom()-.5)*def.volatility*4.2:0;stock.previous=stock.price;stock.price=Math.round(clamp(stock.price*(1+noise+meanPull+shock),def.base*.18,def.base*5)*100)/100;stock.history.push(stock.price);stock.history=stock.history.slice(-48);}}
}
function stockMarketValue(){return Object.entries(STOCK_DEFS).reduce((total,[id])=>total+state.stockMarket.stocks[id].owned*state.stockMarket.stocks[id].price,0);}
function stockSparkline(stock,def){const values=stock.history.length>1?stock.history:[stock.price,stock.price],min=Math.min(...values),max=Math.max(...values),range=Math.max(.01,max-min),points=values.map((value,index)=>`${(index/(values.length-1)*220).toFixed(1)},${(50-(value-min)/range*44).toFixed(1)}`).join(" "),up=stock.price>=values[0];return `<svg class="stock-sparkline ${up?"up":"down"}" viewBox="0 0 220 54" role="img" aria-label="${escapeHTML(def.name)} recent price chart"><polyline points="${points}" vector-effect="non-scaling-stroke"></polyline></svg>`;}
function tavernMarketHTML(){
  const market=state.stockMarket,value=stockMarketValue(),basis=Object.values(market.stocks).reduce((total,stock)=>total+stock.costBasis,0),profit=value-basis,seconds=Math.max(1,Math.ceil(MARKET_TICK_SECONDS-market.tickProgress));
  return `<section class="tavern-exchange" id="tavernMarket"><div class="tavern-market-head"><div><span class="eyebrow">Live from the back table</span><h3>The Crooked Coin Exchange</h3><p>Three wildly enthusiastic fantasy businesses. Quotes move every ${MARKET_TICK_SECONDS} seconds, even while you are away.</p></div><div class="market-bell"><span>🔔</span><strong data-market-countdown>${seconds}s</strong><small>Next bell</small></div></div><div class="portfolio-strip"><div><small>Holdings</small><strong>🪙 ${fmt(value)}</strong></div><div><small>Unrealized</small><strong class="${profit>=0?"gain":"loss"}">${profit>=0?"+":""}${fmt(profit)}</strong></div><div><small>Realized</small><strong class="${market.realized>=0?"gain":"loss"}">${market.realized>=0?"+":""}${fmt(market.realized)}</strong></div><div><small>Broker fee</small><strong>${MARKET_FEE*100}%</strong></div></div><div class="fantasy-stocks">${Object.entries(STOCK_DEFS).map(([id,def])=>{const stock=market.stocks[id],change=stock.previous?((stock.price-stock.previous)/stock.previous)*100:0,holding=stock.owned*stock.price,pl=holding-stock.costBasis;return `<article class="fantasy-stock" style="--stock-color:${def.color}"><div class="stock-title"><span>${def.icon}</span><div><strong>${escapeHTML(def.name)}</strong><small>${def.ticker} · ${escapeHTML(def.flavor)}</small></div><b class="${change>=0?"gain":"loss"}">${change>=0?"+":""}${change.toFixed(1)}%</b></div>${stockSparkline(stock,def)}<div class="stock-quote"><div><small>Share price</small><strong>🪙 ${stock.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></div><div><small>You own</small><strong>${fmt(stock.owned)} · 🪙 ${fmt(holding)}</strong></div><div><small>Position</small><strong class="${pl>=0?"gain":"loss"}">${pl>=0?"+":""}${fmt(pl)}</strong></div></div><div class="stock-actions"><button data-action="trade-stock" data-stock="${id}" data-trade="buy" data-quantity="1">Buy 1</button><button data-action="trade-stock" data-stock="${id}" data-trade="buy" data-quantity="max">Buy max</button><button data-action="trade-stock" data-stock="${id}" data-trade="sell" data-quantity="1" ${stock.owned<1?"disabled":""}>Sell 1</button><button data-action="trade-stock" data-stock="${id}" data-trade="sell" data-quantity="all" ${stock.owned<1?"disabled":""}>Sell all</button></div></article>`;}).join("")}</div><p class="market-disclaimer">Tavern entertainment only: no dividends, no debt, no real-world connection. The barkeep is not a licensed anything.</p></section>`;
}
function refreshTavernMarket(){if($("#drawer")?.dataset.mode!=="tavern")return;const host=$("#tavernMarket");if(host)host.outerHTML=tavernMarketHTML();}
function tradeStock(id,trade,quantity){
  const def=STOCK_DEFS[id],stock=state.stockMarket.stocks[id];if(!def||!stock)return;let qty=0;
  if(trade==="buy"){const perShare=stock.price*(1+MARKET_FEE);qty=quantity==="max"?Math.floor(state.resources.gold/perShare):Math.max(1,Math.floor(Number(quantity)||1));const cost=Math.ceil(perShare*qty);if(!qty||state.resources.gold<cost)return toast("🪙","Not enough Gold",`One ${def.ticker} share costs ${fmt(Math.ceil(perShare))} Gold after the broker fee.`);state.resources.gold-=cost;stock.owned+=qty;stock.costBasis+=cost;playSound("coin");toast(def.icon,`Bought ${qty} ${def.ticker}`,`The Crooked Coin took ${fmt(cost)} Gold.`);
  }else{qty=quantity==="all"?stock.owned:Math.min(stock.owned,Math.max(1,Math.floor(Number(quantity)||1)));if(!qty)return;const proportion=qty/stock.owned,removedBasis=stock.costBasis*proportion,revenue=Math.floor(stock.price*qty*(1-MARKET_FEE));stock.owned-=qty;stock.costBasis=Math.max(0,stock.costBasis-removedBasis);state.stockMarket.realized+=revenue-removedBasis;state.resources.gold+=revenue;playSound("coin");toast(def.icon,`Sold ${qty} ${def.ticker}`,`${fmt(revenue)} Gold reached the town purse.`);}
  markDirty();renderResources();refreshTavernMarket();
}

function ensureAudio(){if(!settings.soundEnabled||audioContext)return audioContext;const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return null;try{audioContext=new AudioCtx();}catch{}return audioContext;}
function playTone(frequency,duration=.08,volume=.025,type="sine",delay=0){const ctx=ensureAudio();if(!ctx||ctx.state!=="running")return;const oscillator=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+delay;oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);oscillator.connect(gain).connect(ctx.destination);oscillator.start(start);oscillator.stop(start+duration+.02);}
function playSound(name){if(!settings.soundEnabled||quietSimulation||document.visibilityState==="hidden")return;const now=performance.now(),cooldown=["hit","enemy"].includes(name)?110:35;if(now-(soundCooldowns.get(name)||0)<cooldown)return;soundCooldowns.set(name,now);const sounds={ui:[[360,.045,.012,"sine",0]],chat:[[520,.06,.018,"sine",0],[680,.07,.014,"sine",.055]],hit:[[150,.05,.016,"square",0]],enemy:[[105,.07,.018,"triangle",0]],crit:[[240,.07,.025,"square",0],[480,.09,.018,"triangle",.035]],level:[[440,.1,.025,"sine",0],[554,.11,.025,"sine",.09],[659,.16,.03,"sine",.18]],victory:[[330,.1,.025,"triangle",0],[494,.12,.025,"triangle",.1],[659,.2,.03,"triangle",.2]],coin:[[660,.07,.022,"sine",0],[880,.1,.018,"sine",.06]],rare:[[523,.1,.02,"sine",0],[784,.18,.028,"sine",.1]]};for(const tone of sounds[name]||sounds.ui)playTone(...tone);}
function toggleSound(){settings.soundEnabled=!settings.soundEnabled;localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));if(settings.soundEnabled){const ctx=ensureAudio();ctx?.resume?.();setTimeout(()=>playSound("level"),30);}renderSoundButton();toast(settings.soundEnabled?"🔊":"🔇",settings.soundEnabled?"Sounds on":"Sounds off",settings.soundEnabled?"Soft combat, chat, market, and milestone cues are enabled.":"The town is quiet.");}
function renderSoundButton(){const button=$("#soundButton");if(!button)return;button.innerHTML=`<span aria-hidden="true">${settings.soundEnabled?"🔊":"🔇"}</span>`;button.setAttribute("aria-label",settings.soundEnabled?"Turn sounds off":"Turn sounds on");button.setAttribute("aria-pressed",String(settings.soundEnabled));}

function addXP(target,amount,max=100){
  const oldLevel=target.level,isCombat=target.hp!==undefined,oldMaxHP=isCombat?heroMaxHP(target):0,requiredForLevel=isCombat?combatXPForLevel:xpForLevel;
  target.xp=(target.xp||0)+amount;
  while(target.level<max && target.xp>=requiredForLevel(target.level)){target.xp-=requiredForLevel(target.level);target.level++;}
  if(target.level>=max)target.xp=0;
  if(isCombat&&target.level>oldLevel)target.hp=Math.min((target.hp||0)+Math.max(0,heroMaxHP(target)-oldMaxHP),heroMaxHP(target));
  return target.level-oldLevel;
}

function warehouseCapacity(){ return 50 + state.buildings.warehouse*25; }
function warehouseResourceStacks(){
  const tiered=Object.entries(RESOURCE_TIERS).flatMap(([resource,tiers])=>tiers.map(tier=>{const quantity=Math.floor(state.resourceTiers?.[resource]?.[tier.id]||0),detail=resource==="food"?`Heals ${tier.heal} HP when eaten in combat`:`Unique ${resource} item · Used by ${tier.tier} crafting recipes`;return {kind:"tiered",resource,tier,quantity,name:tier.name,icon:tier.icon,category:`${tier.tier} ${resource[0].toUpperCase()+resource.slice(1)}`,detail};}).filter(stack=>stack.quantity>0));
  const utility=UTILITY_RESOURCE_STACKS.map(resource=>({...resource,kind:"utility",quantity:Math.floor(state.resources[resource.key]||0),category:resource.tier})).filter(stack=>stack.quantity>0);
  return [...tiered,...utility];
}
function occupiedSlots(){ return state.inventory.reduce((n,i)=>n+(i.qty||1),0)+warehouseResourceStacks().length; }
function combatCount(){ return state.heroes.filter(h=>h.assignment==="combat").length; }
function activeEquipment(h,slot){const item=h.equipment?.[slot];if(!item)return null;if(["weapon","armor"].includes(slot)&&(item.durability??100)<=0)return null;return itemData(item);}
function equipmentEffect(h,key){return ["weapon","armor","pet","trinket"].reduce((total,slot)=>total+(activeEquipment(h,slot)?.effects?.[key]||0),0);}
function itemTextDamage(h){return ["weapon","armor","pet","trinket"].map(slot=>activeEquipment(h,slot)).filter(Boolean).reduce((total,d)=>{if(["poisonDamage","lightningDamage","shadowDamage","fireDamage","frostDamage","natureDamage"].some(key=>d.effects?.[key]))return total;const match=`${d.element||""} ${d.effectText||""}`.match(/\+(\d+)\s+(poison|lightning|thunder|shadow|void|fire|frost|nature|tide)(?:\s+damage)?/i);return total+(match?Number(match[1]):0);},0);}
function equipmentDamageBonus(h){return ["poisonDamage","lightningDamage","shadowDamage","fireDamage","frostDamage","natureDamage"].reduce((total,key)=>total+equipmentEffect(h,key),0)+itemTextDamage(h);}
function heroAttack(h){const identity=CLASS_COMBAT[h.className]||{};return Math.max(1,Math.round((4+h.level*2+(activeEquipment(h,"weapon")?.attack||0)+equipmentEffect(h,"attack")+equipmentDamageBonus(h))*(identity.attack||1)));}
function heroDefense(h){const identity=CLASS_COMBAT[h.className]||{};return Math.max(1,Math.round((2+h.level+(activeEquipment(h,"armor")?.defense||0)+equipmentEffect(h,"defense"))*(identity.defense||1)));}
function heroMaxHP(h){const identity=CLASS_COMBAT[h.className]||{};return Math.max(1,Math.round((100+(h.level-1)*6+equipmentEffect(h,"maxHP"))*(identity.hp||1)));}
function heroMaxHit(h){const identity=CLASS_COMBAT[h.className]||{};return Math.max(1,Math.round((2+Math.floor(h.level/4)+(activeEquipment(h,"weapon")?.attack||0)+equipmentEffect(h,"attack"))*(identity.maxHit||1)));}
function heroAttackSpeed(h){return CLASS_COMBAT[h.className]?.speed||2.6;}
function heroCritChance(h){const text=heroSpecials(h).join(" "),match=text.match(/\+(\d+)%\s+Crit/i);return clamp((CLASS_COMBAT[h.className]?.crit||.05)+(match?Number(match[1])/100:0),0,.65);}
function heroCombatStyle(h){return CLASS_COMBAT[h.className]?.style||"melee";}
function combatStyleMultiplier(attacker,defender){if(!attacker||!defender||attacker===defender)return 1;if(COMBAT_TRIANGLE[attacker]===defender)return 1.25;if(COMBAT_TRIANGLE[defender]===attacker)return .75;return 1;}
function combatStyleBadge(style,compact=false){const meta=COMBAT_STYLE_META[style]||COMBAT_STYLE_META.melee;return `<span class="combat-style-badge ${style} ${compact?"compact":""}">${meta.icon} ${meta.name}</span>`;}
function heroDamageType(h){const text=heroSpecials(h).join(" ").toLowerCase();if(text.includes("poison")||equipmentEffect(h,"poisonDamage"))return "poison";if(text.includes("fire")||text.includes("burn"))return "fire";if(text.includes("frost")||text.includes("cold"))return "frost";if(text.includes("lightning")||text.includes("thunder"))return "lightning";if(text.includes("shadow")||text.includes("void")||text.includes("eclipse"))return "shadow";if(text.includes("nature")||text.includes("tide"))return "nature";return heroCombatStyle(h);}
function heroPower(h){
  const weapon=activeEquipment(h,"weapon")||{attack:0},armor=activeEquipment(h,"armor")||{defense:0};
  return heroAttack(h)*1.45+heroDefense(h)*1.05+heroMaxHit(h)*2.1+heroMaxHP(h)*.075+(1/heroAttackSpeed(h))*8+heroCritChance(h)*24+equipmentEffect(h,"combatStrength")+(weapon.attack||0)+(armor.defense||0)*.5;
}
function partyPower(party){return party.reduce((total,h)=>total+heroPower(h),0);}
function estimatedPartyDPS(party,cfg){if(!party.length)return 0;const preview=createEnemy(cfg,COMBAT_LAYOUTS[cfg.id].find(r=>r.type==="combat"));return party.reduce((total,h)=>{const hit=clamp(.25+(heroAttack(h)/(heroAttack(h)+preview.defense))*.7,.25,.98),average=(heroMaxHit(h)*.5*(1+heroCritChance(h)*.6)+equipmentDamageBonus(h))*combatStyleMultiplier(heroCombatStyle(h),preview.combatStyle);return total+hit*average/heroAttackSpeed(h);},0);}
function heroSpecials(h){return ["weapon","armor","pet","trinket"].map(slot=>activeEquipment(h,slot)).filter(Boolean).flatMap(d=>[d.element,d.effectText].filter(Boolean));}
function workActionTime(h,assignment,tier=null){const skillKey=BUILDINGS[assignment]?.skill,skill=h.skills[skillKey]?.level||1,building=state.buildings[assignment]||1,base=assignment==="smith"?15:TIER_ACTION_SECONDS[tier?.id||"starter"];return base/(1+(skill-1)*.01+(building-1)*.08);}
function workActionStatus(h){if(!["farm","mine","forest","smith"].includes(h.assignment))return "";if(h.assignment==="smith"&&(resourceTierCount("metal",REPAIR_KIT_RECIPE.metalTier)<REPAIR_KIT_RECIPE.metalCost||resourceTierCount("wood",REPAIR_KIT_RECIPE.woodTier)<REPAIR_KIT_RECIPE.woodCost)){const metal=resourceTierData("metal",REPAIR_KIT_RECIPE.metalTier),wood=resourceTierData("wood",REPAIR_KIT_RECIPE.woodTier);return `Waiting for ${REPAIR_KIT_RECIPE.metalCost} ${metal.name} + ${REPAIR_KIT_RECIPE.woodCost} ${wood.name}`;}const tier=RESOURCE_ASSIGNMENTS[h.assignment]?resourceTierForHero(h,h.assignment):null,seconds=Math.max(0,workActionTime(h,h.assignment,tier)-(h.workProgress||0));return `${tier?`${tier.icon} ${tier.name}`:"🧰 Repair Kit"} in ${Math.max(1,Math.ceil(seconds))}s`;}

function starterPartyChat(){
  const now=Date.now();return [
    {id:uid(),time:now-1800,heroId:"warrior",kind:"welcome",text:"All six of us are here. Give us work and we'll keep Briarwatch moving."},
    {id:uid(),time:now-900,heroId:"assassin",kind:"reply",text:"He means you give the orders and we develop strong opinions about them."},
    {id:uid(),time:now,heroId:"summoner",kind:"reply",text:"I started a party channel! The spirits have been told not to spam it."},
  ];
}
function chatPick(values){return values?.length?values[Math.floor(Math.random()*values.length)]:null;}
function chatHero(message){return heroById(message.heroId)||HEROES.find(hero=>hero.id===message.heroId);}
function chatClock(time){return new Date(time).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});}
function partyChatMessageHTML(message,compact=false){const hero=chatHero(message);if(!hero)return "";return `<article class="party-chat-message ${compact?"compact":""} ${message.kind||"ambient"}" style="--chat-color:${hero.color}"><span class="chat-portrait">${heroImage(hero)}</span><div class="chat-bubble"><div class="chat-message-head"><strong><i></i>${escapeHTML(hero.name)}</strong><small>${escapeHTML(hero.className)} · ${chatClock(message.time)}</small></div><p>${escapeHTML(message.text)}</p></div></article>`;}
function partyChatUnread(){const lastRead=Number(state.chatMeta?.lastReadAt)||0;return (state.partyChat||[]).filter(message=>message.time>lastRead).length;}
function syncMapSpeech(){
  const layer=$("#heroLayer");if(!layer)return;layer.querySelectorAll(".map-speech").forEach(node=>node.remove());
  if(!activeMapSpeech||activeMapSpeech.expires<=Date.now())return;const host=layer.querySelector(`[data-map-hero="${activeMapSpeech.heroId}"]`);if(!host)return;const bubble=document.createElement("span");bubble.className="map-speech";bubble.textContent=activeMapSpeech.text;host.append(bubble);
}
function setMapSpeech(hero,text){
  activeMapSpeech={heroId:hero.id,text,expires:Date.now()+6200};clearTimeout(mapSpeechTimer);syncMapSpeech();mapSpeechTimer=setTimeout(()=>{activeMapSpeech=null;syncMapSpeech();},6300);
}
function renderPartyChat(){
  const messages=state.partyChat||[],latest=messages.slice(-2),preview=$("#partyChatPreview"),status=$("#partyChatStatus"),badge=$("#partyChatBadge");
  if(preview)preview.innerHTML=latest.length?latest.map(message=>partyChatMessageHTML(message,true)).join(""):`<span class="empty-mini">The party channel is quiet.</span>`;
  if(status){const working=state.heroes.filter(hero=>hero.assignment!=="idle").length;status.textContent=`Live · ${working} active · 6 connected`;}
  const workingCount=$("#chatWorkingCount"),fightingCount=$("#chatFightingCount");if(workingCount)workingCount.textContent=state.heroes.filter(hero=>hero.assignment!=="idle").length;if(fightingCount)fightingCount.textContent=state.heroes.filter(hero=>hero.assignment==="combat").length;
  if(badge){const unread=partyChatUnread();badge.hidden=!unread;badge.textContent=Math.min(99,unread);}
  syncMapSpeech();renderOpenPartyChat();
}
function renderOpenPartyChat(){
  if($("#drawer")?.dataset.mode!=="party-chat")return;const feed=$("#partyChatFeed");if(!feed)return;feed.innerHTML=(state.partyChat||[]).map(message=>partyChatMessageHTML(message)).join("");feed.scrollTop=feed.scrollHeight;
}
function openPartyChat(){
  const working=state.heroes.filter(hero=>hero.assignment!=="idle").length,fighting=state.heroes.filter(hero=>hero.assignment==="combat").length;state.chatMeta.lastReadAt=Date.now()+1;markDirty();openDrawer("Party Chat","Live from Briarwatch",`<div class="party-chat-intro"><span>💬</span><div><strong>The party channel is alive</strong><p>Real assignments, danger, levels, unlocks, loot, recovery, and idle progress drive the conversation.</p></div></div><div class="chat-presence"><span><i></i> 6 connected</span><span><b id="chatWorkingCount">${working}</b> active</span><span><b id="chatFightingCount">${fighting}</b> fighting</span></div><div id="partyChatFeed" class="party-chat-feed" aria-live="polite"></div><div class="chat-typing"><span></span><span></span><span></span><small>The party is listening…</small></div><div class="drawer-footer"><button class="primary-button" data-action="close-drawer">Back to the game</button></div>`,"party-chat");renderPartyChat();requestAnimationFrame(()=>{const feed=$("#partyChatFeed");if(feed)feed.scrollTop=feed.scrollHeight;});
}
function postHeroChat(hero,text,kind="ambient",options={}){
  if(quietSimulation||!hero||!text)return null;state.partyChat=Array.isArray(state.partyChat)?state.partyChat:[];state.chatMeta={lastReadAt:0,ambientProgress:0,nextAmbientAt:55,lastSpeakerId:null,cooldowns:{},...(state.chatMeta||{})};state.chatMeta.cooldowns={...(state.chatMeta.cooldowns||{})};const now=Date.now(),cooldownKey=options.cooldownKey;
  if(cooldownKey){const last=Number(state.chatMeta.cooldowns[cooldownKey])||0;if(now-last<(options.cooldownSeconds||60)*1000)return null;state.chatMeta.cooldowns[cooldownKey]=now;}
  const previous=state.partyChat[state.partyChat.length-1];if(previous?.heroId===hero.id&&previous.text===text&&now-previous.time<30000)return null;
  const message={id:uid(),time:now,heroId:hero.id,kind,text};state.partyChat.push(message);state.partyChat=state.partyChat.slice(-PARTY_CHAT_LIMIT);state.chatMeta.lastSpeakerId=hero.id;
  if($("#drawer")?.dataset.mode==="party-chat")state.chatMeta.lastReadAt=now+1;if(options.mapBubble!==false)setMapSpeech(hero,text);playSound("chat");renderPartyChat();markDirty();
  if(options.replyType&&Math.random()<(options.replyChance??.35)){
    const supplied=(options.replyPool||state.heroes).map(candidate=>typeof candidate==="string"?heroById(candidate):candidate).filter(candidate=>candidate&&candidate.id!==hero.id&&candidate.assignment!=="inn"),preferred=options.replyType==="danger"?supplied.find(candidate=>candidate.id==="druid"):null,responder=preferred||chatPick(supplied),reply=HERO_CHAT_REPLIES[responder?.id]?.[options.replyType]?.(hero.name);if(reply)postHeroChat(responder,reply,"reply",{mapBubble:options.mapBubble});
  }
  return message;
}
function milestoneCrossed(before,after){return PARTY_CHAT_MILESTONES.find(milestone=>before<milestone&&after>=milestone)||null;}
function postWorkMilestone(hero,before,after,itemName){const milestone=milestoneCrossed(before,after);if(milestone)postHeroChat(hero,HERO_CHAT_VOICES[hero.id].milestone(fmt(milestone),itemName),"milestone",{replyType:"milestone",replyChance:.3});}
function postWorkLevelChat(hero,assignment,skillKey,oldLevel){
  const skill=hero.skills[skillKey],voice=HERO_CHAT_VOICES[hero.id];if(!skill||skill.level<=oldLevel)return;const resource=RESOURCE_ASSIGNMENTS[assignment],crossed=resource?RESOURCE_TIERS[resource].filter(tier=>tier.level>oldLevel&&tier.level<=skill.level):[],smithCrossed=assignment==="smith"?NORMAL_GEAR_TIER_SPECS.filter(tier=>tier.smithLevel>oldLevel&&tier.smithLevel<=skill.level):[],usable=(resource?crossed:smithCrossed).filter(tier=>tier.building<=(state.buildings[assignment]||1)).pop(),blocked=(resource?crossed:smithCrossed).slice(-1)[0];let text;
  if(usable)text=voice.unlock(assignment==="smith"?`${usable.name} equipment`:usable.name);else if(blocked)text=`${WORK_SKILL_NAMES[skillKey]} Level ${skill.level}. I can handle ${assignment==="smith"?`${blocked.name} equipment`:blocked.name}, but the ${BUILDINGS[assignment].name} needs Level ${blocked.building}.`;else text=voice.workLevel(WORK_SKILL_NAMES[skillKey],skill.level);
  playSound("level");
  postHeroChat(hero,text,usable?"unlock":"level",{replyType:"level",replyChance:.38});
}
function postCombatLevelChat(hero){postHeroChat(hero,HERO_CHAT_VOICES[hero.id].combatLevel(hero.level),"level",{replyType:"level",replyChance:.42});}
function postCombatDanger(run,hero){postHeroChat(hero,chatPick(HERO_CHAT_VOICES[hero.id].danger),"danger",{cooldownKey:`danger-${hero.id}`,cooldownSeconds:150,replyType:"danger",replyChance:.7,replyPool:run.heroIds});}
function postNoFoodChat(hero){postHeroChat(hero,"I'm below half health and the Warehouse is out of food. That is useful information for whoever is listening.","danger",{cooldownKey:`no-food-${hero.id}`,cooldownSeconds:300});}
function postCombatStartChat(party,cfg){const speaker=chatPick(party);if(speaker)postHeroChat(speaker,HERO_CHAT_VOICES[speaker.id].combatStart(cfg.short),"combat",{replyType:"start",replyChance:party.length>1 ? .55 : 0,replyPool:party});}
function postCombatClearChat(run,party,cfg,gold){const milestone=[1,10,25,50,100,250,500,1000].find(value=>run.cycles-1<value&&run.cycles>=value);if(!milestone)return;const speaker=chatPick(party);if(speaker)postHeroChat(speaker,HERO_CHAT_VOICES[speaker.id].clear(cfg.short,fmt(gold)),"victory",{cooldownKey:`clear-${run.id}`,cooldownSeconds:45});}
function postRareFindChat(hero,item){if(hero)postHeroChat(hero,HERO_CHAT_VOICES[hero.id].rare(item.name),"loot",{replyType:"rare",replyChance:.58});}
function postBrokenGearChat(hero,item){postHeroChat(hero,HERO_CHAT_VOICES[hero.id].broken(item.name),"danger",{cooldownKey:`broken-${hero.id}-${item.type}`,cooldownSeconds:300});}
function postAssignmentChat(hero,assignment){const text=HERO_CHAT_VOICES[hero.id]?.assignment?.[assignment];if(text)postHeroChat(hero,text,"assignment",{cooldownKey:`assignment-${hero.id}-${assignment}`,cooldownSeconds:20});}
function postTierChat(hero,assignment,tier){const highest=unlockedResourceTiers(hero,assignment).slice(-1)[0],voice=HERO_CHAT_VOICES[hero.id],text=highest&&highest.rank>tier.rank?voice.outdated(tier.name,highest.name):`I'll focus on ${tier.name}. The Warehouse has ${fmt(resourceTierCount(RESOURCE_ASSIGNMENTS[assignment],tier.id))} stored.`;postHeroChat(hero,text,"assignment",{cooldownKey:`tier-${hero.id}-${assignment}-${tier.id}`,cooldownSeconds:20});}
function contextualAmbientChat(hero){
  const assignment=hero.assignment,voice=HERO_CHAT_VOICES[hero.id];if(RESOURCE_ASSIGNMENTS[assignment]){const resource=RESOURCE_ASSIGNMENTS[assignment],tier=resourceTierForHero(hero,assignment),best=unlockedResourceTiers(hero,assignment).slice(-1)[0];if(best&&best.rank>tier.rank)return voice.outdated(tier.name,best.name);const skillKey=BUILDINGS[assignment].skill,skill=hero.skills[skillKey],next=RESOURCE_TIERS[resource].find(candidate=>candidate.rank>(best?.rank||0));if(next&&skill.level>=next.level&&state.buildings[assignment]<next.building)return `I can work ${next.name}, but the ${BUILDINGS[assignment].name} needs Level ${next.building}.`;const stored=resourceTierCount(resource,tier.id),nextNote=next?` ${Math.max(0,next.level-skill.level)} skill level${Math.max(0,next.level-skill.level)===1?"":"s"} until ${next.name}.`:" This is the best material we know.";return `${tier.name}: ${fmt(stored)} stored.${nextNote}`;}
  if(assignment==="smith"){const metal=resourceTierData("metal",REPAIR_KIT_RECIPE.metalTier),wood=resourceTierData("wood",REPAIR_KIT_RECIPE.woodTier),metalCount=resourceTierCount("metal",metal.id),woodCount=resourceTierCount("wood",wood.id),skill=hero.skills.smithing,next=NORMAL_GEAR_TIER_SPECS.find(tier=>skill.level<tier.smithLevel||state.buildings.smith<tier.building);if(metalCount<REPAIR_KIT_RECIPE.metalCost||woodCount<REPAIR_KIT_RECIPE.woodCost)return `The forge is waiting. We need ${REPAIR_KIT_RECIPE.metalCost} ${metal.name} and ${REPAIR_KIT_RECIPE.woodCost} ${wood.name} per Repair Kit.`;if(next&&skill.level>=next.smithLevel)return `I am ready for ${next.name} equipment, but the Blacksmith needs Level ${next.building}.`;return `${fmt(state.resources.repairKits)} Repair Kits stored.${next?` ${Math.max(0,next.smithLevel-skill.level)} Smithing level${Math.max(0,next.smithLevel-skill.level)===1?"":"s"} until ${next.name} equipment.`:" Every normal equipment tier is mastered."}`;}
  if(assignment==="combat"){const run=state.combatRuns.find(candidate=>candidate.heroIds.includes(hero.id)),cfg=COMBAT[run?.combatId],room=COMBAT_LAYOUTS[run?.combatId]?.[run?.roomIndex];if(cfg&&room)return run.enemy?`Still in ${cfg.short}. ${run.enemy.name} has ${fmt(run.enemy.hp)} of ${fmt(run.enemy.maxHP)} HP left.`:`Working through ${room.name} in ${cfg.short}.`;}
  if(assignment==="tavern")return `Sanity is back to ${Math.floor(hero.sanity)}. A little longer at the Tavern.`;
  if(assignment==="inn")return `The Inn says ${formatDuration(Math.max(0,(hero.recoveryUntil-Date.now())/1000))} until I am back on my feet.`;
  return voice.assignment.idle;
}
function maybeAmbientPartyChat(seconds){
  if(quietSimulation||!state.chatMeta)return;state.chatMeta.ambientProgress=(Number(state.chatMeta.ambientProgress)||0)+seconds;if(state.chatMeta.ambientProgress<(Number(state.chatMeta.nextAmbientAt)||55))return;state.chatMeta.ambientProgress=0;state.chatMeta.nextAmbientAt=40+Math.floor(Math.random()*31);let candidates=state.heroes.filter(hero=>hero.assignment!=="inn");if(candidates.length>1)candidates=candidates.filter(hero=>hero.id!==state.chatMeta.lastSpeakerId);const hero=chatPick(candidates.length?candidates:state.heroes),text=contextualAmbientChat(hero);if(text)postHeroChat(hero,text,"ambient",{cooldownKey:`ambient-${hero.id}-${hero.assignment}`,cooldownSeconds:38});
}
function postOfflineProgressChat(report){
  if(!report||report.seconds<60)return;const work=chatPick((report.workHeroes||[]).filter(hero=>hero.levels>0));if(work){const hero=heroById(work.id);if(hero)postHeroChat(hero,`While you were away, I gained ${work.levels} ${work.skill} level${work.levels===1?"":"s"} and reached Level ${work.levelAfter}.`,"offline",{mapBubble:false});return;}const combat=chatPick((report.combatHeroes||[]).filter(hero=>hero.levelAfter>hero.levelBefore));if(combat){const hero=heroById(combat.id);if(hero)postHeroChat(hero,`While you were away, I reached Combat Level ${combat.levelAfter}. The extra Attack, Defence, and HP are already noticeable.`,"offline",{mapBubble:false});}
}

function notify(title,text,icon="✦"){
  if(quietSimulation) return;
  state.notifications.unshift({id:uid(),time:Date.now(),title,text,icon}); state.notifications=state.notifications.slice(0,60);
  toast(icon,title,text); markDirty();
}

function toast(icon,title,text=""){
  const el=document.createElement("div"); el.className="toast"; el.innerHTML=`<span>${icon}</span><div><strong>${escapeHTML(title)}</strong>${text?`<small>${escapeHTML(text)}</small>`:""}</div>`;
  $("#toastRegion").append(el); setTimeout(()=>el.remove(),4200);
}

function saveLocal(){
  state.updatedAt=Date.now(); state.lastTick=Math.min(state.updatedAt,lastSimulationAt||state.updatedAt); localStorage.setItem(SAVE_KEY,JSON.stringify(state));
  if(currentUser && firebaseApi) queueCloudSave();
}
function markDirty(){ clearTimeout(saveTimer); saveTimer=setTimeout(saveLocal,650); }
function queueCloudSave(){
  if(cloudSaveTimer) return;
  const wait=Math.max(1000,30000-(Date.now()-lastCloudSave));
  cloudSaveTimer=setTimeout(()=>{cloudSaveTimer=null;scheduleCloudSave();},wait);
}
async function scheduleCloudSave(){
  try{setSync("saving");await firebaseApi.saveGame(currentUser.uid,state);await firebaseApi.writeLeaderboard(currentUser.uid,{displayName:currentUser.displayName||currentUser.email?.split("@")[0]||"Adventurer",totalLevel:state.heroes.reduce((n,h)=>n+h.level,0),combatXP:state.heroes.reduce((n,h)=>n+COMBAT_XP_TOTALS[h.level]+(h.xp||0),0),wealth:Math.floor(state.resources.gold),raidWins:state.stats.raids,updatedAt:Date.now()});setSync("online");}
  catch(err){console.warn(err);setSync("error");}
  finally{lastCloudSave=Date.now();}
}

function sendToTavern(h){
  if(h.assignment!=="tavern")h.records.beers++;
  h.assignment="tavern";
}
function awardInventoryItem(key,hero=null,title="Special find!"){
  const d=ITEMS[key];if(!d)return null;const item={id:uid(),key,acquiredAt:Date.now()};if(["weapon","armor"].includes(d.type))item.durability=100;
  state.inventory.push(item);state.stats.itemsFound++;if(hero){hero.records.itemsFound++;}
  const overflow=occupiedSlots()>warehouseCapacity();notify(overflow?"Find held in overflow":title,`${hero?`${hero.name} found `:""}${d.name}${overflow?". Make room in the Warehouse.":" was sent to the Warehouse."}`,overflow?"📦":d.icon);playSound("rare");postRareFindChat(hero,d);return item;
}
function rollSkillPet(assignment,h){const key=SKILL_PETS[assignment];if(key&&random()<SKILL_PET_CHANCE)awardInventoryItem(key,h,"Extremely rare skilling pet!");}

function simulate(seconds,offline=false){
  seconds=clamp(seconds,0,OFFLINE_LIMIT); if(seconds<.01)return null;
  const previousQuiet=quietSimulation,previousAudit=activeSimulationAudit;quietSimulation=offline;activeSimulationAudit=offline?{stops:[]}:null;
  const before={...state.resources,items:state.inventory.length,runs:state.stats.expeditions+state.stats.dungeons+state.stats.raids,kills:state.heroes.reduce((n,h)=>n+(h.records.kills||0),0),levels:state.heroes.reduce((n,h)=>n+h.level,0),goldEarned:state.stats.goldEarned};
  const runBefore=state.combatRuns.map(run=>({id:run.id,combatId:run.combatId,heroIds:[...run.heroIds],cycle:run.cycle,cycles:run.cycles,kills:run.kills,elapsed:run.elapsed})),combatHeroIds=new Set(runBefore.flatMap(run=>run.heroIds)),heroBefore=Object.fromEntries(state.heroes.map(h=>[h.id,{name:h.name,level:h.level,totalXP:heroCombatTotalXP(h),skills:Object.fromEntries(Object.entries(h.skills).map(([key,skill])=>[key,skill.level]))}]));
  const beforeTiers=Object.fromEntries(Object.entries(RESOURCE_TIERS).map(([resource,tiers])=>[resource,Object.fromEntries(tiers.map(tier=>[tier.id,state.resourceTiers[resource][tier.id]||0]))]));
  for(const h of state.heroes){
    if(h.assignment!=="idle")h.records.secondsActive+=seconds;
    if(h.assignment==="inn" && h.recoveryUntil && Date.now()>=h.recoveryUntil){h.hp=heroMaxHP(h);sendToTavern(h);h.recoveryUntil=0;notify("Back on their feet",`${h.name} left the Inn and is restoring Sanity at the Tavern.`,"🛏️");postHeroChat(h,"Back on my feet. I am heading to the Tavern to clear the rest of the fog.","recovery");}
    if(h.assignment==="tavern"){
      const rate=(1.2+state.buildings.tavern*.35)*seconds; const needed=100-h.sanity; const restored=Math.min(needed,rate);
      const cost=restored*.045; if(state.resources.gold>=cost){h.sanity+=restored;state.resources.gold-=cost;} if(h.sanity>=99.99){h.sanity=100;h.assignment="idle";postHeroChat(h,"Clear head, steady hands, ready for another assignment.","recovery",{cooldownKey:`tavern-ready-${h.id}`,cooldownSeconds:30});}
    }
    if(["farm","mine","forest","smith"].includes(h.assignment)) processWork(h,seconds);
  }
  for(const run of [...state.combatRuns]) processRun(run,seconds,offline);
  processStockMarket(seconds);
  maybeAmbientPartyChat(seconds);
  checkAchievements(); if(offline)state.stats.offlineSeconds+=seconds;
  const tierChanges=Object.entries(RESOURCE_TIERS).flatMap(([resource,tiers])=>tiers.map(tier=>({resource,name:tier.name,icon:tier.icon,quantity:(state.resourceTiers[resource][tier.id]||0)-beforeTiers[resource][tier.id]}))).filter(change=>Math.abs(change.quantity)>.01);
  const stops=activeSimulationAudit?.stops||[],combatHeroes=state.heroes.filter(h=>combatHeroIds.has(h.id)).map(h=>({id:h.id,name:h.name,xp:Math.max(0,heroCombatTotalXP(h)-heroBefore[h.id].totalXP),levelBefore:heroBefore[h.id].level,levelAfter:h.level,status:statusFor(h)})),combatRuns=runBefore.map(saved=>{const live=state.combatRuns.find(run=>run.id===saved.id),stop=stops.find(entry=>entry.id===saved.id),final=live||stop||saved,cfg=COMBAT[saved.combatId];return {id:saved.id,name:cfg?.short||saved.combatId,heroes:saved.heroIds.map(id=>heroBefore[id]?.name).filter(Boolean),clears:Math.max(0,(Number(final.cycles)||0)-saved.cycles),kills:Math.max(0,(Number(final.kills)||0)-saved.kills),status:live?"Still running":stop?.reason||"Stopped"};}),workHeroes=state.heroes.flatMap(hero=>Object.entries(hero.skills).map(([skillKey,skill])=>({id:hero.id,name:hero.name,skill:WORK_SKILL_NAMES[skillKey],levelBefore:heroBefore[hero.id].skills[skillKey],levelAfter:skill.level,levels:skill.level-heroBefore[hero.id].skills[skillKey]}))).filter(hero=>hero.levels>0);
  const after=state.resources;quietSimulation=previousQuiet;activeSimulationAudit=previousAudit;return {seconds,gold:after.gold-before.gold,goldEarned:state.stats.goldEarned-before.goldEarned,tierChanges,essence:after.essence-before.essence,keys:after.keys-before.keys,kits:after.repairKits-before.repairKits,items:state.inventory.length-before.items,runs:state.stats.expeditions+state.stats.dungeons+state.stats.raids-before.runs,kills:state.heroes.reduce((n,h)=>n+(h.records.kills||0),0)-before.kills,combatLevels:state.heroes.reduce((n,h)=>n+h.level,0)-before.levels,combatHeroes,combatRuns,workHeroes};
}

function settleToNow(showReport=true){
  if(!state)return null;const now=Date.now(),seconds=Math.min(OFFLINE_LIMIT,Math.max(0,(now-lastSimulationAt)/1000));lastSimulationAt=now;if(seconds<.01)return null;
  const catchUp=seconds>5,report=simulate(seconds,catchUp);state.lastTick=now;
  if(catchUp){postOfflineProgressChat(report);saveLocal();renderAll();if(showReport)showOffline(report);}
  return report;
}

function processWork(h,seconds){
  const map={farm:["food","farming"],mine:["metal","mining"],forest:["wood","woodcutting"]};
  if(map[h.assignment]){
    const [resource,skill]=map[h.assignment];h.workProgress=(h.workProgress||0)+seconds;let loops=0;
    while(loops++<50000){
      const tier=resourceTierForHero(h,h.assignment),actionTime=workActionTime(h,h.assignment,tier);if(h.workProgress+1e-8<actionTime)break;h.workProgress-=actionTime;
      const doubleKey=resource==="food"?"foodDoubleChance":resource==="metal"?"metalDoubleChance":"woodDoubleChance",units=random()<equipmentEffect(h,doubleKey)?2:1;
      const oldLevel=h.skills[skill].level,recordKey=resource==="food"?"foodGathered":resource==="metal"?"metalMined":"woodGathered",milestoneName=resource==="food"?"meals gathered":resource==="metal"?"ores mined":"logs gathered",before=h.records[recordKey];addTieredResource(resource,tier.id,units);addXP(h.skills[skill],5*Math.sqrt(tier.rank));h.records.workActions++;h.records[recordKey]+=units;postWorkLevelChat(h,h.assignment,skill,oldLevel);postWorkMilestone(h,before,h.records[recordKey],milestoneName);rollSkillPet(h.assignment,h);
    }
  }else if(h.assignment==="smith"){
    const skill=h.skills.smithing;h.workProgress=(h.workProgress||0)+seconds;let loops=0;
    while(loops++<50000){const actionTime=workActionTime(h,"smith");if(h.workProgress+1e-8<actionTime)break;if(resourceTierCount("metal",REPAIR_KIT_RECIPE.metalTier)<REPAIR_KIT_RECIPE.metalCost||resourceTierCount("wood",REPAIR_KIT_RECIPE.woodTier)<REPAIR_KIT_RECIPE.woodCost){h.workProgress=Math.min(h.workProgress,actionTime);break;}h.workProgress-=actionTime;spendSpecificResource("metal",REPAIR_KIT_RECIPE.metalTier,REPAIR_KIT_RECIPE.metalCost);spendSpecificResource("wood",REPAIR_KIT_RECIPE.woodTier,REPAIR_KIT_RECIPE.woodCost);const kits=random()<equipmentEffect(h,"smithDoubleChance")?2:1,oldLevel=skill.level,before=h.records.kitsForged;state.resources.repairKits+=kits;addXP(skill,28);h.records.kitsForged+=kits;h.records.workActions++;postWorkLevelChat(h,"smith","smithing",oldLevel);postWorkMilestone(h,before,h.records.kitsForged,"Repair Kits");rollSkillPet("smith",h);}
  }
}

function createEnemy(cfg,room){
  const level=cfg.minLevel,baseHP=cfg.category==="raid"?160+level*11:cfg.category==="dungeon"?50+level*5.5:18+level*3.5,baseAttack=5+level*1.7,baseDefense=4+level*1.2,baseMax=cfg.category==="raid"?6+level*.5:cfg.category==="dungeon"?4+level*.38:2+level*.28;
  const maxHP=Math.max(8,Math.round(baseHP*room.hp));return {name:room.name,icon:room.icon,image:room.image,boss:!!room.boss,combatStyle:room.combatStyle||"melee",hp:maxHP,maxHP,attack:Math.round(baseAttack*room.attack),defense:Math.round(baseDefense*room.defense),maxHit:Math.max(2,Math.round(baseMax*(room.boss?1.18:1))),speed:room.speed,attacks:0,status:{},room};
}
function combatRoomsFor(cfg){return (COMBAT_LAYOUTS[cfg.id]||[]).filter(room=>room.type==="combat");}
function pushCombatEvent(run,text,type="info",target="enemy",amount=null,attackerId=null,offline=false){if(offline||quietSimulation)return;run.recentEvents=(run.recentEvents||[]).concat({id:uid(),at:Date.now(),text,type,target,amount,attackerId}).slice(-30);}
function enterCurrentRoom(run,cfg,offline=false){
  const room=COMBAT_LAYOUTS[cfg.id]?.[run.roomIndex];if(!room){completeCombatCycle(run,cfg,offline);return;}
  if(room.type==="combat"){
    run.enemy=createEnemy(cfg,room);run.roomState={type:"combat"};run.enemyTimer=run.enemy.speed*.7;run.heroTimers={};
    for(const id of run.heroIds){const h=heroById(id);if(h)run.heroTimers[id]=heroAttackSpeed(h)*(.25+random()*.45);}
    pushCombatEvent(run,`${run.enemy.name} enters the fight.`,room.boss?"boss":"info","enemy",null,null,offline);
  }else{
    const party=run.heroIds.map(heroById).filter(Boolean),ranked=party.map(h=>({h,level:h.skills[room.skill]?.level||1})).sort((a,b)=>b.level-a.level),effective=ranked.reduce((total,x,i)=>total+x.level*(i?0.25:1),0),total=Math.max(8,room.baseSeconds/(1+effective/25));
    run.enemy=null;run.roomState={type:"skill",total,remaining:total,effective,leaderId:ranked[0]?.h.id||null};pushCombatEvent(run,`${room.name}: ${room.description}`,"skill","room",null,ranked[0]?.h.id,offline);
  }
}
function advanceCombatRoom(run,cfg,offline=false){run.roomIndex++;run.roomState=null;run.enemy=null;if(run.roomIndex>=COMBAT_LAYOUTS[cfg.id].length)completeCombatCycle(run,cfg,offline);else enterCurrentRoom(run,cfg,offline);}
function combatRunHeroStats(run,heroId){if(!run.heroStats)run.heroStats={};if(!run.heroStats[heroId])run.heroStats[heroId]={damage:0,taken:0,healing:0,attacks:0,hits:0,crits:0};return run.heroStats[heroId];}
function applyEnemyDamage(run,amount,type,sourceId,offline=false){if(!run.enemy)return false;const source=heroById(sourceId),multiplier=source?combatStyleMultiplier(heroCombatStyle(source),run.enemy.combatStyle):1,before=run.enemy.hp;amount=amount>0?Math.max(1,Math.round(amount*multiplier)):0;run.enemy.hp=Math.max(0,run.enemy.hp-amount);const actual=before-run.enemy.hp;run.damageDealt+=actual;if(source){combatRunHeroStats(run,sourceId).damage+=actual;source.records.damageDealt=(source.records.damageDealt||0)+actual;}const edge=multiplier>1?" · advantage":multiplier<1?" · resisted":"";pushCombatEvent(run,actual?`${source?.name||"The party"} deals ${actual} ${type} damage${edge}.`:`${source?.name||"The party"} misses.`,type,"enemy",actual,sourceId,offline);if(run.enemy.hp<=0){defeatEnemy(run,sourceId,offline);return true;}return false;}
function defeatEnemy(run,killerId,offline=false){
  const cfg=COMBAT[run.combatId],enemy=run.enemy,killer=heroById(killerId),party=run.heroIds.map(heroById).filter(Boolean),xp=cfg.xp/Math.max(1,combatRoomsFor(cfg).length),leveled=[];if(killer)killer.records.kills++;for(const h of party)if(addXP(h,xp)>0)leveled.push(h);if(leveled.length){notify("Combat level gained",`${leveled.map(h=>h.name).join(", ")} reached ${leveled.length===1?`Combat Level ${leveled[0].level}`:"new Combat Levels"}. Their class combat stats increased.`,"⭐");playSound("level");postCombatLevelChat(chatPick(leveled));}run.kills++;pushCombatEvent(run,`${enemy.name} defeated! ${fmt(xp)} XP to each survivor.`,enemy.boss?"boss":"kill","enemy",null,killerId,offline);advanceCombatRoom(run,cfg,offline);
}
function processEnemyStatuses(run,dt,offline=false){
  const enemy=run.enemy;if(!enemy)return false;for(const [type,status] of Object.entries(enemy.status||{})){status.remaining-=dt;status.timer-=dt;while(status.timer<=0&&status.remaining>0&&run.enemy){status.timer+=type==="fire"?1.5:2;if(applyEnemyDamage(run,status.damage,type,status.sourceId,offline))return true;}if(status.remaining<=0)delete enemy.status[type];}return false;
}
function healLowestHero(run,amount,source,offline=false){const party=run.heroIds.map(heroById).filter(h=>h&&(h.hp||0)>0),target=party.sort((a,b)=>(a.hp/heroMaxHP(a))-(b.hp/heroMaxHP(b)))[0];if(!target||target.hp>=heroMaxHP(target))return;const healed=Math.min(amount,heroMaxHP(target)-target.hp);target.hp+=healed;combatRunHeroStats(run,source.id).healing+=healed;source.records.healingDone=(source.records.healingDone||0)+healed;pushCombatEvent(run,`${source.name} restores ${healed} HP to ${target.name}.`,"heal",target.id,healed,source.id,offline);}
function performHeroAttack(run,h,offline=false){
  const enemy=run.enemy;if(!enemy||(h.hp||0)<=0)return;const stats=combatRunHeroStats(run,h.id);stats.attacks++;h.records.combatActions=(h.records.combatActions||0)+1;const maxHit=heroMaxHit(h),hitChance=clamp(.25+(heroAttack(h)/(heroAttack(h)+enemy.defense))*.7,.25,.98);let damage=random()<hitChance?Math.floor(random()*(maxHit+1)):0,crit=damage>0&&random()<heroCritChance(h),special="";if(damage)stats.hits++;if(crit)stats.crits++;
  if(crit)damage=Math.ceil(damage*1.6);if(h.className==="Warrior"&&damage&&random()<.12){damage+=Math.ceil(maxHit*.3);special=" crushing";}if(h.className==="Wizard"&&damage&&random()<.18){damage+=Math.ceil(maxHit*.4);special=" arcane";}
  if(!offline&&damage)playSound(crit?"crit":"hit");
  if(applyEnemyDamage(run,damage,crit?"crit":CLASS_COMBAT[h.className]?.style||"physical",h.id,offline))return;
  if(damage&&h.className==="Summoner"&&random()<.22){const echo=Math.max(1,Math.ceil(damage*.5));if(applyEnemyDamage(run,echo,"summon",h.id,offline))return;special=" echoed";}
  const bonus=equipmentDamageBonus(h),type=heroDamageType(h);if(damage>0&&bonus>0&&run.enemy){if(type==="poison"||type==="fire"){run.enemy.status[type]={damage:Math.max(1,Math.ceil(bonus/2)),remaining:6,timer:1.5,sourceId:h.id};pushCombatEvent(run,`${h.name}'s weapon inflicts ${type}.`,type,"enemy",bonus,h.id,offline);}else if(applyEnemyDamage(run,bonus,type,h.id,offline))return;if(type==="frost"&&run.enemy)run.enemyTimer+=.45;}
  if(h.className==="Druid"&&random()<.16)healLowestHero(run,Math.max(2,Math.ceil(maxHit*.35)),h,offline);if(special)pushCombatEvent(run,`${h.name}'s${special} strike surges.`,"special","enemy",null,h.id,offline);
}
function defeatHero(run,h,offline=false){h.hp=0;h.assignment="inn";h.recoveryUntil=Date.now()+(1200/(1+state.buildings.inn*.2))*1000;h.records.defeats++;state.stats.defeats++;run.heroIds=run.heroIds.filter(id=>id!==h.id);delete run.heroTimers[h.id];pushCombatEvent(run,`${h.name} falls and is carried to the Inn.`,"defeat",h.id,0,null,offline);notify("Cart to the Inn",`${h.name} was defeated during ${COMBAT[run.combatId].short}.`,"🛒");const companion=chatPick(run.heroIds.map(heroById).filter(Boolean));if(companion)postHeroChat(companion,`${h.name} is down. The Inn has them—we keep moving.`,"danger");else postHeroChat(h,"I woke up in the Inn. That answers how the fight went.","recovery");if(!run.heroIds.length)stopRun(run.id,false,false,"Party defeated");}
function performEnemyAttack(run,offline=false){
  const enemy=run.enemy,party=run.heroIds.map(heroById).filter(h=>h&&(h.hp||0)>0);if(!enemy||!party.length)return;enemy.attacks++;const targets=enemy.boss&&enemy.attacks%4===0?party:[party[Math.floor(random()*party.length)]];
  for(const h of targets){const hitChance=clamp(.22+(enemy.attack/(enemy.attack+heroDefense(h)*1.8))*.68,.18,.95),base=random()<hitChance?Math.floor(random()*(enemy.maxHit+1)):0,raw=targets.length>1?Math.ceil(base*.6):base,multiplier=combatStyleMultiplier(enemy.combatStyle,heroCombatStyle(h)),damage=raw>0?Math.max(1,Math.round(raw*multiplier)):0,maxHP=heroMaxHP(h),before=h.hp??maxHP;h.hp=Math.max(0,before-damage);const actual=before-h.hp;run.damageTaken+=actual;combatRunHeroStats(run,h.id).taken+=actual;h.records.damageTaken=(h.records.damageTaken||0)+actual;const edge=multiplier>1?" · advantage":multiplier<1?" · resisted":"";pushCombatEvent(run,actual?`${enemy.name} hits ${h.name} for ${actual}${edge}.`:`${enemy.name} misses ${h.name}.`,actual?"enemy":"miss",h.id,actual,"enemy",offline);if(!offline&&actual)playSound("enemy");if(h.hp>0&&before/maxHP>.42&&h.hp/maxHP<=.42)postCombatDanger(run,h);if(h.hp<=0)defeatHero(run,h,offline);}
}
function consumeCombatFood(run,h,offline=false){
  if((h.hp||0)>heroMaxHP(h)*.45)return false;if(state.resources.food<=0){postNoFoodChat(h);return false;}const deficit=heroMaxHP(h)-h.hp,bonus=equipmentEffect(h,"foodEfficiency")*4,available=RESOURCE_TIERS.food.filter(t=>(state.resourceTiers.food[t.id]||0)>0).map(t=>({...t,actualHeal:t.heal+bonus}));if(!available.length){postNoFoodChat(h);return false;}const tier=available.find(t=>t.actualHeal>=deficit)||available[available.length-1];state.resourceTiers.food[tier.id]--;recalculateTieredTotal("food");const healed=Math.min(deficit,tier.actualHeal);h.hp+=healed;run.foodEaten++;pushCombatEvent(run,`${h.name} eats ${tier.name} and heals ${healed} HP.`,"heal",h.id,healed,h.id,offline);return true;
}
function processSkillRoom(run,cfg,dt,offline=false){
  const room=COMBAT_LAYOUTS[cfg.id][run.roomIndex],s=run.roomState;s.remaining-=dt;if(s.remaining>0)return;const party=run.heroIds.map(heroById).filter(Boolean),leader=heroById(s.leaderId),assignment={farming:"farm",mining:"mine",woodcutting:"forest",smithing:"smith"}[room.skill],leveled=[];for(const h of party){const oldLevel=h.skills[room.skill].level;addXP(h.skills[room.skill],h.id===s.leaderId?room.baseSeconds*.45:room.baseSeconds*.16);h.records.workActions++;if(h.skills[room.skill].level>oldLevel)leveled.push({hero:h,oldLevel});}const chatter=chatPick(leveled);if(chatter)postWorkLevelChat(chatter.hero,assignment,room.skill,chatter.oldLevel);if(leader)rollSkillPet(assignment,leader);pushCombatEvent(run,`${room.name} cleared by ${leader?.name||"the party"} at effective ${Math.floor(s.effective)} ${room.skill}.`,"skill","room",null,s.leaderId,offline);advanceCombatRoom(run,cfg,offline);
}
function processCombatRoom(run,cfg,dt,offline=false){
  for(const id of [...run.heroIds]){const h=heroById(id);if(h)consumeCombatFood(run,h,offline);}if(processEnemyStatuses(run,dt,offline)||!run.enemy)return;
  for(const id of [...run.heroIds]){const h=heroById(id);if(!h||!run.enemy)continue;run.heroTimers[id]=(run.heroTimers[id]??heroAttackSpeed(h))-dt;let attacks=0;while(run.heroTimers[id]<=0&&run.enemy&&attacks++<3){run.heroTimers[id]+=heroAttackSpeed(h);performHeroAttack(run,h,offline);}}
  if(!run.enemy)return;run.enemyTimer-=dt;if(run.enemyTimer<=0){run.enemyTimer+=run.enemy.speed+(run.enemy.status.frost?.remaining?0.5:0);performEnemyAttack(run,offline);}
}
function processRun(run,seconds,offline=false){
  const cfg=COMBAT[run.combatId];if(!cfg){stopRun(run.id,false,false,"Activity unavailable");return;}let remaining=seconds,steps=0;while(remaining>0&&state.combatRuns.includes(run)&&steps++<250000){const dt=Math.min(.25,remaining);remaining-=dt;run.elapsed+=dt;run.cycleElapsed+=dt;if(!run.roomState)enterCurrentRoom(run,cfg,offline);if(!state.combatRuns.includes(run)||!run.roomState)continue;if(run.roomState.type==="skill")processSkillRoom(run,cfg,dt,offline);else processCombatRoom(run,cfg,dt,offline);}
}

function completeCombatCycle(run,cfg,offline=false){
  const party=run.heroIds.map(heroById).filter(Boolean);if(!party.length){stopRun(run.id,false,false,"Party defeated");return;}const gold=Math.floor(cfg.gold[0]+random()*(cfg.gold[1]-cfg.gold[0]+1));state.resources.gold+=gold;state.stats.goldEarned+=gold;run.cycles++;run.lastReward=`${fmt(gold)} Gold`;
  for(const h of party){h.sanity=clamp(h.sanity-(cfg.category==="raid"?28:cfg.category==="dungeon"?17:8),0,100);damageGear(h,cfg.category==="raid"?12:cfg.category==="dungeon"?7:3);h.records.goldEarned+=Math.floor(gold/party.length);if(cfg.category==="expedition")h.records.expeditions++;if(cfg.category==="dungeon"){h.records.dungeons++;h.records.dungeonBosses++;}if(cfg.category==="raid"){h.records.raids++;h.records.raidBosses++;}}
  if(cfg.category==="expedition"){state.stats.expeditions++;if(random()<(cfg.essenceChance||0))state.resources.essence+=1;}
  if(cfg.category==="dungeon"){state.stats.dungeons++;state.resources.essence+=Math.floor(cfg.essenceReward[0]+random()*(cfg.essenceReward[1]-cfg.essenceReward[0]+1));if(random()<(cfg.keyChance||0))state.resources.keys+=1;if(cfg.trinketPool?.length&&random()<(cfg.trinketChance||0))dropTrinket(cfg,party);}
  if(cfg.category==="raid"){state.stats.raids++;state.resources.essence+=Math.floor(cfg.essenceReward[0]+random()*(cfg.essenceReward[1]-cfg.essenceReward[0]+1));if(cfg.eggKey&&random()<(cfg.eggChance||0))dropEgg(cfg,party);}
  if(cfg.pool?.length&&random()<(cfg.itemChance||0))dropSpecial(cfg,party);pushCombatEvent(run,`${cfg.short} cleared in ${formatDuration(run.cycleElapsed)}. Chest: ${fmt(gold)} Gold.`,"loot","room",gold,null,offline);notify(`${cfg.short} completed`,`${party.map(h=>h.name).join(", ")} opened the chest for ${fmt(gold)} Gold.`,cfg.icon);if(!offline)playSound("victory");postCombatClearChat(run,party,cfg,gold);
  for(const h of party.filter(x=>x.sanity<=0))sendToTavern(h);run.heroIds=run.heroIds.filter(id=>heroById(id)?.sanity>0);if(!run.heroIds.length){stopRun(run.id,false,false,"Sanity depleted");return;}
  if(!run.autoRepeat){stopRun(run.id,false,false,"Single clear complete");return;}if(!canPayRunEntry(cfg)){stopRun(run.id,false,false,"Entry supplies exhausted");notify("Run paused",`${cfg.short} stopped because the next entry needs more ${cfg.keys?"Raid Keys or Essence":"Essence"}.`,"🎒");return;}payRunEntry(cfg);run.cycle++;run.roomIndex=0;run.roomState=null;run.enemy=null;run.cycleElapsed=0;
}

function dropSpecial(cfg,party=[]){const key=cfg.pool[Math.floor(random()*cfg.pool.length)],finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(key,finder,cfg.category==="raid"?"Raid rare table hit!":"Rare equipment!");}
function dropTrinket(cfg,party=[]){const key=cfg.trinketPool[Math.floor(random()*cfg.trinketPool.length)],finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(key,finder,"Dungeon trinket found!");}
function dropEgg(cfg,party=[]){const finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(cfg.eggKey,finder,"Boss egg! One-in-500 drop!");}

function damageGear(h,amount){for(const slot of ["weapon","armor"]){const item=h.equipment[slot];if(item){const before=item.durability??100;item.durability=clamp(before-amount,0,100);if(before>0&&item.durability<=0)postBrokenGearChat(h,itemData(item));}}}
function canPayRunEntry(cfg){return state.resources.essence>=(cfg.essence||0)&&state.resources.keys>=(cfg.keys||0);}
function payRunEntry(cfg){state.resources.essence-=cfg.essence||0;state.resources.keys-=cfg.keys||0;}

function startRun(combatId,heroIds,autoRepeat=true){
  const cfg=COMBAT[combatId];if(!cfg)return;heroIds=heroIds.filter(id=>{const h=heroById(id);return h&&h.assignment!=="combat"&&h.assignment!=="inn"&&h.sanity>0&&(h.hp||0)>0;});
  if(!heroIds.length)return toast("⚠️","Choose at least one available hero");
  const max=cfg.maxParty;if(heroIds.length>max)return toast("⚠️",`${cfg.short} allows up to ${max} heroes`);
  if(combatCount()+heroIds.length>4)return toast("⚠️","Only four heroes may fight at once");
  if(heroIds.some(id=>heroById(id).level<cfg.minLevel))return toast("🔒",`${cfg.name} requires Combat Level ${cfg.minLevel}`);
  if(!canPayRunEntry(cfg))return toast("🎒","Not enough entry supplies",`Need ${cfg.essence||0} Essence${cfg.keys?` and ${cfg.keys} Raid Key${cfg.keys===1?"":"s"}`:""}.`);
  const party=heroIds.map(heroById).filter(Boolean);payRunEntry(cfg);for(const id of heroIds)heroById(id).assignment="combat";const run=createCombatRunState(combatId,heroIds,autoRepeat);state.combatRuns.push(run);watchedRunId=run.id;enterCurrentRoom(run,cfg,false);notify(`${cfg.short} started`,`${party.map(h=>h.name).join(", ")} entered live combat. Higher max hits and faster attacks now shorten every clear.`,cfg.icon);postCombatStartChat(party,cfg);saveLocal();renderAll();closeDrawer();
}

function stopRun(id,announce=true,rerender=true,reason="Recalled"){const run=state.combatRuns.find(r=>r.id===id);if(!run)return;if(activeSimulationAudit)activeSimulationAudit.stops.push({id:run.id,reason,cycle:run.cycle,cycles:run.cycles,kills:run.kills,elapsed:run.elapsed});for(const hid of run.heroIds){const h=heroById(hid);if(h?.assignment==="combat")h.assignment="idle";}state.combatRuns=state.combatRuns.filter(r=>r.id!==id);if(watchedRunId===id)watchedRunId=state.combatRuns[0]?.id||null;if(announce)notify("Party recalled","The adventurers are returning to town.","🏰");markDirty();if(rerender)renderAll();}

function assignHero(heroId,assignment){
  const h=heroById(heroId);if(!h||h.assignment==="inn")return toast("🛏️","Hero is still recovering");
  if(h.assignment==="combat"){const run=state.combatRuns.find(r=>r.heroIds.includes(heroId));if(run)stopRun(run.id,false);}
  h.workProgress=0;if(RESOURCE_ASSIGNMENTS[assignment]&&!h.workTiers?.[assignment]){h.workTiers={...(h.workTiers||{}),[assignment]:"starter"};}if(assignment==="tavern")sendToTavern(h);else h.assignment=assignment;if(assignment==="tavern" && h.sanity>=100)h.assignment="idle";checkAchievements();notify("Assignment changed",`${h.name} is now ${ASSIGNMENTS[h.assignment].name.toLowerCase()}.`,ASSIGNMENTS[h.assignment].icon);postAssignmentChat(h,h.assignment);markDirty();renderAll();
}

function setWorkTier(heroId,assignment,tierId){
  const h=heroById(heroId);if(!h)return;const tier=unlockedResourceTiers(h,assignment).find(candidate=>candidate.id===tierId);if(!tier)return toast("🔒","That task is not unlocked");
  h.workTiers={...(h.workTiers||{}),[assignment]:tier.id};if(h.assignment===assignment)h.workProgress=0;notify("Work task changed",`${h.name} will produce ${tier.name} until you choose another task.`,tier.icon);postTierChat(h,assignment,tier);markDirty();renderAssignments();renderTown();refreshWorkTimers();
}

function checkAchievements(){for(const a of ACHIEVEMENTS){if(!state.achievements.includes(a.id)&&a.test(state)){state.achievements.push(a.id);notify("Milestone unlocked",a.name,a.icon);}}}

function renderAll(){renderResources();renderTown();renderHeroes();renderAssignments();renderCombat();renderWarehouse();renderMarket();renderProgress();renderSyncUser();renderPartyChat();}
function refreshWorkTimers(){$$("[data-work-timer]").forEach(el=>{const h=heroById(el.dataset.workTimer);if(h)el.textContent=workActionStatus(h);});}
function renderResources(){
  const data=[['gold','🪙','Gold']];
  $("#resourceBar").innerHTML=data.map(([k,i,n])=>`<div class="resource-chip" data-resource="${k}"><span class="resource-icon">${i}</span><span><small>${n}</small><strong>${fmt(state.resources[k])}</strong></span></div>`).join("");
}

function statusFor(h){if(h.assignment==="combat"){const r=state.combatRuns.find(x=>x.heroIds.includes(h.id));return r&&COMBAT[r.combatId]?COMBAT[r.combatId].short:"Fighting";}return ASSIGNMENTS[h.assignment]?.name||"Available";}
function mapPosition(h,index){
  if(h.assignment==="combat"){const run=state.combatRuns.find(r=>r.heroIds.includes(h.id)),category=COMBAT[run?.combatId]?.category;return category==="raid"?[18+index*2,19]:category==="dungeon"?[48+index*2,17]:[78+index*2,18];}
  const b=BUILDINGS[h.assignment];if(b)return [b.position[0]+((index%3)-1)*3,b.position[1]+9+(index%2)*3];
  return [45+(index%3)*5,50+Math.floor(index/3)*7];
}

function renderTown(){
  $("#townName").textContent=state.townName;for(const [k,v] of Object.entries(state.buildings))$$(`[data-level-for="${k}"]`).forEach(el=>el.textContent=v);
  $("#warehouseMapCount").textContent=`${occupiedSlots()} / ${warehouseCapacity()}`;
  const heroLayer=$("#heroLayer"),heroMap=state.heroes.map((h,i)=>{const [x,y]=mapPosition(h,i),recover=["inn","tavern"].includes(h.assignment),status=statusFor(h);return {signature:[h.id,h.name,h.assignment,status,x,y,h.color,h.portrait].join(":"),html:`<div class="map-hero ${h.assignment==="combat"?"fighting":""} ${recover?"recovering":""}" data-map-hero="${h.id}" style="--x:${x};--y:${y};--hero-color:${h.color};--delay:-${i*.22}s"><button data-action="open-hero" data-hero="${h.id}" aria-label="${escapeHTML(h.name)}, ${escapeHTML(status)}">${heroImage(h)}</button><small>${escapeHTML(h.name)} · ${escapeHTML(status)}</small></div>`};}),mapSignature=heroMap.map(entry=>entry.signature).join("|");
  if(heroLayer.dataset.signature!==mapSignature){heroLayer.dataset.signature=mapSignature;heroLayer.innerHTML=heroMap.map(entry=>entry.html).join("");}
  syncMapSpeech();
  const fighting=state.heroes.filter(h=>h.assignment==="combat");$("#activePartyCount").textContent=`${fighting.length} / 4 fighting`;$("#activePartyMini").innerHTML=fighting.length?fighting.map(h=>`<span title="${escapeHTML(h.name)}">${heroImage(h)}</span>`).join(""):`<span class="empty-mini">No active combat party</span>`;
  const work=state.heroes.filter(h=>["farm","mine","forest","smith"].includes(h.assignment));$("#townOutputText").textContent=work.length?`${work.length} heroes producing`:"No one working";
  const counts=["farm","mine","forest","smith"].map(a=>[a,state.heroes.filter(h=>h.assignment===a).length]);$("#townOutputMini").innerHTML=counts.filter(x=>x[1]).map(([a,n])=>`<div class="mini-bar"><span>${ASSIGNMENTS[a].icon} ${ASSIGNMENTS[a].name}</span><i style="--w:${n/6*100}%"></i><b>${n}</b></div>`).join("")||`<span class="empty-mini">Assign heroes to begin production.</span>`;
  const story=state.notifications[0];$("#latestStoryTitle").textContent=story?.title||"Quiet town";$("#latestStoryText").textContent=story?.text||"No town reports yet.";$("#notificationBadge").hidden=!state.notifications.length;$("#notificationBadge").textContent=Math.min(99,state.notifications.length);
}

function renderHeroes(){
  $("#heroRoster").innerHTML=state.heroes.map(h=>{const w=h.equipment.weapon?itemData(h.equipment.weapon):null,a=h.equipment.armor?itemData(h.equipment.armor):null,p=h.equipment.pet?itemData(h.equipment.pet):null,t=h.equipment.trinket?itemData(h.equipment.trinket):null,status=h.assignment==="combat"?"combat":["inn","tavern"].includes(h.assignment)?"recovery":"",progress=combatXPProgress(h);return `<article class="hero-card" style="--hero-color:${h.color}"><div class="hero-card-head"><div class="hero-portrait">${heroImage(h)}</div><div><h3>${escapeHTML(h.name)}</h3><span class="class-label">${h.className} · ${CLASS_COMBAT[h.className].identity}</span>${combatStyleBadge(heroCombatStyle(h),true)}</div><div class="hero-level"><strong>${h.level}</strong><small>Combat level</small></div></div><div class="hero-status-line"><span class="status-tag ${status}">${ASSIGNMENTS[h.assignment]?.icon||"✨"} ${escapeHTML(statusFor(h))}</span><small>Power ${Math.floor(heroPower(h))}</small></div><div class="hero-vitals"><div class="meter-row"><span>Combat XP</span><div class="meter" title="${h.level>=100?"Maximum Combat Level":`${fmt(progress.current)} / ${fmt(progress.required)} XP`}"><span style="--value:${progress.percent}%;--meter-color:${h.color}"></span></div><b>${h.level>=100?"MAX":`${Math.floor(progress.percent)}%`}</b></div><div class="meter-row"><span>Sanity</span><div class="meter"><span style="--value:${h.sanity}%;--meter-color:#c59637"></span></div><b>${Math.floor(h.sanity)}</b></div></div><div class="equipment-pair">${gearSlot("Weapon",w)}${gearSlot("Armor",a)}${gearSlot("Pet",p)}${gearSlot("Trinket",t)}</div><div class="hero-card-actions"><button data-action="open-hero" data-hero="${h.id}">Character page</button><button data-action="quick-assign" data-hero="${h.id}">Assign</button></div></article>`}).join("");
}
function gearSlot(label,item){return `<div class="gear-slot"><span>${item?itemImage(item,"gear-art"):"＋"}</span><div><small>${label}</small><strong>${item?escapeHTML(item.name):"Empty"}</strong></div></div>`;}

function renderAssignments(){
  const options=["idle","farm","mine","forest","smith","tavern"];
  $("#assignmentBoard").innerHTML=state.heroes.map(h=>`<article class="assignment-row"><div class="assignment-hero"><span class="mini-portrait" style="--hero-color:${h.color}">${heroImage(h)}</span><div><strong>${escapeHTML(h.name)} · ${h.className}</strong><small>Combat ${h.level} · Best skill ${bestSkill(h)}</small></div></div><div class="assignment-options">${options.map(a=>`<button class="${h.assignment===a?"active":""}" data-action="assign" data-hero="${h.id}" data-assignment="${a}" ${h.assignment==="inn"?"disabled":""}>${ASSIGNMENTS[a].icon} ${ASSIGNMENTS[a].name}</button>`).join("")}<button class="${h.assignment==="combat"?"active":""}" data-action="open-view" data-view="combat">⚔️ Combat Hall</button></div><div class="assignment-detail"><strong>${escapeHTML(statusFor(h))}</strong><br>${workActionStatus(h)?`<span data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</span>`:escapeHTML(ASSIGNMENTS[h.assignment]?.detail||"Away on a combat run.")}${RESOURCE_ASSIGNMENTS[h.assignment]?workTierPickerHTML(h,h.assignment):""}</div></article>`).join("");
}
function bestSkill(h){const names={farming:"Farming",mining:"Mining",woodcutting:"Woodcutting",smithing:"Smithing"};const [k,v]=Object.entries(h.skills).sort((a,b)=>b[1].level-a[1].level)[0];return `${names[k]} ${v.level}`;}

function roomProgress(run){if(run.roomState?.type==="skill")return clamp(1-run.roomState.remaining/run.roomState.total,0,1);if(run.enemy)return clamp(1-run.enemy.hp/run.enemy.maxHP,0,1);return 0;}
function markCombatEventsSeen(run){if(seenCombatEventIds.size>2000)seenCombatEventIds.clear();for(const event of run.recentEvents||[])seenCombatEventIds.add(event.id);}
function spawnCombatHitsplats(host,run){
  const now=Date.now();for(const event of run.recentEvents||[]){if(seenCombatEventIds.has(event.id))continue;seenCombatEventIds.add(event.id);if(event.amount===null||now-event.at>500)continue;const layer=host.querySelector(`[data-hitsplat-target="${event.target}"]`);if(!layer)continue;const hit=document.createElement("span"),index=layer.childElementCount%3;hit.className=`hitsplat ${event.type}`;hit.style.setProperty("--hit-index",index);hit.textContent=`${event.type==="heal"?"+":""}${fmt(event.amount)}`;layer.append(hit);setTimeout(()=>hit.remove(),1050);}
}
function ensureCombatVisualLoop(){
  if(combatVisualFrame||typeof requestAnimationFrame!=="function")return;const tick=()=>{combatVisualFrame=null;if(currentView!=="combat"||!state.combatRuns.length)return;const now=performance.now();$$('#combatBattlefield .attack-timer span[data-attack-speed]').forEach(bar=>{const speed=Number(bar.dataset.attackSpeed)||1,timer=Number(bar.dataset.attackTimer)||speed,sampled=Number(bar.dataset.sampledAt)||now,remaining=Math.max(0,timer-(now-sampled)/1000);bar.style.width=`${clamp((1-remaining/speed)*100,0,100)}%`;});combatVisualFrame=requestAnimationFrame(tick);};combatVisualFrame=requestAnimationFrame(tick);
}
function syncCombatBattlefield(host,run,cfg,room,party){
  const now=Date.now(),dps=run.elapsed?run.damageDealt/run.elapsed:0,cycle=host.querySelector('[data-battle-cycle]');if(cycle)cycle.textContent=`Now watching · Cycle ${run.cycle}`;
  if(room.type==="skill"){
    const s=run.roomState||{total:1,remaining:1,effective:0},leader=heroById(s.leaderId),bar=host.querySelector('[data-skill-progress]'),status=host.querySelector('[data-skill-status]');if(bar)bar.style.width=`${clamp((1-s.remaining/s.total)*100,0,100)}%`;if(status)status.textContent=`${leader?`${leader.name} leads at effective level ${Math.floor(s.effective)}`:"Party assessing obstacle"} · ${formatDuration(Math.max(0,s.remaining))} remaining`;
  }else{
    const enemy=run.enemy||createEnemy(cfg,room),enemyPct=clamp(enemy.hp/enemy.maxHP*100,0,100),enemyBar=host.querySelector('[data-enemy-hp-bar]'),enemyText=host.querySelector('[data-enemy-hp-text]'),statusHost=host.querySelector('[data-enemy-status]');if(enemyBar)enemyBar.style.width=`${enemyPct}%`;if(enemyText)enemyText.textContent=`${fmt(enemy.hp)} / ${fmt(enemy.maxHP)} HP · Max hit ${fmt(enemy.maxHit)} · ${enemy.speed.toFixed(1)}s attacks`;if(statusHost)statusHost.innerHTML=Object.keys(enemy.status||{}).map(x=>`<span class="${x}">${x}</span>`).join("");
    for(const h of party){const card=host.querySelector(`[data-battle-hero="${h.id}"]`);if(!card)continue;const maxHP=heroMaxHP(h),hpBar=card.querySelector('[data-hero-hp-bar]'),hpText=card.querySelector('[data-hero-hp-text]'),attackBar=card.querySelector('[data-attack-speed]'),timer=run.heroTimers?.[h.id]??heroAttackSpeed(h);if(hpBar)hpBar.style.width=`${clamp((h.hp||0)/maxHP*100,0,100)}%`;if(hpText)hpText.textContent=`${fmt(h.hp)} / ${fmt(maxHP)} HP`;if(attackBar){attackBar.dataset.attackSpeed=heroAttackSpeed(h);attackBar.dataset.attackTimer=timer;attackBar.dataset.sampledAt=performance.now();}const last=(run.recentEvents||[]).slice().reverse().find(e=>e.attackerId===h.id&&e.amount!==null&&now-e.at<180);card.classList.toggle("attacking",!!last);}
  }
  const summary={dps:dps.toFixed(1),kills:fmt(run.kills),cycles:fmt(run.cycles),food:fmt(run.foodEaten),reward:run.lastReward||"None yet"};for(const [key,value] of Object.entries(summary)){const el=host.querySelector(`[data-battle-summary="${key}"]`);if(el)el.textContent=value;}
  const log=(run.recentEvents||[]).slice(-7).reverse(),logHost=host.querySelector('[data-combat-log-lines]'),logKey=log.map(e=>e.id).join("|");if(logHost&&logHost.dataset.logKey!==logKey){logHost.dataset.logKey=logKey;logHost.innerHTML=log.length?log.map(e=>`<p class="${e.type}">${escapeHTML(e.text)}</p>`).join(""):`<p>The party is entering the first room.</p>`;}
  spawnCombatHitsplats(host,run);ensureCombatVisualLoop();
}
function renderCombatBattlefield(){
  const host=$("#combatBattlefield");if(!host)return;if(!state.combatRuns.length){host.innerHTML="";delete host.dataset.signature;return;}if(!state.combatRuns.some(r=>r.id===watchedRunId))watchedRunId=state.combatRuns[0].id;const run=state.combatRuns.find(r=>r.id===watchedRunId),cfg=COMBAT[run.combatId],layout=COMBAT_LAYOUTS[cfg.id],room=layout[run.roomIndex]||layout[0],party=run.heroIds.map(heroById).filter(Boolean),signature=`${run.id}:${run.cycle}:${run.roomIndex}:${room.type}:${party.map(h=>h.id).join(",")}`;
  if(host.dataset.signature===signature){syncCombatBattlefield(host,run,cfg,room,party);return;}
  const timeline=`<div class="room-timeline">${layout.map((r,i)=>`<div class="${i<run.roomIndex?"done":i===run.roomIndex?"current":""}"><span>${roomImage(r,"timeline-room-art")}</span><small>${escapeHTML(r.name)}</small></div>`).join("")}</div>`;
  let stage="";if(room.type==="skill"){
    stage=`<div class="skill-obstacle"><div class="obstacle-icon">${room.icon}</div><div><span class="eyebrow">Non-combat Raid room · ${escapeHTML(room.skill)}</span><h3>${escapeHTML(room.name)}</h3><p>${escapeHTML(room.description)}</p><div class="battle-hp"><span data-skill-progress style="width:0%"></span></div><small data-skill-status>Party assessing obstacle</small></div></div>`;
  }else{
    const enemy=run.enemy||createEnemy(cfg,room);stage=`<div class="battle-stage"><div class="enemy-zone ${enemy.boss?"boss":""}"><div class="enemy-name"><span class="eyebrow">${enemy.boss?"Boss":"Enemy"} · Room ${run.roomIndex+1}/${layout.length}</span><h3>${escapeHTML(enemy.name)}</h3>${combatStyleBadge(enemy.combatStyle,true)}</div><div class="enemy-figure">${assetImage(enemy.image||room.image,enemy.name,"enemy-image",enemy.icon)}<div class="hitsplat-layer" data-hitsplat-target="enemy"></div></div><div class="battle-hp enemy-hp"><span data-enemy-hp-bar style="width:100%"></span></div><small data-enemy-hp-text></small><div class="status-effects" data-enemy-status></div></div><div class="versus-mark">VS</div><div class="battle-party">${party.map(h=>`<article class="battle-hero" data-battle-hero="${h.id}" style="--hero-color:${h.color}"><div class="battle-portrait">${heroImage(h)}<div class="hitsplat-layer" data-hitsplat-target="${h.id}"></div></div><div class="battle-hero-name"><strong>${escapeHTML(h.name)}</strong><small>${h.className} · Max ${fmt(heroMaxHit(h))}</small>${combatStyleBadge(heroCombatStyle(h),true)}</div><div class="battle-hp hero-hp"><span data-hero-hp-bar style="width:100%"></span></div><small data-hero-hp-text></small><div class="attack-timer"><span data-attack-speed="${heroAttackSpeed(h)}" data-attack-timer="${heroAttackSpeed(h)}" data-sampled-at="0" style="width:0%"></span></div></article>`).join("")}</div></div>`;
  }
  host.innerHTML=`<section class="combat-battlefield" style="--battle-a:${cfg.colors[0]};--battle-b:${cfg.colors[1]}"><header><div><span class="eyebrow" data-battle-cycle></span><h2>${cfg.icon} ${escapeHTML(cfg.name)}</h2></div><div class="battle-actions"><button data-action="open-battle-stats" data-run="${run.id}">📊 Battle stats</button><button class="loot-button" data-action="open-loot" data-combat="${cfg.id}"><span class="loot-chest-icon"></span> Drop table</button><button class="stop-run" data-action="stop-run" data-run="${run.id}">Recall</button></div></header>${timeline}${stage}<div class="triangle-reminder"><span>⚔️ Melee beats Ranged</span><span>🏹 Ranged beats Magic</span><span>✨ Magic beats Melee</span><b>±25% damage</b></div><div class="battle-summary"><div><strong data-battle-summary="dps">0.0</strong><small>Party DPS</small></div><div><strong data-battle-summary="kills">0</strong><small>Enemies slain</small></div><div><strong data-battle-summary="cycles">0</strong><small>Clears</small></div><div><strong data-battle-summary="food">0</strong><small>Food eaten</small></div><div><strong data-battle-summary="reward">None yet</strong><small>Latest chest</small></div></div><details class="combat-log"><summary>Battle log</summary><div data-combat-log-lines></div></details></section>`;host.dataset.signature=signature;markCombatEventsSeen(run);syncCombatBattlefield(host,run,cfg,room,party);
}
function renderActiveRuns(){
  $("#combatSlotCount").textContent=combatCount();$("#activeRuns").innerHTML=state.combatRuns.length?state.combatRuns.map(r=>{const c=COMBAT[r.combatId],party=r.heroIds.map(heroById).filter(Boolean),room=COMBAT_LAYOUTS[c.id]?.[r.roomIndex],pct=roomProgress(r)*100,status=r.roomState?.type==="skill"?`${formatDuration(Math.max(0,r.roomState.remaining))} on obstacle`:r.enemy?`${fmt(r.enemy.hp)} / ${fmt(r.enemy.maxHP)} enemy HP`:"Entering room";return `<article class="active-run ${r.id===watchedRunId?"watched":""}"><div class="run-icon">${room?roomImage(room,"run-room-art"):c.icon}</div><div><div class="run-title"><strong>${c.name} · Cycle ${r.cycle}</strong><small>${escapeHTML(status)}</small></div><div class="run-progress"><span style="width:${pct}%"></span></div><div class="run-party">${party.map(h=>`<i title="${escapeHTML(h.name)}">${heroImage(h)}</i>`).join("")}<span>${escapeHTML(room?.name||"First room")} · ${r.autoRepeat?"Repeating":"Single clear"}</span></div></div><div class="active-run-actions"><button class="watch-run" data-action="watch-run" data-run="${r.id}">${r.id===watchedRunId?"Watching":"Watch fight"}</button><button data-action="open-battle-stats" data-run="${r.id}">📊 Stats</button><button class="loot-button" data-action="open-loot" data-combat="${c.id}"><span class="loot-chest-icon" aria-hidden="true"></span> Rewards</button><button class="stop-run" data-action="stop-run" data-run="${r.id}">Recall</button></div></article>`}).join(""):`<div class="empty-state"><span>🗺️</span>No active runs. Your heroes are waiting for orders.</div>`;
}
function battleStatsHTML(run){const entries=Object.entries(run.heroStats||{}).map(([id,stats])=>({hero:heroById(id),stats})).filter(entry=>entry.hero).sort((a,b)=>b.stats.damage-a.stats.damage),top=Math.max(1,...entries.map(entry=>entry.stats.damage)),total=entries.reduce((sum,entry)=>sum+entry.stats.damage,0),elapsed=Math.max(1,run.elapsed);return `<div class="battle-analytics-summary"><div><small>Party damage</small><strong>${fmt(total)}</strong></div><div><small>Live DPS</small><strong>${(total/elapsed).toFixed(1)}</strong></div><div><small>Damage taken</small><strong>${fmt(run.damageTaken)}</strong></div><div><small>Fight time</small><strong>${formatDuration(run.elapsed)}</strong></div></div><div class="damage-leaderboard">${entries.map((entry,index)=>{const {hero,stats}=entry,accuracy=stats.attacks?stats.hits/stats.attacks*100:0,share=total?stats.damage/total*100:0;return `<article class="damage-row"><span class="damage-rank">${index+1}</span><span class="damage-portrait">${heroImage(hero)}</span><div class="damage-main"><div><strong>${escapeHTML(hero.name)}</strong>${combatStyleBadge(heroCombatStyle(hero),true)}<b>${fmt(stats.damage)} dmg</b></div><div class="damage-bar"><span style="--damage-width:${stats.damage/top*100}%;--hero-color:${hero.color}"></span></div><small>${share.toFixed(1)}% share · ${(stats.damage/elapsed).toFixed(1)} DPS · ${fmt(stats.hits)}/${fmt(stats.attacks)} hits (${accuracy.toFixed(0)}%) · ${fmt(stats.crits)} crits</small></div><div class="damage-secondary"><span><b>${fmt(stats.taken)}</b><small>Taken</small></span><span><b>${fmt(stats.healing)}</b><small>Healed</small></span></div></article>`;}).join("")||`<div class="empty-state">The first attack will start this leaderboard.</div>`}</div>`;}
function openBattleStats(runId){const run=state.combatRuns.find(candidate=>candidate.id===runId);if(!run)return toast("📊","That battle has ended");const cfg=COMBAT[run.combatId];openDrawer("Battle Stats",`${cfg.short} · live contribution`, `<div id="battleStatsLive">${battleStatsHTML(run)}</div><div class="drawer-section triangle-guide"><h3>Combat triangle</h3><p><b>Melee → Ranged → Magic → Melee.</b> Advantage deals 25% more outgoing damage and takes 25% less incoming damage. Disadvantage reverses both.</p></div><div class="drawer-footer"><button class="primary-button" data-action="close-drawer">Back to combat</button></div>`,"battle-stats");$("#drawer").dataset.runId=runId;}
function refreshBattleStats(){if($("#drawer")?.dataset.mode!=="battle-stats")return;const run=state.combatRuns.find(candidate=>candidate.id===$("#drawer").dataset.runId),host=$("#battleStatsLive");if(run&&host)host.innerHTML=battleStatsHTML(run);}
function renderCombatLive(force=false){renderCombatBattlefield();const now=Date.now();if(force||now-lastActiveRunRender>=250){lastActiveRunRender=now;renderActiveRuns();}}
function renderCombat(){
  renderCombatLive(true);
  const groups=[
    ["expedition","Expeditions","Three real enemies per route. Every attack, kill, XP gain, and chest is simulated."],
    ["dungeon","Dungeons","Shared dungeon enemies lead to a unique regional boss and the existing loot table."],
    ["raid","Raids","Unique raid enemies, live bosses, and work-skill obstacles that reward well-rounded parties."],
  ];
  const highest=Math.max(...state.heroes.map(h=>h.level));
  $("#combatCatalog").innerHTML=groups.map(([category,title,subtitle])=>`<section id="combat-${category}" class="combat-section"><div class="combat-section-heading"><div><span class="eyebrow">${category}</span><h3>${title}</h3><p>${subtitle}</p></div><span>${Object.values(COMBAT).filter(c=>c.category===category).length} locations</span></div><div class="combat-cards">${Object.values(COMBAT).filter(c=>c.category===category).map(c=>{const locked=highest<c.minLevel;return `<article class="combat-card ${locked?"locked":""}" style="--card-a:${c.colors[0]};--card-b:${c.colors[1]}" data-icon="${c.icon}"><span class="eyebrow">${c.eyebrow}</span><h3>${c.name}</h3><p>${c.description}</p><ul>${combatRequirements(c).map(x=>`<li>${x}</li>`).join("")}</ul><div class="combat-card-actions"><button class="loot-button" data-action="open-loot" data-combat="${c.id}" aria-label="View ${c.name} rewards"><span class="loot-chest-icon" aria-hidden="true"></span> Loot</button><button data-action="open-combat" data-combat="${c.id}">${locked?`Locked · Lv ${c.minLevel}`:`Prepare ${c.short}`}</button></div></article>`}).join("")}</div></section>`).join("");
}

function combatRequirements(c){const entry=[c.keys?`${c.keys} Raid Key${c.keys===1?"":"s"}`:"",c.essence?`${c.essence} Essence`:""].filter(Boolean).join(" + ");return [`Combat Level ${c.minLevel}+`,`1–${c.maxParty} heroes`,entry?`${entry} per clear`:"No entry cost","Warehouse food auto-heals in battle"];}

function chanceLabel(value){return `${(Math.round(value*10000)/100).toFixed(2).replace(/\.?0+$/,"")}%`;}
function lootRows(c){
  const rows=[{icon:"🪙",name:`${fmt(c.gold[0])}–${fmt(c.gold[1])} Gold`,detail:"Guaranteed after a victory",chance:"100%"},{icon:"⚔️",name:`${fmt(c.xp)} Combat XP`,detail:"For each participating hero",chance:"100%"}];
  if(c.essenceChance)rows.push({icon:"✨",name:"1 Essence",detail:"Expedition Essence roll",chance:chanceLabel(c.essenceChance)});
  if(c.essenceReward)rows.push({icon:"✨",name:`${c.essenceReward[0]}–${c.essenceReward[1]} Essence`,detail:"Guaranteed after a victory",chance:"100%"});
  if(c.keyChance)rows.push({icon:"🗝️",name:"1 Raid Key",detail:"Independent Dungeon roll",chance:chanceLabel(c.keyChance)});
  if(c.category==="raid")rows.push({icon:"🎒",name:"Common raid loot only",detail:"The rare table is not entered; Gold, XP, and Essence still drop",chance:"90%"});
  for(const key of c.pool||[]){const d=ITEMS[key];rows.push({icon:d.icon,image:d.image,name:d.name,detail:`${d.tier} ${d.type} · Level ${d.requiredLevel||1}`,chance:chanceLabel((c.itemChance||0)/c.pool.length)});}
  for(const key of c.trinketPool||[]){const d=ITEMS[key];rows.push({icon:d.icon,image:d.image,name:d.name,detail:`${d.tier} · Non-tradeable`,chance:chanceLabel((c.trinketChance||0)/c.trinketPool.length)});}
  if(c.eggKey){const d=ITEMS[c.eggKey];rows.push({icon:d.icon,image:d.image,name:d.name,detail:"Independent boss-egg roll · Non-tradeable",chance:chanceLabel(c.eggChance)});}
  return rows;
}
function openLoot(combatId){const c=COMBAT[combatId];if(!c)return;const equipmentChance=c.category==="raid"?`A victory has a 10% chance to enter the 12-item rare table and a 90% chance to award common raid loot only. Each rare item is equally likely.`:c.pool?.length?`Each victory has one ${chanceLabel(c.itemChance)} equipment roll. If it succeeds, every listed item is equally likely.`:"This activity does not drop unique equipment.";openDrawer(`${c.name} Rewards`,"Possible loot and exact rates",`<div class="loot-summary"><span>${c.icon}</span><div><strong>Victory rewards</strong><p>${equipmentChance}</p></div></div><div class="loot-table">${lootRows(c).map(row=>`<div class="loot-row"><span class="loot-icon">${itemImage(row,"loot-art")}</span><div><strong>${escapeHTML(row.name)}</strong><small>${escapeHTML(row.detail)}</small></div><b>${row.chance}</b></div>`).join("")}</div><p class="loot-note">Drop chances are per completed victory. Independent rolls—such as trinkets, keys, and boss eggs—can occur alongside an equipment drop.</p><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Close</button><button class="primary-button" data-action="open-combat" data-combat="${c.id}">Prepare ${c.short}</button></div>`);}

function renderWarehouse(){
  $("#warehouseCount").textContent=occupiedSlots();$("#warehouseCapacity").textContent=`/${warehouseCapacity()} slots`;
  $$("[data-action='warehouse-filter']").forEach(b=>b.classList.toggle("active",b.dataset.filter===warehouseFilter));
  const itemList=warehouseFilter==="resource"?[]:state.inventory.filter(i=>warehouseFilter==="all"||itemData(i).type===warehouseFilter||(warehouseFilter==="special"&&itemData(i).special));
  const resourceList=["all","resource"].includes(warehouseFilter)?warehouseResourceStacks():[];
  const resourceCards=resourceList.map(stack=>`<article class="item-card resource-stack"><div class="item-icon">${stack.icon}</div><div><h4>${escapeHTML(stack.name)}</h4><span class="item-meta">${escapeHTML(stack.category)} · Stored resource</span><p>${escapeHTML(stack.detail)}</p></div><div class="resource-quantity"><small>Stored</small><strong>×${fmt(stack.quantity)}</strong></div></article>`);
  const itemCards=itemList.map(i=>{const d=itemData(i),gear=["weapon","armor"].includes(d.type),equippable=gear||["pet","trinket"].includes(d.type),stats=[d.attack?`+${d.attack} ATK`:"",d.defense?`+${d.defense} DEF`:"",d.element,d.effectText].filter(Boolean).join(" · ")||"A curious town treasure",actions=[equippable?`<button data-action="equip-item" data-item="${i.id}">Equip</button>`:"",d.type==="egg"?`<button data-action="hatch-egg" data-item="${i.id}">Hatch egg</button>`:"",gear?`<button data-action="repair-item" data-item="${i.id}">Repair</button>`:"",d.salvage?`<button data-action="salvage-item" data-item="${i.id}">Salvage +${d.salvage} ✨</button>`:"",!d.soulbound?`<button data-action="sell-item" data-item="${i.id}">List</button>`:""].filter(Boolean).join("");return `<article class="item-card ${d.special?"special":""}"><div class="item-icon">${itemImage(d,"item-art")}</div><div><h4>${escapeHTML(d.name)}</h4><span class="item-meta">${d.tier} ${d.type} · ${d.className||"Any hero"}</span><p>${escapeHTML(stats)}${gear?`<br>Durability ${Math.floor(d.durability??100)}%`:""}${d.soulbound?`<br><b>Non-tradeable</b>`:""}</p></div><div class="item-actions">${actions}</div></article>`});
  const cards=[...resourceCards,...itemCards];$("#inventoryGrid").innerHTML=cards.length?cards.join(""):`<div class="empty-state"><span>📦</span>No matching items in the Warehouse.</div>`;
}

function renderMarket(){
  $("#marketStatus").innerHTML=currentUser?`<div class="notice">Connected as ${escapeHTML(currentUser.displayName||currentUser.email||"Adventurer")}. Listings are synchronized through Firebase.</div>`:`<div class="notice warning">Sign in to use the live player Marketplace. Device play keeps every other system available.</div>`;
  const mine=marketListings.filter(l=>l.sellerId===currentUser?.uid),others=marketListings.filter(l=>l.sellerId!==currentUser?.uid&&!ITEMS[l.itemKey]?.soulbound);
  $("#marketListings").innerHTML=others.length?others.map(l=>listingHTML(l,false)).join(""):`<div class="empty-state"><span>⚖️</span>No player listings are available right now.</div>`;
  $("#myListings").innerHTML=mine.length?mine.map(l=>listingHTML(l,true)).join(""):`<div class="empty-state"><span>🪙</span>Your active listings and claimed payouts appear here.</div>`;
}
function listingHTML(l,mine){const d=ITEMS[l.itemKey]||{name:l.itemName,type:"resource",icon:l.icon||"📦"};return `<article class="listing"><div class="item-icon">${itemImage(d,"item-art")}</div><div><strong>${escapeHTML(d.name||l.itemName)}</strong><small>${escapeHTML(l.sellerName||"Adventurer")} · Qty ${l.quantity||1}</small></div><div class="listing-price"><b>🪙 ${fmt(l.price)}</b><button data-action="${mine?"cancel-listing":"buy-listing"}" data-listing="${l.id}">${mine?"Cancel":"Buy"}</button></div></article>`;}

function renderProgress(){
  const totalLevel=state.heroes.reduce((n,h)=>n+h.level,0),totalSkills=state.heroes.reduce((n,h)=>n+Object.values(h.skills).reduce((a,s)=>a+s.level,0),0);
  $("#progressCards").innerHTML=[["⚔️",totalLevel,"Combined Combat Levels"],["🛠️",totalSkills,"Combined Work Levels"],["🐲",state.stats.raids,"Raid Victories"],["🪙",fmt(state.stats.goldEarned),"Lifetime Gold Earned"]].map(([i,v,l])=>`<article class="stat-card"><span>${i}</span><strong>${v}</strong><small>${l}</small></article>`).join("");
  $("#achievementList").innerHTML=ACHIEVEMENTS.map(a=>{const yes=state.achievements.includes(a.id);return `<article class="achievement ${yes?"":"locked"}"><span>${yes?a.icon:"🔒"}</span><div><strong>${a.name}</strong><small>${a.description}</small></div><b>${yes?"Complete":"Locked"}</b></article>`}).join("");
  const board=leaderboard.length?leaderboard:[{displayName:"Your town",totalLevel,raidWins:state.stats.raids,local:true}];$("#leaderboardList").innerHTML=board.map((x,i)=>`<article class="leaderboard-row"><span class="rank">${i+1}</span><span class="board-avatar">${i===0?"👑":"🛡️"}</span><div><strong>${escapeHTML(x.displayName||"Adventurer")}</strong><small>${x.raidWins||0} raid victories</small></div><b>Lv ${x.totalLevel||0}</b></article>`).join("");
  renderHeroLeague();
}
function heroLeagueValue(hero,metric){if(metric==="damage")return hero.records.damageDealt||0;if(metric==="combat")return hero.level;if(metric==="work")return Object.values(hero.skills).reduce((sum,skill)=>sum+skill.level,0);return Math.floor(heroPower(hero));}
function renderHeroLeague(){const host=$("#heroLeague");if(!host)return;$$('[data-action="hero-league-metric"]').forEach(button=>button.classList.toggle("active",button.dataset.metric===heroLeagueMetric));const labels={power:"Combat power",damage:"Lifetime damage",combat:"Combat level",work:"Combined work levels"},sorted=[...state.heroes].sort((a,b)=>heroLeagueValue(b,heroLeagueMetric)-heroLeagueValue(a,heroLeagueMetric)),max=Math.max(1,...sorted.map(hero=>heroLeagueValue(hero,heroLeagueMetric)));host.innerHTML=`<div class="hero-league-list">${sorted.map((hero,index)=>{const value=heroLeagueValue(hero,heroLeagueMetric),skills=Object.entries(hero.skills);return `<button class="hero-league-row" data-action="open-hero" data-hero="${hero.id}"><span class="league-rank">${index+1}</span><span class="league-portrait">${heroImage(hero)}</span><div class="league-main"><div><strong>${escapeHTML(hero.name)}</strong>${combatStyleBadge(heroCombatStyle(hero),true)}<b>${fmt(value)}</b></div><div class="league-bar"><span style="--league-width:${value/max*100}%;--hero-color:${hero.color}"></span></div><small>${labels[heroLeagueMetric]} · ${CLASS_COMBAT[hero.className].identity}</small></div><div class="skill-mini-chart" aria-label="Work skill levels">${skills.map(([key,skill])=>`<i title="${WORK_SKILL_NAMES[key]} ${skill.level}" style="--skill-height:${Math.max(8,skill.level)}%"><span></span></i>`).join("")}</div></button>`;}).join("")}</div><div class="skill-chart-key"><span>Four small bars per hero:</span><b>Farm</b><b>Mine</b><b>Wood</b><b>Smith</b></div>`;}

function renderSyncUser(){
  $("#versionLabel").textContent=`v${VERSION}`;const label=currentUser?(currentUser.displayName||currentUser.email||"A").charAt(0).toUpperCase():"G";$("#accountButton").textContent=label;
  renderSoundButton();
}
function setSync(status){const dot=$("#syncDot"),label=$("#syncLabel");dot.className=`status-dot ${status==="online"?"online":status==="error"?"error":""}`;label.textContent=status==="online"?"Cloud saved":status==="saving"?"Saving…":status==="error"?"Sync problem":"Device save";}

function openView(view){currentView=view;$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.viewPanel===view));$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));window.scrollTo({top:0,behavior:"smooth"});renderAll();}
function openDrawer(title,eyebrow,html,mode=""){$("#drawerTitle").textContent=title;$("#drawerEyebrow").textContent=eyebrow;$("#drawerContent").innerHTML=html;$("#drawer").dataset.mode=mode;$("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeDrawer(){$("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true");$("#drawer").dataset.mode="";document.body.style.overflow="";}

function profileEquipmentSlot(h,slot,label){const d=h.equipment[slot]?itemData(h.equipment[slot]):null,detail=d?[d.attack?`+${d.attack} ATK`:"",d.defense?`+${d.defense} DEF`:"",d.element,d.effectText,["weapon","armor"].includes(slot)?`${Math.floor(d.durability??100)}% durability`:""].filter(Boolean).join(" · "):slot==="pet"?"Find pets while skilling or hatch a raid egg":slot==="trinket"?"Find trinkets in Dungeons":"No item equipped";return `<article class="profile-gear-slot"><span>${d?itemImage(d,"profile-item-art"):"＋"}</span><div><small>${label}</small><strong>${d?escapeHTML(d.name):"Empty slot"}</strong><p>${escapeHTML(detail)}</p></div></article>`;}
function heroStoryHTML(h){const adventures=(h.records.expeditions||0)+(h.records.dungeons||0)+(h.records.raids||0),best=Object.entries(h.skills).sort((a,b)=>b[1].level-a[1].level)[0],bestName=WORK_SKILL_NAMES[best[0]],workTotal=h.records.workActions||0,damage=h.records.damageDealt||0;return `<div class="hero-story"><div class="story-lead"><span>“</span><p>${escapeHTML(h.name)} has spent ${formatDuration(h.records.secondsActive)} shaping Briarwatch—fighting as a ${CLASS_COMBAT[h.className].identity.toLowerCase()}, mastering ${bestName}, and building a record that belongs to this save alone.</p></div><div class="story-timeline"><article><i>⚔️</i><div><small>Combat chapter</small><strong>${fmt(h.records.kills)} enemies defeated · ${fmt(damage)} damage dealt</strong><p>${fmt(h.records.damageTaken)} damage endured, ${fmt(h.records.healingDone)} HP restored, and ${fmt(h.records.defeats)} trips back by cart.</p></div></article><article><i>🧭</i><div><small>Road chapter</small><strong>${fmt(adventures)} adventures completed</strong><p>${fmt(h.records.expeditions)} expeditions, ${fmt(h.records.dungeons)} dungeons, and ${fmt(h.records.raids)} raids returned from.</p></div></article><article><i>🛠️</i><div><small>Town chapter</small><strong>${fmt(workTotal)} work actions · ${bestName} ${best[1].level}</strong><p>${fmt(h.records.foodGathered)} food, ${fmt(h.records.metalMined)} metal, ${fmt(h.records.woodGathered)} wood, and ${fmt(h.records.kitsForged)} kits added to the town.</p></div></article><article><i>🏆</i><div><small>Legacy chapter</small><strong>${fmt(h.records.goldEarned)} Gold earned · ${fmt(h.records.itemsFound)} rare finds</strong><p>${fmt(h.records.raidBosses)} raid bosses and ${fmt(h.records.dungeonBosses)} dungeon bosses appear in ${escapeHTML(h.name)}'s record.</p></div></article></div></div>`;}
function openHero(id){
  const h=heroById(id);if(!h)return;const maxHP=heroMaxHP(h),specials=heroSpecials(h),progress=combatXPProgress(h),identity=CLASS_COMBAT[h.className];
  openDrawer(h.name,`${h.className} · Combat Level ${h.level}`,`<div class="character-command" style="--hero-color:${h.color}"><span class="command-portrait">${heroImage(h)}</span><div class="command-identity"><div><h2>${escapeHTML(h.name)}</h2><button class="edit-name-button" data-action="toggle-hero-rename" aria-label="Rename ${escapeHTML(h.name)}">✎</button></div><p>${h.className} · ${escapeHTML(statusFor(h))}</p><div>${combatStyleBadge(heroCombatStyle(h))}<span class="identity-chip">${escapeHTML(identity.identity)}</span></div></div><div class="command-level"><strong>${h.level}</strong><small>Combat</small></div></div><div id="heroRenameForm" class="inline-rename" hidden><input id="heroNameInput" maxlength="24" value="${escapeHTML(h.name)}" aria-label="New hero name"><button class="primary-button" data-action="rename-hero" data-hero="${h.id}">Save</button></div><section class="profile-core"><div class="profile-xp"><div><strong>${h.level>=100?"Maximum Combat Level":`${fmt(progress.current)} / ${fmt(progress.required)} XP`}</strong><small>${h.level>=100?"Level 100":`${fmt(progress.remaining)} XP to Level ${h.level+1}`}</small></div><div class="meter"><span style="--value:${progress.percent}%;--meter-color:${h.color}"></span></div></div><div class="compact-combat-stats"><div><span>⚔️</span><strong>${fmt(heroAttack(h))}</strong><small>Attack</small></div><div><span>💥</span><strong>${fmt(heroMaxHit(h))}</strong><small>Max hit</small></div><div><span>🛡️</span><strong>${fmt(heroDefense(h))}</strong><small>Defence</small></div><div><span>❤️</span><strong>${fmt(Math.min(h.hp??maxHP,maxHP))}/${fmt(maxHP)}</strong><small>HP</small></div><div><span>⏱️</span><strong>${heroAttackSpeed(h).toFixed(2)}s</strong><small>Attack</small></div><div><span>🎯</span><strong>${Math.round(heroCritChance(h)*100)}%</strong><small>Crit</small></div><div><span>✦</span><strong>${fmt(heroPower(h))}</strong><small>Power</small></div></div><div class="profile-triangle"><span>⚔️ Melee → 🏹 Ranged → ✨ Magic → ⚔️</span><b>Advantage +25% dealt / −25% taken</b></div>${specials.length?`<div class="special-chip-list">${specials.map(x=>`<span>${escapeHTML(x)}</span>`).join("")}</div>`:""}</section><div class="drawer-section skills-first"><div class="profile-section-title"><h3>Independent Work Skills</h3>${workActionStatus(h)?`<small data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</small>`:""}</div><div class="profile-skill-grid">${Object.entries(h.skills).map(([key,skill])=>`<article><span>${{farming:"🌾",mining:"⛏️",woodcutting:"🌲",smithing:"⚒️"}[key]}</span><div><small>${WORK_SKILL_NAMES[key]}</small><strong>Level ${skill.level}</strong><div class="meter"><span style="--value:${skill.level>=100?100:skill.xp/xpForLevel(skill.level)*100}%"></span></div></div></article>`).join("")}</div></div><div class="drawer-section"><div class="profile-section-title"><h3>Equipment</h3><button class="text-button" data-action="open-view" data-view="warehouse">Open Warehouse</button></div><div class="profile-equipment-grid">${profileEquipmentSlot(h,"weapon","Weapon")}${profileEquipmentSlot(h,"armor","Armor")}${profileEquipmentSlot(h,"pet","Pet")}${profileEquipmentSlot(h,"trinket","Trinket")}</div></div><div class="drawer-section"><h3>${escapeHTML(h.name)}'s Story</h3>${heroStoryHTML(h)}</div><div class="drawer-section quick-assignment"><h3>Quick Assignment</h3><div class="quick-assignment-grid">${["idle","farm","mine","forest","smith","tavern"].map(a=>`<button class="${h.assignment===a?"selected":""}" data-action="assign" data-hero="${h.id}" data-assignment="${a}" ${h.assignment==="combat"||h.assignment==="inn"?"disabled":""}><span>${ASSIGNMENTS[a].icon}</span><strong>${ASSIGNMENTS[a].name}</strong></button>`).join("")}</div></div>`,"hero-profile");
}

function resourceTierHTML(id){
  const resource=RESOURCE_ASSIGNMENTS[id];if(!resource)return "";const b=BUILDINGS[id],buildingLevel=state.buildings[id],bestSkill=Math.max(...state.heroes.map(h=>h.skills[b.skill].level));
  const title=resource==="food"?"Food Items":resource==="metal"?"Metal Ores":"Wood Types",explanation=resource==="food"?"Every completed action creates one meal item. Higher meals restore more HP when a hero auto-eats in combat; they never convert into generic Food.":`Every completed action creates one distinct ${resource} item. Each stack is its own crafting material and cannot substitute for another tier.`;return `<div class="drawer-section"><h3>${title}</h3><p class="tier-explainer">${explanation} Skill and building levels make actions faster; heroes stay on the exact task you select.</p><div class="resource-tier-list">${RESOURCE_TIERS[resource].map(t=>{const unlocked=bestSkill>=t.level&&buildingLevel>=t.building,amount=Math.floor(state.resourceTiers[resource][t.id]||0),detail=resource==="food"?`${fmt(amount)} stored · Heals ${t.heal} HP each · ${TIER_ACTION_SECONDS[t.id]}s base`:`${fmt(amount)} stored · ${t.tier} recipe material · ${TIER_ACTION_SECONDS[t.id]}s base`,badge=resource==="food"?`${t.heal} HP`:"Item";return `<div class="resource-tier ${unlocked?"unlocked":"locked"}"><span>${unlocked?t.icon:"🔒"}</span><div><strong>${t.tier} · ${t.name}</strong><small>${unlocked?detail:`Requires skill ${t.level} + building ${t.building}`}</small></div><b>${unlocked?badge:"Locked"}</b></div>`}).join("")}</div></div>`;
}
function openBuilding(id){const b=BUILDINGS[id],level=state.buildings[id],cost=Math.floor(b.baseCost*Math.pow(1.55,level-1)),workers=state.heroes.filter(h=>h.assignment===id),activity=id==="tavern"?tavernMarketHTML():"";openDrawer(b.name,`Building level ${level}`,`<div class="drawer-section"><div class="info-grid"><div class="info-tile"><small>Assigned heroes</small><strong>${workers.length} / 6</strong></div><div class="info-tile"><small>Action speed</small><strong>+${(level-1)*8}%</strong></div><div class="info-tile"><small>Next upgrade</small><strong>🪙 ${fmt(cost)}</strong></div><div class="info-tile"><small>Role</small><strong>${escapeHTML(b.description)}</strong></div></div></div>${activity}${resourceTierHTML(id)}${id==="smith"?smithCraftHTML():""}<div class="drawer-section"><h3>Heroes here</h3><div class="action-list">${workers.length?workers.map(h=>`<button data-action="open-hero" data-hero="${h.id}"><span class="inline-hero">${heroImage(h)} ${escapeHTML(h.name)}</span><small data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</small></button>`).join(""):`<div class="empty-state">No heroes are assigned here.</div>`}</div></div><div class="drawer-footer"><button class="soft-button" data-action="open-view" data-view="assign">Assignments</button><button class="primary-button" data-action="upgrade-building" data-building="${id}">Upgrade · 🪙 ${fmt(cost)}</button></div>`,id==="tavern"?"tavern":"");}
function itemCraftingRecipe(d){const tierId=d.recipeTier||String(d.tier||"starter").toLowerCase(),metal=resourceTierData("metal",tierId)||RESOURCE_TIERS.metal[0],wood=resourceTierData("wood",tierId)||RESOURCE_TIERS.wood[0];return {metal,wood,metalCost:d.metalCost||0,woodCost:d.woodCost||0};}
function smithingCapability(){return {level:Math.max(...state.heroes.map(hero=>hero.skills.smithing.level)),building:state.buildings.smith};}
function normalGearTierUnlocked(tier,capability=smithingCapability()){return capability.level>=tier.smithLevel&&capability.building>=tier.building;}
function smithRecipeButton(key){const d=ITEMS[key],r=itemCraftingRecipe(d),metalOwned=resourceTierCount("metal",r.metal.id),woodOwned=resourceTierCount("wood",r.wood.id),stat=d.type==="weapon"?`+${d.attack} ATK`:`+${d.defense} DEF`,ready=metalOwned>=r.metalCost&&woodOwned>=r.woodCost;return `<button class="smith-recipe ${ready?"ready":"missing-materials"}" data-action="craft-item" data-key="${key}"><span class="recipe-item">${itemImage(d,"recipe-item-art")}<span><strong>${escapeHTML(d.name)}</strong><small>${stat} · Combat ${d.requiredLevel}</small></span></span><span class="recipe-cost"><strong>${r.metal.icon} ${r.metalCost} · ${r.wood.icon} ${r.woodCost}</strong><small>${fmt(metalOwned)} ${escapeHTML(r.metal.name)} · ${fmt(woodOwned)} ${escapeHTML(r.wood.name)}</small></span></button>`;}
function smithTierHTML(tier,capability,currentTier){
  const metal=resourceTierData("metal",tier.id),wood=resourceTierData("wood",tier.id),unlocked=normalGearTierUnlocked(tier,capability),requirement=`Smithing ${tier.smithLevel} + Blacksmith ${tier.building}`,materialText=`${metal.icon} ${metal.name} + ${wood.icon} ${wood.name}`;
  if(!unlocked)return `<div class="smith-tier locked"><span class="smith-tier-badge">🔒</span><div><strong>${tier.name} Equipment</strong><small>${escapeHTML(materialText)} · Requires ${escapeHTML(requirement)}</small></div><b>Locked</b></div>`;
  return `<details class="smith-tier unlocked" ${tier.id===currentTier.id?"open":""}><summary><span class="smith-tier-badge">${metal.icon}</span><span><strong>${tier.name} Equipment</strong><small>${escapeHTML(materialText)} · ${escapeHTML(requirement)}</small></span><b>12 recipes</b></summary><div class="smith-tier-recipes"><h4>Weapons</h4><div class="action-list">${NORMAL_GEAR_RECIPE_KEYS[tier.id].weapon.map(smithRecipeButton).join("")}</div><h4>Armor</h4><div class="action-list">${NORMAL_GEAR_RECIPE_KEYS[tier.id].armor.map(smithRecipeButton).join("")}</div></div></details>`;
}
function smithCraftHTML(){
  const capability=smithingCapability(),unlocked=NORMAL_GEAR_TIER_SPECS.filter(tier=>normalGearTierUnlocked(tier,capability)),currentTier=unlocked[unlocked.length-1],nextTier=NORMAL_GEAR_TIER_SPECS.find(tier=>!normalGearTierUnlocked(tier,capability)),repairMetal=resourceTierData("metal",REPAIR_KIT_RECIPE.metalTier),repairWood=resourceTierData("wood",REPAIR_KIT_RECIPE.woodTier);
  return `<div class="drawer-section"><h3>Smithing Progression</h3><p class="tier-explainer">Normal equipment follows the same eight exact material tiers as Mining and Woodcutting. A recipe needs both the listed Smithing level and Blacksmith level; lower materials never substitute.</p><div class="smith-capability"><div><small>Highest Smithing</small><strong>Level ${capability.level}</strong></div><div><small>Blacksmith</small><strong>Level ${capability.building}</strong></div><div><small>Next equipment tier</small><strong>${nextTier?`${nextTier.name} · Smithing ${nextTier.smithLevel} / Blacksmith ${nextTier.building}`:"All tiers mastered"}</strong></div></div><div class="smith-tier-list">${NORMAL_GEAR_TIER_SPECS.map(tier=>smithTierHTML(tier,capability,currentTier)).join("")}</div></div><div class="drawer-section"><h3>Assigned Smith Work</h3><div class="notice">Assigned Smiths continuously forge Repair Kits and gain Smithing XP. Each action uses ${repairMetal.icon} ${REPAIR_KIT_RECIPE.metalCost} ${repairMetal.name} + ${repairWood.icon} ${REPAIR_KIT_RECIPE.woodCost} ${repairWood.name}.</div></div>`;
}
function craftItem(key){const d=ITEMS[key];if(!d?.metalCost)return;const tier=d.normalGear?NORMAL_GEAR_TIER_SPECS.find(entry=>entry.id===d.recipeTier):null;if(tier&&!normalGearTierUnlocked(tier))return toast("🔒",`${tier.name} equipment is locked`,`Requires Smithing ${tier.smithLevel} and Blacksmith Level ${tier.building}.`);const r=itemCraftingRecipe(d),metalOwned=resourceTierCount("metal",r.metal.id),woodOwned=resourceTierCount("wood",r.wood.id);if(occupiedSlots()>=warehouseCapacity())return toast("📦","Warehouse is full");if(metalOwned<r.metalCost||woodOwned<r.woodCost)return toast("⚒️","Not enough exact materials",`Need ${r.metalCost} ${r.metal.name} and ${r.woodCost} ${r.wood.name}. You have ${metalOwned} and ${woodOwned}.`);spendSpecificResource("metal",r.metal.id,r.metalCost);spendSpecificResource("wood",r.wood.id,r.woodCost);state.inventory.push({id:uid(),key,durability:100,acquiredAt:Date.now()});notify("Equipment crafted",`${d.name} used ${r.metalCost} ${r.metal.name} and ${r.woodCost} ${r.wood.name}.`,d.icon);markDirty();renderAll();openBuilding("smith");}

function openCombat(combatId){
  const c=COMBAT[combatId];if(!c)return;const available=state.heroes.filter(h=>h.assignment!=="combat"&&h.assignment!=="inn"&&h.sanity>0&&(h.hp||0)>0),max=c.maxParty,entry=[c.keys?`${c.keys} Key${c.keys===1?"":"s"}`:"",c.essence?`${c.essence} Essence`:""].filter(Boolean).join(" + ")||"Free entry",layout=COMBAT_LAYOUTS[c.id];
  openDrawer(c.name,c.eyebrow,`<div class="drawer-section"><p>${c.description}</p><div class="info-grid"><div class="info-tile"><small>Route</small><strong>${combatRoomsFor(c).length} fights · ${layout.filter(r=>r.type==="skill").length} skill rooms</strong></div><div class="info-tile"><small>Required level</small><strong>Combat ${c.minLevel}+</strong></div><div class="info-tile"><small>Party size</small><strong>Up to ${max}</strong></div><div class="info-tile"><small>Auto-healing</small><strong>Eat below 45% HP</strong></div><div class="info-tile"><small>Entry per clear</small><strong>${entry}</strong></div><button class="info-tile loot-preview" data-action="open-loot" data-combat="${c.id}"><small>Possible rewards</small><strong><span class="loot-chest-icon" aria-hidden="true"></span> View loot & rates</strong></button></div></div><div class="drawer-section"><h3>Rooms in this route</h3><div class="route-preview">${layout.map((r,i)=>`<div><span>${roomImage(r,"route-room-art")}</span><div><strong>${i+1}. ${escapeHTML(r.name)}</strong><small>${r.type==="skill"?`${r.skill} obstacle · time scales with party skill`:`${r.boss?"Boss":"Enemy"} fight · ${COMBAT_STYLE_META[r.combatStyle].icon} ${COMBAT_STYLE_META[r.combatStyle].name}`}</small></div></div>`).join("")}</div><div class="triangle-reminder light"><span>⚔️ Melee beats Ranged</span><span>🏹 Ranged beats Magic</span><span>✨ Magic beats Melee</span><b>±25%</b></div></div><div class="drawer-section"><h3>Choose the party</h3><div class="choice-grid" id="partyChoices">${available.map(h=>`<button class="choice-card hero-choice ${h.level<c.minLevel?"locked":""}" data-action="toggle-party" data-hero="${h.id}" data-max="${max}" data-combat="${c.id}" ${h.level<c.minLevel?"disabled":""}><span>${heroImage(h)}</span><strong>${escapeHTML(h.name)} · Lv ${h.level}</strong>${combatStyleBadge(heroCombatStyle(h),true)}<small>${h.level<c.minLevel?`Needs Level ${c.minLevel}`:`Max ${heroMaxHit(h)} · ${heroAttackSpeed(h).toFixed(2)}s · ${fmt(h.hp)} HP`}</small></button>`).join("")}</div></div><div id="combatPartyPreview" class="combat-party-preview empty"><div><span>💥</span><strong id="partyMaxHit">Choose heroes</strong><small>Highest max hit</small></div><div><span>⚔️</span><strong id="partyDps">—</strong><small>Estimated DPS</small></div><div><span>⏱️</span><strong id="partyDuration">—</strong><small id="partySpeed">Estimated clear</small></div><div><span>🥕</span><strong id="partyFood">${fmt(state.resources.food)}</strong><small>Meals stored</small></div></div><p id="combatPreviewNote" class="combat-preview-note">The triangle applies to both outgoing and incoming damage. A mixed party is safest when a route changes styles.</p><label class="notice"><input id="autoRepeatChoice" type="checkbox" checked> Automatically repeat while entry supplies, meals, Sanity, and heroes allow.</label><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Cancel</button><button class="primary-button" data-action="start-run" data-combat="${c.id}">Enter ${c.short}</button></div>`);
  updateCombatPreview(c.id);
}
function estimatedClearTime(c,party){const dps=Math.max(.1,estimatedPartyDPS(party,c));return COMBAT_LAYOUTS[c.id].reduce((total,room)=>{if(room.type==="combat")return total+createEnemy(c,room).maxHP/dps;const ranked=party.map(h=>h.skills[room.skill]?.level||1).sort((a,b)=>b-a),effective=ranked.reduce((n,l,i)=>n+l*(i?0.25:1),0);return total+room.baseSeconds/(1+effective/25);},0);}
function updateCombatPreview(combatId){
  const c=COMBAT[combatId],panel=$("#combatPartyPreview");if(!c||!panel)return;const party=$$("#partyChoices .selected").map(x=>heroById(x.dataset.hero)).filter(Boolean),maxHit=$("#partyMaxHit"),dps=$("#partyDps"),duration=$("#partyDuration"),speed=$("#partySpeed"),food=$("#partyFood"),note=$("#combatPreviewNote");food.textContent=fmt(state.resources.food);
  if(!party.length){panel.classList.add("empty");maxHit.textContent="Choose heroes";dps.textContent="—";duration.textContent="—";speed.textContent="Estimated clear";note.textContent="There is no pass/fail roll. Select heroes to see their real damage and route time.";return;}
  const partyDPS=estimatedPartyDPS(party,c),clearTime=estimatedClearTime(c,party),highest=Math.max(...party.map(heroMaxHit)),avgDef=party.reduce((n,h)=>n+heroDefense(h),0)/party.length;panel.classList.remove("empty");maxHit.textContent=fmt(highest);dps.textContent=partyDPS.toFixed(1);duration.textContent=formatDuration(clearTime);speed.textContent=`Avg DEF ${Math.floor(avgDef)}`;note.textContent=`Weapons directly raise max hit. Work-skilled Raid parties also shorten obstacle rooms. ${state.resources.food?"Stored meals will be eaten automatically below 45% HP.":"Warning: no food is stored, so this party cannot auto-heal."}`;
}
function openCombatCategory(category){closeDrawer();openView("combat");setTimeout(()=>document.querySelector(`#combat-${category}`)?.scrollIntoView({behavior:"smooth",block:"start"}),80);}

function openNotifications(){openDrawer("Town Reports","The living history of Briarwatch",`<div class="action-list">${state.notifications.map(n=>`<article class="notice"><strong>${n.icon||"✦"} ${escapeHTML(n.title)}</strong><br><small>${new Date(n.time).toLocaleString()}</small><p>${escapeHTML(n.text)}</p></article>`).join("")}</div><div class="drawer-footer"><button class="soft-button" data-action="clear-reports">Clear reports</button><button class="primary-button" data-action="close-drawer">Done</button></div>`);}

function openAccount(){
  const cloud=!!currentUser,accountActions=cloud?`<button data-action="sync"><span>☁️ Save to cloud now</span><small>Sync this device</small></button><button data-action="sign-out"><span>🚪 Sign out</span><small>Device save remains</small></button>`:`<button data-action="open-auth"><span>☁️ Sign in for cloud saves</span><small>Device play is active</small></button>`;
  openDrawer("Account & Town",cloud?(currentUser.email||"Cloud adventurer"):"Playing on this device",`<div class="drawer-section"><div class="info-grid"><div class="info-tile"><small>Save</small><strong>${cloud?"Firebase cloud + device":"This device"}</strong></div><div class="info-tile"><small>Version</small><strong>${VERSION}</strong></div><div class="info-tile"><small>Town created</small><strong>${new Date(state.createdAt).toLocaleDateString()}</strong></div><div class="info-tile"><small>Offline time</small><strong>${formatDuration(state.stats.offlineSeconds)}</strong></div></div></div><div class="action-list">${accountActions}<button data-action="export-save"><span>📤 Export save backup</span><small>Download JSON</small></button><button data-action="reset-game"><span>⚠️ Begin a new town</span><small>Starts with zero resources</small></button></div>`);
}

function upgradeBuilding(id){const b=BUILDINGS[id],cost=Math.floor(b.baseCost*Math.pow(1.55,state.buildings[id]-1));if(state.resources.gold<cost)return toast("🪙","Not enough Gold");state.resources.gold-=cost;state.buildings[id]++;notify(`${b.name} upgraded`,`Building Level ${state.buildings[id]} is now complete.`,b.icon);const speaker=state.heroes.find(hero=>hero.assignment===id)||chatPick(state.heroes.filter(hero=>hero.assignment==="idle"));if(speaker)postHeroChat(speaker,`${b.name} Level ${state.buildings[id]} is complete. ${RESOURCE_ASSIGNMENTS[id]?"Check our exact tasks—higher materials may be available.":"The town feels a little stronger already."}`,"upgrade");markDirty();renderAll();openBuilding(id);}

function equipItem(id){const item=state.inventory.find(i=>i.id===id);if(!item)return;const d=itemData(item);if(["pet","trinket"].includes(d.type))return openEquipPicker(id);const hero=state.heroes.find(h=>h.className===d.className);if(!hero)return toast("⚠️","No matching hero");equipItemToHero(id,hero.id);}
function openEquipPicker(itemId){const item=state.inventory.find(i=>i.id===itemId);if(!item)return;const d=itemData(item),slot=d.type;openDrawer(`Equip ${d.name}`,`${slot[0].toUpperCase()+slot.slice(1)} · Any hero`, `<div class="loot-summary"><span>${itemImage(d,"loot-summary-art")}</span><div><strong>${escapeHTML(d.name)}</strong><p>${escapeHTML(d.effectText||d.element||"Choose who will carry this item.")}</p></div></div><div class="drawer-section"><h3>Choose a hero</h3><div class="action-list">${state.heroes.map(h=>{const current=h.equipment[slot]?itemData(h.equipment[slot]):null,busy=h.assignment==="combat";return `<button data-action="equip-to-hero" data-item="${itemId}" data-hero="${h.id}" ${busy?"disabled":""}><span class="inline-hero">${heroImage(h)} ${escapeHTML(h.name)}</span><small>${busy?"Recall from combat first":current?`Replace ${escapeHTML(current.name)}`:`Empty ${slot} slot`}</small></button>`}).join("")}</div></div><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Cancel</button></div>`);}
function equipItemToHero(itemId,heroId){const idx=state.inventory.findIndex(i=>i.id===itemId),hero=heroById(heroId);if(idx<0||!hero)return;if(hero.assignment==="combat")return toast("⚔️","Recall this hero before changing equipment");const item=state.inventory[idx],d=itemData(item),slot=d.type;if(!["weapon","armor","pet","trinket"].includes(slot))return toast("⚠️","That item cannot be equipped");if(d.className&&hero.className!==d.className)return toast("⚠️",`${d.name} is for the ${d.className}`);if(hero.level<(d.requiredLevel||1))return toast("🔒",`${hero.name} needs Combat Level ${d.requiredLevel}`);if(hero.equipment[slot])state.inventory.push({...hero.equipment[slot],id:uid()});hero.equipment[slot]={...item};state.inventory.splice(idx,1);hero.hp=Math.min(hero.hp??heroMaxHP(hero),heroMaxHP(hero));notify("Equipment changed",`${hero.name} equipped ${d.name}.`,d.icon);markDirty();renderAll();closeDrawer();}
function hatchEgg(itemId){const idx=state.inventory.findIndex(i=>i.id===itemId),egg=state.inventory[idx];if(idx<0||!egg)return;const d=itemData(egg),pet=ITEMS[d.hatchesTo];if(d.type!=="egg"||!pet)return toast("🥚","This egg cannot hatch");state.inventory.splice(idx,1);state.inventory.push({id:uid(),key:d.hatchesTo,acquiredAt:Date.now()});notify("The egg hatched!",`${pet.name} is ready to assist one of your heroes.`,pet.icon);markDirty();renderAll();}
function renameHero(heroId){const h=heroById(heroId),input=$("#heroNameInput");if(!h||!input)return;const name=input.value.trim().replace(/\s+/g," ");if(!name)return toast("✏️","A hero needs a name");if(name.length>24)return toast("✏️","Keep hero names to 24 characters");h.name=name;notify("A new name",`${h.className} is now known as ${name}.`,h.icon);markDirty();renderAll();openHero(heroId);}
function repairItem(id){const i=state.inventory.find(x=>x.id===id);if(!i)return;const d=itemData(i),needed=Math.ceil((100-(i.durability??100))/20);if(!needed)return toast("🧰","Item is already fully repaired");if(state.resources.repairKits<needed)return toast("🧰","Not enough Repair Kits");const essence=d.special?Math.ceil(needed/2):0;if(state.resources.essence<essence)return toast("✨","Special gear also needs Essence");state.resources.repairKits-=needed;state.resources.essence-=essence;i.durability=100;notify("Equipment repaired",`${d.name} is restored to full durability.`,"🧰");markDirty();renderAll();}
function salvageItem(id){const idx=state.inventory.findIndex(x=>x.id===id),i=state.inventory[idx];if(!i)return;const d=itemData(i);if(!d.salvage)return;state.resources.essence+=d.salvage;state.inventory.splice(idx,1);notify("Item salvaged",`${d.name} became ${d.salvage} Essence.`,"✨");markDirty();renderAll();}

async function initializeFirebase(){
  try{firebaseApi=await import("./firebase-config.js");firebaseApi.watchAuth(async user=>{
    currentUser=user;renderSyncUser();
    if(user){
      setSync("saving");const cloud=await firebaseApi.loadGame(user.uid);
      if(cloud?.updatedAt>state.updatedAt){const restoredAt=Date.now();state=migrate(cloud);const away=Math.min(OFFLINE_LIMIT,Math.max(0,(restoredAt-(state.lastTick||restoredAt))/1000)),report=simulate(away,true);postOfflineProgressChat(report);lastSimulationAt=restoredAt;state.lastTick=restoredAt;saveLocal();notify("Cloud town restored","Your latest Firebase save and its idle progress are now on this device.","☁️");showOffline(report);}
      await claimPayouts();subscribeOnline();scheduleCloudSave();if($("#authDialog").open)$("#authDialog").close();
    }else{setSync("device");unsubscribeOnline();}
    renderAll();
  });}
  catch(err){console.warn("Firebase unavailable",err);setSync("error");}
}
function subscribeOnline(){unsubscribeOnline();cloudUnsubscribe=firebaseApi.watchMarket(list=>{marketListings=list;renderMarket();});firebaseApi.loadLeaderboard().then(x=>{leaderboard=x;renderProgress();}).catch(console.warn);}
function unsubscribeOnline(){if(cloudUnsubscribe){cloudUnsubscribe();cloudUnsubscribe=null;}marketListings=[];leaderboard=[];}
async function claimPayouts(){if(!currentUser||!firebaseApi)return;try{const payouts=await firebaseApi.claimPayouts(currentUser.uid);if(payouts.total>0){state.resources.gold+=payouts.total;state.stats.marketSales+=payouts.count;notify("Marketplace payout",`${fmt(payouts.total)} Gold was delivered from ${payouts.count} sale${payouts.count===1?"":"s"}.`,"🪙");}}catch(err){console.warn(err);}}

async function createListing(itemId,price){if(!currentUser||!firebaseApi)return toast("☁️","Sign in to create a listing");const idx=state.inventory.findIndex(i=>i.id===itemId),i=state.inventory[idx];if(!i)return;const d=itemData(i);if(d.soulbound)return toast("🔒","Pets and trinkets cannot be traded");try{await firebaseApi.createMarketListing({sellerId:currentUser.uid,sellerName:currentUser.displayName||currentUser.email?.split("@")[0]||"Adventurer",itemKey:i.key,itemData:{durability:i.durability??100},itemName:d.name,icon:d.icon,quantity:1,price:Number(price)});state.inventory.splice(idx,1);notify("Listing created",`${d.name} is listed for ${fmt(price)} Gold.`,"⚖️");markDirty();renderAll();}catch(err){toast("⚠️","Listing failed",friendlyError(err));}}
async function buyListing(id){if(!currentUser||!firebaseApi)return toast("☁️","Sign in to buy from players");const l=marketListings.find(x=>x.id===id);if(!l)return;if(ITEMS[l.itemKey]?.soulbound)return toast("🔒","That account-bound item cannot be traded");if(state.resources.gold<l.price)return toast("🪙","Not enough Gold");if(occupiedSlots()>=warehouseCapacity())return toast("📦","Warehouse is full");try{await firebaseApi.buyMarketListing(l,currentUser.uid,currentUser.displayName||"Adventurer");state.resources.gold-=l.price;state.inventory.push({id:uid(),key:l.itemKey,durability:l.itemData?.durability??100,acquiredAt:Date.now()});notify("Marketplace purchase",`${l.itemName} arrived in your Warehouse.`,"📦");markDirty();renderAll();}catch(err){toast("⚠️","Purchase failed",friendlyError(err));}}
async function cancelListing(id){if(!currentUser||!firebaseApi)return;const l=marketListings.find(x=>x.id===id);if(!l)return;try{await firebaseApi.cancelMarketListing(l);if(occupiedSlots()<warehouseCapacity())state.inventory.push({id:uid(),key:l.itemKey,durability:l.itemData?.durability??100,acquiredAt:Date.now()});notify("Listing cancelled",`${l.itemName} returned to the Warehouse.`,"📦");markDirty();renderAll();}catch(err){toast("⚠️","Could not cancel listing",friendlyError(err));}}

function openSell(itemId=null){if(!currentUser)return $("#authDialog").showModal();const available=state.inventory.filter(i=>!itemData(i).soulbound);if(!available.length)return toast("📦","No tradeable equipment available to list");const selected=available.find(i=>i.id===itemId)||available[0];openDrawer("Create a Listing","Player Marketplace",`<div class="drawer-section"><label>Equipment<select id="sellItemChoice">${available.map(i=>{const d=itemData(i);return `<option value="${i.id}" ${i.id===selected.id?"selected":""}>${escapeHTML(d.name)} · ${d.tier}</option>`}).join("")}</select></label><label>Price in Gold<input id="sellPrice" type="number" min="1" max="99999999" value="${itemData(selected).value||500}"></label><div class="notice">The item leaves your Warehouse while listed. Pets, eggs, and trinkets are account-bound and never appear here.</div></div><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Cancel</button><button class="primary-button" data-action="confirm-listing">List item</button></div>`);}

function formatDuration(seconds){const total=Math.max(0,Math.floor(seconds||0)),d=Math.floor(total/86400),h=Math.floor(total%86400/3600),m=Math.floor(total%3600/60),s=total%60;return d?`${d}d ${h}h`:h?`${h}h ${m}m`:m?`${m}m ${s}s`:`${s}s`;}
function friendlyError(err){return String(err?.message||err||"Unknown error").replace(/^Firebase:\s*/i,"").slice(0,150);}
function exportSave(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`adventure-town-save-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);}
function confirmAction(title,text,icon="⚠️"){return new Promise(resolve=>{const d=$("#confirmDialog");$("#confirmTitle").textContent=title;$("#confirmText").textContent=text;$("#confirmIcon").textContent=icon;d.showModal();d.addEventListener("close",()=>resolve(d.returnValue==="confirm"),{once:true});});}

document.addEventListener("error",event=>{
  const image=event.target;if(!(image instanceof HTMLImageElement)||!image.dataset.artFallback)return;
  const fallback=document.createElement("span");fallback.className=`${image.className} art-fallback`;fallback.textContent=image.dataset.artFallback;fallback.setAttribute("aria-hidden",image.getAttribute("aria-hidden")||"false");if(image.alt)fallback.setAttribute("aria-label",image.alt);image.replaceWith(fallback);
},true);

document.addEventListener("change",event=>{const select=event.target.closest("[data-work-tier]");if(select)setWorkTier(select.dataset.hero,select.dataset.assignment,select.value);});

document.addEventListener("click",async event=>{
  const b=event.target.closest("[data-action]");if(!b)return;const a=b.dataset.action;if(settings.soundEnabled){const ctx=ensureAudio();ctx?.resume?.();if(!["toggle-sound","trade-stock"].includes(a))setTimeout(()=>playSound("ui"),0);}
  if(a==="open-view"){closeDrawer();openView(b.dataset.view);}
  else if(a==="toggle-map-size")$("#townMapFrame").classList.toggle("expanded");
  else if(a==="open-hero")openHero(b.dataset.hero);
  else if(a==="quick-assign"){openView("assign");}
  else if(a==="open-building")openBuilding(b.dataset.building);
  else if(a==="open-combat")openCombat(b.dataset.combat);
  else if(a==="open-combat-category")openCombatCategory(b.dataset.category);
  else if(a==="open-loot")openLoot(b.dataset.combat);
  else if(a==="close-drawer")closeDrawer();
  else if(a==="open-party-chat")openPartyChat();
  else if(a==="toggle-sound")toggleSound();
  else if(a==="trade-stock")tradeStock(b.dataset.stock,b.dataset.trade,b.dataset.quantity);
  else if(a==="hero-league-metric"){heroLeagueMetric=b.dataset.metric;renderHeroLeague();}
  else if(a==="open-battle-stats")openBattleStats(b.dataset.run);
  else if(a==="open-notifications")openNotifications();
  else if(a==="account")openAccount();
  else if(a==="open-auth"){closeDrawer();$("#authDialog").showModal();}
  else if(a==="assign")assignHero(b.dataset.hero,b.dataset.assignment);
  else if(a==="stop-run")stopRun(b.dataset.run);
  else if(a==="watch-run"){watchedRunId=b.dataset.run;renderCombatLive(true);$("#combatBattlefield")?.scrollIntoView({behavior:"smooth",block:"start"});}
  else if(a==="toggle-party"){const max=Number(b.dataset.max);if(!b.classList.contains("selected")&&$$("#partyChoices .selected").length>=max)return toast("⚠️",`This activity allows ${max} heroes`);b.classList.toggle("selected");updateCombatPreview(b.dataset.combat);}
  else if(a==="start-run")startRun(b.dataset.combat,$$("#partyChoices .selected").map(x=>x.dataset.hero),$("#autoRepeatChoice").checked);
  else if(a==="upgrade-building")upgradeBuilding(b.dataset.building);
  else if(a==="craft-item")craftItem(b.dataset.key);
  else if(a==="warehouse-filter"){warehouseFilter=b.dataset.filter;renderWarehouse();}
  else if(a==="equip-item")equipItem(b.dataset.item);
  else if(a==="equip-to-hero")equipItemToHero(b.dataset.item,b.dataset.hero);
  else if(a==="hatch-egg")hatchEgg(b.dataset.item);
  else if(a==="rename-hero")renameHero(b.dataset.hero);
  else if(a==="toggle-hero-rename"){const form=$("#heroRenameForm");if(form){form.hidden=!form.hidden;if(!form.hidden){const input=$("#heroNameInput");input?.focus();input?.select();}}}
  else if(a==="repair-item")repairItem(b.dataset.item);
  else if(a==="salvage-item" && await confirmAction("Salvage this item?","The equipment will be permanently converted into its regional Essence.","❄️"))salvageItem(b.dataset.item);
  else if(a==="sell-item")openSell(b.dataset.item);
  else if(a==="open-sell")openSell();
  else if(a==="confirm-listing")createListing($("#sellItemChoice").value,$("#sellPrice").value);
  else if(a==="buy-listing")buyListing(b.dataset.listing);
  else if(a==="cancel-listing")cancelListing(b.dataset.listing);
  else if(a==="clear-reports"){state.notifications=[];markDirty();closeDrawer();renderTown();}
  else if(a==="sync"){saveLocal();if(currentUser&&firebaseApi)scheduleCloudSave();toast("☁️","Save requested");}
  else if(a==="export-save")exportSave();
  else if(a==="google-signin"){try{$("#authError").textContent="";await firebaseApi?.googleSignIn();}catch(err){$("#authError").textContent=friendlyError(err);}}
  else if(a==="email-signin"){try{$("#authError").textContent="";await firebaseApi?.emailSignIn($("#authEmail").value,$("#authPassword").value);}catch(err){$("#authError").textContent=friendlyError(err);}}
  else if(a==="email-register"){try{$("#authError").textContent="";await firebaseApi?.emailRegister($("#authEmail").value,$("#authPassword").value);}catch(err){$("#authError").textContent=friendlyError(err);}}
  else if(a==="device-play"){settings.authDismissed=true;localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));$("#authDialog").close();}
  else if(a==="sign-out"){await firebaseApi?.signOutUser();closeDrawer();toast("👋","Signed out","Your device save is still available.");}
  else if(a==="reset-game" && await confirmAction("Begin a new town?","This replaces the current town on this device and, after syncing, in the cloud.","🏰")){state=freshState();saveLocal();closeDrawer();renderAll();}
});

function showOffline(report){
  if(!report||report.seconds<60)return;const line=(label,value,kind="")=>`<div class="offline-line ${kind}"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div>`,section=title=>`<h3 class="offline-section-title">${escapeHTML(title)}</h3>`;let html=line("Time away",formatDuration(report.seconds),"time");
  html+=section("Combat activity");
  if(report.combatRuns?.length){for(const run of report.combatRuns){const clearText=`${fmt(run.clears)} clear${run.clears===1?"":"s"}`,killText=`${fmt(run.kills)} enem${run.kills===1?"y":"ies"}`;html+=line(`⚔️ ${run.name}`,`${clearText} · ${killText} · ${run.status}`,"status");}for(const hero of report.combatHeroes||[]){const levelText=hero.levelAfter>hero.levelBefore?` · Level ${hero.levelAfter}`:"";html+=line(`⭐ ${hero.name}`,`+${fmt(hero.xp)} Combat XP${levelText}`,"xp");}}
  else html+=line("⚔️ Combat","No active combat run was saved","status muted");
  const rewards=[...(report.tierChanges||[]).map(change=>[`${change.icon} ${change.name}`,change.quantity]),["🪙 Gold earned",report.goldEarned],["✨ Essence",report.essence],["🗝️ Raid Keys",report.keys],["🧰 Repair Kits",report.kits],["📦 Items",report.items]].filter(([,value])=>Math.abs(Number(value)||0)>.01);html+=section("Rewards & production");html+=rewards.length?rewards.map(([label,value])=>line(label,`${value>=0?"+":""}${fmt(value)}`)).join(""):`<div class="offline-note">No completed chest rewards or production actions during this window.</div>`;
  $("#offlineReport").innerHTML=html;const dialog=$("#offlineDialog");if(!dialog.open)dialog.showModal();
}

async function init(){
  const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");state=migrate(raw);const now=Date.now(),elapsed=Math.min(OFFLINE_LIMIT,Math.max(0,(now-(state.lastTick||now))/1000));const report=simulate(elapsed,true);postOfflineProgressChat(report);lastSimulationAt=now;state.lastTick=now;saveLocal();
  initializeFirebase();
  if("serviceWorker" in navigator){try{await navigator.serviceWorker.register("./service-worker.js");await navigator.serviceWorker.ready;}catch{}}
  const failedAssets=await preloadAssets();renderAll();
  $("#loadingText").textContent=failedAssets.length?"The town is ready. Missing artwork will retry when needed.":"The town is ready.";setTimeout(()=>{$("#loadingScreen").classList.add("fade");$("#app").hidden=false;setTimeout(()=>$("#loadingScreen").remove(),500);if(!settings.authDismissed)setTimeout(()=>$("#authDialog").showModal(),450);showOffline(report);},250);
  setInterval(()=>{if(document.visibilityState==="hidden")return;const now=Date.now();settleToNow(true);if(currentView==="combat")renderCombatLive();if(now-lastSlowRender>=1000){lastSlowRender=now;renderResources();renderTown();if(currentView==="warehouse")renderWarehouse();refreshWorkTimers();refreshTavernMarket();refreshBattleStats();markDirty();}},100);
}

function persistLifecycle(){if(!state)return;settleToNow(false);saveLocal();}
function resumeLifecycle(){if(!state)return;const report=settleToNow(false);renderAll();showOffline(report);}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")persistLifecycle();else resumeLifecycle();});
document.addEventListener("freeze",persistLifecycle);
document.addEventListener("resume",resumeLifecycle);
window.addEventListener("pagehide",persistLifecycle);
window.addEventListener("beforeunload",persistLifecycle);
window.addEventListener("pageshow",event=>{if(event.persisted)resumeLifecycle();});

init();
