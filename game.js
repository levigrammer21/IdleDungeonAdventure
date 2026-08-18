const VERSION = "1.3.0";
const SAVE_KEY = "adventure-town-save-v1";
const SETTINGS_KEY = "adventure-town-settings-v1";
const OFFLINE_LIMIT = 12 * 60 * 60;

const HEROES = [
  { id:"warrior", name:"Bram", className:"Warrior", icon:"🛡️", weapon:"Sword", armor:"Warrior Armor", color:"#a94d3f" },
  { id:"wizard", name:"Elowen", className:"Wizard", icon:"🧙", weapon:"Wand", armor:"Wizard Robes", color:"#5a68a9" },
  { id:"archer", name:"Rowan", className:"Archer", icon:"🏹", weapon:"Bow", armor:"Archer Armor", color:"#4e8a52" },
  { id:"druid", name:"Mira", className:"Druid", icon:"🌿", weapon:"Staff", armor:"Druid Garb", color:"#628c6a" },
  { id:"assassin", name:"Vex", className:"Assassin", icon:"🗡️", weapon:"Daggers", armor:"Assassin Armor", color:"#755b86" },
  { id:"summoner", name:"Orin", className:"Summoner", icon:"📖", weapon:"Tome", armor:"Summoner Robes", color:"#a36f42" },
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
  farm:{name:"Farm",icon:"🌾",description:"Produces Food for every combat activity.",baseCost:650,position:[20,36],skill:"farming"},
  mine:{name:"Mine",icon:"⛏️",description:"Produces Metal for equipment and repairs.",baseCost:700,position:[80,34],skill:"mining"},
  forest:{name:"Forest",icon:"🌲",description:"Produces Wood for repairs and town growth.",baseCost:625,position:[15,63],skill:"woodcutting"},
  smith:{name:"Blacksmith",icon:"⚒️",description:"Turns Metal and Wood into Repair Kits.",baseCost:900,position:[60,70],skill:"smithing"},
  warehouse:{name:"Warehouse",icon:"📦",description:"Stores all loot, resources, and equipment.",baseCost:1100,position:[61,41]},
  market:{name:"Marketplace",icon:"⚖️",description:"Trades player goods and equipment for Gold.",baseCost:1200,position:[39,44]},
  inn:{name:"Inn",icon:"🛏️",description:"Physically restores heroes after defeat.",baseCost:850,position:[79,66]},
  tavern:{name:"Tavern",icon:"🍲",description:"Restores Sanity after battle for a Gold fee.",baseCost:800,position:[35,70]},
};

const ASSIGNMENTS = {
  idle:{name:"Available",icon:"✨",detail:"Ready for a new assignment."},
  farm:{name:"Farming",icon:"🌾",detail:"Produces Food and gains Farming XP."},
  mine:{name:"Mining",icon:"⛏️",detail:"Produces Metal and gains Mining XP."},
  forest:{name:"Woodcutting",icon:"🌲",detail:"Produces Wood and gains Woodcutting XP."},
  smith:{name:"Smithing",icon:"⚒️",detail:"Consumes Metal + Wood to make Repair Kits."},
  tavern:{name:"At Tavern",icon:"🍲",detail:"Restoring Sanity to full."},
  inn:{name:"At Inn",icon:"🛏️",detail:"Recovering from defeat."},
  combat:{name:"Fighting",icon:"⚔️",detail:"Away on a combat run."},
};

const COMBAT = {
  meadowWatch:{id:"meadowWatch",category:"expedition",name:"Meadow Watch",short:"Meadow Watch",icon:"🌾",eyebrow:"Starter expedition · Level 1",description:"Guard the farms and learn the rhythm of combat without risking expensive supplies.",requirements:["Combat Level 1+","1–4 heroes","4 Food per hero"],minLevel:1,maxParty:4,duration:30,difficulty:18,food:4,gold:[12,22],xp:18,essenceChance:.03,itemChance:0,pool:[],colors:["#5f843f","#29472f"]},
  whisperwood:{id:"whisperwood",category:"expedition",name:"Whisperwood Trail",short:"Whisperwood",icon:"🧭",eyebrow:"Forest expedition · Level 8",description:"Patrol old forest roads for better Combat XP, Gold, and the first traces of regional Essence.",requirements:["Combat Level 8+","1–4 heroes","7 Food per hero"],minLevel:8,maxParty:4,duration:45,difficulty:55,food:7,gold:[28,50],xp:36,essenceChance:.05,itemChance:.02,pool:["verdantBlade","briarRobes"],colors:["#3d6e4d","#1d3d2a"]},
  frostmarch:{id:"frostmarch",category:"expedition",name:"Frostmarch Pass",short:"Frostmarch",icon:"❄️",eyebrow:"Frozen expedition · Level 18",description:"Push through the frozen pass where Essence and rare Hollow equipment begin to appear.",requirements:["Combat Level 18+","1–4 heroes","10 Food per hero"],minLevel:18,maxParty:4,duration:70,difficulty:110,food:10,gold:[70,115],xp:72,essenceChance:.08,itemChance:.035,pool:["frostBow","healingStaff"],colors:["#517a91","#233d55"]},
  cindertrail:{id:"cindertrail",category:"expedition",name:"Cindertrail Patrol",short:"Cindertrail",icon:"🔥",eyebrow:"Volcanic expedition · Level 35",description:"Cross scorched roads beneath Cinderdeep and return with richer spoils.",requirements:["Combat Level 35+","1–4 heroes","14 Food per hero"],minLevel:35,maxParty:4,duration:100,difficulty:220,food:14,gold:[150,240],xp:135,essenceChance:.10,itemChance:.045,pool:["emberBow","cinderTome"],colors:["#9a5434","#442824"]},
  stormcoast:{id:"stormcoast",category:"expedition",name:"Stormcoast March",short:"Stormcoast",icon:"⚡",eyebrow:"Tempest expedition · Level 55",description:"Hunt along storm-lashed cliffs where stronger regional loot enters circulation.",requirements:["Combat Level 55+","1–4 heroes","18 Food per hero"],minLevel:55,maxParty:4,duration:140,difficulty:420,food:18,gold:[300,470],xp:230,essenceChance:.12,itemChance:.055,pool:["stormStaff","tempestDaggers"],colors:["#536587","#252d4e"]},
  shadowpeaks:{id:"shadowpeaks",category:"expedition",name:"Shadowpeak Ascent",short:"Shadowpeak",icon:"🌑",eyebrow:"Endgame expedition · Level 75",description:"Climb into the dark peaks and prepare for the final raid tier.",requirements:["Combat Level 75+","1–4 heroes","24 Food per hero"],minLevel:75,maxParty:4,duration:190,difficulty:620,food:24,gold:[520,800],xp:360,essenceChance:.15,itemChance:.065,pool:["voidWand","eclipseTome"],colors:["#544968","#211d31"]},

  thornrootBurrow:{id:"thornrootBurrow",category:"dungeon",name:"Thornroot Burrow",short:"Thornroot",icon:"🌿",eyebrow:"Regional dungeon · Level 10",description:"A solo or duo dungeon beneath the ancient roots, with a complete class set, trinkets, and Raid Key chances.",requirements:["Combat Level 10+","1–2 heroes","2 Essence + 18 Food per hero"],minLevel:10,maxParty:2,duration:75,difficulty:95,food:18,essence:2,gold:[60,95],xp:60,essenceReward:[1,3],itemChance:.12,keyChance:.08,pool:gearSetPool("thornroot"),trinketChance:.06,trinketPool:["luckyAcorn"],killCount:12,colors:["#4b7042","#263e2a"]},
  frozenHollow:{id:"frozenHollow",category:"dungeon",name:"Frozen Hollow",short:"Frozen Hollow",icon:"🗝️",eyebrow:"Regional dungeon · Level 24",description:"A multi-room frozen delve with a complete class set, Essence returns, trinkets, and Raid Keys.",requirements:["Combat Level 24+","1–2 heroes","3 Essence + 35 Food per hero"],minLevel:24,maxParty:2,duration:110,difficulty:190,food:35,essence:3,gold:[180,320],xp:145,essenceReward:[1,5],itemChance:.16,keyChance:.18,pool:gearSetPool("frozen"),trinketChance:.065,trinketPool:["frostSigil"],killCount:18,colors:["#425e76","#1f354a"]},
  cinderdeepVault:{id:"cinderdeepVault",category:"dungeon",name:"Cinderdeep Vault",short:"Cinderdeep",icon:"🌋",eyebrow:"Regional dungeon · Level 45",description:"Descend into a ruined forge for a full fire-forged class set, trinkets, and stronger Key odds.",requirements:["Combat Level 45+","1–2 heroes","5 Essence + 60 Food per hero"],minLevel:45,maxParty:2,duration:160,difficulty:360,food:60,essence:5,gold:[420,680],xp:290,essenceReward:[3,8],itemChance:.18,keyChance:.24,pool:gearSetPool("cinderdeep"),trinketChance:.07,trinketPool:["emberIdol"],killCount:24,colors:["#83432f","#392321"]},
  sunkenSanctum:{id:"sunkenSanctum",category:"dungeon",name:"Sunken Sanctum",short:"Sunken Sanctum",icon:"🌊",eyebrow:"Regional dungeon · Level 58",description:"Explore a drowned temple with a full tide-forged class set, trinkets, and strong Raid Key odds.",requirements:["Combat Level 58+","1–2 heroes","6 Essence + 75 Food per hero"],minLevel:58,maxParty:2,duration:190,difficulty:510,food:75,essence:6,gold:[610,920],xp:370,essenceReward:[4,10],itemChance:.19,keyChance:.27,pool:gearSetPool("sunken"),trinketChance:.075,trinketPool:["tidePearl"],killCount:30,colors:["#397383","#203b4a"]},
  stormcrypt:{id:"stormcrypt",category:"dungeon",name:"Storm Crypt",short:"Storm Crypt",icon:"⛈️",eyebrow:"Regional dungeon · Level 70",description:"Break the seals for a full storm-forged class set, trinkets, and the strongest Dungeon Key odds.",requirements:["Combat Level 70+","1–2 heroes","8 Essence + 95 Food per hero"],minLevel:70,maxParty:2,duration:220,difficulty:700,food:95,essence:8,gold:[820,1250],xp:480,essenceReward:[5,12],itemChance:.20,keyChance:.30,pool:gearSetPool("stormcrypt"),trinketChance:.08,trinketPool:["stormLocket"],killCount:36,colors:["#4e547a","#24263d"]},

  basiliskCrown:{id:"basiliskCrown",category:"raid",name:"Basilisk Crown",short:"Basilisk Raid",icon:"🐲",eyebrow:"First raid · Level 30",description:"A four-hero assault with a 10% chance to enter its complete 12-item rare class table.",requirements:["Combat Level 30+","Up to 4 heroes","1 Raid Key + 8 Essence","80 Food per hero"],minLevel:30,maxParty:4,duration:240,difficulty:650,food:80,essence:8,keys:1,gold:[900,1600],xp:620,essenceReward:[6,16],itemChance:.10,pool:gearSetPool("basilisk"),eggChance:1/500,eggKey:"basiliskEgg",killCount:45,colors:["#6f4737","#2f2520"]},
  tempestTitan:{id:"tempestTitan",category:"raid",name:"Tempest Titan",short:"Titan Raid",icon:"⚡",eyebrow:"Second raid · Level 60",description:"Challenge a storm giant with a 10% chance to enter its complete 12-item rare class table.",requirements:["Combat Level 60+","Up to 4 heroes","1 Raid Key + 16 Essence","180 Food per hero"],minLevel:60,maxParty:4,duration:420,difficulty:1600,food:180,essence:16,keys:1,gold:[2600,4100],xp:1450,essenceReward:[12,28],itemChance:.10,pool:gearSetPool("tempest"),eggChance:1/500,eggKey:"tempestEgg",killCount:65,colors:["#4d5f83","#252d49"]},
  eclipseWyrm:{id:"eclipseWyrm",category:"raid",name:"Eclipse Wyrm",short:"Eclipse Raid",icon:"🌘",eyebrow:"Endgame raid · Level 90",description:"The current final raid has a 10% chance to enter its complete 12-item rare class table.",requirements:["Combat Level 90+","Up to 4 heroes","2 Raid Keys + 30 Essence","400 Food per hero"],minLevel:90,maxParty:4,duration:720,difficulty:3000,food:400,essence:30,keys:2,gold:[7000,11000],xp:3600,essenceReward:[24,55],itemChance:.10,pool:gearSetPool("eclipse"),eggChance:1/500,eggKey:"eclipseEgg",killCount:90,colors:["#514063","#1e1929"]},
};

const ITEMS = {
  rustySword:{name:"Rusty Sword",type:"weapon",className:"Warrior",icon:"🗡️",tier:"Starter",attack:1,value:40},
  apprenticeWand:{name:"Apprentice Wand",type:"weapon",className:"Wizard",icon:"🪄",tier:"Starter",attack:1,value:40},
  huntingBow:{name:"Hunting Bow",type:"weapon",className:"Archer",icon:"🏹",tier:"Starter",attack:1,value:40},
  oakStaff:{name:"Oak Staff",type:"weapon",className:"Druid",icon:"🪵",tier:"Starter",attack:1,value:40},
  wornDaggers:{name:"Worn Daggers",type:"weapon",className:"Assassin",icon:"🗡️",tier:"Starter",attack:1,value:40},
  noviceTome:{name:"Novice Tome",type:"weapon",className:"Summoner",icon:"📖",tier:"Starter",attack:1,value:40},
  goodSword:{name:"Good Sword",type:"weapon",className:"Warrior",icon:"⚔️",tier:"Good",attack:6,requiredLevel:10,value:520,metalCost:70,woodCost:25},
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
    ITEMS[`${set.prefix}_${c.key}_weapon`]={name:weaponName,type:"weapon",className:c.className,icon:c.weaponIcon,tier:set.tier,attack:set.attack,element:set.weaponEffect,requiredLevel:set.level,value:set.value,salvage:set.salvage,special:true,raid:!!set.raid,source:set.name};
    ITEMS[`${set.prefix}_${c.key}_armor`]={name:armorName,type:"armor",className:c.className,icon:c.armorIcon,tier:set.tier,defense:set.defense,element:set.armorEffect,requiredLevel:set.level,value:set.value,salvage:set.salvage,special:true,raid:!!set.raid,source:set.name};
  }
}

Object.assign(ITEMS,{
  beaverPet:{name:"Beaver",type:"pet",icon:"🦫",tier:"Pet",value:0,soulbound:true,effects:{combatStrength:3,woodDoubleChance:.20},effectText:"+3 combat strength · 20% chance to double Wood"},
  cowPet:{name:"Cow",type:"pet",icon:"🐄",tier:"Pet",value:0,soulbound:true,effects:{combatStrength:2,foodEfficiency:2},effectText:"+2 combat strength · combat Food costs -2 per run"},
  molePet:{name:"Mole",type:"pet",icon:"🐾",tier:"Pet",value:0,soulbound:true,effects:{combatStrength:2,metalDoubleChance:.15},effectText:"+2 combat strength · 15% chance to double Metal"},
  forgeSpritePet:{name:"Forge Sprite",type:"pet",icon:"🔥",tier:"Pet",value:0,soulbound:true,effects:{combatStrength:3,smithDoubleChance:.10},effectText:"+3 combat strength · 10% chance to double Repair Kits"},
  basiliskPet:{name:"Basilisk Hatchling",type:"pet",icon:"🐍",tier:"Raid Pet",value:0,soulbound:true,effects:{combatStrength:9,poisonDamage:2},effectText:"+9 combat strength · +2 poison damage"},
  tempestPet:{name:"Tempest Whelp",type:"pet",icon:"⚡",tier:"Raid Pet",value:0,soulbound:true,effects:{combatStrength:10,lightningDamage:2},effectText:"+10 combat strength · +2 lightning damage"},
  eclipsePet:{name:"Eclipse Wyrmling",type:"pet",icon:"🐉",tier:"Raid Pet",value:0,soulbound:true,effects:{combatStrength:12,shadowDamage:2},effectText:"+12 combat strength · +2 shadow damage"},
  basiliskEgg:{name:"Basilisk Crown Egg",type:"egg",icon:"🥚",tier:"Raid Egg",value:0,soulbound:true,hatchesTo:"basiliskPet",effectText:"Hatches into the Basilisk Crown's pet"},
  tempestEgg:{name:"Tempest Titan Egg",type:"egg",icon:"🥚",tier:"Raid Egg",value:0,soulbound:true,hatchesTo:"tempestPet",effectText:"Hatches into a Tempest Whelp"},
  eclipseEgg:{name:"Eclipse Wyrm Egg",type:"egg",icon:"🥚",tier:"Raid Egg",value:0,soulbound:true,hatchesTo:"eclipsePet",effectText:"Hatches into an Eclipse Wyrmling"},
  luckyAcorn:{name:"Lucky Acorn",type:"trinket",icon:"🌰",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{combatStrength:1,woodDoubleChance:.05},effectText:"+1 combat strength · 5% chance to double Wood"},
  frostSigil:{name:"Frost Sigil",type:"trinket",icon:"❄️",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{defense:3},effectText:"+3 defense"},
  emberIdol:{name:"Ember Idol",type:"trinket",icon:"🔥",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{attack:4},effectText:"+4 attack"},
  tidePearl:{name:"Tide Pearl",type:"trinket",icon:"🫧",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{maxHP:8},effectText:"+8 maximum HP"},
  stormLocket:{name:"Storm Locket",type:"trinket",icon:"⚡",tier:"Dungeon Trinket",value:0,soulbound:true,effects:{combatStrength:3},effectText:"+3 combat strength"},
});

const RESOURCE_TIERS = {
  food:[
    {id:"starter",tier:"Starter",name:"Foraged Rations",icon:"🥕",level:1,building:1,value:1},
    {id:"weak",tier:"Weak",name:"Simple Meals",icon:"🥣",level:5,building:1,value:2},
    {id:"average",tier:"Average",name:"Hearty Meals",icon:"🍲",level:12,building:2,value:4},
    {id:"good",tier:"Good",name:"Trail Feasts",icon:"🥘",level:25,building:3,value:7},
    {id:"great",tier:"Great",name:"Adventurer Feasts",icon:"🍗",level:40,building:4,value:11},
    {id:"epic",tier:"Epic",name:"Hero's Feasts",icon:"🍖",level:60,building:5,value:16},
    {id:"legendary",tier:"Legendary",name:"Legendary Banquets",icon:"🍱",level:80,building:6,value:22},
    {id:"divine",tier:"Divine",name:"Divine Banquets",icon:"✨",level:100,building:8,value:30},
  ],
  metal:[
    {id:"starter",tier:"Starter",name:"Scrap Metal",icon:"🔩",level:1,building:1,value:1},
    {id:"weak",tier:"Weak",name:"Copper",icon:"🟠",level:5,building:1,value:2},
    {id:"average",tier:"Average",name:"Iron",icon:"⚙️",level:12,building:2,value:4},
    {id:"good",tier:"Good",name:"Steel",icon:"⛓️",level:25,building:3,value:7},
    {id:"great",tier:"Great",name:"Mithril",icon:"🔷",level:40,building:4,value:11},
    {id:"epic",tier:"Epic",name:"Adamant",icon:"💠",level:60,building:5,value:16},
    {id:"legendary",tier:"Legendary",name:"Starsteel",icon:"🌠",level:80,building:6,value:22},
    {id:"divine",tier:"Divine",name:"Divine Metal",icon:"✨",level:100,building:8,value:30},
  ],
  wood:[
    {id:"starter",tier:"Starter",name:"Fallen Branches",icon:"🪵",level:1,building:1,value:1},
    {id:"weak",tier:"Weak",name:"Pine",icon:"🌲",level:5,building:1,value:2},
    {id:"average",tier:"Average",name:"Oak",icon:"🟤",level:12,building:2,value:4},
    {id:"good",tier:"Good",name:"Ironwood",icon:"🪓",level:25,building:3,value:7},
    {id:"great",tier:"Great",name:"Elderwood",icon:"🌳",level:40,building:4,value:11},
    {id:"epic",tier:"Epic",name:"Moonwood",icon:"🌙",level:60,building:5,value:16},
    {id:"legendary",tier:"Legendary",name:"Worldwood",icon:"🌐",level:80,building:6,value:22},
    {id:"divine",tier:"Divine",name:"Divine Timber",icon:"✨",level:100,building:8,value:30},
  ],
};
const RESOURCE_ASSIGNMENTS={farm:"food",mine:"metal",forest:"wood"};
const emptyResourceTiers=()=>Object.fromEntries(Object.entries(RESOURCE_TIERS).map(([resource,tiers])=>[resource,Object.fromEntries(tiers.map(t=>[t.id,0]))]));
const TIER_ACTION_SECONDS={starter:10,weak:12,average:15,good:18,great:22,epic:28,legendary:35,divine:45};
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
let lastFrame = Date.now();

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
const fmt = n => Math.floor(Number(n)||0).toLocaleString();
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const heroById = id => state.heroes.find(h=>h.id===id);
const itemData = item => ({...ITEMS[item.key],...item});
const xpForLevel = level => Math.floor(55 * Math.pow(level,1.62));

function recalculateTieredTotal(resource){state.resources[resource]=RESOURCE_TIERS[resource].reduce((total,tier)=>total+(state.resourceTiers[resource][tier.id]||0)*tier.value,0);}
function addTieredResource(resource,tierId,units){state.resourceTiers[resource][tierId]=(state.resourceTiers[resource][tierId]||0)+units;recalculateTieredTotal(resource);}
function spendTieredResource(resource,amount){
  amount=Math.max(0,Number(amount)||0);if(state.resources[resource]+1e-6<amount)return false;let remaining=amount;
  for(const tier of RESOURCE_TIERS[resource]){const available=(state.resourceTiers[resource][tier.id]||0)*tier.value,take=Math.min(available,remaining);state.resourceTiers[resource][tier.id]-=take/tier.value;remaining-=take;if(remaining<=1e-6)break;}
  recalculateTieredTotal(resource);return remaining<=1e-6;
}
function resourceTierForHero(h,assignment){const resource=RESOURCE_ASSIGNMENTS[assignment],skill=BUILDINGS[assignment].skill,buildingLevel=state.buildings[assignment];return RESOURCE_TIERS[resource].filter(t=>h.skills[skill].level>=t.level&&buildingLevel>=t.building).at(-1)||RESOURCE_TIERS[resource][0];}

function freshState(){
  return {
    version:VERSION, townName:"Briarwatch", createdAt:Date.now(), updatedAt:Date.now(), lastTick:Date.now(), randomSeed:987654321,
    resources:{gold:0,food:0,metal:0,wood:0,essence:0,keys:0,repairKits:0}, resourceTiers:emptyResourceTiers(),
    buildings:{farm:1,mine:1,forest:1,smith:1,warehouse:1,market:1,inn:1,tavern:1},
    heroes:HEROES.map((h,i)=>({ ...h, level:1,xp:0,sanity:100,hp:100,assignment:"idle", recoveryUntil:0,workProgress:0,records:{...HERO_RECORD_DEFAULTS},
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
    if(raw.resourceTiers?.[resource])for(const tier of tiers)merged.resourceTiers[resource][tier.id]=Math.max(0,Number(raw.resourceTiers[resource][tier.id])||0);
    else merged.resourceTiers[resource].starter=Math.max(0,Number(raw.resources?.[resource])||0);
    merged.resources[resource]=tiers.reduce((total,tier)=>total+merged.resourceTiers[resource][tier.id]*tier.value,0);
  }
  merged.heroes=base.heroes.map(b=>{const h=raw.heroes.find(x=>x.id===b.id)||{},skills=Object.fromEntries(Object.entries(b.skills).map(([key,value])=>[key,{...value,...(h.skills?.[key]||{})}]));return {...b,...h,workProgress:Math.max(0,Number(h.workProgress)||0),records:{...HERO_RECORD_DEFAULTS,...(h.records||{})},skills,equipment:{...b.equipment,...(h.equipment||{})}}});
  merged.inventory=Array.isArray(raw.inventory)?raw.inventory:[];
  const legacyCombat={expedition:"meadowWatch",dungeon:"frozenHollow",raid:"basiliskCrown"};
  merged.combatRuns=(Array.isArray(raw.combatRuns)?raw.combatRuns:[]).map(r=>({...r,combatId:r.combatId||legacyCombat[r.type]||r.type})).filter(r=>COMBAT[r.combatId]);
  merged.notifications=Array.isArray(raw.notifications)?raw.notifications:base.notifications;
  return merged;
}

function random(){
  let x=state.randomSeed|0; x^=x<<13; x^=x>>>17; x^=x<<5; state.randomSeed=x|0; return (x>>>0)/4294967296;
}

function addXP(target,amount,max=100){
  const oldLevel=target.level;
  target.xp=(target.xp||0)+amount;
  while(target.level<max && target.xp>=xpForLevel(target.level)){target.xp-=xpForLevel(target.level);target.level++;}
  if(target.hp!==undefined&&target.level>oldLevel)target.hp=Math.min((target.hp||0)+(target.level-oldLevel)*6,heroMaxHP(target));
}

function warehouseCapacity(){ return 50 + state.buildings.warehouse*25; }
function occupiedSlots(){ return state.inventory.reduce((n,i)=>n+(i.qty||1),0); }
function combatCount(){ return state.heroes.filter(h=>h.assignment==="combat").length; }
function activeEquipment(h,slot){const item=h.equipment?.[slot];if(!item)return null;if(["weapon","armor"].includes(slot)&&(item.durability??100)<=0)return null;return itemData(item);}
function equipmentEffect(h,key){return ["weapon","armor","pet","trinket"].reduce((total,slot)=>total+(activeEquipment(h,slot)?.effects?.[key]||0),0);}
function equipmentDamageBonus(h){return ["poisonDamage","lightningDamage","shadowDamage","fireDamage","frostDamage","natureDamage"].reduce((total,key)=>total+equipmentEffect(h,key),0);}
function heroAttack(h){return 4+h.level*2+(activeEquipment(h,"weapon")?.attack||0)+equipmentEffect(h,"attack")+equipmentDamageBonus(h);}
function heroDefense(h){return 2+h.level+(activeEquipment(h,"armor")?.defense||0)+equipmentEffect(h,"defense");}
function heroMaxHP(h){return 100+(h.level-1)*6+equipmentEffect(h,"maxHP");}
function heroPower(h){
  const weapon=activeEquipment(h,"weapon")||{attack:0},armor=activeEquipment(h,"armor")||{defense:0};
  return 8+h.level*4+(weapon.attack||0)*3+(armor.defense||0)*1.7+equipmentEffect(h,"combatStrength")+equipmentEffect(h,"attack")*2.5+equipmentEffect(h,"defense")*1.5+equipmentEffect(h,"maxHP")*.1+equipmentDamageBonus(h)*3;
}
function partyPower(party){return party.reduce((total,h)=>total+heroPower(h),0);}
function combatSuccessChance(cfg,party){return party.length?clamp(.32+partyPower(party)/(cfg.difficulty*2.1),.34,.96):0;}
function combatSpeedMultiplier(cfg,party){if(!party.length)return 1;const powerRatio=partyPower(party)/cfg.difficulty;return clamp(1+(powerRatio-.5)*.55,.85,3);}
function combatDuration(cfg,party){return Math.max(10,Math.round(cfg.duration/combatSpeedMultiplier(cfg,party)));}
function heroSpecials(h){return ["weapon","armor","pet","trinket"].map(slot=>activeEquipment(h,slot)).filter(Boolean).flatMap(d=>[d.element,d.effectText].filter(Boolean));}
function workActionTime(h,assignment,tier=null){const skillKey=BUILDINGS[assignment]?.skill,skill=h.skills[skillKey]?.level||1,building=state.buildings[assignment]||1,base=assignment==="smith"?15:TIER_ACTION_SECONDS[tier?.id||"starter"];return base/(1+(skill-1)*.01+(building-1)*.08);}
function workActionStatus(h){if(!["farm","mine","forest","smith"].includes(h.assignment))return "";const tier=RESOURCE_ASSIGNMENTS[h.assignment]?resourceTierForHero(h,h.assignment):null,seconds=Math.max(0,workActionTime(h,h.assignment,tier)-(h.workProgress||0));return `${tier?`${tier.icon} ${tier.name}`:"🧰 Repair Kit"} in ${Math.max(1,Math.ceil(seconds))}s`;}

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
  state.updatedAt=Date.now(); state.lastTick=Date.now(); localStorage.setItem(SAVE_KEY,JSON.stringify(state));
  if(currentUser && firebaseApi) queueCloudSave();
}
function markDirty(){ clearTimeout(saveTimer); saveTimer=setTimeout(saveLocal,650); }
function queueCloudSave(){
  if(cloudSaveTimer) return;
  const wait=Math.max(1000,30000-(Date.now()-lastCloudSave));
  cloudSaveTimer=setTimeout(()=>{cloudSaveTimer=null;scheduleCloudSave();},wait);
}
async function scheduleCloudSave(){
  try{setSync("saving");await firebaseApi.saveGame(currentUser.uid,state);await firebaseApi.writeLeaderboard(currentUser.uid,{displayName:currentUser.displayName||currentUser.email?.split("@")[0]||"Adventurer",totalLevel:state.heroes.reduce((n,h)=>n+h.level,0),combatXP:state.heroes.reduce((n,h)=>n+h.xp,0),wealth:Math.floor(state.resources.gold),raidWins:state.stats.raids,updatedAt:Date.now()});setSync("online");}
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
  seconds=clamp(seconds,0,OFFLINE_LIMIT); if(seconds<.25)return null;
  const previousQuiet=quietSimulation; quietSimulation=offline;
  const before={...state.resources,items:state.inventory.length,runs:state.stats.expeditions+state.stats.dungeons+state.stats.raids};
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
  const after=state.resources; quietSimulation=previousQuiet; return {seconds,gold:after.gold-before.gold,food:after.food-before.food,metal:after.metal-before.metal,wood:after.wood-before.wood,essence:after.essence-before.essence,kits:after.repairKits-before.repairKits,items:state.inventory.length-before.items,runs:state.stats.expeditions+state.stats.dungeons+state.stats.raids-before.runs};
}

function processWork(h,seconds){
  const map={farm:["food","farming"],mine:["metal","mining"],forest:["wood","woodcutting"]};
  if(map[h.assignment]){
    const [resource,skill]=map[h.assignment];h.workProgress=(h.workProgress||0)+seconds;let loops=0;
    while(loops++<50000){
      const tier=resourceTierForHero(h,h.assignment),actionTime=workActionTime(h,h.assignment,tier);if(h.workProgress+1e-8<actionTime)break;h.workProgress-=actionTime;
      const doubleKey=resource==="food"?"foodDoubleChance":resource==="metal"?"metalDoubleChance":"woodDoubleChance",units=random()<equipmentEffect(h,doubleKey)?2:1;
      addTieredResource(resource,tier.id,units);addXP(h.skills[skill],5*Math.sqrt(tier.value));h.records.workActions++;h.records[resource==="food"?"foodGathered":resource==="metal"?"metalMined":"woodGathered"]+=units*tier.value;rollSkillPet(h.assignment,h);
    }
  }else if(h.assignment==="smith"){
    const skill=h.skills.smithing;h.workProgress=(h.workProgress||0)+seconds;let loops=0;
    while(loops++<50000){const actionTime=workActionTime(h,"smith");if(h.workProgress+1e-8<actionTime)break;if(state.resources.metal<4||state.resources.wood<3){h.workProgress=Math.min(h.workProgress,actionTime);break;}h.workProgress-=actionTime;spendTieredResource("metal",4);spendTieredResource("wood",3);const kits=random()<equipmentEffect(h,"smithDoubleChance")?2:1;state.resources.repairKits+=kits;addXP(skill,28);h.records.kitsForged+=kits;h.records.workActions++;rollSkillPet("smith",h);}
  }
}

function processRun(run,seconds,offline=false){
  const cfg=COMBAT[run.combatId];if(!cfg){stopRun(run.id,false);return;}run.progress+=seconds;
  let loops=0; const loopLimit=offline?20000:500; while(run.progress>=run.duration && loops++<loopLimit){run.progress-=run.duration;resolveRun(run,cfg);if(!state.combatRuns.includes(run))break;if(!run.autoRepeat){stopRun(run.id,false);break;}if(!canPayRun(cfg,run.heroIds)){stopRun(run.id,false);notify("Run paused",`${cfg.short} stopped because supplies ran out.`,"🎒");break;}payRun(cfg,run.heroIds);run.duration=combatDuration(cfg,run.heroIds.map(heroById).filter(Boolean));}
}

function resolveRun(run,cfg){
  const party=run.heroIds.map(heroById).filter(Boolean);if(!party.length){stopRun(run.id,false);return;}const chance=combatSuccessChance(cfg,party),won=random()<chance;
  for(const h of party){h.sanity=clamp(h.sanity-(cfg.category==="raid"?28:cfg.category==="dungeon"?17:8),0,100);damageGear(h,cfg.category==="raid"?12:cfg.category==="dungeon"?7:3);}
  if(!won){
    const defeated=party[Math.floor(random()*party.length)];defeated.hp=0;defeated.assignment="inn";defeated.recoveryUntil=Date.now()+(1200/(1+state.buildings.inn*.2))*1000;defeated.records.defeats++;state.stats.defeats++;
    run.heroIds=run.heroIds.filter(id=>id!==defeated.id);notify("Cart to the Inn",`${defeated.name} was defeated during ${cfg.short} and is being brought home.`,"🛒");
    if(!run.heroIds.length){stopRun(run.id,false);}return;
  }
  const gold=Math.floor(cfg.gold[0]+random()*(cfg.gold[1]-cfg.gold[0]));state.resources.gold+=gold;state.stats.goldEarned+=gold;
  for(const h of party){addXP(h,cfg.xp);h.records.kills+=cfg.killCount||6;h.records.goldEarned+=Math.floor(gold/party.length);if(cfg.category==="expedition")h.records.expeditions++;if(cfg.category==="dungeon"){h.records.dungeons++;h.records.dungeonBosses++;}if(cfg.category==="raid"){h.records.raids++;h.records.raidBosses++;}}
  if(cfg.category==="expedition"){state.stats.expeditions++;if(random()<(cfg.essenceChance||0))state.resources.essence+=1;}
  if(cfg.category==="dungeon"){state.stats.dungeons++;state.resources.essence+=Math.floor(cfg.essenceReward[0]+random()*(cfg.essenceReward[1]-cfg.essenceReward[0]+1));if(random()<(cfg.keyChance||0))state.resources.keys+=1;if(cfg.trinketPool?.length&&random()<(cfg.trinketChance||0))dropTrinket(cfg,party);}
  if(cfg.category==="raid"){state.stats.raids++;state.resources.essence+=Math.floor(cfg.essenceReward[0]+random()*(cfg.essenceReward[1]-cfg.essenceReward[0]+1));if(cfg.eggKey&&random()<(cfg.eggChance||0))dropEgg(cfg,party);}
  if(cfg.pool?.length&&random()<(cfg.itemChance||0))dropSpecial(cfg,party);
  if(party.some(h=>h.sanity<=0)){for(const h of party.filter(x=>x.sanity<=0))sendToTavern(h);run.heroIds=run.heroIds.filter(id=>heroById(id).sanity>0);if(!run.heroIds.length)stopRun(run.id,false);}
  notify(`${cfg.short} completed`,`${party.map(h=>h.name).join(", ")} returned with ${fmt(gold)} Gold.`,cfg.icon);
}

function dropSpecial(cfg,party=[]){const key=cfg.pool[Math.floor(random()*cfg.pool.length)],finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(key,finder,cfg.category==="raid"?"Raid rare table hit!":"Rare equipment!");}
function dropTrinket(cfg,party=[]){const key=cfg.trinketPool[Math.floor(random()*cfg.trinketPool.length)],finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(key,finder,"Dungeon trinket found!");}
function dropEgg(cfg,party=[]){const finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(cfg.eggKey,finder,"Boss egg! One-in-500 drop!");}

function damageGear(h,amount){for(const slot of ["weapon","armor"]){const item=h.equipment[slot];if(item)item.durability=clamp((item.durability??100)-amount,0,100);}}
function runFoodCost(cfg,heroIds){return heroIds.reduce((total,id)=>{const h=heroById(id);return total+Math.max(0,cfg.food-(h?equipmentEffect(h,"foodEfficiency"):0));},0);}
function canPayRun(cfg,heroIds){return state.resources.food>=runFoodCost(cfg,heroIds) && state.resources.essence>=(cfg.essence||0) && state.resources.keys>=(cfg.keys||0);}
function payRun(cfg,heroIds){spendTieredResource("food",runFoodCost(cfg,heroIds));state.resources.essence-=cfg.essence||0;state.resources.keys-=cfg.keys||0;}

function startRun(combatId,heroIds,autoRepeat=true){
  const cfg=COMBAT[combatId];if(!cfg)return;heroIds=heroIds.filter(id=>{const h=heroById(id);return h&&h.assignment!=="combat"&&h.assignment!=="inn"&&h.sanity>0;});
  if(!heroIds.length)return toast("⚠️","Choose at least one available hero");
  const max=cfg.maxParty;if(heroIds.length>max)return toast("⚠️",`${cfg.short} allows up to ${max} heroes`);
  if(combatCount()+heroIds.length>4)return toast("⚠️","Only four heroes may fight at once");
  if(heroIds.some(id=>heroById(id).level<cfg.minLevel))return toast("🔒",`${cfg.name} requires Combat Level ${cfg.minLevel}`);
  const foodCost=runFoodCost(cfg,heroIds);if(!canPayRun(cfg,heroIds))return toast("🎒","Not enough supplies",`Need ${foodCost} Food${cfg.essence?`, ${cfg.essence} Essence`:""}${cfg.keys?`, ${cfg.keys} Key`:""}.`);
  const party=heroIds.map(heroById).filter(Boolean),duration=combatDuration(cfg,party);payRun(cfg,heroIds);for(const id of heroIds)heroById(id).assignment="combat";
  state.combatRuns.push({id:uid(),combatId,heroIds,progress:0,duration,baseDuration:cfg.duration,autoRepeat,startedAt:Date.now()});notify(`${cfg.short} started`,`${party.map(h=>h.name).join(", ")} departed with a ${chanceLabel(combatSuccessChance(cfg,party))} success chance and ${formatDuration(duration)} clear time.`,cfg.icon);markDirty();renderAll();closeDrawer();
}

function stopRun(id,announce=true){const run=state.combatRuns.find(r=>r.id===id);if(!run)return;for(const hid of run.heroIds){const h=heroById(hid);if(h?.assignment==="combat")h.assignment="idle";}state.combatRuns=state.combatRuns.filter(r=>r.id!==id);if(announce)notify("Party recalled","The adventurers are returning to town.","🏰");markDirty();renderAll();}

function assignHero(heroId,assignment){
  const h=heroById(heroId);if(!h||h.assignment==="inn")return toast("🛏️","Hero is still recovering");
  if(h.assignment==="combat"){const run=state.combatRuns.find(r=>r.heroIds.includes(heroId));if(run)stopRun(run.id,false);}
  h.workProgress=0;if(assignment==="tavern")sendToTavern(h);else h.assignment=assignment;if(assignment==="tavern" && h.sanity>=100)h.assignment="idle";checkAchievements();notify("Assignment changed",`${h.name} is now ${ASSIGNMENTS[h.assignment].name.toLowerCase()}.`,ASSIGNMENTS[h.assignment].icon);markDirty();renderAll();
}

function checkAchievements(){for(const a of ACHIEVEMENTS){if(!state.achievements.includes(a.id)&&a.test(state)){state.achievements.push(a.id);notify("Milestone unlocked",a.name,a.icon);}}}

function renderAll(){renderResources();renderTown();renderHeroes();renderAssignments();renderCombat();renderWarehouse();renderMarket();renderProgress();renderSyncUser();}
function refreshWorkTimers(){$$("[data-work-timer]").forEach(el=>{const h=heroById(el.dataset.workTimer);if(h)el.textContent=workActionStatus(h);});}
function renderResources(){
  const data=[['gold','🪙','Gold'],['food','🥖','Food'],['metal','⛓️','Metal'],['wood','🪵','Wood'],['essence','✨','Essence'],['keys','🗝️','Raid Keys'],['repairKits','🧰','Repair Kits']];
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
  $("#heroLayer").innerHTML=state.heroes.map((h,i)=>{const [x,y]=mapPosition(h,i),recover=["inn","tavern"].includes(h.assignment);return `<div class="map-hero ${h.assignment==="combat"?"fighting":""} ${recover?"recovering":""}" style="--x:${x};--y:${y};--hero-color:${h.color};--delay:-${i*.22}s"><button data-action="open-hero" data-hero="${h.id}" aria-label="${h.name}, ${statusFor(h)}">${h.icon}</button><small>${escapeHTML(h.name)} · ${escapeHTML(statusFor(h))}</small></div>`}).join("");
  const fighting=state.heroes.filter(h=>h.assignment==="combat");$("#activePartyCount").textContent=`${fighting.length} / 4 fighting`;$("#activePartyMini").innerHTML=fighting.length?fighting.map(h=>`<span title="${h.name}">${h.icon}</span>`).join(""):`<span class="empty-mini">No active combat party</span>`;
  const work=state.heroes.filter(h=>["farm","mine","forest","smith"].includes(h.assignment));$("#townOutputText").textContent=work.length?`${work.length} heroes producing`:"No one working";
  const counts=["farm","mine","forest","smith"].map(a=>[a,state.heroes.filter(h=>h.assignment===a).length]);$("#townOutputMini").innerHTML=counts.filter(x=>x[1]).map(([a,n])=>`<div class="mini-bar"><span>${ASSIGNMENTS[a].icon} ${ASSIGNMENTS[a].name}</span><i style="--w:${n/6*100}%"></i><b>${n}</b></div>`).join("")||`<span class="empty-mini">Assign heroes to begin production.</span>`;
  const story=state.notifications[0];$("#latestStoryTitle").textContent=story?.title||"Quiet town";$("#latestStoryText").textContent=story?.text||"No town reports yet.";$("#notificationBadge").hidden=!state.notifications.length;$("#notificationBadge").textContent=Math.min(99,state.notifications.length);
}

function renderHeroes(){
  $("#heroRoster").innerHTML=state.heroes.map(h=>{const w=h.equipment.weapon?itemData(h.equipment.weapon):null,a=h.equipment.armor?itemData(h.equipment.armor):null,p=h.equipment.pet?itemData(h.equipment.pet):null,t=h.equipment.trinket?itemData(h.equipment.trinket):null,status=h.assignment==="combat"?"combat":["inn","tavern"].includes(h.assignment)?"recovery":"";return `<article class="hero-card" style="--hero-color:${h.color}"><div class="hero-card-head"><div class="hero-portrait">${h.icon}</div><div><h3>${escapeHTML(h.name)}</h3><span class="class-label">${h.className}</span></div><div class="hero-level"><strong>${h.level}</strong><small>Combat level</small></div></div><div class="hero-status-line"><span class="status-tag ${status}">${ASSIGNMENTS[h.assignment]?.icon||"✨"} ${escapeHTML(statusFor(h))}</span><small>Power ${Math.floor(heroPower(h))}</small></div><div class="hero-vitals"><div class="meter-row"><span>Combat XP</span><div class="meter"><span style="--value:${h.xp/xpForLevel(h.level)*100}%;--meter-color:${h.color}"></span></div><b>${Math.floor(h.xp/xpForLevel(h.level)*100)}%</b></div><div class="meter-row"><span>Sanity</span><div class="meter"><span style="--value:${h.sanity}%;--meter-color:#c59637"></span></div><b>${Math.floor(h.sanity)}</b></div></div><div class="equipment-pair">${gearSlot("Weapon",w)}${gearSlot("Armor",a)}${gearSlot("Pet",p)}${gearSlot("Trinket",t)}</div><div class="hero-card-actions"><button data-action="open-hero" data-hero="${h.id}">Character page</button><button data-action="quick-assign" data-hero="${h.id}">Assign</button></div></article>`}).join("");
}
function gearSlot(label,item){return `<div class="gear-slot"><span>${item?.icon||"＋"}</span><div><small>${label}</small><strong>${item?escapeHTML(item.name):"Empty"}</strong></div></div>`;}

function renderAssignments(){
  const options=["idle","farm","mine","forest","smith","tavern"];
  $("#assignmentBoard").innerHTML=state.heroes.map(h=>`<article class="assignment-row"><div class="assignment-hero"><span class="mini-portrait" style="--hero-color:${h.color}">${h.icon}</span><div><strong>${escapeHTML(h.name)} · ${h.className}</strong><small>Combat ${h.level} · Best skill ${bestSkill(h)}</small></div></div><div class="assignment-options">${options.map(a=>`<button class="${h.assignment===a?"active":""}" data-action="assign" data-hero="${h.id}" data-assignment="${a}" ${h.assignment==="inn"?"disabled":""}>${ASSIGNMENTS[a].icon} ${ASSIGNMENTS[a].name}</button>`).join("")}<button class="${h.assignment==="combat"?"active":""}" data-action="open-view" data-view="combat">⚔️ Combat Hall</button></div><div class="assignment-detail"><strong>${escapeHTML(statusFor(h))}</strong><br>${workActionStatus(h)?`<span data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</span>`:escapeHTML(ASSIGNMENTS[h.assignment]?.detail||"Away on a combat run.")}</div></article>`).join("");
}
function bestSkill(h){const names={farming:"Farming",mining:"Mining",woodcutting:"Woodcutting",smithing:"Smithing"};const [k,v]=Object.entries(h.skills).sort((a,b)=>b[1].level-a[1].level)[0];return `${names[k]} ${v.level}`;}

function renderCombat(){
  $("#combatSlotCount").textContent=combatCount();
  $("#activeRuns").innerHTML=state.combatRuns.length?state.combatRuns.map(r=>{const c=COMBAT[r.combatId],party=r.heroIds.map(heroById).filter(Boolean),pct=clamp(r.progress/r.duration*100,0,100);return `<article class="active-run"><div class="run-icon">${c.icon}</div><div><div class="run-title"><strong>${c.name}</strong><small>${Math.ceil(r.duration-r.progress)}s remaining</small></div><div class="run-progress"><span style="width:${pct}%"></span></div><div class="run-party">${party.map(h=>`<i title="${escapeHTML(h.name)}">${h.icon}</i>`).join("")}<span>${chanceLabel(combatSuccessChance(c,party))} success · ${combatSpeedMultiplier(c,party).toFixed(2)}× speed · ${r.autoRepeat?"Repeating":"Single run"}</span></div></div><div class="active-run-actions"><button class="loot-button" data-action="open-loot" data-combat="${c.id}" aria-label="View ${c.name} rewards"><span class="loot-chest-icon" aria-hidden="true"></span> Rewards</button><button class="stop-run" data-action="stop-run" data-run="${r.id}">Recall party</button></div></article>`}).join(""):`<div class="empty-state"><span>🗺️</span>No active runs. Your heroes are waiting for orders.</div>`;
  const groups=[
    ["expedition","Expeditions","Free and low-cost routes for Combat XP, Gold, and the Essence needed to enter Dungeons."],
    ["dungeon","Dungeons","Solo or duo multi-room runs with unique equipment and Raid Key chances."],
    ["raid","Raids","Four-hero milestone battles at Levels 30, 60, and 90 with exceptional jackpot gear."],
  ];
  const highest=Math.max(...state.heroes.map(h=>h.level));
  $("#combatCatalog").innerHTML=groups.map(([category,title,subtitle])=>`<section id="combat-${category}" class="combat-section"><div class="combat-section-heading"><div><span class="eyebrow">${category}</span><h3>${title}</h3><p>${subtitle}</p></div><span>${Object.values(COMBAT).filter(c=>c.category===category).length} locations</span></div><div class="combat-cards">${Object.values(COMBAT).filter(c=>c.category===category).map(c=>{const locked=highest<c.minLevel;return `<article class="combat-card ${locked?"locked":""}" style="--card-a:${c.colors[0]};--card-b:${c.colors[1]}" data-icon="${c.icon}"><span class="eyebrow">${c.eyebrow}</span><h3>${c.name}</h3><p>${c.description}</p><ul>${c.requirements.map(x=>`<li>${x}</li>`).join("")}</ul><div class="combat-card-actions"><button class="loot-button" data-action="open-loot" data-combat="${c.id}" aria-label="View ${c.name} rewards"><span class="loot-chest-icon" aria-hidden="true"></span> Loot</button><button data-action="open-combat" data-combat="${c.id}">${locked?`Locked · Lv ${c.minLevel}`:`Prepare ${c.short}`}</button></div></article>`}).join("")}</div></section>`).join("");
}

function chanceLabel(value){return `${(Math.round(value*10000)/100).toFixed(2).replace(/\.?0+$/,"")}%`;}
function lootRows(c){
  const rows=[{icon:"🪙",name:`${fmt(c.gold[0])}–${fmt(c.gold[1])} Gold`,detail:"Guaranteed after a victory",chance:"100%"},{icon:"⚔️",name:`${fmt(c.xp)} Combat XP`,detail:"For each participating hero",chance:"100%"}];
  if(c.essenceChance)rows.push({icon:"✨",name:"1 Essence",detail:"Expedition Essence roll",chance:chanceLabel(c.essenceChance)});
  if(c.essenceReward)rows.push({icon:"✨",name:`${c.essenceReward[0]}–${c.essenceReward[1]} Essence`,detail:"Guaranteed after a victory",chance:"100%"});
  if(c.keyChance)rows.push({icon:"🗝️",name:"1 Raid Key",detail:"Independent Dungeon roll",chance:chanceLabel(c.keyChance)});
  if(c.category==="raid")rows.push({icon:"🎒",name:"Common raid loot only",detail:"The rare table is not entered; Gold, XP, and Essence still drop",chance:"90%"});
  for(const key of c.pool||[]){const d=ITEMS[key];rows.push({icon:d.icon,name:d.name,detail:`${d.tier} ${d.type} · Level ${d.requiredLevel||1}`,chance:chanceLabel((c.itemChance||0)/c.pool.length)});}
  for(const key of c.trinketPool||[]){const d=ITEMS[key];rows.push({icon:d.icon,name:d.name,detail:`${d.tier} · Non-tradeable`,chance:chanceLabel((c.trinketChance||0)/c.trinketPool.length)});}
  if(c.eggKey){const d=ITEMS[c.eggKey];rows.push({icon:d.icon,name:d.name,detail:"Independent boss-egg roll · Non-tradeable",chance:chanceLabel(c.eggChance)});}
  return rows;
}
function openLoot(combatId){const c=COMBAT[combatId];if(!c)return;const equipmentChance=c.category==="raid"?`A victory has a 10% chance to enter the 12-item rare table and a 90% chance to award common raid loot only. Each rare item is equally likely.`:c.pool?.length?`Each victory has one ${chanceLabel(c.itemChance)} equipment roll. If it succeeds, every listed item is equally likely.`:"This activity does not drop unique equipment.";openDrawer(`${c.name} Rewards`,"Possible loot and exact rates",`<div class="loot-summary"><span>${c.icon}</span><div><strong>Victory rewards</strong><p>${equipmentChance}</p></div></div><div class="loot-table">${lootRows(c).map(row=>`<div class="loot-row"><span class="loot-icon">${row.icon}</span><div><strong>${escapeHTML(row.name)}</strong><small>${escapeHTML(row.detail)}</small></div><b>${row.chance}</b></div>`).join("")}</div><p class="loot-note">Drop chances are per completed victory. Independent rolls—such as trinkets, keys, and boss eggs—can occur alongside an equipment drop.</p><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Close</button><button class="primary-button" data-action="open-combat" data-combat="${c.id}">Prepare ${c.short}</button></div>`);}

function renderWarehouse(){
  $("#warehouseCount").textContent=occupiedSlots();$("#warehouseCapacity").textContent=`/${warehouseCapacity()} slots`;
  $$("[data-action='warehouse-filter']").forEach(b=>b.classList.toggle("active",b.dataset.filter===warehouseFilter));
  const list=state.inventory.filter(i=>warehouseFilter==="all"||itemData(i).type===warehouseFilter||(warehouseFilter==="special"&&itemData(i).special));
  $("#inventoryGrid").innerHTML=list.length?list.map(i=>{const d=itemData(i),gear=["weapon","armor"].includes(d.type),equippable=gear||["pet","trinket"].includes(d.type),stats=[d.attack?`+${d.attack} ATK`:"",d.defense?`+${d.defense} DEF`:"",d.element,d.effectText].filter(Boolean).join(" · ")||"A curious town treasure",actions=[equippable?`<button data-action="equip-item" data-item="${i.id}">Equip</button>`:"",d.type==="egg"?`<button data-action="hatch-egg" data-item="${i.id}">Hatch egg</button>`:"",gear?`<button data-action="repair-item" data-item="${i.id}">Repair</button>`:"",d.salvage?`<button data-action="salvage-item" data-item="${i.id}">Salvage +${d.salvage} ✨</button>`:"",!d.soulbound?`<button data-action="sell-item" data-item="${i.id}">List</button>`:""].filter(Boolean).join("");return `<article class="item-card ${d.special?"special":""}"><div class="item-icon">${d.icon}</div><div><h4>${escapeHTML(d.name)}</h4><span class="item-meta">${d.tier} ${d.type} · ${d.className||"Any hero"}</span><p>${escapeHTML(stats)}${gear?`<br>Durability ${Math.floor(d.durability??100)}%`:""}${d.soulbound?`<br><b>Non-tradeable</b>`:""}</p></div><div class="item-actions">${actions}</div></article>`}).join(""):`<div class="empty-state"><span>📦</span>No matching items in the Warehouse.</div>`;
}

function renderMarket(){
  $("#marketStatus").innerHTML=currentUser?`<div class="notice">Connected as ${escapeHTML(currentUser.displayName||currentUser.email||"Adventurer")}. Listings are synchronized through Firebase.</div>`:`<div class="notice warning">Sign in to use the live player Marketplace. Device play keeps every other system available.</div>`;
  const mine=marketListings.filter(l=>l.sellerId===currentUser?.uid),others=marketListings.filter(l=>l.sellerId!==currentUser?.uid&&!ITEMS[l.itemKey]?.soulbound);
  $("#marketListings").innerHTML=others.length?others.map(l=>listingHTML(l,false)).join(""):`<div class="empty-state"><span>⚖️</span>No player listings are available right now.</div>`;
  $("#myListings").innerHTML=mine.length?mine.map(l=>listingHTML(l,true)).join(""):`<div class="empty-state"><span>🪙</span>Your active listings and claimed payouts appear here.</div>`;
}
function listingHTML(l,mine){const d=ITEMS[l.itemKey]||{name:l.itemName,type:"resource",icon:l.icon||"📦"};return `<article class="listing"><div class="item-icon">${d.icon||"📦"}</div><div><strong>${escapeHTML(d.name||l.itemName)}</strong><small>${escapeHTML(l.sellerName||"Adventurer")} · Qty ${l.quantity||1}</small></div><div class="listing-price"><b>🪙 ${fmt(l.price)}</b><button data-action="${mine?"cancel-listing":"buy-listing"}" data-listing="${l.id}">${mine?"Cancel":"Buy"}</button></div></article>`;}

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

function profileEquipmentSlot(h,slot,label){const d=h.equipment[slot]?itemData(h.equipment[slot]):null,detail=d?[d.attack?`+${d.attack} ATK`:"",d.defense?`+${d.defense} DEF`:"",d.element,d.effectText,["weapon","armor"].includes(slot)?`${Math.floor(d.durability??100)}% durability`:""].filter(Boolean).join(" · "):slot==="pet"?"Find pets while skilling or hatch a raid egg":slot==="trinket"?"Find trinkets in Dungeons":"No item equipped";return `<article class="profile-gear-slot"><span>${d?.icon||"＋"}</span><div><small>${label}</small><strong>${d?escapeHTML(d.name):"Empty slot"}</strong><p>${escapeHTML(detail)}</p></div></article>`;}
function openHero(id){
  const h=heroById(id);if(!h)return;const skillNames={farming:"Farming",mining:"Mining",woodcutting:"Woodcutting",smithing:"Smithing"},maxHP=heroMaxHP(h),specials=heroSpecials(h),records=[
    ["⚔️","Enemies defeated",h.records.kills],["🐲","Raid bosses slain",h.records.raidBosses],["🗝️","Dungeon bosses slain",h.records.dungeonBosses],["🪙","Gold earned",h.records.goldEarned],
    ["🍺","Beers at the Tavern",h.records.beers],["🧭","Expeditions finished",h.records.expeditions],["🏰","Dungeons cleared",h.records.dungeons],["🌘","Raids cleared",h.records.raids],
    ["📦","Rare finds",h.records.itemsFound],["🥕","Food gathered",h.records.foodGathered],["⛓️","Metal mined",h.records.metalMined],["🪵","Wood gathered",h.records.woodGathered],
    ["🧰","Repair kits forged",h.records.kitsForged],["📋","Work actions",h.records.workActions],["🛒","Defeats",h.records.defeats],["⏳","Time active",formatDuration(h.records.secondsActive)],
  ];
  openDrawer(h.name,`${h.className} · Combat Level ${h.level}`,`<div class="character-banner" style="--hero-color:${h.color}"><span>${h.icon}</span><div><strong>${escapeHTML(h.name)}</strong><small>${h.className} · ${escapeHTML(statusFor(h))}</small></div></div><div class="drawer-section"><h3>Rename this hero</h3><div class="rename-row"><input id="heroNameInput" maxlength="24" value="${escapeHTML(h.name)}" aria-label="New hero name"><button class="primary-button" data-action="rename-hero" data-hero="${h.id}">Save name</button></div></div><div class="drawer-section"><h3>Combat Sheet</h3><div class="combat-stat-grid"><div><span>⚔️</span><strong>${fmt(heroAttack(h))}</strong><small>Attack</small></div><div><span>🛡️</span><strong>${fmt(heroDefense(h))}</strong><small>Defense</small></div><div><span>❤️</span><strong>${fmt(Math.min(h.hp??maxHP,maxHP))} / ${fmt(maxHP)}</strong><small>HP</small></div><div><span>✦</span><strong>${fmt(heroPower(h))}</strong><small>Combat strength</small></div></div>${specials.length?`<div class="special-chip-list">${specials.map(x=>`<span>${escapeHTML(x)}</span>`).join("")}</div>`:`<p class="profile-empty-note">No special effects yet. Dungeon gear, pets, and trinkets can add them.</p>`}</div><div class="drawer-section"><div class="profile-section-title"><h3>Equipment</h3><button class="text-button" data-action="open-view" data-view="warehouse">Open Warehouse</button></div><div class="profile-equipment-grid">${profileEquipmentSlot(h,"weapon","Weapon")}${profileEquipmentSlot(h,"armor","Armor")}${profileEquipmentSlot(h,"pet","Pet")}${profileEquipmentSlot(h,"trinket","Trinket")}</div></div><div class="drawer-section"><h3>${escapeHTML(h.name)}'s Story</h3><div class="hero-record-grid">${records.map(([icon,label,value])=>`<div><span>${icon}</span><strong>${typeof value==="number"?fmt(value):escapeHTML(value)}</strong><small>${label}</small></div>`).join("")}</div></div><div class="drawer-section"><h3>Independent Work Skills</h3>${workActionStatus(h)?`<div class="notice work-timer">⏱️ Next timed action: <strong data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</strong></div>`:""}<div class="skill-list">${Object.entries(h.skills).map(([k,s])=>`<div class="skill-row"><span>${skillNames[k]}</span><b>Lv ${s.level}</b><div class="meter"><span style="--value:${s.xp/xpForLevel(s.level)*100}%"></span></div></div>`).join("")}</div></div><div class="drawer-section"><h3>Quick Assignment</h3><div class="choice-grid">${["idle","farm","mine","forest","smith","tavern"].map(a=>`<button class="choice-card ${h.assignment===a?"selected":""}" data-action="assign" data-hero="${h.id}" data-assignment="${a}"><span>${ASSIGNMENTS[a].icon}</span><strong>${ASSIGNMENTS[a].name}</strong><small>${ASSIGNMENTS[a].detail}</small></button>`).join("")}</div></div>`);
}

function resourceTierHTML(id){
  const resource=RESOURCE_ASSIGNMENTS[id];if(!resource)return "";const b=BUILDINGS[id],buildingLevel=state.buildings[id],bestSkill=Math.max(...state.heroes.map(h=>h.skills[b.skill].level));
  return `<div class="drawer-section"><h3>${resource[0].toUpperCase()+resource.slice(1)} Tiers</h3><p class="tier-explainer">Every item is a timed action. Starter actions take 10 seconds at Skill 1 and Building 1; skill and building levels make actions faster. Heroes automatically use their highest unlocked tier.</p><div class="resource-tier-list">${RESOURCE_TIERS[resource].map(t=>{const unlocked=bestSkill>=t.level&&buildingLevel>=t.building,amount=state.resourceTiers[resource][t.id]||0;return `<div class="resource-tier ${unlocked?"unlocked":"locked"}"><span>${unlocked?t.icon:"🔒"}</span><div><strong>${t.tier} · ${t.name}</strong><small>${unlocked?`${amount<10?amount.toFixed(1):fmt(amount)} stored · ${t.value} supply each · ${TIER_ACTION_SECONDS[t.id]}s base`:`Requires skill ${t.level} + building ${t.building}`}</small></div><b>${unlocked?`×${t.value}`:"Locked"}</b></div>`}).join("")}</div></div>`;
}
function openBuilding(id){const b=BUILDINGS[id],level=state.buildings[id],cost=Math.floor(b.baseCost*Math.pow(1.55,level-1));const workers=state.heroes.filter(h=>h.assignment===id);openDrawer(b.name,`Building level ${level}`,`<div class="drawer-section"><div class="info-grid"><div class="info-tile"><small>Assigned heroes</small><strong>${workers.length} / 6</strong></div><div class="info-tile"><small>Action speed</small><strong>+${(level-1)*8}%</strong></div><div class="info-tile"><small>Next upgrade</small><strong>🪙 ${fmt(cost)}</strong></div><div class="info-tile"><small>Role</small><strong>${escapeHTML(b.description)}</strong></div></div></div>${resourceTierHTML(id)}${id==="smith"?smithCraftHTML():""}<div class="drawer-section"><h3>Heroes here</h3><div class="action-list">${workers.length?workers.map(h=>`<button data-action="open-hero" data-hero="${h.id}"><span>${h.icon} ${escapeHTML(h.name)}</span><small data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</small></button>`).join(""):`<div class="empty-state">No heroes are assigned here.</div>`}</div></div><div class="drawer-footer"><button class="soft-button" data-action="open-view" data-view="assign">Assignments</button><button class="primary-button" data-action="upgrade-building" data-building="${id}">Upgrade · 🪙 ${fmt(cost)}</button></div>`);}
function smithCraftHTML(){const keys=["goodSword","goodWand","goodBow","goodStaff","goodDaggers","goodTome","warriorArmor","wizardArmor","archerArmor","druidArmor","assassinArmor","summonerArmor"];return `<div class="drawer-section"><h3>Normal Equipment Recipes</h3><div class="action-list">${keys.map(key=>{const d=ITEMS[key];return `<button data-action="craft-item" data-key="${key}"><span>${d.icon} ${d.name}</span><small>${d.metalCost} Metal · ${d.woodCost} Wood</small></button>`}).join("")}</div></div>`;}
function craftItem(key){const d=ITEMS[key];if(!d?.metalCost)return;if(occupiedSlots()>=warehouseCapacity())return toast("📦","Warehouse is full");if(state.resources.metal<d.metalCost||state.resources.wood<d.woodCost)return toast("⚒️","Not enough crafting materials",`Need ${d.metalCost} Metal and ${d.woodCost} Wood.`);spendTieredResource("metal",d.metalCost);spendTieredResource("wood",d.woodCost);state.inventory.push({id:uid(),key,durability:100,acquiredAt:Date.now()});notify("Equipment crafted",`${d.name} was delivered to the Warehouse.`,d.icon);markDirty();renderAll();openBuilding("smith");}

function openCombat(combatId){
  const c=COMBAT[combatId];if(!c)return;const available=state.heroes.filter(h=>h.assignment!=="combat"&&h.assignment!=="inn"&&h.sanity>0),max=c.maxParty,entry=[c.keys?`${c.keys} Key${c.keys===1?"":"s"}`:"",c.essence?`${c.essence} Essence`:""].filter(Boolean).join(" + ")||"No key or Essence";
  openDrawer(c.name,c.eyebrow,`<div class="drawer-section"><p>${c.description}</p><div class="info-grid"><div class="info-tile"><small>Base duration</small><strong>${formatDuration(c.duration)}</strong></div><div class="info-tile"><small>Required level</small><strong>Combat ${c.minLevel}+</strong></div><div class="info-tile"><small>Party size</small><strong>Up to ${max}</strong></div><div class="info-tile"><small>Food cost</small><strong>${c.food} per hero</strong></div><div class="info-tile"><small>Entry</small><strong>${entry}</strong></div><button class="info-tile loot-preview" data-action="open-loot" data-combat="${c.id}"><small>Possible rewards</small><strong><span class="loot-chest-icon" aria-hidden="true"></span> View loot & rates</strong></button></div></div><div class="drawer-section"><h3>Choose the party</h3><div class="choice-grid" id="partyChoices">${available.map(h=>`<button class="choice-card ${h.level<c.minLevel?"locked":""}" data-action="toggle-party" data-hero="${h.id}" data-max="${max}" data-combat="${c.id}" ${h.level<c.minLevel?"disabled":""}><span>${h.icon}</span><strong>${escapeHTML(h.name)} · Lv ${h.level}</strong><small>${h.level<c.minLevel?`Needs Level ${c.minLevel}`:`Power ${Math.floor(heroPower(h))} · Sanity ${Math.floor(h.sanity)}`}</small></button>`).join("")}</div></div><div id="combatPartyPreview" class="combat-party-preview empty"><div><span>🎯</span><strong id="partySuccess">Choose heroes</strong><small>Success chance</small></div><div><span>✦</span><strong id="partyPower">—</strong><small>Party power</small></div><div><span>⏱️</span><strong id="partyDuration">${formatDuration(c.duration)}</strong><small id="partySpeed">Base duration</small></div><div><span>🥖</span><strong id="partyFood">—</strong><small>Food cost</small></div></div><p id="combatPreviewNote" class="combat-preview-note">Select heroes to calculate this party’s exact odds and clear speed.</p><label class="notice"><input id="autoRepeatChoice" type="checkbox" checked> Automatically repeat while supplies and heroes allow.</label><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Cancel</button><button class="primary-button" data-action="start-run" data-combat="${c.id}">Begin ${c.short}</button></div>`);
  updateCombatPreview(c.id);
}
function updateCombatPreview(combatId){
  const c=COMBAT[combatId],panel=$("#combatPartyPreview");if(!c||!panel)return;const heroIds=$$("#partyChoices .selected").map(x=>x.dataset.hero),party=heroIds.map(heroById).filter(Boolean),success=$("#partySuccess"),power=$("#partyPower"),duration=$("#partyDuration"),speed=$("#partySpeed"),food=$("#partyFood"),note=$("#combatPreviewNote");
  if(!party.length){panel.classList.add("empty");success.textContent="Choose heroes";power.textContent="—";duration.textContent=formatDuration(c.duration);speed.textContent="Base duration";food.textContent="—";note.textContent="Select heroes to calculate this party’s exact odds and clear speed.";return;}
  const totalPower=partyPower(party),chance=combatSuccessChance(c,party),clearTime=combatDuration(c,party),multiplier=combatSpeedMultiplier(c,party);panel.classList.remove("empty");panel.dataset.risk=chance>=.85?"high":chance>=.6?"medium":"low";success.textContent=chanceLabel(chance);power.textContent=fmt(totalPower);duration.textContent=formatDuration(clearTime);speed.textContent=`${multiplier.toFixed(2)}× clear speed`;food.textContent=fmt(runFoodCost(c,heroIds));note.textContent=`More party power improves both success chance and clear speed. Success chance is capped at 96%; clear speed is capped at 3×.`;
}
function openCombatCategory(category){closeDrawer();openView("combat");setTimeout(()=>document.querySelector(`#combat-${category}`)?.scrollIntoView({behavior:"smooth",block:"start"}),80);}

function openNotifications(){openDrawer("Town Reports","The living history of Briarwatch",`<div class="action-list">${state.notifications.map(n=>`<article class="notice"><strong>${n.icon||"✦"} ${escapeHTML(n.title)}</strong><br><small>${new Date(n.time).toLocaleString()}</small><p>${escapeHTML(n.text)}</p></article>`).join("")}</div><div class="drawer-footer"><button class="soft-button" data-action="clear-reports">Clear reports</button><button class="primary-button" data-action="close-drawer">Done</button></div>`);}

function openAccount(){
  const cloud=!!currentUser,accountActions=cloud?`<button data-action="sync"><span>☁️ Save to cloud now</span><small>Sync this device</small></button><button data-action="sign-out"><span>🚪 Sign out</span><small>Device save remains</small></button>`:`<button data-action="open-auth"><span>☁️ Sign in for cloud saves</span><small>Device play is active</small></button>`;
  openDrawer("Account & Town",cloud?(currentUser.email||"Cloud adventurer"):"Playing on this device",`<div class="drawer-section"><div class="info-grid"><div class="info-tile"><small>Save</small><strong>${cloud?"Firebase cloud + device":"This device"}</strong></div><div class="info-tile"><small>Version</small><strong>${VERSION}</strong></div><div class="info-tile"><small>Town created</small><strong>${new Date(state.createdAt).toLocaleDateString()}</strong></div><div class="info-tile"><small>Offline time</small><strong>${formatDuration(state.stats.offlineSeconds)}</strong></div></div></div><div class="action-list">${accountActions}<button data-action="export-save"><span>📤 Export save backup</span><small>Download JSON</small></button><button data-action="reset-game"><span>⚠️ Begin a new town</span><small>Starts with zero resources</small></button></div>`);
}

function upgradeBuilding(id){const b=BUILDINGS[id],cost=Math.floor(b.baseCost*Math.pow(1.55,state.buildings[id]-1));if(state.resources.gold<cost)return toast("🪙","Not enough Gold");state.resources.gold-=cost;state.buildings[id]++;notify(`${b.name} upgraded`,`Building Level ${state.buildings[id]} is now complete.`,b.icon);markDirty();renderAll();openBuilding(id);}

function equipItem(id){const item=state.inventory.find(i=>i.id===id);if(!item)return;const d=itemData(item);if(["pet","trinket"].includes(d.type))return openEquipPicker(id);const hero=state.heroes.find(h=>h.className===d.className);if(!hero)return toast("⚠️","No matching hero");equipItemToHero(id,hero.id);}
function openEquipPicker(itemId){const item=state.inventory.find(i=>i.id===itemId);if(!item)return;const d=itemData(item),slot=d.type;openDrawer(`Equip ${d.name}`,`${slot[0].toUpperCase()+slot.slice(1)} · Any hero`, `<div class="loot-summary"><span>${d.icon}</span><div><strong>${escapeHTML(d.name)}</strong><p>${escapeHTML(d.effectText||d.element||"Choose who will carry this item.")}</p></div></div><div class="drawer-section"><h3>Choose a hero</h3><div class="action-list">${state.heroes.map(h=>{const current=h.equipment[slot]?itemData(h.equipment[slot]):null,busy=h.assignment==="combat";return `<button data-action="equip-to-hero" data-item="${itemId}" data-hero="${h.id}" ${busy?"disabled":""}><span>${h.icon} ${escapeHTML(h.name)}</span><small>${busy?"Recall from combat first":current?`Replace ${escapeHTML(current.name)}`:`Empty ${slot} slot`}</small></button>`}).join("")}</div></div><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Cancel</button></div>`);}
function equipItemToHero(itemId,heroId){const idx=state.inventory.findIndex(i=>i.id===itemId),hero=heroById(heroId);if(idx<0||!hero)return;if(hero.assignment==="combat")return toast("⚔️","Recall this hero before changing equipment");const item=state.inventory[idx],d=itemData(item),slot=d.type;if(!["weapon","armor","pet","trinket"].includes(slot))return toast("⚠️","That item cannot be equipped");if(d.className&&hero.className!==d.className)return toast("⚠️",`${d.name} is for the ${d.className}`);if(hero.level<(d.requiredLevel||1))return toast("🔒",`${hero.name} needs Combat Level ${d.requiredLevel}`);if(hero.equipment[slot])state.inventory.push({...hero.equipment[slot],id:uid()});hero.equipment[slot]={...item};state.inventory.splice(idx,1);hero.hp=Math.min(hero.hp??heroMaxHP(hero),heroMaxHP(hero));notify("Equipment changed",`${hero.name} equipped ${d.name}.`,d.icon);markDirty();renderAll();closeDrawer();}
function hatchEgg(itemId){const idx=state.inventory.findIndex(i=>i.id===itemId),egg=state.inventory[idx];if(idx<0||!egg)return;const d=itemData(egg),pet=ITEMS[d.hatchesTo];if(d.type!=="egg"||!pet)return toast("🥚","This egg cannot hatch");state.inventory.splice(idx,1);state.inventory.push({id:uid(),key:d.hatchesTo,acquiredAt:Date.now()});notify("The egg hatched!",`${pet.name} is ready to assist one of your heroes.`,pet.icon);markDirty();renderAll();}
function renameHero(heroId){const h=heroById(heroId),input=$("#heroNameInput");if(!h||!input)return;const name=input.value.trim().replace(/\s+/g," ");if(!name)return toast("✏️","A hero needs a name");if(name.length>24)return toast("✏️","Keep hero names to 24 characters");h.name=name;notify("A new name",`${h.className} is now known as ${name}.`,h.icon);markDirty();renderAll();openHero(heroId);}
function repairItem(id){const i=state.inventory.find(x=>x.id===id);if(!i)return;const d=itemData(i),needed=Math.ceil((100-(i.durability??100))/20);if(!needed)return toast("🧰","Item is already fully repaired");if(state.resources.repairKits<needed)return toast("🧰","Not enough Repair Kits");const essence=d.special?Math.ceil(needed/2):0;if(state.resources.essence<essence)return toast("✨","Special gear also needs Essence");state.resources.repairKits-=needed;state.resources.essence-=essence;i.durability=100;notify("Equipment repaired",`${d.name} is restored to full durability.`,"🧰");markDirty();renderAll();}
function salvageItem(id){const idx=state.inventory.findIndex(x=>x.id===id),i=state.inventory[idx];if(!i)return;const d=itemData(i);if(!d.salvage)return;state.resources.essence+=d.salvage;state.inventory.splice(idx,1);notify("Item salvaged",`${d.name} became ${d.salvage} Essence.`,"✨");markDirty();renderAll();}

async function initializeFirebase(){
  try{firebaseApi=await import("./firebase-config.js");firebaseApi.watchAuth(async user=>{currentUser=user;renderSyncUser();if(user){setSync("saving");const cloud=await firebaseApi.loadGame(user.uid);if(cloud?.updatedAt>state.updatedAt){state=migrate(cloud);localStorage.setItem(SAVE_KEY,JSON.stringify(state));notify("Cloud town restored","Your latest Firebase save is now on this device.","☁️");}await claimPayouts();subscribeOnline();scheduleCloudSave();if($("#authDialog").open)$("#authDialog").close();}else{setSync("device");unsubscribeOnline();}renderAll();});}
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

function showOffline(report){if(!report||report.seconds<60)return;const entries=[["Time away",formatDuration(report.seconds)],["🪙 Gold",report.gold],["🥖 Food",report.food],["⛓️ Metal",report.metal],["🪵 Wood",report.wood],["✨ Essence",report.essence],["🧰 Repair Kits",report.kits],["📦 Items",report.items],["⚔️ Runs completed",report.runs]].filter(([,v],i)=>i===0||Math.abs(v)>.01);$("#offlineReport").innerHTML=entries.map(([k,v],i)=>`<div class="offline-line"><span>${k}</span><strong>${i===0?v:`${v>=0?"+":""}${fmt(v)}`}</strong></div>`).join("");$("#offlineDialog").showModal();}

async function init(){
  const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");state=migrate(raw);const now=Date.now(),elapsed=Math.min(OFFLINE_LIMIT,Math.max(0,(now-(state.lastTick||now))/1000));const report=simulate(elapsed,true);state.lastTick=now;saveLocal();renderAll();
  $("#loadingText").textContent="The town is ready.";setTimeout(()=>{$("#loadingScreen").classList.add("fade");$("#app").hidden=false;setTimeout(()=>$("#loadingScreen").remove(),500);if(!settings.authDismissed)setTimeout(()=>$("#authDialog").showModal(),450);showOffline(report);},500);
  initializeFirebase();
  if("serviceWorker" in navigator)navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  setInterval(()=>{const now=Date.now(),delta=Math.min(5,(now-lastFrame)/1000);lastFrame=now;simulate(delta);renderResources();renderTown();renderCombat();refreshWorkTimers();markDirty();},1000);
}

init();
