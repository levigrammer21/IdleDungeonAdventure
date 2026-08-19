const VERSION = "1.5.4";
const SAVE_KEY = "adventure-town-save-v1";
const SETTINGS_KEY = "adventure-town-settings-v1";
const OFFLINE_LIMIT = 12 * 60 * 60;

const HEROES = [
  { id:"warrior", name:"Bram", className:"Warrior", icon:"🛡️", portrait:"img/hero-warrior-bram.webp", weapon:"Sword", armor:"Warrior Armor", color:"#a94d3f" },
  { id:"wizard", name:"Elowen", className:"Wizard", icon:"🧙", portrait:"img/hero-wizard-elowen.webp", weapon:"Wand", armor:"Wizard Robes", color:"#5a68a9" },
  { id:"archer", name:"Rowan", className:"Archer", icon:"🏹", portrait:"img/hero-archer-rowan.webp", weapon:"Bow", armor:"Archer Armor", color:"#4e8a52" },
  { id:"druid", name:"Mira", className:"Druid", icon:"🌿", portrait:"img/hero-druid-mira.webp", weapon:"Staff", armor:"Druid Garb", color:"#628c6a" },
  { id:"assassin", name:"Vex", className:"Assassin", icon:"🗡️", portrait:"img/hero-assassin-vex.webp", weapon:"Daggers", armor:"Assassin Armor", color:"#755b86" },
  { id:"summoner", name:"Orin", className:"Summoner", icon:"📖", portrait:"img/hero-summoner-orin.webp", weapon:"Tome", armor:"Summoner Robes", color:"#a36f42" },
];

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
  Warrior:{speed:2.55,crit:.05,style:"melee",verb:"cleaves"},
  Wizard:{speed:2.85,crit:.07,style:"magic",verb:"blasts"},
  Archer:{speed:2.25,crit:.11,style:"ranged",verb:"shoots"},
  Druid:{speed:2.75,crit:.06,style:"nature",verb:"strikes"},
  Assassin:{speed:1.65,crit:.15,style:"shadow",verb:"slashes"},
  Summoner:{speed:2.65,crit:.06,style:"summon",verb:"commands"},
};
const enemyAssetPath=name=>`img/enemy-${name.toLowerCase().replace(/^the\s+/,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}.webp`;
const combatRoom=(name,icon,hp=1,attack=1,defense=1,speed=2.7,boss=false)=>({type:"combat",name,icon,image:enemyAssetPath(name),hp,attack,defense,speed,boss});
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
    ITEMS[`${set.prefix}_${c.key}_weapon`]={name:weaponName,type:"weapon",className:c.className,icon:c.weaponIcon,image:set.prefix==="thornroot"&&c.key==="warrior"?"img/item-thornroot-warrior-weapon.webp":undefined,tier:set.tier,attack:set.attack,element:set.weaponEffect,requiredLevel:set.level,value:set.value,salvage:set.salvage,special:true,raid:!!set.raid,source:set.name};
    ITEMS[`${set.prefix}_${c.key}_armor`]={name:armorName,type:"armor",className:c.className,icon:c.armorIcon,tier:set.tier,defense:set.defense,element:set.armorEffect,requiredLevel:set.level,value:set.value,salvage:set.salvage,special:true,raid:!!set.raid,source:set.name};
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
const SKILL_PETS={farm:"cowPet",mine:"molePet",forest:"beaverPet",smith:"forgeSpritePet"};
const SKILL_PET_CHANCE=1/250000;
const HERO_RECORD_DEFAULTS={kills:0,expeditions:0,dungeons:0,raids:0,raidBosses:0,dungeonBosses:0,goldEarned:0,beers:0,defeats:0,itemsFound:0,foodGathered:0,metalMined:0,woodGathered:0,kitsForged:0,workActions:0,secondsActive:0};

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
const combatXPProgress = h => {const required=combatXPForLevel(h.level),current=h.level>=100?0:clamp(Number(h.xp)||0,0,required),percent=h.level>=100?100:required?current/required*100:0;return {current,required,percent,remaining:Math.max(0,required-current)};};
const SWORD_TIER_IMAGES=Object.fromEntries(["starter","weak","average","good","great","epic","legendary","divine"].map(tier=>[tier,`img/item-sword-${tier}.webp`]));
const assetImage = (src,alt,className,fallback="✦",decorative=false) => `<img class="${className}" src="${escapeHTML(src)}" alt="${decorative?"":escapeHTML(alt)}" ${decorative?'aria-hidden="true" ':""}draggable="false" data-art-fallback="${escapeHTML(fallback)}">`;
const heroImage = (h,className="hero-image") => assetImage(h.portrait,h.name,className,h.icon,true);
const itemImagePath = item => item?.image||(item?.type==="weapon"&&item?.className==="Warrior"?SWORD_TIER_IMAGES[String(item.tier||"").toLowerCase()]:null);
const itemImage = (item,className="item-art") => itemImagePath(item)?assetImage(itemImagePath(item),item.name,className,item.icon):item?.icon||"✦";
const roomImage = (room,className="room-art") => room?.type==="combat"&&room.image?assetImage(room.image,room.name,className,room.icon):room?.icon||"✦";

function assetCatalog(){
  return [...new Set([
    "img/icon.svg","img/fantasy-town-map.webp","img/loot-chest.svg","img/item-thornroot-warrior-weapon.webp",
    ...Object.values(SWORD_TIER_IMAGES),...HEROES.map(h=>h.portrait),...Object.values(COMBAT_LAYOUTS).flatMap(rooms=>rooms.filter(room=>room.type==="combat").map(room=>room.image)),...Object.values(ITEMS).map(item=>item.image).filter(Boolean),
  ])];
}

async function preloadAssets(){
  const assets=assetCatalog(),bar=$("#loadingProgress"),track=$(".loading-track"),count=$("#loadingCount"),failed=[];let complete=0;
  const update=()=>{const pct=assets.length?Math.round(complete/assets.length*100):100;if(bar)bar.style.width=`${pct}%`;if(track){track.setAttribute("aria-valuenow",String(complete));track.setAttribute("aria-valuemax",String(assets.length));}if(count)count.textContent=`${complete} / ${assets.length} assets`;};
  $("#loadingText").textContent="Preparing the town artwork…";update();
  await Promise.all(assets.map(src=>new Promise(resolve=>{const image=new Image();let settled=false;const timeout=setTimeout(()=>finish(false),10000),finish=ok=>{if(settled)return;settled=true;clearTimeout(timeout);if(!ok)failed.push(src);complete++;update();resolve();};image.onload=()=>finish(true);image.onerror=()=>finish(false);image.src=src;})));
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
  return {id,combatId,heroIds:[...heroIds],autoRepeat,startedAt:Date.now(),cycle:1,roomIndex:0,roomState:null,heroTimers:{},enemyTimer:0,enemy:null,elapsed:0,cycleElapsed:0,kills:0,cycles:0,foodEaten:0,damageDealt:0,damageTaken:0,recentEvents:[],lastReward:"No chest opened yet"};
}

function migrateCombatRun(saved,combatId,heroIds,heroes){
  const base=createCombatRunState(combatId,heroIds,saved.autoRepeat!==false,saved.id||uid()),cfg=COMBAT[combatId],layout=COMBAT_LAYOUTS[combatId]||[],roomIndex=clamp(Math.floor(Number(saved.roomIndex)||0),0,Math.max(0,layout.length-1)),room=layout[roomIndex];
  const nonnegative=(value,fallback=0)=>Math.max(0,Number.isFinite(Number(value))?Number(value):fallback);
  const run={...base,...saved,id:base.id,combatId,heroIds:[...heroIds],autoRepeat:saved.autoRepeat!==false,startedAt:nonnegative(saved.startedAt,base.startedAt),cycle:Math.max(1,Math.floor(nonnegative(saved.cycle,1))),roomIndex,heroTimers:{},enemyTimer:nonnegative(saved.enemyTimer),enemy:null,roomState:null,elapsed:nonnegative(saved.elapsed),cycleElapsed:nonnegative(saved.cycleElapsed),kills:Math.floor(nonnegative(saved.kills)),cycles:Math.floor(nonnegative(saved.cycles)),foodEaten:Math.floor(nonnegative(saved.foodEaten)),damageDealt:nonnegative(saved.damageDealt),damageTaken:nonnegative(saved.damageTaken),recentEvents:Array.isArray(saved.recentEvents)?saved.recentEvents.slice(-30):[],lastReward:String(saved.lastReward||base.lastReward)};
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
    heroes:HEROES.map((h,i)=>({ ...h, level:1,xp:0,sanity:100,hp:100,assignment:"idle", recoveryUntil:0,workProgress:0,workTiers:{farm:"starter",mine:"starter",forest:"starter"},records:{...HERO_RECORD_DEFAULTS},
      skills:{farming:{level:1,xp:0},mining:{level:1,xp:0},woodcutting:{level:1,xp:0},smithing:{level:1,xp:0}},
      equipment:{weapon:{key:["rustySword","apprenticeWand","huntingBow","oakStaff","wornDaggers","noviceTome"][i],durability:100},armor:null,pet:null,trinket:null}
    })),
    inventory:[], combatRuns:[], notifications:[{id:uid(),time:Date.now(),title:"The town awakens",text:"Your six adventurers are ready. Every choice of how they spend their time will shape Briarwatch."}],
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
  return merged;
}

function random(){
  let x=state.randomSeed|0; x^=x<<13; x^=x>>>17; x^=x<<5; state.randomSeed=x|0; return (x>>>0)/4294967296;
}

function addXP(target,amount,max=100){
  const oldLevel=target.level,isCombat=target.hp!==undefined,requiredForLevel=isCombat?combatXPForLevel:xpForLevel;
  target.xp=(target.xp||0)+amount;
  while(target.level<max && target.xp>=requiredForLevel(target.level)){target.xp-=requiredForLevel(target.level);target.level++;}
  if(target.level>=max)target.xp=0;
  if(isCombat&&target.level>oldLevel)target.hp=Math.min((target.hp||0)+(target.level-oldLevel)*6,heroMaxHP(target));
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
function heroAttack(h){return 4+h.level*2+(activeEquipment(h,"weapon")?.attack||0)+equipmentEffect(h,"attack")+equipmentDamageBonus(h);}
function heroDefense(h){return 2+h.level+(activeEquipment(h,"armor")?.defense||0)+equipmentEffect(h,"defense");}
function heroMaxHP(h){return 100+(h.level-1)*6+equipmentEffect(h,"maxHP");}
function heroMaxHit(h){return Math.max(1,2+Math.floor(h.level/4)+(activeEquipment(h,"weapon")?.attack||0)+equipmentEffect(h,"attack"));}
function heroAttackSpeed(h){return CLASS_COMBAT[h.className]?.speed||2.6;}
function heroCritChance(h){const text=heroSpecials(h).join(" "),match=text.match(/\+(\d+)%\s+Crit/i);return clamp((CLASS_COMBAT[h.className]?.crit||.05)+(match?Number(match[1])/100:0),0,.65);}
function heroDamageType(h){const text=heroSpecials(h).join(" ").toLowerCase();if(text.includes("poison")||equipmentEffect(h,"poisonDamage"))return "poison";if(text.includes("fire")||text.includes("burn"))return "fire";if(text.includes("frost")||text.includes("cold"))return "frost";if(text.includes("lightning")||text.includes("thunder"))return "lightning";if(text.includes("shadow")||text.includes("void")||text.includes("eclipse"))return "shadow";if(text.includes("nature")||text.includes("tide"))return "nature";return CLASS_COMBAT[h.className]?.style||"physical";}
function heroPower(h){
  const weapon=activeEquipment(h,"weapon")||{attack:0},armor=activeEquipment(h,"armor")||{defense:0};
  return 8+h.level*4+(weapon.attack||0)*3+(armor.defense||0)*1.7+equipmentEffect(h,"combatStrength")+equipmentEffect(h,"attack")*2.5+equipmentEffect(h,"defense")*1.5+equipmentEffect(h,"maxHP")*.1+equipmentDamageBonus(h)*3;
}
function partyPower(party){return party.reduce((total,h)=>total+heroPower(h),0);}
function estimatedPartyDPS(party,cfg){if(!party.length)return 0;const preview=createEnemy(cfg,COMBAT_LAYOUTS[cfg.id].find(r=>r.type==="combat"));return party.reduce((total,h)=>{const hit=clamp(.25+(heroAttack(h)/(heroAttack(h)+preview.defense))*.7,.25,.98),average=heroMaxHit(h)*.5*(1+heroCritChance(h)*.6)+equipmentDamageBonus(h);return total+hit*average/heroAttackSpeed(h);},0);}
function heroSpecials(h){return ["weapon","armor","pet","trinket"].map(slot=>activeEquipment(h,slot)).filter(Boolean).flatMap(d=>[d.element,d.effectText].filter(Boolean));}
function workActionTime(h,assignment,tier=null){const skillKey=BUILDINGS[assignment]?.skill,skill=h.skills[skillKey]?.level||1,building=state.buildings[assignment]||1,base=assignment==="smith"?15:TIER_ACTION_SECONDS[tier?.id||"starter"];return base/(1+(skill-1)*.01+(building-1)*.08);}
function workActionStatus(h){if(!["farm","mine","forest","smith"].includes(h.assignment))return "";if(h.assignment==="smith"&&(resourceTierCount("metal",REPAIR_KIT_RECIPE.metalTier)<REPAIR_KIT_RECIPE.metalCost||resourceTierCount("wood",REPAIR_KIT_RECIPE.woodTier)<REPAIR_KIT_RECIPE.woodCost)){const metal=resourceTierData("metal",REPAIR_KIT_RECIPE.metalTier),wood=resourceTierData("wood",REPAIR_KIT_RECIPE.woodTier);return `Waiting for ${REPAIR_KIT_RECIPE.metalCost} ${metal.name} + ${REPAIR_KIT_RECIPE.woodCost} ${wood.name}`;}const tier=RESOURCE_ASSIGNMENTS[h.assignment]?resourceTierForHero(h,h.assignment):null,seconds=Math.max(0,workActionTime(h,h.assignment,tier)-(h.workProgress||0));return `${tier?`${tier.icon} ${tier.name}`:"🧰 Repair Kit"} in ${Math.max(1,Math.ceil(seconds))}s`;}

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
  const overflow=occupiedSlots()>warehouseCapacity();notify(overflow?"Find held in overflow":title,`${hero?`${hero.name} found `:""}${d.name}${overflow?". Make room in the Warehouse.":" was sent to the Warehouse."}`,overflow?"📦":d.icon);return item;
}
function rollSkillPet(assignment,h){const key=SKILL_PETS[assignment];if(key&&random()<SKILL_PET_CHANCE)awardInventoryItem(key,h,"Extremely rare skilling pet!");}

function simulate(seconds,offline=false){
  seconds=clamp(seconds,0,OFFLINE_LIMIT); if(seconds<.01)return null;
  const previousQuiet=quietSimulation; quietSimulation=offline;
  const before={...state.resources,items:state.inventory.length,runs:state.stats.expeditions+state.stats.dungeons+state.stats.raids,kills:state.heroes.reduce((n,h)=>n+(h.records.kills||0),0),levels:state.heroes.reduce((n,h)=>n+h.level,0)};
  const beforeTiers=Object.fromEntries(Object.entries(RESOURCE_TIERS).map(([resource,tiers])=>[resource,Object.fromEntries(tiers.map(tier=>[tier.id,state.resourceTiers[resource][tier.id]||0]))]));
  for(const h of state.heroes){
    if(h.assignment!=="idle")h.records.secondsActive+=seconds;
    if(h.assignment==="inn" && h.recoveryUntil && Date.now()>=h.recoveryUntil){h.hp=heroMaxHP(h);sendToTavern(h);h.recoveryUntil=0;notify("Back on their feet",`${h.name} left the Inn and is restoring Sanity at the Tavern.`,"🛏️");}
    if(h.assignment==="tavern"){
      const rate=(1.2+state.buildings.tavern*.35)*seconds; const needed=100-h.sanity; const restored=Math.min(needed,rate);
      const cost=restored*.045; if(state.resources.gold>=cost){h.sanity+=restored;state.resources.gold-=cost;} if(h.sanity>=99.99){h.sanity=100;h.assignment="idle";}
    }
    if(["farm","mine","forest","smith"].includes(h.assignment)) processWork(h,seconds);
  }
  for(const run of [...state.combatRuns]) processRun(run,seconds,offline);
  checkAchievements(); if(offline)state.stats.offlineSeconds+=seconds;
  const tierChanges=Object.entries(RESOURCE_TIERS).flatMap(([resource,tiers])=>tiers.map(tier=>({resource,name:tier.name,icon:tier.icon,quantity:(state.resourceTiers[resource][tier.id]||0)-beforeTiers[resource][tier.id]}))).filter(change=>Math.abs(change.quantity)>.01);
  const after=state.resources; quietSimulation=previousQuiet; return {seconds,gold:after.gold-before.gold,tierChanges,essence:after.essence-before.essence,keys:after.keys-before.keys,kits:after.repairKits-before.repairKits,items:state.inventory.length-before.items,runs:state.stats.expeditions+state.stats.dungeons+state.stats.raids-before.runs,kills:state.heroes.reduce((n,h)=>n+(h.records.kills||0),0)-before.kills,combatLevels:state.heroes.reduce((n,h)=>n+h.level,0)-before.levels};
}

function settleToNow(showReport=true){
  if(!state)return null;const now=Date.now(),seconds=Math.min(OFFLINE_LIMIT,Math.max(0,(now-lastSimulationAt)/1000));lastSimulationAt=now;if(seconds<.01)return null;
  const catchUp=seconds>5,report=simulate(seconds,catchUp);state.lastTick=now;
  if(catchUp){saveLocal();renderAll();if(showReport)showOffline(report);}
  return report;
}

function processWork(h,seconds){
  const map={farm:["food","farming"],mine:["metal","mining"],forest:["wood","woodcutting"]};
  if(map[h.assignment]){
    const [resource,skill]=map[h.assignment];h.workProgress=(h.workProgress||0)+seconds;let loops=0;
    while(loops++<50000){
      const tier=resourceTierForHero(h,h.assignment),actionTime=workActionTime(h,h.assignment,tier);if(h.workProgress+1e-8<actionTime)break;h.workProgress-=actionTime;
      const doubleKey=resource==="food"?"foodDoubleChance":resource==="metal"?"metalDoubleChance":"woodDoubleChance",units=random()<equipmentEffect(h,doubleKey)?2:1;
      addTieredResource(resource,tier.id,units);addXP(h.skills[skill],5*Math.sqrt(tier.rank));h.records.workActions++;h.records[resource==="food"?"foodGathered":resource==="metal"?"metalMined":"woodGathered"]+=units;rollSkillPet(h.assignment,h);
    }
  }else if(h.assignment==="smith"){
    const skill=h.skills.smithing;h.workProgress=(h.workProgress||0)+seconds;let loops=0;
    while(loops++<50000){const actionTime=workActionTime(h,"smith");if(h.workProgress+1e-8<actionTime)break;if(resourceTierCount("metal",REPAIR_KIT_RECIPE.metalTier)<REPAIR_KIT_RECIPE.metalCost||resourceTierCount("wood",REPAIR_KIT_RECIPE.woodTier)<REPAIR_KIT_RECIPE.woodCost){h.workProgress=Math.min(h.workProgress,actionTime);break;}h.workProgress-=actionTime;spendSpecificResource("metal",REPAIR_KIT_RECIPE.metalTier,REPAIR_KIT_RECIPE.metalCost);spendSpecificResource("wood",REPAIR_KIT_RECIPE.woodTier,REPAIR_KIT_RECIPE.woodCost);const kits=random()<equipmentEffect(h,"smithDoubleChance")?2:1;state.resources.repairKits+=kits;addXP(skill,28);h.records.kitsForged+=kits;h.records.workActions++;rollSkillPet("smith",h);}
  }
}

function createEnemy(cfg,room){
  const level=cfg.minLevel,baseHP=cfg.category==="raid"?160+level*11:cfg.category==="dungeon"?50+level*5.5:18+level*3.5,baseAttack=5+level*1.7,baseDefense=4+level*1.2,baseMax=cfg.category==="raid"?6+level*.5:cfg.category==="dungeon"?4+level*.38:2+level*.28;
  const maxHP=Math.max(8,Math.round(baseHP*room.hp));return {name:room.name,icon:room.icon,image:room.image,boss:!!room.boss,hp:maxHP,maxHP,attack:Math.round(baseAttack*room.attack),defense:Math.round(baseDefense*room.defense),maxHit:Math.max(2,Math.round(baseMax*(room.boss?1.18:1))),speed:room.speed,attacks:0,status:{},room};
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
function applyEnemyDamage(run,amount,type,sourceId,offline=false){if(!run.enemy)return false;amount=Math.max(0,Math.floor(amount));run.enemy.hp=Math.max(0,run.enemy.hp-amount);run.damageDealt+=amount;pushCombatEvent(run,amount?`${heroById(sourceId)?.name||"The party"} deals ${amount} ${type} damage.`:`${heroById(sourceId)?.name||"The party"} misses.`,type,"enemy",amount,sourceId,offline);if(run.enemy.hp<=0){defeatEnemy(run,sourceId,offline);return true;}return false;}
function defeatEnemy(run,killerId,offline=false){
  const cfg=COMBAT[run.combatId],enemy=run.enemy,killer=heroById(killerId),party=run.heroIds.map(heroById).filter(Boolean),xp=cfg.xp/Math.max(1,combatRoomsFor(cfg).length),leveled=[];if(killer)killer.records.kills++;for(const h of party)if(addXP(h,xp)>0)leveled.push(h);if(leveled.length)notify("Combat level gained",`${leveled.map(h=>h.name).join(", ")} reached ${leveled.length===1?`Combat Level ${leveled[0].level}`:"new Combat Levels"}. Attack, Defence, and Max HP increased.`,"⭐");run.kills++;pushCombatEvent(run,`${enemy.name} defeated! ${fmt(xp)} XP to each survivor.`,enemy.boss?"boss":"kill","enemy",null,killerId,offline);advanceCombatRoom(run,cfg,offline);
}
function processEnemyStatuses(run,dt,offline=false){
  const enemy=run.enemy;if(!enemy)return false;for(const [type,status] of Object.entries(enemy.status||{})){status.remaining-=dt;status.timer-=dt;while(status.timer<=0&&status.remaining>0&&run.enemy){status.timer+=type==="fire"?1.5:2;if(applyEnemyDamage(run,status.damage,type,status.sourceId,offline))return true;}if(status.remaining<=0)delete enemy.status[type];}return false;
}
function healLowestHero(run,amount,source,offline=false){const party=run.heroIds.map(heroById).filter(h=>h&&(h.hp||0)>0),target=party.sort((a,b)=>(a.hp/heroMaxHP(a))-(b.hp/heroMaxHP(b)))[0];if(!target||target.hp>=heroMaxHP(target))return;const healed=Math.min(amount,heroMaxHP(target)-target.hp);target.hp+=healed;pushCombatEvent(run,`${source.name} restores ${healed} HP to ${target.name}.`,"heal",target.id,healed,source.id,offline);}
function performHeroAttack(run,h,offline=false){
  const enemy=run.enemy;if(!enemy||(h.hp||0)<=0)return;const maxHit=heroMaxHit(h),hitChance=clamp(.25+(heroAttack(h)/(heroAttack(h)+enemy.defense))*.7,.25,.98);let damage=random()<hitChance?Math.floor(random()*(maxHit+1)):0,crit=damage>0&&random()<heroCritChance(h),special="";
  if(crit)damage=Math.ceil(damage*1.6);if(h.className==="Warrior"&&damage&&random()<.12){damage+=Math.ceil(maxHit*.3);special=" crushing";}if(h.className==="Wizard"&&damage&&random()<.18){damage+=Math.ceil(maxHit*.4);special=" arcane";}
  if(applyEnemyDamage(run,damage,crit?"crit":CLASS_COMBAT[h.className]?.style||"physical",h.id,offline))return;
  if(damage&&h.className==="Summoner"&&random()<.22){const echo=Math.max(1,Math.ceil(damage*.5));if(applyEnemyDamage(run,echo,"summon",h.id,offline))return;special=" echoed";}
  const bonus=equipmentDamageBonus(h),type=heroDamageType(h);if(damage>0&&bonus>0&&run.enemy){if(type==="poison"||type==="fire"){run.enemy.status[type]={damage:Math.max(1,Math.ceil(bonus/2)),remaining:6,timer:1.5,sourceId:h.id};pushCombatEvent(run,`${h.name}'s weapon inflicts ${type}.`,type,"enemy",bonus,h.id,offline);}else if(applyEnemyDamage(run,bonus,type,h.id,offline))return;if(type==="frost"&&run.enemy)run.enemyTimer+=.45;}
  if(h.className==="Druid"&&random()<.16)healLowestHero(run,Math.max(2,Math.ceil(maxHit*.35)),h,offline);if(special)pushCombatEvent(run,`${h.name}'s${special} strike surges.`,"special","enemy",null,h.id,offline);
}
function defeatHero(run,h,offline=false){h.hp=0;h.assignment="inn";h.recoveryUntil=Date.now()+(1200/(1+state.buildings.inn*.2))*1000;h.records.defeats++;state.stats.defeats++;run.heroIds=run.heroIds.filter(id=>id!==h.id);delete run.heroTimers[h.id];pushCombatEvent(run,`${h.name} falls and is carried to the Inn.`,"defeat",h.id,0,null,offline);notify("Cart to the Inn",`${h.name} was defeated during ${COMBAT[run.combatId].short}.`,"🛒");if(!run.heroIds.length)stopRun(run.id,false,false);}
function performEnemyAttack(run,offline=false){
  const enemy=run.enemy,party=run.heroIds.map(heroById).filter(h=>h&&(h.hp||0)>0);if(!enemy||!party.length)return;enemy.attacks++;const targets=enemy.boss&&enemy.attacks%4===0?party:[party[Math.floor(random()*party.length)]];
  for(const h of targets){const hitChance=clamp(.22+(enemy.attack/(enemy.attack+heroDefense(h)*1.8))*.68,.18,.95),base=random()<hitChance?Math.floor(random()*(enemy.maxHit+1)):0,damage=targets.length>1?Math.ceil(base*.6):base;h.hp=Math.max(0,(h.hp??heroMaxHP(h))-damage);run.damageTaken+=damage;pushCombatEvent(run,damage?`${enemy.name} hits ${h.name} for ${damage}.`:`${enemy.name} misses ${h.name}.`,damage?"enemy":"miss",h.id,damage,"enemy",offline);if(h.hp<=0)defeatHero(run,h,offline);}
}
function consumeCombatFood(run,h,offline=false){
  if((h.hp||0)>heroMaxHP(h)*.45||state.resources.food<=0)return false;const deficit=heroMaxHP(h)-h.hp,bonus=equipmentEffect(h,"foodEfficiency")*4,available=RESOURCE_TIERS.food.filter(t=>(state.resourceTiers.food[t.id]||0)>0).map(t=>({...t,actualHeal:t.heal+bonus}));if(!available.length)return false;const tier=available.find(t=>t.actualHeal>=deficit)||available[available.length-1];state.resourceTiers.food[tier.id]--;recalculateTieredTotal("food");const healed=Math.min(deficit,tier.actualHeal);h.hp+=healed;run.foodEaten++;pushCombatEvent(run,`${h.name} eats ${tier.name} and heals ${healed} HP.`,"heal",h.id,healed,h.id,offline);return true;
}
function processSkillRoom(run,cfg,dt,offline=false){
  const room=COMBAT_LAYOUTS[cfg.id][run.roomIndex],s=run.roomState;s.remaining-=dt;if(s.remaining>0)return;const party=run.heroIds.map(heroById).filter(Boolean),leader=heroById(s.leaderId);for(const h of party){addXP(h.skills[room.skill],h.id===s.leaderId?room.baseSeconds*.45:room.baseSeconds*.16);h.records.workActions++;}if(leader)rollSkillPet({farming:"farm",mining:"mine",woodcutting:"forest",smithing:"smith"}[room.skill],leader);pushCombatEvent(run,`${room.name} cleared by ${leader?.name||"the party"} at effective ${Math.floor(s.effective)} ${room.skill}.`,"skill","room",null,s.leaderId,offline);advanceCombatRoom(run,cfg,offline);
}
function processCombatRoom(run,cfg,dt,offline=false){
  for(const id of [...run.heroIds]){const h=heroById(id);if(h)consumeCombatFood(run,h,offline);}if(processEnemyStatuses(run,dt,offline)||!run.enemy)return;
  for(const id of [...run.heroIds]){const h=heroById(id);if(!h||!run.enemy)continue;run.heroTimers[id]=(run.heroTimers[id]??heroAttackSpeed(h))-dt;let attacks=0;while(run.heroTimers[id]<=0&&run.enemy&&attacks++<3){run.heroTimers[id]+=heroAttackSpeed(h);performHeroAttack(run,h,offline);}}
  if(!run.enemy)return;run.enemyTimer-=dt;if(run.enemyTimer<=0){run.enemyTimer+=run.enemy.speed+(run.enemy.status.frost?.remaining?0.5:0);performEnemyAttack(run,offline);}
}
function processRun(run,seconds,offline=false){
  const cfg=COMBAT[run.combatId];if(!cfg){stopRun(run.id,false,false);return;}let remaining=seconds,steps=0;while(remaining>0&&state.combatRuns.includes(run)&&steps++<250000){const dt=Math.min(.25,remaining);remaining-=dt;run.elapsed+=dt;run.cycleElapsed+=dt;if(!run.roomState)enterCurrentRoom(run,cfg,offline);if(!state.combatRuns.includes(run)||!run.roomState)continue;if(run.roomState.type==="skill")processSkillRoom(run,cfg,dt,offline);else processCombatRoom(run,cfg,dt,offline);}
}

function completeCombatCycle(run,cfg,offline=false){
  const party=run.heroIds.map(heroById).filter(Boolean);if(!party.length){stopRun(run.id,false,false);return;}const gold=Math.floor(cfg.gold[0]+random()*(cfg.gold[1]-cfg.gold[0]+1));state.resources.gold+=gold;state.stats.goldEarned+=gold;run.cycles++;run.lastReward=`${fmt(gold)} Gold`;
  for(const h of party){h.sanity=clamp(h.sanity-(cfg.category==="raid"?28:cfg.category==="dungeon"?17:8),0,100);damageGear(h,cfg.category==="raid"?12:cfg.category==="dungeon"?7:3);h.records.goldEarned+=Math.floor(gold/party.length);if(cfg.category==="expedition")h.records.expeditions++;if(cfg.category==="dungeon"){h.records.dungeons++;h.records.dungeonBosses++;}if(cfg.category==="raid"){h.records.raids++;h.records.raidBosses++;}}
  if(cfg.category==="expedition"){state.stats.expeditions++;if(random()<(cfg.essenceChance||0))state.resources.essence+=1;}
  if(cfg.category==="dungeon"){state.stats.dungeons++;state.resources.essence+=Math.floor(cfg.essenceReward[0]+random()*(cfg.essenceReward[1]-cfg.essenceReward[0]+1));if(random()<(cfg.keyChance||0))state.resources.keys+=1;if(cfg.trinketPool?.length&&random()<(cfg.trinketChance||0))dropTrinket(cfg,party);}
  if(cfg.category==="raid"){state.stats.raids++;state.resources.essence+=Math.floor(cfg.essenceReward[0]+random()*(cfg.essenceReward[1]-cfg.essenceReward[0]+1));if(cfg.eggKey&&random()<(cfg.eggChance||0))dropEgg(cfg,party);}
  if(cfg.pool?.length&&random()<(cfg.itemChance||0))dropSpecial(cfg,party);pushCombatEvent(run,`${cfg.short} cleared in ${formatDuration(run.cycleElapsed)}. Chest: ${fmt(gold)} Gold.`,"loot","room",gold,null,offline);notify(`${cfg.short} completed`,`${party.map(h=>h.name).join(", ")} opened the chest for ${fmt(gold)} Gold.`,cfg.icon);
  for(const h of party.filter(x=>x.sanity<=0))sendToTavern(h);run.heroIds=run.heroIds.filter(id=>heroById(id)?.sanity>0);if(!run.heroIds.length){stopRun(run.id,false,false);return;}
  if(!run.autoRepeat){stopRun(run.id,false,false);return;}if(!canPayRunEntry(cfg)){stopRun(run.id,false,false);notify("Run paused",`${cfg.short} stopped because the next entry needs more ${cfg.keys?"Raid Keys or Essence":"Essence"}.`,"🎒");return;}payRunEntry(cfg);run.cycle++;run.roomIndex=0;run.roomState=null;run.enemy=null;run.cycleElapsed=0;
}

function dropSpecial(cfg,party=[]){const key=cfg.pool[Math.floor(random()*cfg.pool.length)],finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(key,finder,cfg.category==="raid"?"Raid rare table hit!":"Rare equipment!");}
function dropTrinket(cfg,party=[]){const key=cfg.trinketPool[Math.floor(random()*cfg.trinketPool.length)],finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(key,finder,"Dungeon trinket found!");}
function dropEgg(cfg,party=[]){const finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(cfg.eggKey,finder,"Boss egg! One-in-500 drop!");}

function damageGear(h,amount){for(const slot of ["weapon","armor"]){const item=h.equipment[slot];if(item)item.durability=clamp((item.durability??100)-amount,0,100);}}
function canPayRunEntry(cfg){return state.resources.essence>=(cfg.essence||0)&&state.resources.keys>=(cfg.keys||0);}
function payRunEntry(cfg){state.resources.essence-=cfg.essence||0;state.resources.keys-=cfg.keys||0;}

function startRun(combatId,heroIds,autoRepeat=true){
  const cfg=COMBAT[combatId];if(!cfg)return;heroIds=heroIds.filter(id=>{const h=heroById(id);return h&&h.assignment!=="combat"&&h.assignment!=="inn"&&h.sanity>0&&(h.hp||0)>0;});
  if(!heroIds.length)return toast("⚠️","Choose at least one available hero");
  const max=cfg.maxParty;if(heroIds.length>max)return toast("⚠️",`${cfg.short} allows up to ${max} heroes`);
  if(combatCount()+heroIds.length>4)return toast("⚠️","Only four heroes may fight at once");
  if(heroIds.some(id=>heroById(id).level<cfg.minLevel))return toast("🔒",`${cfg.name} requires Combat Level ${cfg.minLevel}`);
  if(!canPayRunEntry(cfg))return toast("🎒","Not enough entry supplies",`Need ${cfg.essence||0} Essence${cfg.keys?` and ${cfg.keys} Raid Key${cfg.keys===1?"":"s"}`:""}.`);
  const party=heroIds.map(heroById).filter(Boolean);payRunEntry(cfg);for(const id of heroIds)heroById(id).assignment="combat";const run=createCombatRunState(combatId,heroIds,autoRepeat);state.combatRuns.push(run);watchedRunId=run.id;enterCurrentRoom(run,cfg,false);notify(`${cfg.short} started`,`${party.map(h=>h.name).join(", ")} entered live combat. Higher max hits and faster attacks now shorten every clear.`,cfg.icon);markDirty();renderAll();closeDrawer();
}

function stopRun(id,announce=true,rerender=true){const run=state.combatRuns.find(r=>r.id===id);if(!run)return;for(const hid of run.heroIds){const h=heroById(hid);if(h?.assignment==="combat")h.assignment="idle";}state.combatRuns=state.combatRuns.filter(r=>r.id!==id);if(watchedRunId===id)watchedRunId=state.combatRuns[0]?.id||null;if(announce)notify("Party recalled","The adventurers are returning to town.","🏰");markDirty();if(rerender)renderAll();}

function assignHero(heroId,assignment){
  const h=heroById(heroId);if(!h||h.assignment==="inn")return toast("🛏️","Hero is still recovering");
  if(h.assignment==="combat"){const run=state.combatRuns.find(r=>r.heroIds.includes(heroId));if(run)stopRun(run.id,false);}
  h.workProgress=0;if(RESOURCE_ASSIGNMENTS[assignment]&&!h.workTiers?.[assignment]){h.workTiers={...(h.workTiers||{}),[assignment]:"starter"};}if(assignment==="tavern")sendToTavern(h);else h.assignment=assignment;if(assignment==="tavern" && h.sanity>=100)h.assignment="idle";checkAchievements();notify("Assignment changed",`${h.name} is now ${ASSIGNMENTS[h.assignment].name.toLowerCase()}.`,ASSIGNMENTS[h.assignment].icon);markDirty();renderAll();
}

function setWorkTier(heroId,assignment,tierId){
  const h=heroById(heroId);if(!h)return;const tier=unlockedResourceTiers(h,assignment).find(candidate=>candidate.id===tierId);if(!tier)return toast("🔒","That task is not unlocked");
  h.workTiers={...(h.workTiers||{}),[assignment]:tier.id};if(h.assignment===assignment)h.workProgress=0;notify("Work task changed",`${h.name} will produce ${tier.name} until you choose another task.`,tier.icon);markDirty();renderAssignments();renderTown();refreshWorkTimers();
}

function checkAchievements(){for(const a of ACHIEVEMENTS){if(!state.achievements.includes(a.id)&&a.test(state)){state.achievements.push(a.id);notify("Milestone unlocked",a.name,a.icon);}}}

function renderAll(){renderResources();renderTown();renderHeroes();renderAssignments();renderCombat();renderWarehouse();renderMarket();renderProgress();renderSyncUser();}
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
  const heroLayer=$("#heroLayer"),heroMap=state.heroes.map((h,i)=>{const [x,y]=mapPosition(h,i),recover=["inn","tavern"].includes(h.assignment),status=statusFor(h);return {signature:[h.id,h.name,h.assignment,status,x,y,h.color,h.portrait].join(":"),html:`<div class="map-hero ${h.assignment==="combat"?"fighting":""} ${recover?"recovering":""}" style="--x:${x};--y:${y};--hero-color:${h.color};--delay:-${i*.22}s"><button data-action="open-hero" data-hero="${h.id}" aria-label="${escapeHTML(h.name)}, ${escapeHTML(status)}">${heroImage(h)}</button><small>${escapeHTML(h.name)} · ${escapeHTML(status)}</small></div>`};}),mapSignature=heroMap.map(entry=>entry.signature).join("|");
  if(heroLayer.dataset.signature!==mapSignature){heroLayer.dataset.signature=mapSignature;heroLayer.innerHTML=heroMap.map(entry=>entry.html).join("");}
  const fighting=state.heroes.filter(h=>h.assignment==="combat");$("#activePartyCount").textContent=`${fighting.length} / 4 fighting`;$("#activePartyMini").innerHTML=fighting.length?fighting.map(h=>`<span title="${escapeHTML(h.name)}">${heroImage(h)}</span>`).join(""):`<span class="empty-mini">No active combat party</span>`;
  const work=state.heroes.filter(h=>["farm","mine","forest","smith"].includes(h.assignment));$("#townOutputText").textContent=work.length?`${work.length} heroes producing`:"No one working";
  const counts=["farm","mine","forest","smith"].map(a=>[a,state.heroes.filter(h=>h.assignment===a).length]);$("#townOutputMini").innerHTML=counts.filter(x=>x[1]).map(([a,n])=>`<div class="mini-bar"><span>${ASSIGNMENTS[a].icon} ${ASSIGNMENTS[a].name}</span><i style="--w:${n/6*100}%"></i><b>${n}</b></div>`).join("")||`<span class="empty-mini">Assign heroes to begin production.</span>`;
  const story=state.notifications[0];$("#latestStoryTitle").textContent=story?.title||"Quiet town";$("#latestStoryText").textContent=story?.text||"No town reports yet.";$("#notificationBadge").hidden=!state.notifications.length;$("#notificationBadge").textContent=Math.min(99,state.notifications.length);
}

function renderHeroes(){
  $("#heroRoster").innerHTML=state.heroes.map(h=>{const w=h.equipment.weapon?itemData(h.equipment.weapon):null,a=h.equipment.armor?itemData(h.equipment.armor):null,p=h.equipment.pet?itemData(h.equipment.pet):null,t=h.equipment.trinket?itemData(h.equipment.trinket):null,status=h.assignment==="combat"?"combat":["inn","tavern"].includes(h.assignment)?"recovery":"",progress=combatXPProgress(h);return `<article class="hero-card" style="--hero-color:${h.color}"><div class="hero-card-head"><div class="hero-portrait">${heroImage(h)}</div><div><h3>${escapeHTML(h.name)}</h3><span class="class-label">${h.className}</span></div><div class="hero-level"><strong>${h.level}</strong><small>Combat level</small></div></div><div class="hero-status-line"><span class="status-tag ${status}">${ASSIGNMENTS[h.assignment]?.icon||"✨"} ${escapeHTML(statusFor(h))}</span><small>Power ${Math.floor(heroPower(h))}</small></div><div class="hero-vitals"><div class="meter-row"><span>Combat XP</span><div class="meter" title="${h.level>=100?"Maximum Combat Level":`${fmt(progress.current)} / ${fmt(progress.required)} XP`}"><span style="--value:${progress.percent}%;--meter-color:${h.color}"></span></div><b>${h.level>=100?"MAX":`${Math.floor(progress.percent)}%`}</b></div><div class="meter-row"><span>Sanity</span><div class="meter"><span style="--value:${h.sanity}%;--meter-color:#c59637"></span></div><b>${Math.floor(h.sanity)}</b></div></div><div class="equipment-pair">${gearSlot("Weapon",w)}${gearSlot("Armor",a)}${gearSlot("Pet",p)}${gearSlot("Trinket",t)}</div><div class="hero-card-actions"><button data-action="open-hero" data-hero="${h.id}">Character page</button><button data-action="quick-assign" data-hero="${h.id}">Assign</button></div></article>`}).join("");
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
    const enemy=run.enemy||createEnemy(cfg,room);stage=`<div class="battle-stage"><div class="enemy-zone ${enemy.boss?"boss":""}"><div class="enemy-name"><span class="eyebrow">${enemy.boss?"Boss":"Enemy"} · Room ${run.roomIndex+1}/${layout.length}</span><h3>${escapeHTML(enemy.name)}</h3></div><div class="enemy-figure">${assetImage(enemy.image||room.image,enemy.name,"enemy-image",enemy.icon)}<div class="hitsplat-layer" data-hitsplat-target="enemy"></div></div><div class="battle-hp enemy-hp"><span data-enemy-hp-bar style="width:100%"></span></div><small data-enemy-hp-text></small><div class="status-effects" data-enemy-status></div></div><div class="versus-mark">VS</div><div class="battle-party">${party.map(h=>`<article class="battle-hero" data-battle-hero="${h.id}" style="--hero-color:${h.color}"><div class="battle-portrait">${heroImage(h)}<div class="hitsplat-layer" data-hitsplat-target="${h.id}"></div></div><div class="battle-hero-name"><strong>${escapeHTML(h.name)}</strong><small>${h.className} · Max ${fmt(heroMaxHit(h))}</small></div><div class="battle-hp hero-hp"><span data-hero-hp-bar style="width:100%"></span></div><small data-hero-hp-text></small><div class="attack-timer"><span data-attack-speed="${heroAttackSpeed(h)}" data-attack-timer="${heroAttackSpeed(h)}" data-sampled-at="0" style="width:0%"></span></div></article>`).join("")}</div></div>`;
  }
  host.innerHTML=`<section class="combat-battlefield" style="--battle-a:${cfg.colors[0]};--battle-b:${cfg.colors[1]}"><header><div><span class="eyebrow" data-battle-cycle></span><h2>${cfg.icon} ${escapeHTML(cfg.name)}</h2></div><div class="battle-actions"><button class="loot-button" data-action="open-loot" data-combat="${cfg.id}"><span class="loot-chest-icon"></span> Drop table</button><button class="stop-run" data-action="stop-run" data-run="${run.id}">Recall</button></div></header>${timeline}${stage}<div class="battle-summary"><div><strong data-battle-summary="dps">0.0</strong><small>Party DPS</small></div><div><strong data-battle-summary="kills">0</strong><small>Enemies slain</small></div><div><strong data-battle-summary="cycles">0</strong><small>Clears</small></div><div><strong data-battle-summary="food">0</strong><small>Food eaten</small></div><div><strong data-battle-summary="reward">None yet</strong><small>Latest chest</small></div></div><details class="combat-log"><summary>Battle log</summary><div data-combat-log-lines></div></details></section>`;host.dataset.signature=signature;markCombatEventsSeen(run);syncCombatBattlefield(host,run,cfg,room,party);
}
function renderActiveRuns(){
  $("#combatSlotCount").textContent=combatCount();$("#activeRuns").innerHTML=state.combatRuns.length?state.combatRuns.map(r=>{const c=COMBAT[r.combatId],party=r.heroIds.map(heroById).filter(Boolean),room=COMBAT_LAYOUTS[c.id]?.[r.roomIndex],pct=roomProgress(r)*100,status=r.roomState?.type==="skill"?`${formatDuration(Math.max(0,r.roomState.remaining))} on obstacle`:r.enemy?`${fmt(r.enemy.hp)} / ${fmt(r.enemy.maxHP)} enemy HP`:"Entering room";return `<article class="active-run ${r.id===watchedRunId?"watched":""}"><div class="run-icon">${room?roomImage(room,"run-room-art"):c.icon}</div><div><div class="run-title"><strong>${c.name} · Cycle ${r.cycle}</strong><small>${escapeHTML(status)}</small></div><div class="run-progress"><span style="width:${pct}%"></span></div><div class="run-party">${party.map(h=>`<i title="${escapeHTML(h.name)}">${heroImage(h)}</i>`).join("")}<span>${escapeHTML(room?.name||"First room")} · ${r.autoRepeat?"Repeating":"Single clear"}</span></div></div><div class="active-run-actions"><button class="watch-run" data-action="watch-run" data-run="${r.id}">${r.id===watchedRunId?"Watching":"Watch fight"}</button><button class="loot-button" data-action="open-loot" data-combat="${c.id}"><span class="loot-chest-icon" aria-hidden="true"></span> Rewards</button><button class="stop-run" data-action="stop-run" data-run="${r.id}">Recall</button></div></article>`}).join(""):`<div class="empty-state"><span>🗺️</span>No active runs. Your heroes are waiting for orders.</div>`;
}
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
}

function renderSyncUser(){
  $("#versionLabel").textContent=`v${VERSION}`;const label=currentUser?(currentUser.displayName||currentUser.email||"A").charAt(0).toUpperCase():"G";$("#accountButton").textContent=label;
}
function setSync(status){const dot=$("#syncDot"),label=$("#syncLabel");dot.className=`status-dot ${status==="online"?"online":status==="error"?"error":""}`;label.textContent=status==="online"?"Cloud saved":status==="saving"?"Saving…":status==="error"?"Sync problem":"Device save";}

function openView(view){currentView=view;$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.viewPanel===view));$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));window.scrollTo({top:0,behavior:"smooth"});renderAll();}
function openDrawer(title,eyebrow,html){$("#drawerTitle").textContent=title;$("#drawerEyebrow").textContent=eyebrow;$("#drawerContent").innerHTML=html;$("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeDrawer(){$("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true");document.body.style.overflow="";}

function profileEquipmentSlot(h,slot,label){const d=h.equipment[slot]?itemData(h.equipment[slot]):null,detail=d?[d.attack?`+${d.attack} ATK`:"",d.defense?`+${d.defense} DEF`:"",d.element,d.effectText,["weapon","armor"].includes(slot)?`${Math.floor(d.durability??100)}% durability`:""].filter(Boolean).join(" · "):slot==="pet"?"Find pets while skilling or hatch a raid egg":slot==="trinket"?"Find trinkets in Dungeons":"No item equipped";return `<article class="profile-gear-slot"><span>${d?itemImage(d,"profile-item-art"):"＋"}</span><div><small>${label}</small><strong>${d?escapeHTML(d.name):"Empty slot"}</strong><p>${escapeHTML(detail)}</p></div></article>`;}
function openHero(id){
  const h=heroById(id);if(!h)return;const skillNames={farming:"Farming",mining:"Mining",woodcutting:"Woodcutting",smithing:"Smithing"},maxHP=heroMaxHP(h),specials=heroSpecials(h),progress=combatXPProgress(h),records=[
    ["⚔️","Enemies defeated",h.records.kills],["🐲","Raid bosses slain",h.records.raidBosses],["🗝️","Dungeon bosses slain",h.records.dungeonBosses],["🪙","Gold earned",h.records.goldEarned],
    ["🍺","Beers at the Tavern",h.records.beers],["🧭","Expeditions finished",h.records.expeditions],["🏰","Dungeons cleared",h.records.dungeons],["🌘","Raids cleared",h.records.raids],
    ["📦","Rare finds",h.records.itemsFound],["🥕","Food gathered",h.records.foodGathered],["⛓️","Metal mined",h.records.metalMined],["🪵","Wood gathered",h.records.woodGathered],
    ["🧰","Repair kits forged",h.records.kitsForged],["📋","Work actions",h.records.workActions],["🛒","Defeats",h.records.defeats],["⏳","Time active",formatDuration(h.records.secondsActive)],
  ];
  openDrawer(h.name,`${h.className} · Combat Level ${h.level}`,`<div class="character-banner" style="--hero-color:${h.color}"><span>${heroImage(h)}</span><div><strong>${escapeHTML(h.name)}</strong><small>${h.className} · ${escapeHTML(statusFor(h))}</small></div></div><div class="drawer-section"><h3>Rename this hero</h3><div class="rename-row"><input id="heroNameInput" maxlength="24" value="${escapeHTML(h.name)}" aria-label="New hero name"><button class="primary-button" data-action="rename-hero" data-hero="${h.id}">Save name</button></div></div><div class="drawer-section"><h3>Combat Sheet</h3><div class="combat-stat-grid"><div><span>⚔️</span><strong>${fmt(heroAttack(h))}</strong><small>Attack</small></div><div><span>💥</span><strong>${fmt(heroMaxHit(h))}</strong><small>Max hit</small></div><div><span>🛡️</span><strong>${fmt(heroDefense(h))}</strong><small>Defense</small></div><div><span>❤️</span><strong>${fmt(Math.min(h.hp??maxHP,maxHP))} / ${fmt(maxHP)}</strong><small>HP</small></div><div><span>✦</span><strong>${fmt(heroPower(h))}</strong><small>Combat strength</small></div></div>${specials.length?`<div class="special-chip-list">${specials.map(x=>`<span>${escapeHTML(x)}</span>`).join("")}</div>`:`<p class="profile-empty-note">No special effects yet. Dungeon gear, pets, and trinkets can add them.</p>`}</div><div class="drawer-section"><div class="profile-section-title"><h3>Equipment</h3><button class="text-button" data-action="open-view" data-view="warehouse">Open Warehouse</button></div><div class="profile-equipment-grid">${profileEquipmentSlot(h,"weapon","Weapon")}${profileEquipmentSlot(h,"armor","Armor")}${profileEquipmentSlot(h,"pet","Pet")}${profileEquipmentSlot(h,"trinket","Trinket")}</div></div><div class="drawer-section"><h3>${escapeHTML(h.name)}'s Story</h3><div class="hero-record-grid">${records.map(([icon,label,value])=>`<div><span>${icon}</span><strong>${typeof value==="number"?fmt(value):escapeHTML(value)}</strong><small>${label}</small></div>`).join("")}</div></div><div class="drawer-section"><h3>Independent Work Skills</h3>${workActionStatus(h)?`<div class="notice work-timer">⏱️ Next timed action: <strong data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</strong></div>`:""}<div class="skill-list">${Object.entries(h.skills).map(([k,s])=>`<div class="skill-row"><span>${skillNames[k]}</span><b>Lv ${s.level}</b><div class="meter"><span style="--value:${s.xp/xpForLevel(s.level)*100}%"></span></div></div>`).join("")}</div></div><div class="drawer-section"><h3>Quick Assignment</h3><div class="choice-grid">${["idle","farm","mine","forest","smith","tavern"].map(a=>`<button class="choice-card ${h.assignment===a?"selected":""}" data-action="assign" data-hero="${h.id}" data-assignment="${a}"><span>${ASSIGNMENTS[a].icon}</span><strong>${ASSIGNMENTS[a].name}</strong><small>${ASSIGNMENTS[a].detail}</small></button>`).join("")}</div></div>`);
  $("#drawerContent").querySelector(".character-banner")?.insertAdjacentHTML("afterend",`<div class="drawer-section"><h3>Combat Progression</h3><div class="combat-xp-progress"><div><strong>${h.level>=100?"Maximum level reached":`${fmt(progress.current)} / ${fmt(progress.required)} XP`}</strong><small>${h.level>=100?"Combat Level 100":`${fmt(progress.remaining)} XP to Combat Level ${h.level+1}`}</small></div><div class="meter"><span style="--value:${progress.percent}%;--meter-color:${h.color}"></span></div></div><div class="notice combat-growth-note">Every Combat Level adds <strong>+2 Attack, +1 Defence, and +6 Max HP</strong>. Max Hit increases by 1 every four levels.</div></div>`);
}

function resourceTierHTML(id){
  const resource=RESOURCE_ASSIGNMENTS[id];if(!resource)return "";const b=BUILDINGS[id],buildingLevel=state.buildings[id],bestSkill=Math.max(...state.heroes.map(h=>h.skills[b.skill].level));
  const title=resource==="food"?"Food Items":resource==="metal"?"Metal Ores":"Wood Types",explanation=resource==="food"?"Every completed action creates one meal item. Higher meals restore more HP when a hero auto-eats in combat; they never convert into generic Food.":`Every completed action creates one distinct ${resource} item. Each stack is its own crafting material and cannot substitute for another tier.`;return `<div class="drawer-section"><h3>${title}</h3><p class="tier-explainer">${explanation} Skill and building levels make actions faster; heroes stay on the exact task you select.</p><div class="resource-tier-list">${RESOURCE_TIERS[resource].map(t=>{const unlocked=bestSkill>=t.level&&buildingLevel>=t.building,amount=Math.floor(state.resourceTiers[resource][t.id]||0),detail=resource==="food"?`${fmt(amount)} stored · Heals ${t.heal} HP each · ${TIER_ACTION_SECONDS[t.id]}s base`:`${fmt(amount)} stored · ${t.tier} recipe material · ${TIER_ACTION_SECONDS[t.id]}s base`,badge=resource==="food"?`${t.heal} HP`:"Item";return `<div class="resource-tier ${unlocked?"unlocked":"locked"}"><span>${unlocked?t.icon:"🔒"}</span><div><strong>${t.tier} · ${t.name}</strong><small>${unlocked?detail:`Requires skill ${t.level} + building ${t.building}`}</small></div><b>${unlocked?badge:"Locked"}</b></div>`}).join("")}</div></div>`;
}
function openBuilding(id){const b=BUILDINGS[id],level=state.buildings[id],cost=Math.floor(b.baseCost*Math.pow(1.55,level-1));const workers=state.heroes.filter(h=>h.assignment===id);openDrawer(b.name,`Building level ${level}`,`<div class="drawer-section"><div class="info-grid"><div class="info-tile"><small>Assigned heroes</small><strong>${workers.length} / 6</strong></div><div class="info-tile"><small>Action speed</small><strong>+${(level-1)*8}%</strong></div><div class="info-tile"><small>Next upgrade</small><strong>🪙 ${fmt(cost)}</strong></div><div class="info-tile"><small>Role</small><strong>${escapeHTML(b.description)}</strong></div></div></div>${resourceTierHTML(id)}${id==="smith"?smithCraftHTML():""}<div class="drawer-section"><h3>Heroes here</h3><div class="action-list">${workers.length?workers.map(h=>`<button data-action="open-hero" data-hero="${h.id}"><span class="inline-hero">${heroImage(h)} ${escapeHTML(h.name)}</span><small data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</small></button>`).join(""):`<div class="empty-state">No heroes are assigned here.</div>`}</div></div><div class="drawer-footer"><button class="soft-button" data-action="open-view" data-view="assign">Assignments</button><button class="primary-button" data-action="upgrade-building" data-building="${id}">Upgrade · 🪙 ${fmt(cost)}</button></div>`);}
function itemCraftingRecipe(d){const tierId=d.recipeTier||String(d.tier||"starter").toLowerCase(),metal=resourceTierData("metal",tierId)||RESOURCE_TIERS.metal[0],wood=resourceTierData("wood",tierId)||RESOURCE_TIERS.wood[0];return {metal,wood,metalCost:d.metalCost||0,woodCost:d.woodCost||0};}
function smithCraftHTML(){const keys=["goodSword","goodWand","goodBow","goodStaff","goodDaggers","goodTome","warriorArmor","wizardArmor","archerArmor","druidArmor","assassinArmor","summonerArmor"],repairMetal=resourceTierData("metal",REPAIR_KIT_RECIPE.metalTier),repairWood=resourceTierData("wood",REPAIR_KIT_RECIPE.woodTier);return `<div class="drawer-section"><h3>Repair Kit Work Recipe</h3><div class="notice">Each timed Smithing action uses ${repairMetal.icon} ${REPAIR_KIT_RECIPE.metalCost} ${repairMetal.name} + ${repairWood.icon} ${REPAIR_KIT_RECIPE.woodCost} ${repairWood.name}.</div></div><div class="drawer-section"><h3>Good Equipment Recipes</h3><p class="tier-explainer">Good equipment requires Good-tier materials. Lower metals and woods cannot substitute.</p><div class="action-list">${keys.map(key=>{const d=ITEMS[key],r=itemCraftingRecipe(d);return `<button data-action="craft-item" data-key="${key}"><span class="recipe-item">${itemImage(d,"recipe-item-art")} ${d.name}</span><small>${r.metal.icon} ${r.metalCost} ${r.metal.name} (${fmt(resourceTierCount("metal",r.metal.id))}) · ${r.wood.icon} ${r.woodCost} ${r.wood.name} (${fmt(resourceTierCount("wood",r.wood.id))})</small></button>`}).join("")}</div></div>`;}
function craftItem(key){const d=ITEMS[key];if(!d?.metalCost)return;const r=itemCraftingRecipe(d),metalOwned=resourceTierCount("metal",r.metal.id),woodOwned=resourceTierCount("wood",r.wood.id);if(occupiedSlots()>=warehouseCapacity())return toast("📦","Warehouse is full");if(metalOwned<r.metalCost||woodOwned<r.woodCost)return toast("⚒️","Not enough exact materials",`Need ${r.metalCost} ${r.metal.name} and ${r.woodCost} ${r.wood.name}. You have ${metalOwned} and ${woodOwned}.`);spendSpecificResource("metal",r.metal.id,r.metalCost);spendSpecificResource("wood",r.wood.id,r.woodCost);state.inventory.push({id:uid(),key,durability:100,acquiredAt:Date.now()});notify("Equipment crafted",`${d.name} used ${r.metalCost} ${r.metal.name} and ${r.woodCost} ${r.wood.name}.`,d.icon);markDirty();renderAll();openBuilding("smith");}

function openCombat(combatId){
  const c=COMBAT[combatId];if(!c)return;const available=state.heroes.filter(h=>h.assignment!=="combat"&&h.assignment!=="inn"&&h.sanity>0&&(h.hp||0)>0),max=c.maxParty,entry=[c.keys?`${c.keys} Key${c.keys===1?"":"s"}`:"",c.essence?`${c.essence} Essence`:""].filter(Boolean).join(" + ")||"Free entry",layout=COMBAT_LAYOUTS[c.id];
  openDrawer(c.name,c.eyebrow,`<div class="drawer-section"><p>${c.description}</p><div class="info-grid"><div class="info-tile"><small>Route</small><strong>${combatRoomsFor(c).length} fights · ${layout.filter(r=>r.type==="skill").length} skill rooms</strong></div><div class="info-tile"><small>Required level</small><strong>Combat ${c.minLevel}+</strong></div><div class="info-tile"><small>Party size</small><strong>Up to ${max}</strong></div><div class="info-tile"><small>Auto-healing</small><strong>Eat below 45% HP</strong></div><div class="info-tile"><small>Entry per clear</small><strong>${entry}</strong></div><button class="info-tile loot-preview" data-action="open-loot" data-combat="${c.id}"><small>Possible rewards</small><strong><span class="loot-chest-icon" aria-hidden="true"></span> View loot & rates</strong></button></div></div><div class="drawer-section"><h3>Rooms in this route</h3><div class="route-preview">${layout.map((r,i)=>`<div><span>${roomImage(r,"route-room-art")}</span><div><strong>${i+1}. ${escapeHTML(r.name)}</strong><small>${r.type==="skill"?`${r.skill} obstacle · time scales with party skill`:r.boss?"Boss fight":"Enemy fight"}</small></div></div>`).join("")}</div></div><div class="drawer-section"><h3>Choose the party</h3><div class="choice-grid" id="partyChoices">${available.map(h=>`<button class="choice-card hero-choice ${h.level<c.minLevel?"locked":""}" data-action="toggle-party" data-hero="${h.id}" data-max="${max}" data-combat="${c.id}" ${h.level<c.minLevel?"disabled":""}><span>${heroImage(h)}</span><strong>${escapeHTML(h.name)} · Lv ${h.level}</strong><small>${h.level<c.minLevel?`Needs Level ${c.minLevel}`:`Max hit ${heroMaxHit(h)} · ${heroAttackSpeed(h).toFixed(2)}s · HP ${fmt(h.hp)}`}</small></button>`).join("")}</div></div><div id="combatPartyPreview" class="combat-party-preview empty"><div><span>💥</span><strong id="partyMaxHit">Choose heroes</strong><small>Highest max hit</small></div><div><span>⚔️</span><strong id="partyDps">—</strong><small>Estimated DPS</small></div><div><span>⏱️</span><strong id="partyDuration">—</strong><small id="partySpeed">Estimated clear</small></div><div><span>🥕</span><strong id="partyFood">${fmt(state.resources.food)}</strong><small>Meals stored</small></div></div><p id="combatPreviewNote" class="combat-preview-note">There is no pass/fail roll. The party must survive every room; more damage means faster kills, XP, and chest rolls.</p><label class="notice"><input id="autoRepeatChoice" type="checkbox" checked> Automatically repeat while entry supplies, meals, Sanity, and heroes allow.</label><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Cancel</button><button class="primary-button" data-action="start-run" data-combat="${c.id}">Enter ${c.short}</button></div>`);
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

function upgradeBuilding(id){const b=BUILDINGS[id],cost=Math.floor(b.baseCost*Math.pow(1.55,state.buildings[id]-1));if(state.resources.gold<cost)return toast("🪙","Not enough Gold");state.resources.gold-=cost;state.buildings[id]++;notify(`${b.name} upgraded`,`Building Level ${state.buildings[id]} is now complete.`,b.icon);markDirty();renderAll();openBuilding(id);}

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
      if(cloud?.updatedAt>state.updatedAt){const restoredAt=Date.now();state=migrate(cloud);const away=Math.min(OFFLINE_LIMIT,Math.max(0,(restoredAt-(state.lastTick||restoredAt))/1000)),report=simulate(away,true);lastSimulationAt=restoredAt;state.lastTick=restoredAt;saveLocal();notify("Cloud town restored","Your latest Firebase save and its idle progress are now on this device.","☁️");showOffline(report);}
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
  const b=event.target.closest("[data-action]");if(!b)return;const a=b.dataset.action;
  if(a==="open-view"){closeDrawer();openView(b.dataset.view);}
  else if(a==="toggle-map-size")$("#townMapFrame").classList.toggle("expanded");
  else if(a==="open-hero")openHero(b.dataset.hero);
  else if(a==="quick-assign"){openView("assign");}
  else if(a==="open-building")openBuilding(b.dataset.building);
  else if(a==="open-combat")openCombat(b.dataset.combat);
  else if(a==="open-combat-category")openCombatCategory(b.dataset.category);
  else if(a==="open-loot")openLoot(b.dataset.combat);
  else if(a==="close-drawer")closeDrawer();
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

function showOffline(report){if(!report||report.seconds<60)return;const entries=[["Time away",formatDuration(report.seconds)],...(report.tierChanges||[]).map(change=>[`${change.icon} ${change.name}`,change.quantity]),["🪙 Gold",report.gold],["✨ Essence",report.essence],["🗝️ Raid Keys",report.keys],["🧰 Repair Kits",report.kits],["📦 Items",report.items],["💀 Enemies slain",report.kills],["⚔️ Routes cleared",report.runs],["⭐ Combat levels",report.combatLevels]].filter(([,v],i)=>i===0||Math.abs(v)>.01);$("#offlineReport").innerHTML=entries.map(([k,v],i)=>`<div class="offline-line"><span>${k}</span><strong>${i===0?v:`${v>=0?"+":""}${fmt(v)}`}</strong></div>`).join("");$("#offlineDialog").showModal();}

async function init(){
  const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");state=migrate(raw);const now=Date.now(),elapsed=Math.min(OFFLINE_LIMIT,Math.max(0,(now-(state.lastTick||now))/1000));const report=simulate(elapsed,true);lastSimulationAt=now;state.lastTick=now;saveLocal();
  initializeFirebase();
  if("serviceWorker" in navigator)navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  const failedAssets=await preloadAssets();renderAll();
  $("#loadingText").textContent=failedAssets.length?"The town is ready. Missing artwork will retry when needed.":"The town is ready.";setTimeout(()=>{$("#loadingScreen").classList.add("fade");$("#app").hidden=false;setTimeout(()=>$("#loadingScreen").remove(),500);if(!settings.authDismissed)setTimeout(()=>$("#authDialog").showModal(),450);showOffline(report);},250);
  setInterval(()=>{const now=Date.now();settleToNow(true);if(currentView==="combat")renderCombatLive();if(now-lastSlowRender>=1000){lastSlowRender=now;renderResources();renderTown();if(currentView==="warehouse")renderWarehouse();refreshWorkTimers();markDirty();}},100);
}

document.addEventListener("visibilitychange",()=>{if(!state)return;if(document.visibilityState==="hidden"){settleToNow(false);saveLocal();}else{settleToNow(true);renderAll();}});
window.addEventListener("pagehide",()=>{if(!state)return;settleToNow(false);saveLocal();});
window.addEventListener("pageshow",event=>{if(!state||!event.persisted)return;settleToNow(true);renderAll();});

init();
