const VERSION = "2.0.2";
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
const ENEMY_STAT_MULTIPLIER = 1.12;
const ENEMY_DAMAGE_MULTIPLIER = 1.30;
const ENEMY_OFFENSE_MULTIPLIER = 1.30;
const ENEMY_SURVIVABILITY_MULTIPLIER = 1.15;
const WORK_SKILL_NAMES = {farming:"Farming",cooking:"Cooking",mining:"Mining",woodcutting:"Woodcutting",smithing:"Smithing",plundering:"Plundering"};
const HERO_CHAT_VOICES = {
  warrior:{
    banter:[
      "I sharpened my sword. Then Vex sharpened it again without asking. I am choosing gratitude.",
      "A good shield solves most problems. The rest usually require a bigger shield.",
      "Someone moved my helmet. It was on my head. Nobody say anything.",
      "I have counted our emergency rations twice. Orin has named three of them.",
      "If the plan is 'Bram goes first,' I would at least like the courtesy of calling it a plan.",
      "The Tavern stew is improving. I can no longer identify the spoon marks afterward.",
      "Armor maintenance is mostly finding new places for dents to live.",
      "I do enjoy quiet days. I just don't trust them.",
      "Rowan says I walk too loudly. I say enemies deserve fair warning.",
      "My sword has one setting: useful. Vex claims that is two settings fewer than ideal.",
      "If anyone needs me, I will be doing the glamorous work of checking buckles.",
      "We should put a sign at the gate: 'Briarwatch—please attack in an orderly line.'",
      "Elowen called my fighting style 'repeatable blunt-force methodology.' I think that was praise.",
      "There is no shame in retreating. There is some paperwork, apparently.",
      "I can carry more. I should not have said that out loud.",
      "Nothing builds team spirit like everyone pretending they did not hear the ominous noise."
    ],
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
    banter:[
      "I labeled my spell components. Orin relabeled them with names like 'sparkly bit.' We are in negotiations.",
      "There is a measurable difference between 'magic' and 'reckless magic.' Mostly paperwork.",
      "Bram asked if I could enchant his shield. I asked what he wanted. He said 'more shield.'",
      "I have discovered three new laws of arcana today. Two are probably accidents.",
      "The correct number of books to bring on an expedition is all of them. Pack accordingly.",
      "I would like it recorded that the explosion was educational.",
      "Vex keeps appearing behind me while I read. I am considering a proximity glyph. A loud one.",
      "Tea improves concentration. This is empirical fact and not personal bias.",
      "If a rune is glowing, do not touch it. If it is whispering, definitely do not touch it.",
      "My robe pocket contains chalk, crystals, two biscuits, and a mystery I am postponing.",
      "Rowan says the weather is changing. My instruments agree, but with much better handwriting.",
      "I have optimized our route by 3.7 percent. Bram has optimized it by walking straight through the problem.",
      "Magic is ninety percent preparation and ten percent pretending the preparation covered this exact situation.",
      "Mira keeps plants on my windowsill. One of them has begun leaning away from my experiments.",
      "There is technically no rule against casting indoors. There are several new rules because I cast indoors.",
      "I am not overthinking it. I am thinking the appropriate amount with excellent coverage."
    ],
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
    banter:[
      "I can tell who raided the pantry by the footprints. I can also tell it was Orin.",
      "Wind from the west, clear sky, and Bram is clanking from three buildings away. Normal day.",
      "You learn a lot by watching quietly. Mostly that nobody else is quiet.",
      "I made six new arrows. Vex borrowed one. Somehow I now have five new arrows and a lockpick.",
      "The best place to stand in a fight is somewhere the enemy is not looking.",
      "I tried explaining fletching to Orin. One of his spirits is now wearing feathers.",
      "There is a bird on the watchtower that has beaten me at staring contests three days running.",
      "Bram calls this bow delicate. Bram also uses a sword to open crates.",
      "Tracks outside town look normal. Which is exactly what suspicious tracks would want me to think.",
      "I like the forest. It rarely asks follow-up questions.",
      "Elowen calculates trajectories. I point the sharp end away from us. Both methods have merit.",
      "I have spare bowstrings in three places. I am not telling Vex where any of them are.",
      "If you hear me say 'duck,' please skip the discussion and duck.",
      "Good news: I found our missing target. Bad news: Bram was using it as a table.",
      "Rain makes archery harder. It also makes everyone else complain louder, so it balances out.",
      "The horizon is clear. I will distrust it professionally."
    ],
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
    banter:[
      "The herb garden is doing well. The mint is planning a territorial expansion.",
      "I told Bram to rest his shoulder. He interpreted that as carrying things with the other shoulder.",
      "There is a fox near the forest path. We have agreed not to discuss who stole whose lunch.",
      "Plants are excellent listeners. They are less useful when I need someone to admit they broke a chair.",
      "Orin's spirits keep watering the same flower. It is now the most supported flower in Briarwatch.",
      "Vex insists they do not need healing. Their bandages have submitted a different opinion.",
      "The breeze smells like rain, pine, and whatever Elowen just burned.",
      "I made tea for everyone. Bram asked whether it counts as a potion if it tastes suspicious.",
      "Nature rewards patience. Adventurers usually reward whoever brought snacks.",
      "A small mushroom has appeared beside the Tavern. Please do not eat mysterious civic mushrooms.",
      "Rowan knows every bird call. I know which birds are complaining about Rowan.",
      "The old oak by the square is healthy. It also thinks our market prices are ridiculous.",
      "Healing magic works better when the patient stops walking away mid-spell. A general reminder.",
      "Some days the town needs a hero. Some days it needs everyone to drink water.",
      "I have asked the weeds to leave the Farm. They have requested better terms.",
      "Even Vex smiles sometimes. Usually when nobody else is looking. I am not looking, officially."
    ],
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
    banter:[
      "For the record, I was never on the roof. The roof is an unreliable witness.",
      "Bram's idea of stealth is lowering his voice while wearing several pans worth of armor.",
      "Someone locked the Warehouse. Adorable.",
      "I have not stolen Rowan's spare bowstring. I have merely relocated an unguarded resource.",
      "Orin asked if shadows have feelings. Mine is filing for reassignment.",
      "The best hiding place in town remains directly behind whoever claims they checked everywhere.",
      "Elowen installed a proximity glyph. It now screams when a cat walks past. Progress.",
      "I sharpened Bram's sword. He said thank you. This arrangement is becoming dangerously wholesome.",
      "There are seven squeaky floorboards in the Tavern. Six after tonight.",
      "I enjoy team meetings. They tell me exactly where everyone will be at once.",
      "Mira left tea outside my room. I drank it. This information goes no further.",
      "If a guard says 'nobody could get through there,' I consider it a personal invitation.",
      "My knives are organized by purpose. 'Emergency cheese' is a purpose.",
      "I heard a suspicious noise near the gate. It was Bram sitting down.",
      "Rowan keeps finding my footprints. I may have to start respecting them professionally.",
      "I am not brooding. I am standing efficiently in low light."
    ],
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
    banter:[
      "One of the spirits learned to knock. Unfortunately it only knocks from inside walls.",
      "I named a summon Sir Wobbles. Bram says this harms battlefield morale. Sir Wobbles disagrees.",
      "Elowen says my notes need structure. They have structure. It is just mostly arrows and exclamation marks.",
      "Good news! The pantry is not haunted. Bad news! Something else ate the biscuits.",
      "I asked the spirits to help clean. We now have six very clean spoons and a floating broom problem.",
      "Vex says I talk too much on stealth missions. So I have been whispering more enthusiastically.",
      "Mira's plants like my summons. One vine has adopted a tiny ghost.",
      "Bram told me not to summon anything in the Tavern again. The wording leaves several loopholes.",
      "Does anyone know why there is a chicken following me? No? Great, new friend.",
      "I tried to summon courage. I got a small blue creature holding a flag. Close enough.",
      "Rowan says I scare the wildlife. I think the wildlife is fascinated by me.",
      "There are twelve voices in my head right now, but eleven are invited.",
      "My tome opened itself to the page labeled 'Do Not.' I respect its optimism.",
      "The spirits voted on dinner. Soup won, somehow, despite none of them eating.",
      "I can absolutely explain the glowing footprints. I would prefer not to.",
      "If anyone finds a purple wisp wearing my hat, please tell it we are still arguing."
    ],
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
  farm:{name:"Farm",icon:"🌾",description:"Harvests raw ingredients. Food must be cooked before heroes can eat it.",baseCost:650,position:[20,36],skill:"farming"},
  cook:{name:"Kitchen",icon:"🍳",description:"Turns farm ingredients into combat-ready meals over time.",baseCost:750,position:[34,56],skill:"cooking"},
  mine:{name:"Mine",icon:"⛏️",description:"Produces named metals stored in the Warehouse.",baseCost:700,position:[80,34],skill:"mining"},
  forest:{name:"Forest",icon:"🌲",description:"Produces named woods stored in the Warehouse.",baseCost:625,position:[15,63],skill:"woodcutting"},
  smith:{name:"Blacksmith",icon:"⚒️",description:"Uses exact named metals and woods for equipment and Repair Kits.",baseCost:900,position:[60,70],skill:"smithing"},
  warehouse:{name:"Warehouse",icon:"📦",description:"Stores all loot, resources, and equipment.",baseCost:1100,position:[61,41]},
  market:{name:"Marketplace",icon:"⚖️",description:"Trades player goods and equipment for Gold.",baseCost:1200,position:[39,44]},
  inn:{name:"Inn",icon:"🛏️",description:"Physically restores heroes after defeat.",baseCost:850,position:[79,66]},
  tavern:{name:"Tavern",icon:"🍲",description:"Restores Sanity after battle; heroes pay their own tab.",baseCost:800,position:[35,70]},
  plunder:{name:"Shady Quarter",icon:"🏴‍☠️",description:"Send a hero on risky timed plundering jobs for personal Gold and stolen supplies.",baseCost:1000,position:[50,82],skill:"plundering"},
};

const ASSIGNMENTS = {
  idle:{name:"Available",icon:"✨",detail:"Ready for a new assignment."},
  farm:{name:"Farming",icon:"🌾",detail:"Harvests your selected raw ingredient for the Kitchen."},
  cook:{name:"Cooking",icon:"🍳",detail:"Turns raw farm ingredients into meals heroes can eat in combat."},
  mine:{name:"Mining",icon:"⛏️",detail:"Produces your selected metal for the Warehouse."},
  forest:{name:"Woodcutting",icon:"🌲",detail:"Produces your selected wood for the Warehouse."},
  smith:{name:"Smithing",icon:"⚒️",detail:"Uses Scrap Metal + Fallen Branches to make Repair Kits."},
  plunder:{name:"Plundering",icon:"🏴‍☠️",detail:"Risky timed jobs. Success pays the hero; the town collects tax."},
  tavern:{name:"At Tavern",icon:"🍲",detail:"Restoring Sanity to full."},
  inn:{name:"At Inn",icon:"🛏️",detail:"Recovering from defeat."},
  combat:{name:"Fighting",icon:"⚔️",detail:"Away on a combat run."},
};

const COMBAT = {
  meadowWatch:{id:"meadowWatch",category:"expedition",name:"Meadow Watch",short:"Meadow Watch",icon:"🌾",eyebrow:"Starter expedition · Level 1",description:"Guard the farms and learn the rhythm of combat without risking expensive supplies.",requirements:["Combat Level 1+","1–4 heroes","4 Food per hero"],minLevel:1,maxParty:4,duration:30,difficulty:18,food:4,gold:[12,22],xp:30,itemChance:0,pool:[],colors:["#5f843f","#29472f"]},
  whisperwood:{id:"whisperwood",category:"expedition",name:"Whisperwood Trail",short:"Whisperwood",icon:"🧭",eyebrow:"Forest expedition · Level 8",description:"Patrol old forest roads for better Combat XP, Gold, and occasional rare expedition equipment.",requirements:["Combat Level 8+","1–4 heroes","7 Food per hero"],minLevel:8,maxParty:4,duration:45,difficulty:55,food:7,gold:[28,50],xp:75,itemChance:.02,pool:["verdantBlade","briarRobes"],colors:["#3d6e4d","#1d3d2a"]},
  frostmarch:{id:"frostmarch",category:"expedition",name:"Frostmarch Pass",short:"Frostmarch",icon:"❄️",eyebrow:"Frozen expedition · Level 18",description:"Push through the frozen pass where tougher enemies guard rare regional equipment.",requirements:["Combat Level 18+","1–4 heroes","10 Food per hero"],minLevel:18,maxParty:4,duration:70,difficulty:110,food:10,gold:[70,115],xp:180,itemChance:.035,pool:["frostBow","healingStaff"],colors:["#517a91","#233d55"]},
  cindertrail:{id:"cindertrail",category:"expedition",name:"Cindertrail Patrol",short:"Cindertrail",icon:"🔥",eyebrow:"Volcanic expedition · Level 35",description:"Cross scorched roads beneath Cinderdeep and return with richer spoils.",requirements:["Combat Level 35+","1–4 heroes","14 Food per hero"],minLevel:35,maxParty:4,duration:100,difficulty:220,food:14,gold:[150,240],xp:420,itemChance:.045,pool:["emberBow","cinderTome"],colors:["#9a5434","#442824"]},
  stormcoast:{id:"stormcoast",category:"expedition",name:"Stormcoast March",short:"Stormcoast",icon:"⚡",eyebrow:"Tempest expedition · Level 55",description:"Hunt along storm-lashed cliffs where stronger regional loot enters circulation.",requirements:["Combat Level 55+","1–4 heroes","18 Food per hero"],minLevel:55,maxParty:4,duration:140,difficulty:420,food:18,gold:[300,470],xp:850,itemChance:.055,pool:["stormStaff","tempestDaggers"],colors:["#536587","#252d4e"]},
  shadowpeaks:{id:"shadowpeaks",category:"expedition",name:"Shadowpeak Ascent",short:"Shadowpeak",icon:"🌑",eyebrow:"Endgame expedition · Level 75",description:"Climb into the dark peaks and prepare for the final raid tier.",requirements:["Combat Level 75+","1–4 heroes","24 Food per hero"],minLevel:75,maxParty:4,duration:190,difficulty:620,food:24,gold:[520,800],xp:1600,itemChance:.065,pool:["voidWand","eclipseTome"],colors:["#544968","#211d31"]},

  thornrootBurrow:{id:"thornrootBurrow",category:"dungeon",name:"Thornroot Burrow",short:"Thornroot",icon:"🌿",eyebrow:"Regional dungeon · Level 10",description:"A solo or duo dungeon beneath the ancient roots, with a complete class set, trinkets, and Raid Key chances.",requirements:["Combat Level 10+","1–2 heroes","50 Gold + 18 Food per hero"],minLevel:10,maxParty:2,duration:75,difficulty:95,food:18,entryGold:50,gold:[60,95],xp:300,essenceReward:[1,3],itemChance:.12,keyChance:.08,pool:gearSetPool("thornroot"),trinketChance:.06,trinketPool:["luckyAcorn"],killCount:12,colors:["#4b7042","#263e2a"]},
  frozenHollow:{id:"frozenHollow",category:"dungeon",name:"Frozen Hollow",short:"Frozen Hollow",icon:"🗝️",eyebrow:"Regional dungeon · Level 24",description:"A multi-room frozen delve with a complete class set, Essence returns, trinkets, and Raid Keys.",requirements:["Combat Level 24+","1–2 heroes","150 Gold + 35 Food per hero"],minLevel:24,maxParty:2,duration:110,difficulty:190,food:35,entryGold:150,gold:[180,320],xp:900,essenceReward:[1,5],itemChance:.16,keyChance:.18,pool:gearSetPool("frozen"),trinketChance:.065,trinketPool:["frostSigil"],killCount:18,colors:["#425e76","#1f354a"]},
  cinderdeepVault:{id:"cinderdeepVault",category:"dungeon",name:"Cinderdeep Vault",short:"Cinderdeep",icon:"🌋",eyebrow:"Regional dungeon · Level 45",description:"Descend into a ruined forge for a full fire-forged class set, trinkets, and stronger Key odds.",requirements:["Combat Level 45+","1–2 heroes","350 Gold + 60 Food per hero"],minLevel:45,maxParty:2,duration:160,difficulty:360,food:60,entryGold:350,gold:[420,680],xp:2200,essenceReward:[3,8],itemChance:.18,keyChance:.24,pool:gearSetPool("cinderdeep"),trinketChance:.07,trinketPool:["emberIdol"],killCount:24,colors:["#83432f","#392321"]},
  sunkenSanctum:{id:"sunkenSanctum",category:"dungeon",name:"Sunken Sanctum",short:"Sunken Sanctum",icon:"🌊",eyebrow:"Regional dungeon · Level 58",description:"Explore a drowned temple with a full tide-forged class set, trinkets, and strong Raid Key odds.",requirements:["Combat Level 58+","1–2 heroes","550 Gold + 75 Food per hero"],minLevel:58,maxParty:2,duration:190,difficulty:510,food:75,entryGold:550,gold:[610,920],xp:4000,essenceReward:[4,10],itemChance:.19,keyChance:.27,pool:gearSetPool("sunken"),trinketChance:.075,trinketPool:["tidePearl"],killCount:30,colors:["#397383","#203b4a"]},
  stormcrypt:{id:"stormcrypt",category:"dungeon",name:"Storm Crypt",short:"Storm Crypt",icon:"⛈️",eyebrow:"Regional dungeon · Level 70",description:"Break the seals for a full storm-forged class set, trinkets, and the strongest Dungeon Key odds.",requirements:["Combat Level 70+","1–2 heroes","800 Gold + 95 Food per hero"],minLevel:70,maxParty:2,duration:220,difficulty:700,food:95,entryGold:800,gold:[820,1250],xp:6500,essenceReward:[5,12],itemChance:.20,keyChance:.30,pool:gearSetPool("stormcrypt"),trinketChance:.08,trinketPool:["stormLocket"],killCount:36,colors:["#4e547a","#24263d"]},

  basiliskCrown:{id:"basiliskCrown",category:"raid",name:"Basilisk Crown",short:"Basilisk Raid",icon:"🐲",eyebrow:"First raid · Level 30",description:"A four-hero assault where combat, skilling, and clear time build a score that determines the chance to enter its complete 12-item rare class table.",requirements:["Combat Level 30+","Up to 4 heroes","600 Gold + 2 Essence per hero + 1 Raid Key","80 Food per hero"],minLevel:30,maxParty:4,duration:1200,raidPace:3.4,difficulty:650,food:80,entryGold:600,essencePerHero:2,keys:1,gold:[1800,2800],xp:5000,essenceReward:[12,22],itemChance:.10,pool:gearSetPool("basilisk"),eggChance:1/500,eggKey:"basiliskEgg",killCount:45,colors:["#6f4737","#2f2520"]},
  tempestTitan:{id:"tempestTitan",category:"raid",name:"Tempest Titan",short:"Titan Raid",icon:"⚡",eyebrow:"Second raid · Level 60",description:"Challenge a storm giant where combat, skilling, and clear time build a score that determines the chance to enter its complete 12-item rare class table.",requirements:["Combat Level 60+","Up to 4 heroes","2,000 Gold + 4 Essence per hero + 1 Raid Key","180 Food per hero"],minLevel:60,maxParty:4,duration:1200,raidPace:3.4,difficulty:1600,food:180,entryGold:2000,essencePerHero:4,keys:1,gold:[5500,8000],xp:12000,essenceReward:[24,40],itemChance:.10,pool:gearSetPool("tempest"),eggChance:1/500,eggKey:"tempestEgg",killCount:65,colors:["#4d5f83","#252d49"]},
  eclipseWyrm:{id:"eclipseWyrm",category:"raid",name:"Eclipse Wyrm",short:"Eclipse Raid",icon:"🌘",eyebrow:"Endgame raid · Level 90",description:"The current final raid scores combat, skilling, and clear time to determine the chance to enter its complete 12-item rare class table.",requirements:["Combat Level 90+","Up to 4 heroes","5,500 Gold + 8 Essence per hero + 1 Raid Key","400 Food per hero"],minLevel:90,maxParty:4,duration:1200,raidPace:2.35,difficulty:3000,food:400,entryGold:5500,essencePerHero:8,keys:1,gold:[15000,22000],xp:30000,essenceReward:[48,72],itemChance:.10,pool:gearSetPool("eclipse"),eggChance:1/500,eggKey:"eclipseEgg",killCount:90,colors:["#514063","#1e1929"]},
};

const CLASS_COMBAT = {
  Warrior:{speed:2.55,crit:.05,style:"melee",verb:"cleaves",attack:1,defense:1.25,hp:1.2,maxHit:1.05,resolve:120,identity:"Bulwark"},
  Wizard:{speed:2.85,crit:.08,style:"magic",verb:"blasts",attack:1.18,defense:.82,hp:.84,maxHit:1.28,resolve:94,identity:"Arcane burst"},
  Archer:{speed:2.25,crit:.12,style:"ranged",verb:"shoots",attack:1.12,defense:.92,hp:.94,maxHit:1.12,resolve:104,identity:"Precise striker"},
  Druid:{speed:2.7,crit:.06,style:"magic",verb:"strikes",attack:.98,defense:1.04,hp:1.06,maxHit:.94,resolve:112,identity:"Battle healer"},
  Assassin:{speed:1.65,crit:.17,style:"melee",verb:"slashes",attack:1.13,defense:.78,hp:.86,maxHit:1.12,resolve:88,identity:"Fast executioner"},
  Summoner:{speed:2.62,crit:.06,style:"magic",verb:"commands",attack:1.06,defense:.9,hp:.92,maxHit:1.02,resolve:100,identity:"Echo Strike"},
};
const CLASS_PASSIVES = {
  Warrior:{icon:"🛡️",name:"Bulwark",detail:"Innately gains 25% Defence and 20% HP. Damaging attacks have a 12% chance to add a Crushing Blow worth 30% of max hit."},
  Wizard:{icon:"✨",name:"Arcane Burst",detail:"Innately gains 18% Attack and 28% max-hit scaling. Damaging attacks have an 18% chance to add an Arcane Burst worth 40% of max hit."},
  Archer:{icon:"🏹",name:"Precise Striker",detail:"Attacks every 2.25s with 12% base Crit, plus 12% Attack and 12% max-hit scaling."},
  Druid:{icon:"🌿",name:"Battle Healer",detail:"After every attack, has a 16% chance to heal the lowest-HP living ally for 35% of max hit. Healing weapons can strengthen this."},
  Assassin:{icon:"🗡️",name:"Fast Executioner",detail:"Attacks every 1.65s with 17% base Crit and 13% bonus Attack, trading away Defence and HP for speed."},
  Summoner:{icon:"🔮",name:"Echo Strike",detail:"Damaging attacks have a 22% chance to echo for 50% of the triggering hit. Certain Tomes modify the echoes."},
};
const EXPEDITION_BREAK_SANITY=12;
const EXPEDITION_RETURN_SANITY=85;
const BASE_SANITY_DRAIN={expedition:6,dungeon:16,raid:25};
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
  verdantBlade:{name:"Greenwarden’s Edge",type:"weapon",className:"Warrior",icon:"🌿",tier:"Rare Expedition Drop",attack:8,element:"+2 Nature Damage",requiredLevel:10,value:950,salvage:10,special:true},
  briarRobes:{name:"Raiment of the Briar Saint",type:"armor",className:"Wizard",icon:"🍃",tier:"Rare Expedition Drop",defense:11,element:"Root ward",requiredLevel:10,value:980,salvage:10,special:true},
  frostBow:{name:"Winterglass",type:"weapon",className:"Archer",icon:"❄️",tier:"Rare Expedition Drop",attack:10,element:"+2 Frost Damage",requiredLevel:24,value:1800,salvage:16,special:true},
  burningSword:{name:"Emberwrought Oath",type:"weapon",className:"Warrior",icon:"🔥",tier:"Dungeon",attack:11,element:"+2 Fire Damage",requiredLevel:24,value:1900,salvage:16,special:true},
  healingStaff:{name:"Staff of Returning Spring",type:"weapon",className:"Druid",icon:"💚",tier:"Rare Expedition Drop",attack:9,element:"Druid healing +8%",effects:{healingPower:.08},requiredLevel:24,value:1750,salvage:15,special:true},
  darkWand:{name:"Nightwhisper",type:"weapon",className:"Wizard",icon:"🌑",tier:"Dungeon",attack:11,element:"+2 Shadow Damage",requiredLevel:24,value:1850,salvage:16,special:true},
  poisonDaggers:{name:"Viper’s Kiss",type:"weapon",className:"Assassin",icon:"☠️",tier:"Dungeon",attack:10,element:"+3 Poison Damage",requiredLevel:24,value:1950,salvage:16,special:true},
  echoTome:{name:"Grimoire of Second Voices",type:"weapon",className:"Summoner",icon:"🔮",tier:"Dungeon",attack:10,element:"Echo Strike summons +1 additional echo",effects:{extraEchoes:1},requiredLevel:24,value:1900,salvage:16,special:true},
  emberBow:{name:"Ashflight",type:"weapon",className:"Archer",icon:"🏹",tier:"Rare Expedition Drop",attack:18,element:"+4 Fire Damage",requiredLevel:45,value:4200,salvage:28,special:true},
  cinderTome:{name:"Testament of Living Flame",type:"weapon",className:"Summoner",icon:"📕",tier:"Rare Expedition Drop",attack:18,element:"Echo Strike burns for 20% of each echo",effects:{echoBurn:.20},requiredLevel:45,value:4300,salvage:28,special:true},
  tideSpear:{name:"Tidecaller’s Crook",type:"weapon",className:"Druid",icon:"🔱",tier:"Dungeon",attack:22,element:"Druid healing +35%",effects:{healingPower:.35},requiredLevel:58,value:5900,salvage:35,special:true},
  coralArmor:{name:"Reefking’s Carapace",type:"armor",className:"Warrior",icon:"🪸",tier:"Dungeon",defense:29,element:"Wave ward",requiredLevel:58,value:6100,salvage:36,special:true},
  stormStaff:{name:"Skyroot",type:"weapon",className:"Druid",icon:"⛈️",tier:"Rare Expedition Drop",attack:25,element:"+6 Lightning Damage",requiredLevel:70,value:7600,salvage:42,special:true},
  tempestDaggers:{name:"Thunderstep Twins",type:"weapon",className:"Assassin",icon:"⚡",tier:"Rare Expedition Drop",attack:25,element:"22% chance: Chain Lightning for 50% of the hit",effects:{chainLightningChance:.22,chainLightningMultiplier:.50},requiredLevel:70,value:7800,salvage:42,special:true},
  basiliskTooth:{name:"The King’s Venom",type:"weapon",className:"Assassin",icon:"🦷",tier:"Raid",attack:15,element:"+30% Crit · +3 Poison Damage",effects:{critBonus:.30,poisonDamage:3},requiredLevel:30,value:12000,salvage:80,special:true,raid:true},
  basiliskPlate:{name:"Stonegaze Carapace",type:"armor",className:"Warrior",icon:"🐲",tier:"Raid",defense:22,element:"Poison ward",requiredLevel:30,value:11500,salvage:75,special:true,raid:true},
  stormbreakerBow:{name:"Thunderhead",type:"weapon",className:"Archer",icon:"🌩️",tier:"Raid",attack:34,element:"+25% Crit · 20% chance: Thunder Volley for 55% of the hit",effects:{critBonus:.25,thunderVolleyChance:.20,thunderVolleyMultiplier:.55},requiredLevel:60,value:28000,salvage:150,special:true,raid:true},
  titanWard:{name:"Mantle of the Mountain Storm",type:"armor",className:"Druid",icon:"🗿",tier:"Raid",defense:38,element:"Party storm ward",requiredLevel:60,value:27000,salvage:145,special:true,raid:true},
  voidWand:{name:"Scepter of Empty Stars",type:"weapon",className:"Wizard",icon:"🌌",tier:"Rare Expedition Drop",attack:48,element:"18% chance: Void Surge for 75% of the hit",effects:{voidSurgeChance:.18,voidSurgeMultiplier:.75},requiredLevel:90,value:68000,salvage:320,special:true,raid:true},
  eclipseTome:{name:"Grimoire of the Devoured Moon",type:"weapon",className:"Summoner",icon:"🌘",tier:"Rare Expedition Drop",attack:48,element:"Echo Strike summons +1 echo · echoes deal 60%",effects:{extraEchoes:1,echoDamageBonus:.10},requiredLevel:90,value:70000,salvage:330,special:true,raid:true},
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
  rawFood:[
    {id:"starter",tier:"Starter",name:"Wild Vegetables",icon:"🥬",level:1,building:1,rank:1},
    {id:"weak",tier:"Weak",name:"Farm Produce",icon:"🥔",level:5,building:1,rank:2},
    {id:"average",tier:"Average",name:"Garden Basket",icon:"🧺",level:12,building:2,rank:4},
    {id:"good",tier:"Good",name:"Fresh Provisions",icon:"🥕",level:25,building:3,rank:7},
    {id:"great",tier:"Great",name:"Prime Produce",icon:"🌽",level:40,building:4,rank:11},
    {id:"epic",tier:"Epic",name:"Heroic Harvest",icon:"🍅",level:60,building:5,rank:16},
    {id:"legendary",tier:"Legendary",name:"Royal Harvest",icon:"👑",level:80,building:6,rank:22},
    {id:"divine",tier:"Divine",name:"Divine Harvest",icon:"✨",level:100,building:8,rank:30},
  ],
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
const RESOURCE_ASSIGNMENTS={farm:"rawFood",mine:"metal",forest:"wood"};
const WORK_ASSIGNMENTS=["farm","cook","mine","forest","smith","plunder"];
const COOK_WORK_TASKS=RESOURCE_TIERS.food.map((meal,index)=>({...meal,rawTier:RESOURCE_TIERS.rawFood[index].id,baseSeconds:[12,15,18,22,27,34,42,54][index]}));
const SMITH_WORK_TASKS=[
  {id:"repairKits",tier:"Utility",name:"Repair Kits",icon:"🧰",level:1,building:1,rank:1,baseSeconds:15},
];
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
      ITEMS[key]={...existing,name:normalGearDisplayName(tier,archetype,slot),type:slot,className:classGear.className,icon:slot==="weapon"?classGear.weaponIcon:classGear.armorIcon,image,tier:tier.name,[slot==="weapon"?"attack":"defense"]:slot==="weapon"?tier.attack:tier.defense,requiredLevel:tier.combatLevel,value:slot==="weapon"?tier.weaponValue:tier.armorValue,recipeTier:tier.id,smithLevel:tier.smithLevel,buildingLevel:tier.building,metalCost:Math.ceil(metalBase*tier.costScale*1.5),woodCost:Math.ceil(woodBase*tier.costScale*1.5),normalGear:true};
      NORMAL_GEAR_RECIPE_KEYS[tier.id][slot].push(key);
    }
  }
}
const SKILL_PETS={farm:"cowPet",mine:"molePet",forest:"beaverPet",smith:"forgeSpritePet"};
const SKILL_PET_CHANCE=1/250000;
const HERO_RECORD_DEFAULTS={kills:0,expeditions:0,dungeons:0,raids:0,raidBosses:0,dungeonBosses:0,goldEarned:0,beers:0,defeats:0,itemsFound:0,foodGathered:0,foodCooked:0,metalMined:0,woodGathered:0,kitsForged:0,workActions:0,secondsActive:0,damageDealt:0,damageTaken:0,healingDone:0,combatActions:0};

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
function storedJSON(key,fallback){
  try{const value=localStorage.getItem(key);return value===null?fallback:(JSON.parse(value)??fallback);}
  catch(err){console.warn(`Could not read ${key}; using safe defaults.`,err);return fallback;}
}
let settings = storedJSON(SETTINGS_KEY,{}) || {};
if(typeof settings.soundEnabled!=="boolean")settings.soundEnabled=true;
let currentUser = null;
let firebaseApi = null;
let marketListings = [];
let leaderboard = [];
let cloudUnsubscribe = null;
let saveTimer = null;
let cloudSaveTimer = null;
let lastCloudSave = 0;
let startupHadLocalSave = false;
let cloudReconciled = false;
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
let heroLeagueMetric = "overview";
let heroLeagueStat = "totalLevel";
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
const itemData = item => {const d={...ITEMS[item.key],...item},u=Math.max(0,Math.min(5,Number(item.upgrade)||0));if(u&&["weapon","armor"].includes(d.type)){if(d.attack)d.attack=Math.round(d.attack*(1+.08*u));if(d.defense)d.defense=Math.round(d.defense*(1+.08*u));d.name=`${d.name} +${u}`;}d.upgrade=u;return d;};
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
    "img/icon-192.png","img/icon-512.png","img/icon-maskable-512.png","img/apple-touch-icon.png","img/fantasy-town-map.webp","img/loot-chest.svg","img/ui-icon-atlas.webp","img/item-thornroot-warrior-weapon.webp",
    ...Object.values(SWORD_TIER_IMAGES),...HEROES.map(h=>h.portrait),...Object.values(COMBAT_LAYOUTS).flatMap(rooms=>rooms.filter(room=>room.type==="combat").map(room=>room.image)),...Object.values(ITEMS).map(item=>item.image).filter(Boolean),
  ])];
}

const STARTUP_ASSETS=["img/icon-192.png","img/fantasy-town-map.webp","img/ui-icon-atlas.webp","img/loot-chest.svg",...HEROES.map(hero=>hero.portrait)];

async function preloadAssetBatch(sources,{showProgress=false,timeoutMs=4000,concurrency=6}={}){
  const assets=[...new Set(sources)],bar=showProgress?$("#loadingProgress"):null,track=showProgress?$(".loading-track"):null,count=showProgress?$("#loadingCount"):null,failed=[];let complete=0;
  const update=()=>{const pct=assets.length?Math.round(complete/assets.length*100):100;if(bar)bar.style.width=`${pct}%`;if(track){track.setAttribute("aria-valuenow",String(complete));track.setAttribute("aria-valuemax",String(assets.length));}if(count)count.textContent=`${complete} / ${assets.length} assets`;};
  if(showProgress)$("#loadingText").textContent="Preparing the town essentials…";update();
  let cursor=0;const load=src=>new Promise(resolve=>{const image=new Image();let settled=false;const finish=ok=>{if(settled)return;settled=true;clearTimeout(timeout);image.onload=null;image.onerror=null;if(!ok)failed.push(src);complete++;update();resolve();},timeout=setTimeout(()=>finish(false),timeoutMs);image.onload=()=>finish(true);image.onerror=()=>finish(false);image.src=src;});
  const worker=async()=>{while(cursor<assets.length){const src=assets[cursor++];await load(src);}};
  await Promise.all(Array.from({length:Math.min(concurrency,assets.length)},worker));
  return failed;
}

let artworkWarmScheduled=false;
function warmRemainingAssets(){
  if(artworkWarmScheduled)return;artworkWarmScheduled=true;
  const essential=new Set(STARTUP_ASSETS),remaining=assetCatalog().filter(src=>!essential.has(src)),warm=()=>preloadAssetBatch(remaining,{timeoutMs:6000,concurrency:4}).catch(err=>console.warn("Background artwork preload stopped",err));
  if("requestIdleCallback" in window)window.requestIdleCallback(warm,{timeout:1600});else setTimeout(warm,500);
}

function recalculateTieredTotal(resource){state.resources[resource]=RESOURCE_TIERS[resource].reduce((total,tier)=>total+Math.floor(state.resourceTiers[resource][tier.id]||0),0);}
function addTieredResource(resource,tierId,units){state.resourceTiers[resource][tierId]=(state.resourceTiers[resource][tierId]||0)+units;recalculateTieredTotal(resource);}
function resourceTierData(resource,tierId){return RESOURCE_TIERS[resource]?.find(tier=>tier.id===tierId)||null;}
function resourceTierCount(resource,tierId){return Math.floor(state.resourceTiers?.[resource]?.[tierId]||0);}
function spendSpecificResource(resource,tierId,amount){amount=Math.max(0,Math.floor(Number(amount)||0));if(resourceTierCount(resource,tierId)<amount)return false;state.resourceTiers[resource][tierId]-=amount;recalculateTieredTotal(resource);return true;}
function unlockedResourceTiers(h,assignment){const resource=RESOURCE_ASSIGNMENTS[assignment],skill=BUILDINGS[assignment]?.skill,buildingLevel=state.buildings[assignment]||1;return resource?RESOURCE_TIERS[resource].filter(t=>(h.skills[skill]?.level||1)>=t.level&&buildingLevel>=t.building):[];}
function resourceTierForHero(h,assignment){const unlocked=unlockedResourceTiers(h,assignment),selected=h.workTiers?.[assignment]||"starter";return unlocked.find(t=>t.id===selected)||unlocked[0]||RESOURCE_TIERS[RESOURCE_ASSIGNMENTS[assignment]]?.[0];}
function workTasksFor(assignment){return RESOURCE_ASSIGNMENTS[assignment]?RESOURCE_TIERS[RESOURCE_ASSIGNMENTS[assignment]]:assignment==="cook"?COOK_WORK_TASKS:assignment==="smith"?SMITH_WORK_TASKS:assignment==="plunder"?PLUNDER_TARGETS:[];}
function unlockedWorkTasks(h,assignment){if(RESOURCE_ASSIGNMENTS[assignment])return unlockedResourceTiers(h,assignment);if(!["cook","smith","plunder"].includes(assignment))return [];const skill=BUILDINGS[assignment].skill,buildingLevel=state.buildings[assignment]||1,tasks=assignment==="cook"?COOK_WORK_TASKS:assignment==="plunder"?PLUNDER_TARGETS:SMITH_WORK_TASKS;return tasks.filter(task=>(h.skills[skill]?.level||1)>=task.level&&buildingLevel>=task.building);}
function workTaskForHero(h,assignment){if(RESOURCE_ASSIGNMENTS[assignment])return resourceTierForHero(h,assignment);const tasks=unlockedWorkTasks(h,assignment),selected=h.workTiers?.[assignment]||tasks[0]?.id;return tasks.find(task=>task.id===selected)||tasks[0]||null;}
function workTaskTime(task){return task?.baseSeconds||TIER_ACTION_SECONDS[task?.id||"starter"]||15;}
function workTaskPickerHTML(h,assignment){const tasks=unlockedWorkTasks(h,assignment),selected=workTaskForHero(h,assignment)?.id;return tasks.length?`<label class="work-tier-picker"><span>Exact task</span><select data-work-tier data-hero="${h.id}" data-assignment="${assignment}" aria-label="${escapeHTML(h.name)} ${ASSIGNMENTS[assignment].name} task">${tasks.map(task=>`<option value="${task.id}" ${task.id===selected?"selected":""}>${task.icon} ${escapeHTML(task.name)} · ${workTaskTime(task)}s base</option>`).join("")}</select></label>`:"";}

function shuffledCopy(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function generateCombatRoute(combatId){const cfg=COMBAT[combatId],base=COMBAT_LAYOUTS[combatId]||[];if(cfg?.category!=="raid"||base.length<4)return [...base];const boss=base[base.length-1],middle=shuffledCopy(base.slice(0,-1));return [...middle,boss];}
function runRoute(run,cfg=COMBAT[run.combatId]){return run.route?.length?run.route:(COMBAT_LAYOUTS[cfg.id]||[]);}
function createCombatRunState(combatId,heroIds,autoRepeat=true,id=uid()){
  return {id,combatId,heroIds:[...heroIds],rosterIds:[...heroIds],restingHeroIds:[],waitingForParty:false,autoRepeat,startedAt:Date.now(),cycle:1,roomIndex:0,roomState:null,heroTimers:{},heroStats:Object.fromEntries(heroIds.map(heroId=>[heroId,{damage:0,taken:0,healing:0,attacks:0,hits:0,crits:0}])),enemyTimer:0,enemy:null,elapsed:0,cycleElapsed:0,kills:0,cycles:0,foodEaten:0,damageDealt:0,damageTaken:0,raidCombatPoints:0,raidSkillPoints:0,lastRaidScore:null,route:generateCombatRoute(combatId),recentEvents:[],lastReward:"No chest opened yet"};
}

function migrateCombatRun(saved,combatId,heroIds,heroes){
  const base=createCombatRunState(combatId,heroIds,saved.autoRepeat!==false,saved.id||uid()),cfg=COMBAT[combatId],layout=Array.isArray(saved.route)&&saved.route.length?saved.route:(COMBAT_LAYOUTS[combatId]||[]),roomIndex=clamp(Math.floor(Number(saved.roomIndex)||0),0,Math.max(0,layout.length-1)),room=layout[roomIndex];
  const nonnegative=(value,fallback=0)=>Math.max(0,Number.isFinite(Number(value))?Number(value):fallback);
  const validHeroIds=new Set(heroes.filter(hero=>(hero.hp||0)>0).map(hero=>hero.id)),restingHeroIds=[...new Set(saved.restingHeroIds||[])].filter(id=>validHeroIds.has(id)&&!heroIds.includes(id)),rosterIds=[...new Set(saved.rosterIds||[...heroIds,...restingHeroIds])].filter(id=>validHeroIds.has(id));
  const run={...base,...saved,id:base.id,combatId,heroIds:[...heroIds],rosterIds:[...new Set([...rosterIds,...heroIds,...restingHeroIds])],restingHeroIds,waitingForParty:cfg.category==="expedition"&&saved.autoRepeat!==false&&heroIds.length===0&&restingHeroIds.length>0,autoRepeat:saved.autoRepeat!==false,startedAt:nonnegative(saved.startedAt,base.startedAt),cycle:Math.max(1,Math.floor(nonnegative(saved.cycle,1))),roomIndex,heroTimers:{},heroStats:{},enemyTimer:nonnegative(saved.enemyTimer),enemy:null,roomState:null,elapsed:nonnegative(saved.elapsed),cycleElapsed:nonnegative(saved.cycleElapsed),kills:Math.floor(nonnegative(saved.kills)),cycles:Math.floor(nonnegative(saved.cycles)),foodEaten:Math.floor(nonnegative(saved.foodEaten)),damageDealt:nonnegative(saved.damageDealt),damageTaken:nonnegative(saved.damageTaken),raidCombatPoints:nonnegative(saved.raidCombatPoints),raidSkillPoints:nonnegative(saved.raidSkillPoints),lastRaidScore:saved.lastRaidScore&&typeof saved.lastRaidScore==="object"?saved.lastRaidScore:null,route:layout,recentEvents:Array.isArray(saved.recentEvents)?saved.recentEvents.slice(-30):[],lastReward:String(saved.lastReward||base.lastReward)};
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

const QUEST_BOARD_SIZE=3;
function questDayKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;}
function totalMonsterKills(){return state?.heroes?.reduce((n,h)=>n+(h.records?.kills||0),0)||0;}
function questResourceCount(resource){return RESOURCE_TIERS[resource].reduce((n,tier)=>n+(state?.resourceTiers?.[resource]?.[tier.id]||0),0);}
function questRoll(){return Math.random();}
function questScale(){if(!state?.heroes?.length)return 1;const avg=state.heroes.reduce((n,h)=>n+Math.max(h.skills.farming.level,h.skills.mining.level,h.skills.woodcutting.level),0)/state.heroes.length;return clamp(.8+avg/35,.8,3.5);}
function questReward(){const roll=questRoll(),scale=questScale();return {gold:Math.floor((110+questRoll()*241)*scale),essence:roll<.24?1+(questRoll()<.15?1:0):0,keys:roll<.012?1:0};}
function makeQuest(slot=0){
  const killBase=totalMonsterKills(),types=["resource","resource","resource","kill"],type=types[Math.floor(questRoll()*types.length)],reward=questReward(),scale=questScale();
  if(type==="kill"){const amount=Math.floor((35+questRoll()*46)*Math.sqrt(scale));return {id:uid(),type,amount,baseline:killBase,title:["Clear the Roads","Monster Trouble","Bounty Notice"][slot%3],icon:"⚔️",reward,claimed:false};}
  const resources=["food","metal","wood"],resource=resources[Math.floor(questRoll()*resources.length)],amount=Math.floor((220+questRoll()*381)*scale),names={food:"Food",metal:"Metal",wood:"Wood"},icons={food:"🥕",metal:"⛏️",wood:"🪵"};return {id:uid(),type,resource,amount,title:`${names[resource]} Requisition`,icon:icons[resource],reward,claimed:false};
}
function freshQuestBoard(){return Array.from({length:QUEST_BOARD_SIZE},(_,i)=>makeQuest(i));}
function migrateQuestBoard(raw){const board=Array.isArray(raw)?raw.filter(q=>q&&q.id&&["resource","kill"].includes(q.type)).slice(0,QUEST_BOARD_SIZE).map(q=>({...q,claimed:!!q.claimed})):[];while(board.length<QUEST_BOARD_SIZE)board.push(makeQuest(board.length));return board;}
function ensureDailyQuestBoard(){const today=questDayKey();if(state.questBoardDate===today&&state.questBoard?.length===QUEST_BOARD_SIZE)return;state.questBoard=freshQuestBoard();state.questBoardDate=today;markDirty?.();}
function questProgress(q){if(q.claimed)return q.amount;return q.type==="kill"?Math.max(0,totalMonsterKills()-(q.baseline||0)):questResourceCount(q.resource);}
function questRewardText(q){const bits=[`🪙 ${fmt(q.reward.gold)} Gold`];if(q.reward.essence)bits.push(`✨ ${q.reward.essence} Essence`);if(q.reward.keys)bits.push(`🗝️ ${q.reward.keys} Raid Key`);return bits.join(" · ");}
function spendQuestResource(resource,amount){if(questResourceCount(resource)<amount)return false;let left=amount;for(const tier of RESOURCE_TIERS[resource]){const have=state.resourceTiers[resource][tier.id]||0,take=Math.min(have,left);state.resourceTiers[resource][tier.id]=have-take;left-=take;if(left<=0)break;}recalculateTieredTotal(resource);return true;}
function questBoardHTML(){
  ensureDailyQuestBoard();const completed=state.questBoard.filter(q=>q.claimed).length;
  return `<div class="drawer-section quest-board"><div class="profile-section-title"><div><small>Daily town contracts</small><h3>📜 Quest Board</h3></div><small>${completed}/3 complete today</small></div><p class="section-copy">Three contracts are posted each day. Supply orders are intentionally large town-scale requests; completed slots do not refill until tomorrow.</p><div class="action-list">${state.questBoard.map(q=>{const progress=questProgress(q),done=!q.claimed&&progress>=q.amount,objective=q.type==="kill"?`Defeat ${q.amount} monsters`:`Turn in ${fmt(q.amount)} ${q.resource}`,shown=Math.min(progress,q.amount);return `<button class="quest-contract ${done?"ready":""} ${q.claimed?"claimed":""}" data-action="claim-quest" data-quest="${q.id}" ${done?"":"disabled"}><span><strong>${q.icon} ${escapeHTML(q.title)}</strong><small>${escapeHTML(objective)} · ${fmt(shown)} / ${fmt(q.amount)}</small><small>${escapeHTML(questRewardText(q))}</small></span><b>${q.claimed?"Completed":done?"Claim":"In progress"}</b></button>`;}).join("")}</div></div>`;
}
function claimQuest(id){ensureDailyQuestBoard();const q=state.questBoard.find(q=>q.id===id);if(!q||q.claimed)return;if(questProgress(q)<q.amount)return toast("📜","Quest is not complete yet");if(q.type==="resource"&&!spendQuestResource(q.resource,q.amount))return toast("📦","Those supplies are no longer available");state.resources.gold+=q.reward.gold;state.stats.goldEarned+=q.reward.gold;state.resources.essence+=q.reward.essence||0;state.resources.keys+=q.reward.keys||0;state.stats.questsCompleted=(state.stats.questsCompleted||0)+1;q.claimed=true;notify("Daily quest complete",`${q.title}: ${questRewardText(q)}. ${state.questBoard.filter(x=>x.claimed).length}/3 contracts complete today.`,"📜");markDirty();renderAll();openBuilding("tavern");}

function freshState(){
  return {
    version:VERSION, combatXpCurve:1, townName:"Briarwatch", createdAt:Date.now(), updatedAt:Date.now(), lastTick:Date.now(), randomSeed:987654321,
    resources:{gold:0,food:0,metal:0,wood:0,essence:0,keys:0,repairKits:0}, taxRate:15, resourceTiers:emptyResourceTiers(),
    buildings:{farm:1,cook:1,mine:1,forest:1,smith:1,warehouse:1,market:1,inn:1,tavern:1},
    heroes:HEROES.map((h,i)=>({ ...h, level:1,xp:0,sanity:100,hp:Math.round(50*(CLASS_COMBAT[h.className]?.hp||1)),assignment:"idle", recoveryUntil:0,workProgress:0,workTiers:{farm:"starter",cook:"starter",mine:"starter",forest:"starter"},records:{...HERO_RECORD_DEFAULTS},
      skills:{farming:{level:1,xp:0},cooking:{level:1,xp:0},mining:{level:1,xp:0},woodcutting:{level:1,xp:0},smithing:{level:1,xp:0},plundering:{level:1,xp:0}},gold:100,
      equipment:{weapon:{key:["rustySword","apprenticeWand","huntingBow","oakStaff","wornDaggers","noviceTome"][i],durability:100},armor:null,pet:null,trinket:null}
    })),
    inventory:[], smithOrder:null, combatRuns:[], notifications:[{id:uid(),time:Date.now(),title:"The town awakens",text:"Your six adventurers are ready. Every choice of how they spend their time will shape Briarwatch."}],
    partyChat:starterPartyChat(), chatMeta:{lastReadAt:0,ambientProgress:0,nextAmbientAt:55,lastSpeakerId:null,cooldowns:{}},
    stockMarket:freshStockMarket(),
    achievements:[], questBoard:freshQuestBoard(), questBoardDate:questDayKey(), stats:{expeditions:0,dungeons:0,raids:0,defeats:0,goldEarned:0,itemsFound:0,marketSales:0,offlineSeconds:0,questsCompleted:0},
    pendingFractions:{food:0,metal:0,wood:0,kits:0}, settings:{autoSave:true,reducedMotion:false},
  };
}

function migrate(raw){
  const base=freshState();
  if(!raw || !raw.heroes) return base;
  const merged={...base,...raw,version:VERSION,resources:{...base.resources,...raw.resources},buildings:{...base.buildings,...raw.buildings},stats:{...base.stats,...raw.stats},pendingFractions:{...base.pendingFractions,...raw.pendingFractions}};
  merged.taxRate=clamp(Number(raw.taxRate??15),0,50);
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
  merged.smithOrder=raw.smithOrder&&ITEMS[raw.smithOrder.key]?{...raw.smithOrder,remaining:Math.max(0,Number(raw.smithOrder.remaining)||0),totalSeconds:Math.max(1,Number(raw.smithOrder.totalSeconds)||smithOrderSeconds(ITEMS[raw.smithOrder.key]))}:null;
  const legacyCombat={expedition:"meadowWatch",dungeon:"frozenHollow",raid:"basiliskCrown"};
  merged.combatRuns=(Array.isArray(raw.combatRuns)?raw.combatRuns:[]).map(r=>{const combatId=r.combatId||legacyCombat[r.type]||r.type;if(!COMBAT[combatId])return null;const heroIds=(r.heroIds||[]).filter(id=>merged.heroes.some(h=>h.id===id&&(h.hp||0)>0)),restingHeroIds=(r.restingHeroIds||[]).filter(id=>merged.heroes.some(h=>h.id===id&&(h.hp||0)>0));return heroIds.length||restingHeroIds.length?migrateCombatRun({...r,restingHeroIds},combatId,heroIds,merged.heroes):null;}).filter(Boolean);
  const activeIds=new Set(merged.combatRuns.flatMap(r=>r.heroIds)),restingIds=new Set(merged.combatRuns.flatMap(r=>r.restingHeroIds||[]));for(const h of merged.heroes){if(activeIds.has(h.id))h.assignment="combat";else if(restingIds.has(h.id)&&h.assignment!=="inn")h.assignment="tavern";else if(h.assignment==="combat")h.assignment="idle";h.hp=clamp(Number(h.hp??heroMaxHP(h)),0,heroMaxHP(h));}
  merged.notifications=Array.isArray(raw.notifications)?raw.notifications:base.notifications;
  merged.partyChat=(Array.isArray(raw.partyChat)?raw.partyChat:base.partyChat).filter(message=>message&&merged.heroes.some(hero=>hero.id===message.heroId)&&typeof message.text==="string").slice(-PARTY_CHAT_LIMIT);
  merged.chatMeta={...base.chatMeta,...(raw.chatMeta||{}),cooldowns:{...base.chatMeta.cooldowns,...(raw.chatMeta?.cooldowns||{})}};
  merged.stockMarket=migrateStockMarket(raw.stockMarket,base.stockMarket);
  merged.questBoard=raw.questBoardDate?migrateQuestBoard(raw.questBoard):freshQuestBoard();merged.questBoardDate=String(raw.questBoardDate||questDayKey());
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
function stockPrice(value){return Number(value||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
function stockRecentAverage(stock){const history=(stock.history||[]).map(Number).filter(Number.isFinite);return history.length?history.reduce((total,price)=>total+price,0)/history.length:stock.price;}
function stockAverageWindow(stock){const seconds=Math.max(0,((stock.history?.length||1)-1)*MARKET_TICK_SECONDS);return !seconds?"Opening average":seconds<60?`${seconds}s average`:`${Math.max(1,Math.round(seconds/60))}m average`;}
function stockAverageCost(stock){return stock.owned?stock.costBasis/stock.owned:0;}
function stockSparkline(stock,def){const values=stock.history.length>1?stock.history:[stock.price,stock.price],min=Math.min(...values),max=Math.max(...values),range=Math.max(.01,max-min),points=values.map((value,index)=>`${(index/(values.length-1)*220).toFixed(1)},${(50-(value-min)/range*44).toFixed(1)}`).join(" "),up=stock.price>=values[0];return `<svg class="stock-sparkline ${up?"up":"down"}" viewBox="0 0 220 54" role="img" aria-label="${escapeHTML(def.name)} recent price chart"><polyline points="${points}" vector-effect="non-scaling-stroke"></polyline></svg>`;}
function tavernMarketHTML(){
  const market=state.stockMarket,value=stockMarketValue(),basis=Object.values(market.stocks).reduce((total,stock)=>total+stock.costBasis,0),profit=value-basis,seconds=Math.max(1,Math.ceil(MARKET_TICK_SECONDS-market.tickProgress));
  return `<section class="tavern-exchange" id="tavernMarket"><div class="tavern-market-head"><div><span class="eyebrow">Live from the back table</span><h3>The Crooked Coin Exchange</h3><p>Quotes move every ${MARKET_TICK_SECONDS} seconds with heavy swings and occasional shocks, then drift gently toward each company's Base Anchor. Charts remember the latest 48 quotes—up to 12 minutes—even while you are away.</p></div><div class="market-bell"><span>🔔</span><strong data-market-countdown>${seconds}s</strong><small>Next bell</small></div></div><div class="portfolio-strip"><div><small>Holdings</small><strong>🪙 ${fmt(value)}</strong></div><div><small>Unrealized</small><strong class="${profit>=0?"gain":"loss"}">${profit>=0?"+":""}${fmt(profit)}</strong></div><div><small>Realized</small><strong class="${market.realized>=0?"gain":"loss"}">${market.realized>=0?"+":""}${fmt(market.realized)}</strong></div><div><small>Broker fee</small><strong>${MARKET_FEE*100}%</strong></div></div><div class="fantasy-stocks">${Object.entries(STOCK_DEFS).map(([id,def])=>{
    const stock=market.stocks[id],change=stock.previous?((stock.price-stock.previous)/stock.previous)*100:0,holding=stock.owned*stock.price,pl=holding-stock.costBasis,recentAverage=stockRecentAverage(stock),averageCost=stockAverageCost(stock),fromBase=(stock.price-def.base)/def.base*100;
    return `<article class="fantasy-stock" style="--stock-color:${def.color}"><div class="stock-title"><span>${def.icon}</span><div><strong>${escapeHTML(def.name)}</strong><small>${def.ticker} · ${escapeHTML(def.flavor)}</small></div><b class="${change>=0?"gain":"loss"}">${change>=0?"+":""}${change.toFixed(1)}%</b></div>${stockSparkline(stock,def)}<div class="stock-reference"><div><small>Base anchor</small><strong>🪙 ${stockPrice(def.base)}</strong></div><div><small>${stockAverageWindow(stock)}</small><strong>🪙 ${stockPrice(recentAverage)}</strong></div><div><small>Versus base</small><strong class="${fromBase>=0?"gain":"loss"}">${fromBase>=0?"+":""}${fromBase.toFixed(1)}%</strong></div></div><div class="stock-quote"><div><small>Share price</small><strong>🪙 ${stockPrice(stock.price)}</strong></div><div><small>You own</small><strong>${fmt(stock.owned)} · 🪙 ${fmt(holding)}</strong></div><div><small>Your average · fee included</small><strong>${stock.owned?`🪙 ${stockPrice(averageCost)}`:"—"}</strong></div><div><small>Position</small><strong class="${pl>=0?"gain":"loss"}">${pl>=0?"+":""}${fmt(pl)}</strong></div></div><div class="stock-actions"><button data-action="trade-stock" data-stock="${id}" data-trade="buy" data-quantity="1">Buy 1</button><button data-action="trade-stock" data-stock="${id}" data-trade="buy" data-quantity="max">Buy max</button><button data-action="trade-stock" data-stock="${id}" data-trade="sell" data-quantity="1" ${stock.owned<1?"disabled":""}>Sell 1</button><button data-action="trade-stock" data-stock="${id}" data-trade="sell" data-quantity="all" ${stock.owned<1?"disabled":""}>Sell all</button></div></article>`;
  }).join("")}</div><p class="market-disclaimer">Tavern entertainment only: no dividends, no debt, no real-world connection. The barkeep is not a licensed anything.</p></section>`;
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
  const tiered=Object.entries(RESOURCE_TIERS).flatMap(([resource,tiers])=>tiers.map(tier=>{const quantity=Math.floor(state.resourceTiers?.[resource]?.[tier.id]||0),detail=resource==="food"?`Cooked meal · Heals ${tier.heal} HP in combat`:resource==="rawFood"?`Raw ingredient · Cook in the Kitchen before heroes can eat it`:`Unique ${resource} item · Used by ${tier.tier} crafting recipes`;return {kind:"tiered",resource,tier,quantity,name:tier.name,icon:tier.icon,category:resource==="rawFood"?`${tier.tier} Raw Food`:`${tier.tier} ${resource[0].toUpperCase()+resource.slice(1)}`,detail};}).filter(stack=>stack.quantity>0));
  const utility=UTILITY_RESOURCE_STACKS.map(resource=>({...resource,kind:"utility",quantity:Math.floor(state.resources[resource.key]||0),category:resource.tier})).filter(stack=>stack.quantity>0);
  return [...tiered,...utility];
}
function occupiedSlots(){ return state.inventory.reduce((n,i)=>n+(i.qty||1),0)+warehouseResourceStacks().length; }
function expeditionRunForRestingHero(heroId){return state.combatRuns.find(run=>COMBAT[run.combatId]?.category==="expedition"&&(run.restingHeroIds||[]).includes(heroId))||null;}
function heroReservedForCombat(heroId){return state.combatRuns.some(run=>(run.rosterIds||run.heroIds).includes(heroId));}
function combatCount(){return new Set(state.combatRuns.flatMap(run=>run.rosterIds||run.heroIds)).size;}
function activeEquipment(h,slot){const item=h.equipment?.[slot];if(!item)return null;if(["weapon","armor"].includes(slot)&&(item.durability??100)<=0)return null;return itemData(item);}
function equipmentEffect(h,key){return ["weapon","armor","pet","trinket"].reduce((total,slot)=>total+(activeEquipment(h,slot)?.effects?.[key]||0),0);}
function itemTextDamage(h){return ["weapon","armor","pet","trinket"].map(slot=>activeEquipment(h,slot)).filter(Boolean).reduce((total,d)=>{if(["poisonDamage","lightningDamage","shadowDamage","fireDamage","frostDamage","natureDamage"].some(key=>d.effects?.[key]))return total;const match=`${d.element||""} ${d.effectText||""}`.match(/\+(\d+)\s+(poison|lightning|thunder|shadow|void|fire|frost|nature|tide)(?:\s+damage)?/i);return total+(match?Number(match[1]):0);},0);}
function equipmentDamageBonus(h){return ["poisonDamage","lightningDamage","shadowDamage","fireDamage","frostDamage","natureDamage"].reduce((total,key)=>total+equipmentEffect(h,key),0)+itemTextDamage(h);}
function heroAttack(h){const identity=CLASS_COMBAT[h.className]||{};return Math.max(1,Math.round((4+h.level*2+(activeEquipment(h,"weapon")?.attack||0)+equipmentEffect(h,"attack"))*(identity.attack||1)));}
function heroDefense(h){const identity=CLASS_COMBAT[h.className]||{};return Math.max(1,Math.round((2+h.level+(activeEquipment(h,"armor")?.defense||0)+equipmentEffect(h,"defense"))*(identity.defense||1)));}
function heroMaxHP(h){const identity=CLASS_COMBAT[h.className]||{};return Math.max(1,Math.round((50+(h.level-1)*6+equipmentEffect(h,"maxHP"))*(identity.hp||1)));}
function heroMaxHit(h){const identity=CLASS_COMBAT[h.className]||{};return Math.max(1,Math.round((2+Math.floor(h.level/4)+(activeEquipment(h,"weapon")?.attack||0)+equipmentEffect(h,"attack"))*(identity.maxHit||1)));}
function heroAttackSpeed(h){return CLASS_COMBAT[h.className]?.speed||2.6;}
function heroCritChance(h){const text=heroSpecials(h).join(" "),matches=[...text.matchAll(/\+(\d+)%\s+Crit/gi)],textBonus=matches.reduce((total,match)=>total+Number(match[1])/100,0),explicit=equipmentEffect(h,"critBonus");return clamp((CLASS_COMBAT[h.className]?.crit||.05)+Math.max(textBonus,explicit),0,.65);}
function heroResolve(h){return Math.max(50,Math.round((CLASS_COMBAT[h.className]?.resolve||100)+(h.level-1)/5+equipmentEffect(h,"resolve")));}
function heroSanityDrain(h,cfg){return Math.max(.5,Math.round((BASE_SANITY_DRAIN[cfg.category]||6)*1000/heroResolve(h))/10);}
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
function workActionTime(h,assignment,tier=null){const skillKey=BUILDINGS[assignment]?.skill,skill=h.skills[skillKey]?.level||1,building=state.buildings[assignment]||1,base=assignment==="smith"?SMITH_WORK_TASKS[0].baseSeconds:assignment==="cook"?(tier?.baseSeconds||12):TIER_ACTION_SECONDS[tier?.id||"starter"];return base*1.3/(1+(skill-1)*.01+(building-1)*.08);}
function workActionStatus(h){if(!WORK_ASSIGNMENTS.includes(h.assignment))return "";if(h.assignment==="plunder"){const t=plunderTarget(h),left=Math.max(0,plunderActionTime(h,t)-(h.workProgress||0));return `${t.icon} ${t.name} · ${formatDuration(left)} left`;}if(h.assignment==="smith"&&state.smithOrder){const order=state.smithOrder,d=ITEMS[order.key];return `Forging ${d?.name||"equipment"} · ${Math.max(1,Math.ceil(order.remaining))}s work left`;}if(h.assignment==="smith"&&(resourceTierCount("metal",REPAIR_KIT_RECIPE.metalTier)<REPAIR_KIT_RECIPE.metalCost||resourceTierCount("wood",REPAIR_KIT_RECIPE.woodTier)<REPAIR_KIT_RECIPE.woodCost)){const metal=resourceTierData("metal",REPAIR_KIT_RECIPE.metalTier),wood=resourceTierData("wood",REPAIR_KIT_RECIPE.woodTier);return `Waiting for ${REPAIR_KIT_RECIPE.metalCost} ${metal.name} + ${REPAIR_KIT_RECIPE.woodCost} ${wood.name}`;}const tier=workTaskForHero(h,h.assignment);if(h.assignment==="cook"&&tier&&resourceTierCount("rawFood",tier.rawTier)<1)return `Waiting for ${resourceTierData("rawFood",tier.rawTier)?.name||"ingredients"}`;const seconds=Math.max(0,workActionTime(h,h.assignment,tier)-(h.workProgress||0));return `${tier?`${tier.icon} ${tier.name}`:"🧰 Repair Kit"} in ${Math.max(1,Math.ceil(seconds))}s`;}

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
function adaptHeroNames(text){let adapted=String(text??"");for(const def of HEROES){const live=heroById(def.id);if(!live?.name||live.name===def.name)continue;const escaped=def.name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");adapted=adapted.replace(new RegExp(`\\b${escaped}\\b`,"g"),live.name);}return adapted;}
function partyChatMessageHTML(message,compact=false){const hero=chatHero(message);if(!hero)return "";return `<article class="party-chat-message ${compact?"compact":""} ${message.kind||"ambient"}" style="--chat-color:${hero.color}"><span class="chat-portrait">${heroImage(hero)}</span><div class="chat-bubble"><div class="chat-message-head"><strong><i></i>${escapeHTML(hero.name)}</strong><small>${escapeHTML(hero.className)} · ${chatClock(message.time)}</small></div><p>${escapeHTML(adaptHeroNames(message.text))}</p></div></article>`;}
function partyChatUnread(){const lastRead=Number(state.chatMeta?.lastReadAt)||0;return (state.partyChat||[]).filter(message=>message.time>lastRead).length;}
function syncMapSpeech(){
  const layer=$("#heroLayer");if(!layer)return;const bubbles=[...layer.querySelectorAll(".map-speech")];
  if(!activeMapSpeech||activeMapSpeech.expires<=Date.now()){bubbles.forEach(node=>node.remove());return;}
  const host=layer.querySelector(`[data-map-hero="${activeMapSpeech.heroId}"]`);if(!host){bubbles.forEach(node=>node.remove());return;}
  const speechId=activeMapSpeech.id||`${activeMapSpeech.heroId}-${activeMapSpeech.expires}`,current=bubbles.find(node=>node.dataset.speechId===speechId&&node.parentElement===host);bubbles.forEach(node=>{if(node!==current)node.remove();});
  if(current)return;const bubble=document.createElement("span");bubble.className="map-speech";bubble.dataset.speechId=speechId;bubble.textContent=activeMapSpeech.text;host.append(bubble);
}
function setMapSpeech(hero,text){
  text=adaptHeroNames(text);const now=Date.now(),sameSpeech=activeMapSpeech?.heroId===hero.id&&activeMapSpeech.text===text&&activeMapSpeech.expires>now;activeMapSpeech=sameSpeech?{...activeMapSpeech,expires:now+6200}:{id:uid(),heroId:hero.id,text,expires:now+6200};clearTimeout(mapSpeechTimer);syncMapSpeech();mapSpeechTimer=setTimeout(()=>{activeMapSpeech=null;syncMapSpeech();},6300);
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
function postAssignmentChat(hero,assignment){const text=HERO_CHAT_VOICES[hero.id]?.assignment?.[assignment]||(assignment==="cook"?chatPick(["I’ll turn the harvest into something we can actually eat.","Kitchen duty. Try not to judge the first batch.","Raw vegetables do not count as battle rations. I’m fixing that."]):null);if(text)postHeroChat(hero,text,"assignment",{cooldownKey:`assignment-${hero.id}-${assignment}`,cooldownSeconds:20});}
function postTierChat(hero,assignment,tier){const highest=unlockedResourceTiers(hero,assignment).slice(-1)[0],voice=HERO_CHAT_VOICES[hero.id],text=highest&&highest.rank>tier.rank?voice.outdated(tier.name,highest.name):`I'll focus on ${tier.name}. The Warehouse has ${fmt(resourceTierCount(RESOURCE_ASSIGNMENTS[assignment],tier.id))} stored.`;postHeroChat(hero,text,"assignment",{cooldownKey:`tier-${hero.id}-${assignment}-${tier.id}`,cooldownSeconds:20});}
function contextualAmbientChat(hero){
  const assignment=hero.assignment,voice=HERO_CHAT_VOICES[hero.id];if(voice?.banter?.length&&Math.random()<.5)return chatPick(voice.banter);if(RESOURCE_ASSIGNMENTS[assignment]){const resource=RESOURCE_ASSIGNMENTS[assignment],tier=resourceTierForHero(hero,assignment),best=unlockedResourceTiers(hero,assignment).slice(-1)[0];if(best&&best.rank>tier.rank)return voice.outdated(tier.name,best.name);const skillKey=BUILDINGS[assignment].skill,skill=hero.skills[skillKey],next=RESOURCE_TIERS[resource].find(candidate=>candidate.rank>(best?.rank||0));if(next&&skill.level>=next.level&&state.buildings[assignment]<next.building)return `I can work ${next.name}, but the ${BUILDINGS[assignment].name} needs Level ${next.building}.`;const stored=resourceTierCount(resource,tier.id),nextNote=next?` ${Math.max(0,next.level-skill.level)} skill level${Math.max(0,next.level-skill.level)===1?"":"s"} until ${next.name}.`:" This is the best material we know.";return `${tier.name}: ${fmt(stored)} stored.${nextNote}`;}
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

function saveLocal({touchUpdatedAt=true}={}){
  if(touchUpdatedAt)state.updatedAt=Date.now(); state.lastTick=Math.min(Date.now(),lastSimulationAt||Date.now());try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch(err){console.warn("Device save unavailable",err);}
  if(currentUser && firebaseApi && cloudReconciled) queueCloudSave();
}
function markDirty(){ clearTimeout(saveTimer); saveTimer=setTimeout(saveLocal,650); }
function queueCloudSave(){
  if(cloudSaveTimer) return;
  const wait=Math.max(1000,30000-(Date.now()-lastCloudSave));
  cloudSaveTimer=setTimeout(()=>{cloudSaveTimer=null;scheduleCloudSave();},wait);
}
async function scheduleCloudSave({manual=false}={}){
  if(!currentUser||!firebaseApi||!cloudReconciled)return false;
  const user=currentUser,snapshot=JSON.parse(JSON.stringify(state));
  try{setSync("saving");await firebaseApi.saveGame(user.uid,snapshot);await firebaseApi.writeLeaderboard(user.uid,{displayName:user.displayName||user.email?.split("@")[0]||"Adventurer",totalLevel:snapshot.heroes.reduce((n,h)=>n+h.level,0),combatXP:snapshot.heroes.reduce((n,h)=>n+COMBAT_XP_TOTALS[h.level]+(h.xp||0),0),wealth:Math.floor(snapshot.resources.gold),raidWins:snapshot.stats.raids,updatedAt:Date.now()});setSync("online");if(manual)toast("☁️","Cloud save verified","Firebase confirmed this town was saved.");return true;}
  catch(err){console.error("Cloud save failed",err);setSync("error");if(manual)toast("⚠️","Cloud save failed",friendlyError(err));return false;}
  finally{lastCloudSave=Date.now();}
}


const PLUNDER_TARGETS=[
{id:"caravan",name:"Merchant Caravan",icon:"🛒",level:1,building:1,seconds:120,success:.88,gold:[45,90],xp:18,risk:.08,loot:"supplies"},
{id:"bandits",name:"Bandit Cache",icon:"🗡️",level:15,building:2,seconds:300,success:.78,gold:[140,260],xp:45,risk:.14,loot:"mixed"},
{id:"convoy",name:"Noble Convoy",icon:"👑",level:30,building:3,seconds:600,success:.68,gold:[350,650],xp:90,risk:.22,loot:"gold"},
{id:"smugglers",name:"Smuggler's Den",icon:"⚓",level:50,building:4,seconds:900,success:.60,gold:[700,1300],xp:150,risk:.30,loot:"mixed"},
{id:"cult",name:"Cult Vault",icon:"🕯️",level:75,building:5,seconds:1500,success:.52,gold:[1500,2800],xp:260,risk:.40,loot:"vault"}
];
function heroEarnGold(h,amount,source="loot"){amount=Math.max(0,Math.floor(amount));const tax=Math.floor(amount*(state.taxRate||0)/100),net=amount-tax;h.gold=(h.gold||0)+net;h.records.goldEarned=(h.records.goldEarned||0)+amount;state.resources.gold+=tax;state.stats.goldEarned+=tax;return {gross:amount,tax,net,source};}
function heroSpendGold(h,amount){amount=Math.max(0,amount);const paid=Math.min(h.gold||0,amount);h.gold=Math.max(0,(h.gold||0)-paid);state.resources.gold+=paid;return paid;}
function buildingUpgradeCost(id){const b=BUILDINGS[id],level=state.buildings[id]||1,gold=Math.floor(b.baseCost*Math.pow(1.55,level-1)),materialScale=Math.pow(1.48,level-1);return {gold,wood:Math.ceil((80+b.baseCost*.10)*materialScale),metal:Math.ceil((55+b.baseCost*.075)*materialScale)};}
function plunderTarget(h){const unlocked=PLUNDER_TARGETS.filter(t=>(h.skills.plundering?.level||1)>=t.level);const selected=h.workTiers?.plunder;return unlocked.find(t=>t.id===selected)||unlocked[unlocked.length-1]||PLUNDER_TARGETS[0];}
function plunderActionTime(h,t){return t.seconds/(1+(h.skills.plundering.level-1)*.008+(state.buildings.plunder-1)*.06);}
function completePlunder(h,t){const skill=h.skills.plundering,level=skill.level,chance=clamp(t.success+(level-t.level)*.004,.35,.95),success=random()<chance;h.records.workActions++;if(success){const gross=Math.floor(t.gold[0]+random()*(t.gold[1]-t.gold[0]+1)),pay=heroEarnGold(h,gross,"plunder");addXP(skill,t.xp);let extra="";if(t.loot!=="gold"&&random()<.55){const resource=random()<.5?"wood":"metal",tiers=RESOURCE_TIERS[resource].filter(x=>x.level<=level),tier=tiers[Math.floor(random()*tiers.length)]||tiers[0],qty=2+Math.floor(random()*(3+level/12));addTieredResource(resource,tier.id,qty);extra=` and ${qty} ${tier.name}`;}if(t.loot==="vault"&&random()<.025){state.resources.keys++;extra+=" and a Raid Key";}notify("Plunder successful",`${h.name} stole ${fmt(gross)} Gold${extra}. Tax: ${fmt(pay.tax)}. Hero kept ${fmt(pay.net)}.`,t.icon);}else{addXP(skill,Math.max(2,t.xp*.25));const damage=Math.max(1,Math.round(heroMaxHP(h)*(t.risk*(.7+random()*.6))));h.hp=Math.max(1,(h.hp??heroMaxHP(h))-damage);notify("Plunder failed",`${h.name} escaped ${t.name} empty-handed and lost ${damage} HP.`,"🚨");}}

function sendToTavern(h){
  if(h.assignment!=="tavern")h.records.beers++;
  h.assignment="tavern";
}
function restoreTavernSanity(h,seconds){
  const potential=Math.min(100-h.sanity,(1.2+state.buildings.tavern*.35)*seconds),restored=Math.min(potential,(h.gold||0)/.045);if(restored<=0)return 0;h.sanity=clamp(h.sanity+restored,0,100);heroSpendGold(h,restored*.045);return restored;
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
  const runBefore=state.combatRuns.map(run=>({id:run.id,combatId:run.combatId,heroIds:[...(run.rosterIds||run.heroIds)],cycle:run.cycle,cycles:run.cycles,kills:run.kills,elapsed:run.elapsed})),combatHeroIds=new Set(runBefore.flatMap(run=>run.heroIds)),heroBefore=Object.fromEntries(state.heroes.map(h=>[h.id,{name:h.name,level:h.level,totalXP:heroCombatTotalXP(h),skills:Object.fromEntries(Object.entries(h.skills).map(([key,skill])=>[key,skill.level]))}]));
  const beforeTiers=Object.fromEntries(Object.entries(RESOURCE_TIERS).map(([resource,tiers])=>[resource,Object.fromEntries(tiers.map(tier=>[tier.id,state.resourceTiers[resource][tier.id]||0]))]));
  for(const h of state.heroes){
    if(h.assignment!=="idle")h.records.secondsActive+=seconds;
    if(h.assignment==="inn" && h.recoveryUntil && Date.now()>=h.recoveryUntil){h.hp=heroMaxHP(h);sendToTavern(h);h.recoveryUntil=0;notify("Back on their feet",`${h.name} left the Inn and is restoring Sanity at the Tavern.`,"🛏️");postHeroChat(h,"Back on my feet. I am heading to the Tavern to clear the rest of the fog.","recovery");}
    if(h.assignment==="tavern"&&!expeditionRunForRestingHero(h.id)){
      restoreTavernSanity(h,seconds);if(h.sanity>=99.99){h.sanity=100;h.assignment="idle";postHeroChat(h,"Clear head, steady hands, ready for another assignment.","recovery",{cooldownKey:`tavern-ready-${h.id}`,cooldownSeconds:30});}
    }
    if(WORK_ASSIGNMENTS.includes(h.assignment)) processWork(h,seconds);
  }
  processSmithOrder(seconds);
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
  const map={farm:["rawFood","farming"],mine:["metal","mining"],forest:["wood","woodcutting"]};
  if(map[h.assignment]){
    const [resource,skill]=map[h.assignment];h.workProgress=(h.workProgress||0)+seconds;let loops=0;
    while(loops++<50000){
      const tier=resourceTierForHero(h,h.assignment),actionTime=workActionTime(h,h.assignment,tier);if(h.workProgress+1e-8<actionTime)break;h.workProgress-=actionTime;
      const doubleKey=resource==="rawFood"?"foodDoubleChance":resource==="metal"?"metalDoubleChance":"woodDoubleChance",units=random()<equipmentEffect(h,doubleKey)?2:1;
      const oldLevel=h.skills[skill].level,recordKey=resource==="rawFood"?"foodGathered":resource==="metal"?"metalMined":"woodGathered",milestoneName=resource==="rawFood"?"ingredients harvested":resource==="metal"?"ores mined":"logs gathered",before=h.records[recordKey];addTieredResource(resource,tier.id,units);addXP(h.skills[skill],5*Math.sqrt(tier.rank));h.records.workActions++;h.records[recordKey]+=units;postWorkLevelChat(h,h.assignment,skill,oldLevel);postWorkMilestone(h,before,h.records[recordKey],milestoneName);rollSkillPet(h.assignment,h);
    }
  }else if(h.assignment==="cook"){
    const task=workTaskForHero(h,"cook"),skill=h.skills.cooking;if(!task)return;h.workProgress=(h.workProgress||0)+seconds;let loops=0;
    while(loops++<50000){const actionTime=workActionTime(h,"cook",task);if(h.workProgress+1e-8<actionTime)break;if(resourceTierCount("rawFood",task.rawTier)<1){h.workProgress=Math.min(h.workProgress,actionTime);break;}h.workProgress-=actionTime;spendSpecificResource("rawFood",task.rawTier,1);const oldLevel=skill.level,before=h.records.foodCooked||0;addTieredResource("food",task.id,1);addXP(skill,7*Math.sqrt(task.rank));h.records.foodCooked=(h.records.foodCooked||0)+1;h.records.workActions++;postWorkLevelChat(h,"cook","cooking",oldLevel);postWorkMilestone(h,before,h.records.foodCooked,"meals cooked");}
  }else if(h.assignment==="plunder"){
    const t=plunderTarget(h);h.workProgress=(h.workProgress||0)+seconds;let loops=0;while(loops++<1000){const actionTime=plunderActionTime(h,t);if(h.workProgress+1e-8<actionTime)break;h.workProgress-=actionTime;completePlunder(h,t);}
  }else if(h.assignment==="smith"){
    if(state.smithOrder)return;const skill=h.skills.smithing;h.workProgress=(h.workProgress||0)+seconds;let loops=0;
    while(loops++<50000){const actionTime=workActionTime(h,"smith");if(h.workProgress+1e-8<actionTime)break;if(resourceTierCount("metal",REPAIR_KIT_RECIPE.metalTier)<REPAIR_KIT_RECIPE.metalCost||resourceTierCount("wood",REPAIR_KIT_RECIPE.woodTier)<REPAIR_KIT_RECIPE.woodCost){h.workProgress=Math.min(h.workProgress,actionTime);break;}h.workProgress-=actionTime;spendSpecificResource("metal",REPAIR_KIT_RECIPE.metalTier,REPAIR_KIT_RECIPE.metalCost);spendSpecificResource("wood",REPAIR_KIT_RECIPE.woodTier,REPAIR_KIT_RECIPE.woodCost);const kits=random()<equipmentEffect(h,"smithDoubleChance")?2:1,oldLevel=skill.level,before=h.records.kitsForged;state.resources.repairKits+=kits;addXP(skill,28);h.records.kitsForged+=kits;h.records.workActions++;postWorkLevelChat(h,"smith","smithing",oldLevel);postWorkMilestone(h,before,h.records.kitsForged,"Repair Kits");rollSkillPet("smith",h);}
  }
}

function smithOrderSeconds(d){const tier=NORMAL_GEAR_TIER_SPECS.find(t=>t.id===(d.recipeTier||"starter")),scale=tier?.costScale||Math.max(1,(d.requiredLevel||1)/5);return Math.round(45*Math.max(1,scale));}
function processSmithOrder(seconds){const order=state.smithOrder;if(!order)return;const smiths=state.heroes.filter(h=>h.assignment==="smith"&&(h.hp||0)>0);if(!smiths.length)return;const rates=smiths.map(h=>1+(h.skills.smithing.level-1)*.01+(state.buildings.smith-1)*.08).sort((a,b)=>b-a),rate=rates.reduce((n,r,i)=>n+r*(i?0.3:1),0);order.remaining=Math.max(0,order.remaining-seconds*rate);if(order.remaining>0)return;const d=ITEMS[order.key],lead=smiths.sort((a,b)=>b.skills.smithing.level-a.skills.smithing.level)[0];state.inventory.push({id:uid(),key:order.key,durability:100,upgrade:0,acquiredAt:Date.now()});for(const h of smiths){const old=h.skills.smithing.level;addXP(h.skills.smithing,h===lead?70:20);h.records.workActions++;postWorkLevelChat(h,"smith","smithing",old);}state.smithOrder=null;notify("Equipment finished",`${lead?.name||"The smith"} completed ${d.name}.`,d.icon);markDirty();}

const ENEMY_SPECIALS=[
  {id:"crusher",name:"Crusher",icon:"💥",detail:"Every 3rd attack is a Crushing Blow."},
  {id:"venomous",name:"Venomous",icon:"☠️",detail:"Special attacks add a burst of venom damage."},
  {id:"vampiric",name:"Vampiric",icon:"🩸",detail:"Special attacks restore enemy health."},
  {id:"sweeping",name:"Sweeping",icon:"🌪️",detail:"Every 4th attack strikes the whole party."}
];
function enemySpecialFor(cfg,room){const eligible=cfg.category==="raid"||cfg.category==="dungeon"||(cfg.category==="expedition"&&room.boss);if(!eligible)return null;const guaranteed=room.boss, chance=cfg.category==="raid"?.72:.55;if(!guaranteed&&random()>chance)return null;return ENEMY_SPECIALS[Math.floor(random()*ENEMY_SPECIALS.length)];}
function maybeEnrageEnemy(run,offline=false){const e=run.enemy;if(!e?.boss||e.enraged||e.hp<=0||e.hp/e.maxHP>.3)return;e.enraged=true;e.attack=Math.round(e.attack*1.3);e.maxHit=Math.round(e.maxHit*1.3);e.speed=Math.max(.8,e.speed*.85);run.enemyTimer=Math.min(run.enemyTimer,e.speed);pushCombatEvent(run,`${e.name} ENRAGES below 30% HP! Attack +30%, max hit +30%, attack speed +15%.`,"enrage","enemy",null,null,offline);}
function raidPaceScale(cfg){return cfg.category==="raid"?(cfg.raidPace||1):1;}
function createEnemy(cfg,room){
  const level=cfg.minLevel,baseHP=cfg.category==="raid"?160+level*11:cfg.category==="dungeon"?50+level*5.5:18+level*3.5,baseAttack=5+level*1.7,baseDefense=4+level*1.2,baseMax=cfg.category==="raid"?6+level*.5:cfg.category==="dungeon"?4+level*.38:2+level*.28;
  const maxHP=Math.max(8,Math.round(baseHP*room.hp*ENEMY_STAT_MULTIPLIER*ENEMY_SURVIVABILITY_MULTIPLIER*raidPaceScale(cfg))),special=enemySpecialFor(cfg,room);return {name:room.name,icon:room.icon,image:room.image,boss:!!room.boss,special,enraged:false,combatStyle:room.combatStyle||"melee",hp:maxHP,maxHP,attack:Math.round(baseAttack*room.attack*ENEMY_STAT_MULTIPLIER*ENEMY_DAMAGE_MULTIPLIER*ENEMY_OFFENSE_MULTIPLIER),defense:Math.round(baseDefense*room.defense*ENEMY_STAT_MULTIPLIER*ENEMY_SURVIVABILITY_MULTIPLIER),maxHit:Math.max(2,Math.round(baseMax*(room.boss?1.18:1)*ENEMY_STAT_MULTIPLIER*ENEMY_DAMAGE_MULTIPLIER*ENEMY_OFFENSE_MULTIPLIER)),speed:room.speed,attacks:0,status:{},room};
}
function combatRoomsFor(cfg){return (COMBAT_LAYOUTS[cfg.id]||[]).filter(room=>room.type==="combat");}
function pushCombatEvent(run,text,type="info",target="enemy",amount=null,attackerId=null,offline=false){if(offline||quietSimulation)return;run.recentEvents=(run.recentEvents||[]).concat({id:uid(),at:Date.now(),text,type,target,amount,attackerId}).slice(-30);}
function enterCurrentRoom(run,cfg,offline=false){
  const room=runRoute(run,cfg)[run.roomIndex];if(!room){completeCombatCycle(run,cfg,offline);return;}
  if(room.type==="combat"){
    run.enemy=createEnemy(cfg,room);run.roomState={type:"combat"};run.enemyTimer=run.enemy.speed*.7;run.heroTimers={};
    for(const id of run.heroIds){const h=heroById(id);if(h)run.heroTimers[id]=heroAttackSpeed(h)*(.25+random()*.45);}
    pushCombatEvent(run,`${run.enemy.name} enters the fight.${run.enemy.special?` ${run.enemy.special.icon} ${run.enemy.special.name}: ${run.enemy.special.detail}`:""}`,room.boss?"boss":"info","enemy",null,null,offline);
  }else{
    const party=run.heroIds.map(heroById).filter(Boolean),ranked=party.map(h=>({h,level:h.skills[room.skill]?.level||1})).sort((a,b)=>b.level-a.level),effective=ranked.reduce((total,x,i)=>total+x.level*(i?0.25:1),0),total=Math.max(8,room.baseSeconds*raidPaceScale(cfg)/(1+effective/25));
    run.enemy=null;run.roomState={type:"skill",total,remaining:total,effective,leaderId:ranked[0]?.h.id||null};pushCombatEvent(run,`${room.name}: ${room.description}`,"skill","room",null,ranked[0]?.h.id,offline);
  }
}
function advanceCombatRoom(run,cfg,offline=false){run.roomIndex++;run.roomState=null;run.enemy=null;if(run.roomIndex>=runRoute(run,cfg).length)completeCombatCycle(run,cfg,offline);else{rejoinReadyExpeditionHeroes(run,offline);enterCurrentRoom(run,cfg,offline);}}
function combatRunHeroStats(run,heroId){if(!run.heroStats)run.heroStats={};if(!run.heroStats[heroId])run.heroStats[heroId]={damage:0,taken:0,healing:0,attacks:0,hits:0,crits:0};return run.heroStats[heroId];}
function applyEnemyDamage(run,amount,type,sourceId,offline=false){if(!run.enemy)return false;const source=heroById(sourceId),multiplier=source?combatStyleMultiplier(heroCombatStyle(source),run.enemy.combatStyle):1,before=run.enemy.hp;amount=amount>0?Math.max(1,Math.round(amount*multiplier)):0;run.enemy.hp=Math.max(0,run.enemy.hp-amount);const actual=before-run.enemy.hp;run.damageDealt+=actual;if(COMBAT[run.combatId]?.category==="raid")run.raidCombatPoints=(run.raidCombatPoints||0)+actual;if(source){combatRunHeroStats(run,sourceId).damage+=actual;source.records.damageDealt=(source.records.damageDealt||0)+actual;}const edge=multiplier>1?" · advantage":multiplier<1?" · resisted":"";pushCombatEvent(run,actual?`${source?.name||"The party"} deals ${actual} ${type} damage${edge}.`:`${source?.name||"The party"} misses.`,type,"enemy",actual,sourceId,offline);maybeEnrageEnemy(run,offline);if(run.enemy.hp<=0){defeatEnemy(run,sourceId,offline);return true;}return false;}
function defeatEnemy(run,killerId,offline=false){
  const cfg=COMBAT[run.combatId],enemy=run.enemy,killer=heroById(killerId),party=run.heroIds.map(heroById).filter(Boolean),xp=cfg.xp/Math.max(1,combatRoomsFor(cfg).length),leveled=[];if(killer)killer.records.kills++;for(const h of party)if(addXP(h,xp)>0)leveled.push(h);if(leveled.length){notify("Combat level gained",`${leveled.map(h=>h.name).join(", ")} reached ${leveled.length===1?`Combat Level ${leveled[0].level}`:"new Combat Levels"}. Their class combat stats increased.`,"⭐");playSound("level");postCombatLevelChat(chatPick(leveled));}run.kills++;const commonDrop=addCommonCombatDrop(cfg,enemy,offline,killer);pushCombatEvent(run,`${enemy.name} defeated! ${fmt(xp)} XP to each survivor.${commonDrop?` Common drop: ${commonDrop}.`:""}`,enemy.boss?"boss":"kill","enemy",null,killerId,offline);advanceCombatRoom(run,cfg,offline);
}
function processEnemyStatuses(run,dt,offline=false){
  const enemy=run.enemy;if(!enemy)return false;for(const [type,status] of Object.entries(enemy.status||{})){status.remaining-=dt;status.timer-=dt;while(status.timer<=0&&status.remaining>0&&run.enemy){status.timer+=type==="fire"?1.5:2;if(applyEnemyDamage(run,status.damage,type,status.sourceId,offline))return true;}if(status.remaining<=0)delete enemy.status[type];}return false;
}
function healLowestHero(run,amount,source,offline=false){const party=run.heroIds.map(heroById).filter(h=>h&&(h.hp||0)>0),target=party.sort((a,b)=>(a.hp/heroMaxHP(a))-(b.hp/heroMaxHP(b)))[0];if(!target||target.hp>=heroMaxHP(target))return;const healed=Math.min(amount,heroMaxHP(target)-target.hp);target.hp+=healed;combatRunHeroStats(run,source.id).healing+=healed;source.records.healingDone=(source.records.healingDone||0)+healed;pushCombatEvent(run,`${source.name} restores ${healed} HP to ${target.name}.`,"heal",target.id,healed,source.id,offline);}
function applyWeaponElementalBonus(run,h,damage,offline=false){
  const bonus=equipmentDamageBonus(h);if(damage<=0||bonus<=0||!run.enemy)return false;const type=heroDamageType(h);if(applyEnemyDamage(run,bonus,type,h.id,offline))return true;if(!run.enemy)return true;
  if(type==="poison"||type==="fire"){const dot=Math.max(1,Math.ceil(bonus/3));run.enemy.status[type]={damage:dot,remaining:4.5,timer:1.5,sourceId:h.id};pushCombatEvent(run,`${h.name}'s weapon inflicts ${type}.`,type,"enemy",dot,h.id,offline);}
  if(type==="frost")run.enemyTimer+=.45;return false;
}
function applyWeaponProc(run,h,damage,offline=false){
  if(damage<=0||!run.enemy)return false;const weapon=activeEquipment(h,"weapon"),effects=weapon?.effects||{};
  const proc=(chance,multiplier,label,type)=>{if(!chance||random()>=chance||!run.enemy)return false;const amount=Math.max(1,Math.ceil(damage*multiplier));pushCombatEvent(run,`${h.name}'s ${label} triggers!`,"special","enemy",amount,h.id,offline);return applyEnemyDamage(run,amount,type,h.id,offline);};
  if(proc(effects.chainLightningChance,effects.chainLightningMultiplier||.5,"Chain Lightning","lightning"))return true;
  if(proc(effects.thunderVolleyChance,effects.thunderVolleyMultiplier||.55,"Thunder Volley","lightning"))return true;
  if(proc(effects.voidSurgeChance,effects.voidSurgeMultiplier||.75,"Void Surge","shadow"))return true;
  return false;
}
function performHeroAttack(run,h,offline=false){
  const enemy=run.enemy;if(!enemy||(h.hp||0)<=0)return;const stats=combatRunHeroStats(run,h.id);stats.attacks++;h.records.combatActions=(h.records.combatActions||0)+1;const maxHit=heroMaxHit(h),hitChance=clamp(.25+(heroAttack(h)/(heroAttack(h)+enemy.defense))*.7,.25,.98);let damage=random()<hitChance?Math.floor(random()*(maxHit+1)):0,crit=damage>0&&random()<heroCritChance(h),special="";if(damage)stats.hits++;if(crit)stats.crits++;
  if(crit)damage=Math.ceil(damage*1.6);if(h.className==="Warrior"&&damage&&random()<.12){damage+=Math.ceil(maxHit*.3);special=" crushing";}if(h.className==="Wizard"&&damage&&random()<.18){damage+=Math.ceil(maxHit*.4);special=" arcane";}
  if(!offline&&damage)playSound(crit?"crit":"hit");
  if(applyEnemyDamage(run,damage,crit?"crit":CLASS_COMBAT[h.className]?.style||"physical",h.id,offline))return;
  if(damage&&h.className==="Summoner"&&random()<.22&&run.enemy){const echoes=1+Math.max(0,Math.floor(equipmentEffect(h,"extraEchoes"))),echoMultiplier=.5+equipmentEffect(h,"echoDamageBonus"),burnRatio=equipmentEffect(h,"echoBurn");for(let i=0;i<echoes&&run.enemy;i++){const echo=Math.max(1,Math.ceil(damage*echoMultiplier));if(applyEnemyDamage(run,echo,"summon",h.id,offline))return;if(burnRatio&&run.enemy){const burn=Math.max(1,Math.ceil(echo*burnRatio));run.enemy.status.fire={damage:burn,remaining:4.5,timer:1.5,sourceId:h.id};pushCombatEvent(run,`${h.name}'s summoned echo ignites the target.`,"fire","enemy",burn,h.id,offline);}}special=echoes>1?" echoed twice":" echoed";}
  if(applyWeaponProc(run,h,damage,offline))return;
  if(applyWeaponElementalBonus(run,h,damage,offline))return;
  if(h.className==="Druid"&&random()<.16){const healingPower=1+equipmentEffect(h,"healingPower");healLowestHero(run,Math.max(2,Math.ceil(maxHit*.35*healingPower)),h,offline);}if(special)pushCombatEvent(run,`${h.name}'s${special} strike surges.`,"special","enemy",null,h.id,offline);
}

function defeatHero(run,h,offline=false){const innFee=25+h.level*2;heroSpendGold(h,innFee);h.hp=0;h.assignment="inn";h.recoveryUntil=Date.now()+(1200/(1+state.buildings.inn*.2))*1000;h.records.defeats++;state.stats.defeats++;run.heroIds=run.heroIds.filter(id=>id!==h.id);run.rosterIds=(run.rosterIds||run.heroIds).filter(id=>id!==h.id);delete run.heroTimers[h.id];pushCombatEvent(run,`${h.name} falls and is carried to the Inn.`,"defeat",h.id,0,null,offline);notify("Cart to the Inn",`${h.name} was defeated during ${COMBAT[run.combatId].short}.`,"🛒");const companion=chatPick(run.heroIds.map(heroById).filter(Boolean));if(companion)postHeroChat(companion,`${h.name} is down. The Inn has them—we keep moving.`,"danger");else postHeroChat(h,"I woke up in the Inn. That answers how the fight went.","recovery");if(!run.heroIds.length)stopRun(run.id,false,false,"Party defeated");}
function performEnemyAttack(run,offline=false){
  const enemy=run.enemy,party=run.heroIds.map(heroById).filter(h=>h&&(h.hp||0)>0);if(!enemy||!party.length)return;enemy.attacks++;const special=enemy.special,trigger=special&&(special.id==="crusher"?enemy.attacks%3===0:enemy.attacks%4===0),targets=(trigger&&special.id==="sweeping")||(enemy.boss&&!special&&enemy.attacks%4===0)?party:[party[Math.floor(random()*party.length)]];
  if(trigger)pushCombatEvent(run,`${enemy.name} uses ${special.name}! ${special.detail}`,"special","enemy",null,"enemy",offline);
  let totalDamage=0;for(const h of targets){const hitChance=clamp(.22+(enemy.attack/(enemy.attack+heroDefense(h)*1.8))*.68,.18,.95),base=random()<hitChance?Math.floor(random()*(enemy.maxHit+1)):0,specialMult=trigger&&special.id==="crusher"?1.75:1,raw=targets.length>1?Math.ceil(base*.65):Math.ceil(base*specialMult),multiplier=combatStyleMultiplier(enemy.combatStyle,heroCombatStyle(h)),damage=raw>0?Math.max(1,Math.round(raw*multiplier)):0,maxHP=heroMaxHP(h),before=h.hp??maxHP;h.hp=Math.max(0,before-damage);const actual=before-h.hp;totalDamage+=actual;run.damageTaken+=actual;combatRunHeroStats(run,h.id).taken+=actual;h.records.damageTaken=(h.records.damageTaken||0)+actual;const edge=multiplier>1?" · advantage":multiplier<1?" · resisted":"";pushCombatEvent(run,actual?`${enemy.name} hits ${h.name} for ${actual}${edge}.`:`${enemy.name} misses ${h.name}.`,actual?"enemy":"miss",h.id,actual,"enemy",offline);if(trigger&&special.id==="venomous"&&actual&&h.hp>0){const venom=Math.max(1,Math.round(enemy.maxHit*.18));h.hp=Math.max(0,h.hp-venom);run.damageTaken+=venom;combatRunHeroStats(run,h.id).taken+=venom;h.records.damageTaken=(h.records.damageTaken||0)+venom;pushCombatEvent(run,`${h.name} suffers ${venom} venom damage.`,"poison",h.id,venom,"enemy",offline);}if(!offline&&actual)playSound("enemy");if(h.hp>0&&before/maxHP>.42&&h.hp/maxHP<=.42)postCombatDanger(run,h);if(h.hp<=0)defeatHero(run,h,offline);}
  if(trigger&&special.id==="vampiric"&&run.enemy&&totalDamage){const healed=Math.min(run.enemy.maxHP-run.enemy.hp,Math.max(1,Math.round(totalDamage*.5)));run.enemy.hp+=healed;if(healed)pushCombatEvent(run,`${enemy.name} drains the party and restores ${healed} HP.`,"heal","enemy",healed,"enemy",offline);}
}

function consumeCombatFood(run,h,offline=false){
  if((h.hp||0)>heroMaxHP(h)*.45)return false;if((h.gold||0)<2)return false;if(state.resources.food<=0){postNoFoodChat(h);return false;}const deficit=heroMaxHP(h)-h.hp,bonus=equipmentEffect(h,"foodEfficiency")*4,available=RESOURCE_TIERS.food.filter(t=>(state.resourceTiers.food[t.id]||0)>0).map(t=>({...t,actualHeal:t.heal+bonus}));if(!available.length){postNoFoodChat(h);return false;}const tier=available.find(t=>t.actualHeal>=deficit)||available[available.length-1];state.resourceTiers.food[tier.id]--;recalculateTieredTotal("food");heroSpendGold(h,2);const healed=Math.min(deficit,tier.actualHeal);h.hp+=healed;run.foodEaten++;pushCombatEvent(run,`${h.name} eats ${tier.name} and heals ${healed} HP.`,"heal",h.id,healed,h.id,offline);return true;
}
function processSkillRoom(run,cfg,dt,offline=false){
  const room=runRoute(run,cfg)[run.roomIndex],s=run.roomState;s.remaining-=dt;if(s.remaining>0)return;const party=run.heroIds.map(heroById).filter(Boolean),leader=heroById(s.leaderId),assignment={farming:"farm",mining:"mine",woodcutting:"forest",smithing:"smith"}[room.skill],leveled=[];for(const h of party){const oldLevel=h.skills[room.skill].level;addXP(h.skills[room.skill],h.id===s.leaderId?room.baseSeconds*.45:room.baseSeconds*.16);h.records.workActions++;if(h.skills[room.skill].level>oldLevel)leveled.push({hero:h,oldLevel});}const chatter=chatPick(leveled);if(chatter)postWorkLevelChat(chatter.hero,assignment,room.skill,chatter.oldLevel);if(leader)rollSkillPet(assignment,leader);const raidPoints=cfg.category==="raid"?Math.round(room.baseSeconds*(1+s.effective/50)):0;if(raidPoints)run.raidSkillPoints=(run.raidSkillPoints||0)+raidPoints;pushCombatEvent(run,`${room.name} cleared by ${leader?.name||"the party"} at effective ${Math.floor(s.effective)} ${room.skill}.${raidPoints?` +${fmt(raidPoints)} raid points.`:""}`,"skill","room",raidPoints||null,s.leaderId,offline);advanceCombatRoom(run,cfg,offline);
}
function processCombatRoom(run,cfg,dt,offline=false){
  for(const id of [...run.heroIds]){const h=heroById(id);if(h)consumeCombatFood(run,h,offline);}if(processEnemyStatuses(run,dt,offline)||!run.enemy)return;
  for(const id of [...run.heroIds]){const h=heroById(id);if(!h||!run.enemy)continue;run.heroTimers[id]=(run.heroTimers[id]??heroAttackSpeed(h))-dt;let attacks=0;while(run.heroTimers[id]<=0&&run.enemy&&attacks++<3){run.heroTimers[id]+=heroAttackSpeed(h);performHeroAttack(run,h,offline);}}
  if(!run.enemy)return;run.enemyTimer-=dt;if(run.enemyTimer<=0){run.enemyTimer+=run.enemy.speed+(run.enemy.status.frost?.remaining?0.5:0);performEnemyAttack(run,offline);}
}
function sendHeroOnExpeditionBreak(run,h,cfg,offline=false){
  run.heroIds=run.heroIds.filter(id=>id!==h.id);run.restingHeroIds=[...new Set([...(run.restingHeroIds||[]),h.id])];delete run.heroTimers[h.id];sendToTavern(h);pushCombatEvent(run,`${h.name} takes a Tavern break at ${Math.floor(h.sanity)} Sanity and remains on the expedition roster.`,"recovery",h.id,null,h.id,offline);postHeroChat(h,`I need a short Tavern break. I'll rejoin ${cfg.short} at the next checkpoint.`,"recovery",{cooldownKey:`expedition-break-${run.id}-${h.id}`,cooldownSeconds:120});
}
function recoverExpeditionResters(run,seconds){
  for(const heroId of [...(run.restingHeroIds||[])]){const h=heroById(heroId);if(!h||h.assignment!=="tavern"||(h.hp||0)<=0){run.restingHeroIds=run.restingHeroIds.filter(id=>id!==heroId);run.rosterIds=(run.rosterIds||run.heroIds).filter(id=>id!==heroId);continue;}restoreTavernSanity(h,seconds);}
}
function rejoinReadyExpeditionHeroes(run,offline=false){
  const cfg=COMBAT[run.combatId];if(cfg?.category!=="expedition")return 0;const ready=(run.restingHeroIds||[]).map(heroById).filter(h=>h&&h.assignment==="tavern"&&(h.hp||0)>0&&h.sanity>=EXPEDITION_RETURN_SANITY),capacity=Math.max(0,cfg.maxParty-run.heroIds.length),returning=ready.slice(0,capacity);
  for(const h of returning){run.restingHeroIds=run.restingHeroIds.filter(id=>id!==h.id);if(!run.heroIds.includes(h.id))run.heroIds.push(h.id);h.assignment="combat";run.heroTimers[h.id]=heroAttackSpeed(h)*(.35+random()*.3);pushCombatEvent(run,`${h.name} returns from the Tavern with ${Math.floor(h.sanity)} Sanity.`,"recovery",h.id,null,h.id,offline);postHeroChat(h,`Break's over. I'm rejoining ${cfg.short}.`,"recovery",{cooldownKey:`expedition-return-${run.id}-${h.id}`,cooldownSeconds:120});}
  return returning.length;
}
function resumeWaitingExpedition(run,cfg,offline=false){
  rejoinReadyExpeditionHeroes(run,offline);if(!run.heroIds.length)return false;if(!canPayRunEntry(cfg)){stopRun(run.id,false,false,"Entry supplies exhausted");notify("Run paused",`${cfg.short} stopped because the next entry supplies ran out during the Tavern break.`,"🎒");return false;}payRunEntry(cfg);run.waitingForParty=false;run.roomIndex=0;run.roomState=null;run.enemy=null;run.route=generateCombatRoute(cfg.id);run.cycleElapsed=0;pushCombatEvent(run,`${cfg.short} resumes as the refreshed party leaves the Tavern.`,"recovery","room",null,null,offline);return true;
}
function processRun(run,seconds,offline=false){
  const cfg=COMBAT[run.combatId];if(!cfg){stopRun(run.id,false,false,"Activity unavailable");return;}let remaining=seconds,steps=0;while(remaining>0&&state.combatRuns.includes(run)&&steps++<250000){const dt=Math.min(.25,remaining);remaining-=dt;run.elapsed+=dt;recoverExpeditionResters(run,dt);if(run.waitingForParty){if(!resumeWaitingExpedition(run,cfg,offline))continue;}run.cycleElapsed+=dt;if(!run.roomState)enterCurrentRoom(run,cfg,offline);if(!state.combatRuns.includes(run)||!run.roomState)continue;if(run.roomState.type==="skill")processSkillRoom(run,cfg,dt,offline);else processCombatRoom(run,cfg,dt,offline);}
}

function raidTargetPoints(cfg){
  const layout=COMBAT_LAYOUTS[cfg.id]||[],combat=layout.filter(room=>room.type==="combat").reduce((total,room)=>total+createEnemy(cfg,room).maxHP,0),skill=layout.filter(room=>room.type==="skill").reduce((total,room)=>total+room.baseSeconds*raidPaceScale(cfg)*1.5,0);return Math.max(1,Math.round(combat+skill));
}
function raidRewardScore(run,cfg){
  const combat=Math.max(0,Math.round(run.raidCombatPoints||0)),skill=Math.max(0,Math.round(run.raidSkillPoints||0)),raw=combat+skill,target=raidTargetPoints(cfg),timeMultiplier=clamp((cfg.duration||run.cycleElapsed)/Math.max(1,run.cycleElapsed),.65,1.35),score=Math.max(0,Math.round(raw*timeMultiplier)),chance=clamp((cfg.itemChance||.10)*(score/target),0,.25);return {combat,skill,raw,target,timeMultiplier,score,chance};
}
function addCommonCombatDrop(cfg,enemy,offline=false,killer=null){if(random()>.22)return null;const level=cfg.minLevel,tierIds=RESOURCE_TIERS.metal.filter(t=>t.level<=Math.max(1,level)).map(t=>t.id),tier=tierIds[Math.floor(random()*Math.min(tierIds.length,3))]||"starter",roll=random();if(roll<.38){const gold=Math.max(3,Math.round((4+level*.7)*(1+random())));if(killer){const pay=heroEarnGold(killer,gold,"monster");return `${gold} Gold (${pay.tax} tax)`;}return `${gold} Gold`;}const resource=roll<.62?"food":roll<.81?"wood":"metal",useTier=resource==="food"?RESOURCE_TIERS.food[Math.min(RESOURCE_TIERS.food.length-1,RESOURCE_TIERS.metal.findIndex(t=>t.id===tier))].id:tier,qty=1+Math.floor(random()*Math.max(2,1+level/30));addTieredResource(resource,useTier,qty);return `${qty} ${resourceTierData(resource,useTier)?.name||resource}`;}
function awardCommonChest(cfg,party,offline=false){const scale=Math.max(1,Math.sqrt(cfg.minLevel||1)),parts=[];const bonusGold=cfg.category==="raid"?Math.round((cfg.entryGold||0)*(.4+random()*.35)):Math.round((25+random()*50)*scale);if(party?.length){const share=Math.floor(bonusGold/party.length);for(const h of party)heroEarnGold(h,share,"common chest");}parts.push(`${fmt(bonusGold)} bonus Gold`);const count=cfg.category==="raid"?3:2;for(let i=0;i<count;i++){const resource=["food","wood","metal"][Math.floor(random()*3)],tiers=RESOURCE_TIERS[resource].filter(t=>t.level<=cfg.minLevel),tier=tiers[Math.floor(random()*tiers.length)]||RESOURCE_TIERS[resource][0],qty=Math.max(2,Math.round((3+random()*5)*scale));addTieredResource(resource,tier.id,qty);parts.push(`${qty} ${tier.name}`);}return parts;}

function completeCombatCycle(run,cfg,offline=false){
  const party=run.heroIds.map(heroById).filter(Boolean);if(!party.length){stopRun(run.id,false,false,"Party defeated");return;}const gold=Math.floor(cfg.gold[0]+random()*(cfg.gold[1]-cfg.gold[0]+1)),raidScore=cfg.category==="raid"?raidRewardScore(run,cfg):null,share=Math.floor(gold/party.length);for(const h of party)heroEarnGold(h,share,"chest");run.cycles++;run.lastReward=raidScore?`${fmt(gold)} Gold · ${chanceLabel(raidScore.chance)} rare roll`:`${fmt(gold)} Gold`;
  for(const h of party){h.sanity=clamp(h.sanity-heroSanityDrain(h,cfg),0,100);damageGear(h,cfg.category==="raid"?12:cfg.category==="dungeon"?7:3);if(cfg.category==="expedition")h.records.expeditions++;if(cfg.category==="dungeon"){h.records.dungeons++;h.records.dungeonBosses++;}if(cfg.category==="raid"){h.records.raids++;h.records.raidBosses++;}}
  if(cfg.category==="expedition")state.stats.expeditions++;
  if(cfg.category==="dungeon"){state.stats.dungeons++;state.resources.essence+=Math.floor(cfg.essenceReward[0]+random()*(cfg.essenceReward[1]-cfg.essenceReward[0]+1));if(random()<(cfg.keyChance||0))state.resources.keys+=1;if(cfg.trinketPool?.length&&random()<(cfg.trinketChance||0))dropTrinket(cfg,party);}
  let raidRareHit=false,dungeonRareHit=false;if(cfg.category==="raid"){state.stats.raids++;state.resources.essence+=Math.floor(cfg.essenceReward[0]+random()*(cfg.essenceReward[1]-cfg.essenceReward[0]+1));if(cfg.eggKey&&random()<(cfg.eggChance||0))dropEgg(cfg,party);raidRareHit=!!(cfg.pool?.length&&random()<raidScore.chance);if(raidRareHit)dropSpecial(cfg,party);run.lastRaidScore={...raidScore,elapsed:run.cycleElapsed,hit:raidRareHit};}
  if(cfg.category!=="raid"&&cfg.pool?.length){dungeonRareHit=cfg.category==="dungeon"&&random()<(cfg.itemChance||0);if(cfg.category==="dungeon"?dungeonRareHit:random()<(cfg.itemChance||0))dropSpecial(cfg,party);}
  const commonChest=((cfg.category==="raid"&&!raidRareHit)||(cfg.category==="dungeon"&&!dungeonRareHit))?awardCommonChest(cfg,party,offline):[];
  const chestResult=commonChest?.length?` Common chest: ${commonChest.join(", ")}.`:"";const raidResult=raidScore?` Raid score: ${fmt(raidScore.score)} (${fmt(raidScore.combat)} combat + ${fmt(raidScore.skill)} skill, ×${raidScore.timeMultiplier.toFixed(2)} time). Rare table: ${chanceLabel(raidScore.chance)}${raidRareHit?" — HIT!":"."}`:"";pushCombatEvent(run,`${cfg.short} cleared in ${formatDuration(run.cycleElapsed)}. Chest: ${fmt(gold)} Gold.${chestResult}${raidResult}`,"loot","room",gold,null,offline);notify(`${cfg.short} completed`,raidScore?`${party.map(h=>h.name).join(", ")} scored ${fmt(raidScore.score)} points for a ${chanceLabel(raidScore.chance)} rare-table roll${raidRareHit?" — rare drop!":""}.`:`${party.map(h=>h.name).join(", ")} opened the chest for ${fmt(gold)} Gold.`,cfg.icon);if(!offline)playSound("victory");postCombatClearChat(run,party,cfg,gold);
  if(cfg.category==="expedition"&&run.autoRepeat){for(const h of party.filter(hero=>hero.sanity<=EXPEDITION_BREAK_SANITY))sendHeroOnExpeditionBreak(run,h,cfg,offline);rejoinReadyExpeditionHeroes(run,offline);}else{for(const h of party.filter(hero=>hero.sanity<=0))sendToTavern(h);run.heroIds=run.heroIds.filter(id=>heroById(id)?.sanity>0);run.rosterIds=(run.rosterIds||run.heroIds).filter(id=>heroById(id)?.sanity>0);}
  if(!run.autoRepeat){stopRun(run.id,false,false,"Single clear complete");return;}run.cycle++;run.roomIndex=0;run.roomState=null;run.enemy=null;run.route=generateCombatRoute(cfg.id);run.cycleElapsed=0;run.raidCombatPoints=0;run.raidSkillPoints=0;
  if(!run.heroIds.length){if(cfg.category==="expedition"&&(run.restingHeroIds||[]).length){run.waitingForParty=true;pushCombatEvent(run,`${cfg.short} is holding at camp while the roster recovers at the Tavern.`,"recovery","room",null,null,offline);return;}stopRun(run.id,false,false,"Sanity depleted");return;}
  if(!canPayRunEntry(cfg,run.heroIds.length)){stopRun(run.id,false,false,"Entry supplies exhausted");notify("Run paused",`${cfg.short} stopped because the next entry needs ${runEntryLabel(cfg,run.heroIds.length)}.`,"🎒");return;}payRunEntry(cfg,run.heroIds.length);
}

function dropSpecial(cfg,party=[]){const key=cfg.pool[Math.floor(random()*cfg.pool.length)],finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(key,finder,cfg.category==="raid"?"Raid rare table hit!":"Rare equipment!");}
function dropTrinket(cfg,party=[]){const key=cfg.trinketPool[Math.floor(random()*cfg.trinketPool.length)],finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(key,finder,"Dungeon trinket found!");}
function dropEgg(cfg,party=[]){const finder=party[Math.floor(random()*party.length)]||null;awardInventoryItem(cfg.eggKey,finder,"Boss egg! One-in-500 drop!");}

function damageGear(h,amount){for(const slot of ["weapon","armor"]){const item=h.equipment[slot];if(item){const before=item.durability??100;item.durability=clamp(before-amount,0,100);if(before>0&&item.durability<=0)postBrokenGearChat(h,itemData(item));}}}
function runEntryCost(cfg,partySize=1){return {gold:cfg.entryGold||0,essence:(cfg.essencePerHero||0)*Math.max(1,partySize),keys:cfg.keys||0};}
function runEntryLabel(cfg,partySize=null){const cost=runEntryCost(cfg,partySize||1),parts=[];if(cost.gold)parts.push(`${fmt(cost.gold)} Gold`);if(cfg.essencePerHero)parts.push(partySize?`${fmt(cost.essence)} Essence (${cfg.essencePerHero}/hero)`:`${cfg.essencePerHero} Essence per hero`);if(cost.keys)parts.push(`${cost.keys} Raid Key${cost.keys===1?"":"s"}`);return parts.join(" + ")||"Free entry";}
function canPayRunEntry(cfg,partySize=1){const cost=runEntryCost(cfg,partySize);return state.resources.gold>=cost.gold&&state.resources.essence>=cost.essence&&state.resources.keys>=cost.keys;}
function payRunEntry(cfg,partySize=1){const cost=runEntryCost(cfg,partySize);state.resources.gold-=cost.gold;state.resources.essence-=cost.essence;state.resources.keys-=cost.keys;}
function releaseHeroFromExpeditionRotation(heroId){
  const run=expeditionRunForRestingHero(heroId);if(!run)return;run.restingHeroIds=run.restingHeroIds.filter(id=>id!==heroId);run.rosterIds=(run.rosterIds||run.heroIds).filter(id=>id!==heroId);if(!run.heroIds.length&&!run.restingHeroIds.length)stopRun(run.id,false,false,"Expedition roster reassigned");
}

function startRun(combatId,heroIds,autoRepeat=true){
  const cfg=COMBAT[combatId];if(!cfg)return;heroIds=heroIds.filter(id=>{const h=heroById(id);return h&&!heroReservedForCombat(id)&&h.assignment!=="combat"&&h.assignment!=="inn"&&h.sanity>0&&(h.hp||0)>0;});
  if(!heroIds.length)return toast("⚠️","Choose at least one available hero");
  const max=cfg.maxParty;if(heroIds.length>max)return toast("⚠️",`${cfg.short} allows up to ${max} heroes`);
  if(combatCount()+heroIds.length>4)return toast("⚠️","Only four heroes may fight at once");
  if(heroIds.some(id=>heroById(id).level<cfg.minLevel))return toast("🔒",`${cfg.name} requires Combat Level ${cfg.minLevel}`);
  if(!canPayRunEntry(cfg,heroIds.length))return toast("🎒","Not enough entry supplies",`Need ${runEntryLabel(cfg,heroIds.length)}.`);
  const party=heroIds.map(heroById).filter(Boolean);payRunEntry(cfg,heroIds.length);for(const id of heroIds)heroById(id).assignment="combat";const run=createCombatRunState(combatId,heroIds,autoRepeat);state.combatRuns.push(run);watchedRunId=run.id;enterCurrentRoom(run,cfg,false);notify(`${cfg.short} started`,`${party.map(h=>h.name).join(", ")} entered live combat. Higher max hits and faster attacks now shorten every clear.`,cfg.icon);postCombatStartChat(party,cfg);saveLocal();renderAll();closeDrawer();
}

function stopRun(id,announce=true,rerender=true,reason="Recalled"){const run=state.combatRuns.find(r=>r.id===id);if(!run)return;if(activeSimulationAudit)activeSimulationAudit.stops.push({id:run.id,reason,cycle:run.cycle,cycles:run.cycles,kills:run.kills,elapsed:run.elapsed});for(const hid of run.heroIds){const h=heroById(hid);if(h?.assignment==="combat")h.assignment="idle";}state.combatRuns=state.combatRuns.filter(r=>r.id!==id);if(watchedRunId===id)watchedRunId=state.combatRuns[0]?.id||null;if(announce)notify("Party recalled","The adventurers are returning to town.","🏰");markDirty();if(rerender)renderAll();}

function assignHero(heroId,assignment){
  const h=heroById(heroId);if(!h||h.assignment==="inn")return toast("🛏️","Hero is still recovering");
  if(WORK_ASSIGNMENTS.includes(assignment))return openHeroWorkPicker(heroId,assignment);
  if(h.assignment==="combat"){const run=state.combatRuns.find(r=>r.heroIds.includes(heroId));if(run)stopRun(run.id,false);}
  if(assignment!=="tavern")releaseHeroFromExpeditionRotation(heroId);
  h.workProgress=0;if(RESOURCE_ASSIGNMENTS[assignment]&&!h.workTiers?.[assignment]){h.workTiers={...(h.workTiers||{}),[assignment]:"starter"};}if(assignment==="tavern")sendToTavern(h);else h.assignment=assignment;if(assignment==="tavern" && h.sanity>=100)h.assignment="idle";checkAchievements();notify("Assignment changed",`${h.name} is now ${ASSIGNMENTS[h.assignment].name.toLowerCase()}.`,ASSIGNMENTS[h.assignment].icon);postAssignmentChat(h,h.assignment);markDirty();renderAll();
}

function setWorkTier(heroId,assignment,tierId){
  const h=heroById(heroId);if(!h)return;const task=unlockedWorkTasks(h,assignment).find(candidate=>candidate.id===tierId);if(!task)return toast("🔒","That task is not unlocked");
  const unchanged=h.workTiers?.[assignment]===task.id;if(!unchanged){h.workTiers={...(h.workTiers||{}),[assignment]:task.id};if(h.assignment===assignment)h.workProgress=0;notify("Work task changed",`${h.name} will produce ${task.name} until you choose another task.`,task.icon);if(RESOURCE_ASSIGNMENTS[assignment])postTierChat(h,assignment,task);markDirty();}renderAssignments();renderTown();refreshWorkTimers();
}

function assignSpecificTask(heroId,assignment,taskId){
  const h=heroById(heroId);if(!h)return;if(h.assignment==="inn")return toast("🛏️","Hero is still recovering");
  if(h.assignment==="combat")return toast("⚔️","Recall this hero from combat first","Town work cannot interrupt an active party run.");
  const requested=workTasksFor(assignment).find(candidate=>candidate.id===taskId),task=unlockedWorkTasks(h,assignment).find(candidate=>candidate.id===taskId);if(!task)return toast("🔒","That hero cannot do this task yet",requested?`${taskRequirementText(assignment,requested)} required.`:"Choose a valid task from the building.");
  const previousAssignment=h.assignment,previousTask=workTaskForHero(h,assignment)?.id,origin=$("#drawer")?.dataset.mode||"";
  if(previousAssignment===assignment&&previousTask===task.id){if(origin===`task-${assignment}`)openBuilding(assignment);else closeDrawer();return toast(task.icon,`${h.name} is already working on ${task.name}`);}
  releaseHeroFromExpeditionRotation(heroId);
  h.assignment=assignment;h.workTiers={...(h.workTiers||{}),[assignment]:task.id};h.workProgress=0;checkAchievements();notify("Exact task assigned",`${h.name} is now producing ${task.name}.`,task.icon);
  if(RESOURCE_ASSIGNMENTS[assignment])postTierChat(h,assignment,task);else postAssignmentChat(h,assignment);markDirty();renderAll();
  if(origin===`task-${assignment}`)openBuilding(assignment);else closeDrawer();
}

function checkAchievements(){for(const a of ACHIEVEMENTS){if(!state.achievements.includes(a.id)&&a.test(state)){state.achievements.push(a.id);notify("Milestone unlocked",a.name,a.icon);}}}

function renderAll(){renderResources();renderTown();renderHeroes();renderAssignments();renderCombat();renderWarehouse();renderMarket();renderProgress();renderSyncUser();renderPartyChat();}
function refreshWorkTimers(){$$("[data-work-timer]").forEach(el=>{const h=heroById(el.dataset.workTimer);if(h)el.textContent=workActionStatus(h);});}
function renderResources(){
  const data=[['gold','🪙','Gold'],['essence','✨','Essence']];
  const resources=data.map(([k,i,n])=>`<div class="resource-chip" data-resource="${k}"><span class="resource-icon">${i}</span><span><small>${n}</small><strong>${fmt(state.resources[k])}</strong></span></div>`).join("");
  const heroes=`<div class="resource-heroes" aria-label="Hero profiles">${state.heroes.map(h=>`<button class="resource-hero-button" data-action="open-hero" data-hero="${h.id}" style="--hero-color:${h.color}" aria-label="Open ${escapeHTML(h.name)} profile" title="${escapeHTML(h.name)} · ${escapeHTML(statusFor(h))}">${heroImage(h)}</button>`).join("")}</div>`;
  $("#resourceBar").innerHTML=resources+heroes;
}

function statusFor(h){if(h.assignment==="combat"){const r=state.combatRuns.find(x=>x.heroIds.includes(h.id));return r&&COMBAT[r.combatId]?COMBAT[r.combatId].short:"Fighting";}const rotation=expeditionRunForRestingHero(h.id);if(rotation){const name=COMBAT[rotation.combatId]?.short||"expedition";return h.sanity>=EXPEDITION_RETURN_SANITY?`Ready to rejoin ${name}`:`Tavern break · ${Math.floor(h.sanity)} Sanity`;}return ASSIGNMENTS[h.assignment]?.name||"Available";}
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
  const work=state.heroes.filter(h=>WORK_ASSIGNMENTS.includes(h.assignment));$("#townOutputText").textContent=work.length?`${work.length} heroes producing`:"No one working";
  const counts=["farm","cook","mine","forest","smith","plunder"].map(a=>[a,state.heroes.filter(h=>h.assignment===a).length]);$("#townOutputMini").innerHTML=counts.filter(x=>x[1]).map(([a,n])=>`<div class="mini-bar"><span>${ASSIGNMENTS[a].icon} ${ASSIGNMENTS[a].name}</span><i style="--w:${n/6*100}%"></i><b>${n}</b></div>`).join("")||`<span class="empty-mini">Assign heroes to begin production.</span>`;
  const story=state.notifications[0];$("#latestStoryTitle").textContent=story?.title||"Quiet town";$("#latestStoryText").textContent=story?.text||"No town reports yet.";$("#notificationBadge").hidden=!state.notifications.length;$("#notificationBadge").textContent=Math.min(99,state.notifications.length);
}

function renderHeroes(){
  $("#heroRoster").innerHTML=state.heroes.map(h=>{const w=h.equipment.weapon?itemData(h.equipment.weapon):null,a=h.equipment.armor?itemData(h.equipment.armor):null,p=h.equipment.pet?itemData(h.equipment.pet):null,t=h.equipment.trinket?itemData(h.equipment.trinket):null,status=h.assignment==="combat"?"combat":["inn","tavern"].includes(h.assignment)?"recovery":"",progress=combatXPProgress(h);return `<article class="hero-card" style="--hero-color:${h.color}"><div class="hero-card-head"><div class="hero-portrait">${heroImage(h)}</div><div><h3>${escapeHTML(h.name)}</h3><span class="class-label">${h.className} · ${CLASS_COMBAT[h.className].identity}</span>${combatStyleBadge(heroCombatStyle(h),true)}</div><div class="hero-level"><strong>${h.level}</strong><small>Combat level</small></div></div><div class="hero-status-line"><span class="status-tag ${status}">${ASSIGNMENTS[h.assignment]?.icon||"✨"} ${escapeHTML(statusFor(h))}</span><small>Power ${Math.floor(heroPower(h))}</small></div><div class="hero-vitals"><div class="meter-row"><span>Combat XP</span><div class="meter" title="${h.level>=100?"Maximum Combat Level":`${fmt(progress.current)} / ${fmt(progress.required)} XP`}"><span style="--value:${progress.percent}%;--meter-color:${h.color}"></span></div><b>${h.level>=100?"MAX":`${Math.floor(progress.percent)}%`}</b></div><div class="meter-row"><span>Sanity</span><div class="meter"><span style="--value:${h.sanity}%;--meter-color:#c59637"></span></div><b>${Math.floor(h.sanity)}</b></div></div><div class="equipment-pair">${gearSlot("Weapon",w)}${gearSlot("Armor",a)}${gearSlot("Pet",p)}${gearSlot("Trinket",t)}</div><div class="hero-card-actions"><button data-action="open-hero" data-hero="${h.id}">Character page</button><button data-action="quick-assign" data-hero="${h.id}">Assign</button></div></article>`}).join("");
}
function gearSlot(label,item){return `<div class="gear-slot"><span>${item?itemImage(item,"gear-art"):"＋"}</span><div><small>${label}</small><strong>${item?escapeHTML(item.name):"Empty"}</strong></div></div>`;}

function renderAssignments(){
  const options=["idle","farm","cook","mine","forest","smith","plunder","tavern"];
  $("#assignmentBoard").innerHTML=state.heroes.map(h=>`<article class="assignment-row"><div class="assignment-hero"><span class="mini-portrait" style="--hero-color:${h.color}">${heroImage(h)}</span><div><strong>${escapeHTML(h.name)} · ${h.className}</strong><small>Combat ${h.level} · Best skill ${bestSkill(h)}</small></div></div><div class="assignment-options">${options.map(a=>`<button class="${h.assignment===a?"active":""}" data-action="assign" data-hero="${h.id}" data-assignment="${a}" ${h.assignment==="inn"?"disabled":""}>${ASSIGNMENTS[a].icon} ${ASSIGNMENTS[a].name}${WORK_ASSIGNMENTS.includes(a)?" ›":""}</button>`).join("")}<button class="${h.assignment==="combat"?"active":""}" data-action="open-view" data-view="combat">⚔️ Combat Hall</button></div><div class="assignment-detail"><strong>${escapeHTML(statusFor(h))}</strong><br>${workActionStatus(h)?`<span data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</span>`:escapeHTML(ASSIGNMENTS[h.assignment]?.detail||"Away on a combat run.")}${WORK_ASSIGNMENTS.includes(h.assignment)?workTaskPickerHTML(h,h.assignment):""}</div></article>`).join("");
}
function bestSkill(h){const names={farming:"Farming",cooking:"Cooking",mining:"Mining",woodcutting:"Woodcutting",smithing:"Smithing"};const [k,v]=Object.entries(h.skills).sort((a,b)=>b[1].level-a[1].level)[0];return `${names[k]} ${v.level}`;}

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
  if(run.waitingForParty){for(const heroId of run.restingHeroIds||[]){const hero=heroById(heroId),value=host.querySelector(`[data-rest-sanity="${heroId}"]`),bar=host.querySelector(`[data-rest-bar="${heroId}"]`);if(hero&&value)value.textContent=Math.floor(hero.sanity);if(hero&&bar)bar.style.width=`${hero.sanity}%`;}}
  else if(room.type==="skill"){
    const s=run.roomState||{total:1,remaining:1,effective:0},leader=heroById(s.leaderId),bar=host.querySelector('[data-skill-progress]'),status=host.querySelector('[data-skill-status]');if(bar)bar.style.width=`${clamp((1-s.remaining/s.total)*100,0,100)}%`;if(status)status.textContent=`${leader?`${leader.name} leads at effective level ${Math.floor(s.effective)}`:"Party assessing obstacle"} · ${formatDuration(Math.max(0,s.remaining))} remaining`;
  }else{
    const enemy=run.enemy||createEnemy(cfg,room),enemyPct=clamp(enemy.hp/enemy.maxHP*100,0,100),enemyBar=host.querySelector('[data-enemy-hp-bar]'),enemyText=host.querySelector('[data-enemy-hp-text]'),statusHost=host.querySelector('[data-enemy-status]');if(enemyBar)enemyBar.style.width=`${enemyPct}%`;if(enemyText)enemyText.textContent=`${fmt(enemy.hp)} / ${fmt(enemy.maxHP)} HP · Max hit ${fmt(enemy.maxHit)} · ${enemy.speed.toFixed(1)}s attacks`;if(statusHost)statusHost.innerHTML=Object.keys(enemy.status||{}).map(x=>`<span class="${x}">${x}</span>`).join("");const enrageBadge=host.querySelector("[data-enrage-badge]");if(enrageBadge)enrageBadge.hidden=!enemy.enraged;
    for(const h of party){const card=host.querySelector(`[data-battle-hero="${h.id}"]`);if(!card)continue;const maxHP=heroMaxHP(h),hpBar=card.querySelector('[data-hero-hp-bar]'),hpText=card.querySelector('[data-hero-hp-text]'),attackBar=card.querySelector('[data-attack-speed]'),timer=run.heroTimers?.[h.id]??heroAttackSpeed(h);if(hpBar)hpBar.style.width=`${clamp((h.hp||0)/maxHP*100,0,100)}%`;if(hpText)hpText.textContent=`${fmt(h.hp)} / ${fmt(maxHP)} HP`;if(attackBar){attackBar.dataset.attackSpeed=heroAttackSpeed(h);attackBar.dataset.attackTimer=timer;attackBar.dataset.sampledAt=performance.now();}const last=(run.recentEvents||[]).slice().reverse().find(e=>e.attackerId===h.id&&e.amount!==null&&now-e.at<180);card.classList.toggle("attacking",!!last);}
  }
  const summary={dps:dps.toFixed(1),kills:fmt(run.kills),cycles:fmt(run.cycles),food:fmt(run.foodEaten),reward:run.lastReward||"None yet"};for(const [key,value] of Object.entries(summary)){const el=host.querySelector(`[data-battle-summary="${key}"]`);if(el)el.textContent=value;}
  const log=(run.recentEvents||[]).slice(-7).reverse(),logHost=host.querySelector('[data-combat-log-lines]'),logKey=log.map(e=>e.id).join("|");if(logHost&&logHost.dataset.logKey!==logKey){logHost.dataset.logKey=logKey;logHost.innerHTML=log.length?log.map(e=>`<p class="${e.type}">${escapeHTML(e.text)}</p>`).join(""):`<p>The party is entering the first room.</p>`;}
  spawnCombatHitsplats(host,run);ensureCombatVisualLoop();
}
function renderCombatBattlefield(){
  const host=$("#combatBattlefield");if(!host)return;if(!state.combatRuns.length){host.innerHTML="";delete host.dataset.signature;return;}if(!state.combatRuns.some(r=>r.id===watchedRunId))watchedRunId=state.combatRuns[0].id;const run=state.combatRuns.find(r=>r.id===watchedRunId),cfg=COMBAT[run.combatId],layout=runRoute(run,cfg),room=layout[run.roomIndex]||layout[0],party=run.heroIds.map(heroById).filter(Boolean),resting=(run.restingHeroIds||[]).map(heroById).filter(Boolean),signature=`${run.id}:${run.cycle}:${run.roomIndex}:${room.type}:${party.map(h=>h.id).join(",")}:${resting.map(h=>h.id).join(",")}:${run.waitingForParty?"waiting":"active"}`;
  if(host.dataset.signature===signature){syncCombatBattlefield(host,run,cfg,room,party);return;}
  const timeline=`<div class="room-timeline">${layout.map((r,i)=>`<div class="${i<run.roomIndex?"done":i===run.roomIndex?"current":""}"><span>${roomImage(r,"timeline-room-art")}</span><small>${escapeHTML(r.name)}</small></div>`).join("")}</div>`;
  let stage="";if(run.waitingForParty){
    stage=`<div class="combat-rest-stop"><div class="rest-stop-icon">🍲</div><div><span class="eyebrow">Expedition rotation · Tavern break</span><h3>The route is holding at camp</h3><p>No hero was forced off the expedition. The roster will depart automatically when someone reaches ${EXPEDITION_RETURN_SANITY} Sanity.</p><div class="resting-party">${resting.map(hero=>`<article><span>${heroImage(hero)}</span><div><strong>${escapeHTML(hero.name)}</strong><small>Resolve ${heroResolve(hero)} · <b data-rest-sanity="${hero.id}">${Math.floor(hero.sanity)}</b> / 100 Sanity</small><div class="rest-sanity"><i data-rest-bar="${hero.id}" style="width:${hero.sanity}%"></i></div></div></article>`).join("")}</div></div></div>`;
  }else if(room.type==="skill"){
    stage=`<div class="skill-obstacle"><div class="obstacle-icon">${room.icon}</div><div><span class="eyebrow">Non-combat Raid room · ${escapeHTML(room.skill)}</span><h3>${escapeHTML(room.name)}</h3><p>${escapeHTML(room.description)}</p><div class="battle-hp"><span data-skill-progress style="width:0%"></span></div><small data-skill-status>Party assessing obstacle</small></div></div>`;
  }else{
    const enemy=run.enemy||createEnemy(cfg,room);stage=`<div class="battle-stage"><div class="enemy-zone ${enemy.boss?"boss":""}"><div class="enemy-name"><span class="eyebrow">${enemy.boss?"Boss":"Enemy"} · Room ${run.roomIndex+1}/${layout.length}</span><h3>${escapeHTML(enemy.name)}</h3>${combatStyleBadge(enemy.combatStyle,true)}${enemy.special?`<span class="combat-style-badge compact">${enemy.special.icon} ${escapeHTML(enemy.special.name)}</span>`:""}<span class="combat-style-badge compact" data-enrage-badge ${enemy.enraged?"":"hidden"}>🔥 ENRAGED</span></div><div class="enemy-figure">${assetImage(enemy.image||room.image,enemy.name,"enemy-image",enemy.icon)}<div class="hitsplat-layer" data-hitsplat-target="enemy"></div></div><div class="battle-hp enemy-hp"><span data-enemy-hp-bar style="width:100%"></span></div><small data-enemy-hp-text></small><div class="status-effects" data-enemy-status></div></div><div class="versus-mark">VS</div><div class="battle-party">${party.map(h=>`<article class="battle-hero" data-battle-hero="${h.id}" style="--hero-color:${h.color}"><div class="battle-portrait">${heroImage(h)}<div class="hitsplat-layer" data-hitsplat-target="${h.id}"></div></div><div class="battle-hero-name"><strong>${escapeHTML(h.name)}</strong><small>${h.className} · Max ${fmt(heroMaxHit(h))}</small>${combatStyleBadge(heroCombatStyle(h),true)}</div><div class="battle-hp hero-hp"><span data-hero-hp-bar style="width:100%"></span></div><small data-hero-hp-text></small><div class="attack-timer"><span data-attack-speed="${heroAttackSpeed(h)}" data-attack-timer="${heroAttackSpeed(h)}" data-sampled-at="0" style="width:0%"></span></div></article>`).join("")}</div></div>`;
  }
  host.innerHTML=`<section class="combat-battlefield" style="--battle-a:${cfg.colors[0]};--battle-b:${cfg.colors[1]}"><header><div><span class="eyebrow" data-battle-cycle></span><h2>${cfg.icon} ${escapeHTML(cfg.name)}</h2></div><div class="battle-actions"><button data-action="open-battle-stats" data-run="${run.id}">📊 Battle stats</button><button class="loot-button" data-action="open-loot" data-combat="${cfg.id}"><span class="loot-chest-icon"></span> Drop table</button><button class="stop-run" data-action="stop-run" data-run="${run.id}">Recall</button></div></header>${timeline}${stage}<div class="triangle-reminder"><span>⚔️ Melee beats Ranged</span><span>🏹 Ranged beats Magic</span><span>✨ Magic beats Melee</span><b>±25% damage</b></div><div class="battle-summary"><div><strong data-battle-summary="dps">0.0</strong><small>Party DPS</small></div><div><strong data-battle-summary="kills">0</strong><small>Enemies slain</small></div><div><strong data-battle-summary="cycles">0</strong><small>Clears</small></div><div><strong data-battle-summary="food">0</strong><small>Food eaten</small></div><div><strong data-battle-summary="reward">None yet</strong><small>Latest chest</small></div></div><details class="combat-log"><summary>Battle log</summary><div data-combat-log-lines></div></details></section>`;host.dataset.signature=signature;markCombatEventsSeen(run);syncCombatBattlefield(host,run,cfg,room,party);
}
function renderActiveRuns(){
  const host=$("#activeRuns");$("#combatSlotCount").textContent=combatCount();if(!host)return;
  if(!state.combatRuns.length){host.innerHTML=`<div class="empty-state"><span>🗺️</span>No active runs. Your heroes are waiting for orders.</div>`;return;}
  host.innerHTML=state.combatRuns.map(run=>{
    const cfg=COMBAT[run.combatId],party=run.heroIds.map(heroById).filter(Boolean),resting=(run.restingHeroIds||[]).map(heroById).filter(Boolean),room=runRoute(run,cfg)?.[run.roomIndex],pct=run.waitingForParty?0:roomProgress(run)*100,status=run.waitingForParty?`Waiting for ${resting.map(hero=>hero.name).join(", ")} at the Tavern`:run.roomState?.type==="skill"?`${formatDuration(Math.max(0,run.roomState.remaining))} on obstacle`:run.enemy?`${fmt(run.enemy.hp)} / ${fmt(run.enemy.maxHP)} enemy HP`:"Entering room",roster=[party.length?`${party.length} fighting`:"No one fighting",resting.length?`${resting.length} on break`:""].filter(Boolean).join(" · ");
    const portraits=party.map(hero=>`<i title="${escapeHTML(hero.name)} · Resolve ${heroResolve(hero)}">${heroImage(hero)}</i>`).join("")+resting.map(hero=>`<i class="resting" title="${escapeHTML(hero.name)} · Tavern break · ${Math.floor(hero.sanity)} Sanity">${heroImage(hero)}<b>🍲</b></i>`).join("");
    return `<article class="active-run ${run.id===watchedRunId?"watched":""} ${run.waitingForParty?"waiting":""}"><div class="run-icon">${run.waitingForParty?"🍲":room?roomImage(room,"run-room-art"):cfg.icon}</div><div><div class="run-title"><strong>${cfg.name} · Cycle ${run.cycle}</strong><small>${escapeHTML(status)}</small></div><div class="run-progress"><span style="width:${pct}%"></span></div><div class="run-party">${portraits}<span>${escapeHTML(roster)} · ${run.autoRepeat?"Repeating":"Single clear"}</span></div></div><div class="active-run-actions"><button class="watch-run" data-action="watch-run" data-run="${run.id}">${run.id===watchedRunId?"Watching":"Watch fight"}</button><button data-action="open-battle-stats" data-run="${run.id}">📊 Stats</button><button class="loot-button" data-action="open-loot" data-combat="${cfg.id}"><span class="loot-chest-icon" aria-hidden="true"></span> Rewards</button><button class="stop-run" data-action="stop-run" data-run="${run.id}">Recall</button></div></article>`;
  }).join("");
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

function combatRequirements(c){return [`Combat Level ${c.minLevel}+`,`1–${c.maxParty} heroes`,`${runEntryLabel(c)} per clear`,"Warehouse food auto-heals in battle"];}

function chanceLabel(value){return `${(Math.round(value*10000)/100).toFixed(2).replace(/\.?0+$/,"")}%`;}
function lootRows(c){
  const rows=[{icon:"🪙",name:`${fmt(c.gold[0])}–${fmt(c.gold[1])} Gold`,detail:"Guaranteed after a victory",chance:"100%"},{icon:"⚔️",name:`${fmt(c.xp)} Combat XP`,detail:"For each participating hero",chance:"100%"}];
  if(["dungeon","raid"].includes(c.category))rows.push({icon:"📦",name:"Common chest bundle",detail:"Bonus Gold plus cooked food, wood, and/or metal when the unique rare table misses",chance:"On rare miss"});
  if(c.essenceChance)rows.push({icon:"✨",name:"1 Essence",detail:"Expedition Essence roll",chance:chanceLabel(c.essenceChance)});
  if(c.essenceReward)rows.push({icon:"✨",name:`${c.essenceReward[0]}–${c.essenceReward[1]} Essence`,detail:"Guaranteed after a victory",chance:"100%"});
  if(c.keyChance)rows.push({icon:"🗝️",name:"1 Raid Key",detail:"Independent Dungeon roll",chance:chanceLabel(c.keyChance)});
  if(c.category==="raid")rows.push({icon:"🎯",name:"Rare raid table roll",detail:"Combat + skill-room points are weighted by clear time at the end of the raid",chance:"Score-based"});
  for(const key of c.pool||[]){const d=ITEMS[key];rows.push({icon:d.icon,image:d.image,name:d.name,detail:`${d.tier} ${d.type} · Level ${d.requiredLevel||1}`,chance:c.category==="raid"?`1/${c.pool.length} if rare table hits`:chanceLabel((c.itemChance||0)/c.pool.length)});}
  for(const key of c.trinketPool||[]){const d=ITEMS[key];rows.push({icon:d.icon,image:d.image,name:d.name,detail:`${d.tier} · Non-tradeable`,chance:chanceLabel((c.trinketChance||0)/c.trinketPool.length)});}
  if(c.eggKey){const d=ITEMS[c.eggKey];rows.push({icon:d.icon,image:d.image,name:d.name,detail:"Independent boss-egg roll · Non-tradeable",chance:chanceLabel(c.eggChance)});}
  return rows;
}
function openLoot(combatId){const c=COMBAT[combatId];if(!c)return;const equipmentChance=c.category==="raid"?`Raid loot is performance-based. Damage dealt earns combat points, skill rooms award more points when the party brings higher relevant skills, and the final score is multiplied by clear-time performance. A target-score clear at the listed target time is ${chanceLabel(c.itemChance||.10)} to enter the rare table; stronger scores can improve that chance up to 25%. Each rare item is equally likely once the table is entered.`:c.pool?.length?`Each victory has one ${chanceLabel(c.itemChance)} equipment roll. If it succeeds, every listed item is equally likely.`:"This activity does not drop unique equipment.";openDrawer(`${c.name} Rewards`,"Possible loot and exact rates",`<div class="loot-summary"><span>${c.icon}</span><div><strong>Victory rewards</strong><p>${equipmentChance}</p></div></div><div class="loot-table">${lootRows(c).map(row=>`<div class="loot-row"><span class="loot-icon">${itemImage(row,"loot-art")}</span><div><strong>${escapeHTML(row.name)}</strong><small>${escapeHTML(row.detail)}</small></div><b>${row.chance}</b></div>`).join("")}</div><p class="loot-note">${c.category==="raid"?`Raid target time: ${formatDuration(c.duration)}. High relevant work skills both clear skill rooms faster and award more skill points. Boss eggs remain independent of the score-based rare-table roll.`:`Drop chances are per completed victory. Independent rolls—such as trinkets, keys, and boss eggs—can occur alongside an equipment drop.`}</p><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Close</button><button class="primary-button" data-action="open-combat" data-combat="${c.id}">Prepare ${c.short}</button></div>`);}

function renderWarehouse(){
  $("#warehouseCount").textContent=occupiedSlots();$("#warehouseCapacity").textContent=`/${warehouseCapacity()} slots`;
  $$("[data-action='warehouse-filter']").forEach(b=>b.classList.toggle("active",b.dataset.filter===warehouseFilter));
  const itemList=warehouseFilter==="resource"?[]:state.inventory.filter(i=>warehouseFilter==="all"||itemData(i).type===warehouseFilter||(warehouseFilter==="special"&&itemData(i).special));
  const resourceList=["all","resource"].includes(warehouseFilter)?warehouseResourceStacks():[];
  const resourceCards=resourceList.map(stack=>`<article class="item-card resource-stack"><div class="item-icon">${stack.icon}</div><div><h4>${escapeHTML(stack.name)}</h4><span class="item-meta">${escapeHTML(stack.category)} · Stored resource</span><p>${escapeHTML(stack.detail)}</p></div><div class="resource-quantity"><small>Stored</small><strong>×${fmt(stack.quantity)}</strong></div></article>`);
  const itemCards=itemList.map(i=>{const d=itemData(i),gear=["weapon","armor"].includes(d.type),equippable=gear||["pet","trinket"].includes(d.type),stats=[d.attack?`+${d.attack} ATK`:"",d.defense?`+${d.defense} DEF`:"",d.element,d.effectText].filter(Boolean).join(" · ")||"A curious town treasure",actions=[equippable?`<button data-action="equip-item" data-item="${i.id}">Equip</button>`:"",d.type==="egg"?`<button data-action="hatch-egg" data-item="${i.id}">Hatch egg</button>`:"",gear?`<button data-action="repair-item" data-item="${i.id}">Repair</button><button data-action="upgrade-item" data-item="${i.id}" ${d.upgrade>=5?"disabled":""}>${d.upgrade>=5?"+5 MAX":`Upgrade +${d.upgrade+1}`}</button>`:"",d.salvage?`<button data-action="salvage-item" data-item="${i.id}">Salvage +${d.salvage} ✨</button>`:d.tier==="Starter"&&gear?`<button data-action="salvage-item" data-item="${i.id}">Salvage +1 🔩</button>`:"",!d.soulbound?`<button data-action="sell-item" data-item="${i.id}">List</button>`:""].filter(Boolean).join("");return `<article class="item-card ${d.special?"special":""}"><div class="item-icon">${itemImage(d,"item-art")}</div><div><h4>${escapeHTML(d.name)}</h4><span class="item-meta">${d.tier} ${d.type} · ${d.className||"Any hero"}</span><p>${escapeHTML(stats)}${gear?`<br>Durability ${Math.floor(d.durability??100)}%`:""}${d.soulbound?`<br><b>Non-tradeable</b>`:""}</p></div><div class="item-actions">${actions}</div></article>`});
  const cards=[...resourceCards,...itemCards];$("#inventoryGrid").innerHTML=cards.length?cards.join(""):`<div class="empty-state"><span>📦</span>No matching items in the Warehouse.</div>`;
}

function renderMarket(){
  $("#marketStatus").innerHTML=currentUser?`<div class="notice">Connected as ${escapeHTML(currentUser.displayName||currentUser.email||"Adventurer")}. Listings are synchronized through Firebase.</div>`:`<div class="notice warning">Sign in to use the live player Marketplace. Device play keeps every other system available.</div>`;
  const mine=marketListings.filter(l=>l.sellerId===currentUser?.uid),others=marketListings.filter(l=>l.sellerId!==currentUser?.uid&&!ITEMS[l.itemKey]?.soulbound);
  $("#marketListings").innerHTML=others.length?others.map(l=>listingHTML(l,false)).join(""):`<div class="empty-state"><span>⚖️</span>No player listings are available right now.</div>`;
  $("#myListings").innerHTML=mine.length?mine.map(l=>listingHTML(l,true)).join(""):`<div class="empty-state"><span>🪙</span>Your active listings and claimed payouts appear here.</div>`;
}
function listingHTML(l,mine){const d=ITEMS[l.itemKey]?itemData({key:l.itemKey,...(l.itemData||{})}):{name:l.itemName,type:"resource",icon:l.icon||"📦"};return `<article class="listing"><div class="item-icon">${itemImage(d,"item-art")}</div><div><strong>${escapeHTML(d.name||l.itemName)}</strong><small>${escapeHTML(l.sellerName||"Adventurer")} · Qty ${l.quantity||1}</small></div><div class="listing-price"><b>🪙 ${fmt(l.price)}</b><button data-action="${mine?"cancel-listing":"buy-listing"}" data-listing="${l.id}">${mine?"Cancel":"Buy"}</button></div></article>`;}

function renderProgress(){
  const totalLevel=state.heroes.reduce((n,h)=>n+h.level,0),totalSkills=state.heroes.reduce((n,h)=>n+Object.values(h.skills).reduce((a,s)=>a+s.level,0),0);
  $("#progressCards").innerHTML=[["⚔️",totalLevel,"Combined Combat Levels"],["🛠️",totalSkills,"Combined Work Levels"],["🐲",state.stats.raids,"Raid Victories"],["🪙",fmt(state.stats.goldEarned),"Lifetime Gold Earned"]].map(([i,v,l])=>`<article class="stat-card"><span>${i}</span><strong>${v}</strong><small>${l}</small></article>`).join("");
  $("#achievementList").innerHTML=ACHIEVEMENTS.map(a=>{const yes=state.achievements.includes(a.id);return `<article class="achievement ${yes?"":"locked"}"><span>${yes?a.icon:"🔒"}</span><div><strong>${a.name}</strong><small>${a.description}</small></div><b>${yes?"Complete":"Locked"}</b></article>`}).join("");
  const board=leaderboard.length?leaderboard:[{displayName:"Your town",totalLevel,raidWins:state.stats.raids,local:true}];$("#leaderboardList").innerHTML=board.map((x,i)=>`<article class="leaderboard-row"><span class="rank">${i+1}</span><span class="board-avatar">${i===0?"👑":"🛡️"}</span><div><strong>${escapeHTML(x.displayName||"Adventurer")}</strong><small>${x.raidWins||0} raid victories</small></div><b>Lv ${x.totalLevel||0}</b></article>`).join("");
  renderHeroLeague();
}
function heroWorkTotalLevel(hero){return Object.values(hero.skills).reduce((total,skill)=>total+skill.level,0);}
function workSkillTotalXP(skill){let total=0,level=clamp(Math.floor(Number(skill.level)||1),1,100);for(let current=1;current<level;current++)total+=xpForLevel(current);return total+(level>=100?0:Math.max(0,Number(skill.xp)||0));}
function heroWorkTotalXP(hero){return Object.values(hero.skills).reduce((total,skill)=>total+workSkillTotalXP(skill),0);}
function heroTotalLevel(hero){return hero.level+heroWorkTotalLevel(hero);}
function heroTotalXP(hero){return heroCombatTotalXP(hero)+heroWorkTotalXP(hero);}
function heroAdventureTotal(hero){return (hero.records.expeditions||0)+(hero.records.dungeons||0)+(hero.records.raids||0);}
function heroBossTotal(hero){return (hero.records.raidBosses||0)+(hero.records.dungeonBosses||0);}
function heroGatheredTotal(hero){return (hero.records.foodGathered||0)+(hero.records.foodCooked||0)+(hero.records.metalMined||0)+(hero.records.woodGathered||0);}

const HERO_LEAGUE_CATEGORIES={
  overview:{label:"Overview",metrics:[
    {key:"totalLevel",icon:"🏆",label:"Total Level",detail:"Combat plus all five work skills"},
    {key:"totalXP",icon:"✨",label:"Total XP",detail:"Lifetime Combat and work XP"},
    {key:"power",icon:"⚔️",label:"Combat Power",detail:"Current equipment and combat progression"},
    {key:"combatLevel",icon:"🛡️",label:"Combat Level",detail:"Individual Combat progression"},
  ]},
  combat:{label:"Combat",metrics:[
    {key:"damage",icon:"💥",label:"Damage Dealt",detail:"Lifetime damage successfully inflicted"},
    {key:"kills",icon:"☠️",label:"Enemies Killed",detail:"Finishing blows against all enemies"},
    {key:"combatXP",icon:"⭐",label:"Combat XP",detail:"Lifetime Combat experience"},
    {key:"healing",icon:"💚",label:"Healing Done",detail:"HP restored to the party"},
    {key:"damageTaken",icon:"🩸",label:"Damage Endured",detail:"Lifetime incoming damage survived"},
    {key:"combatActions",icon:"⚡",label:"Combat Actions",detail:"Attacks and class actions performed"},
  ]},
  bosses:{label:"Bosses",metrics:[
    {key:"raidBosses",icon:"🐲",label:"Raid Boss Victories",detail:"Raid clears this hero survived"},
    {key:"dungeonBosses",icon:"🗝️",label:"Dungeon Boss Victories",detail:"Dungeon clears this hero survived"},
    {key:"totalBosses",icon:"👑",label:"Total Boss Victories",detail:"Raid and Dungeon bosses combined"},
    {key:"raids",icon:"🌑",label:"Raids Completed",detail:"Successful Raid returns"},
    {key:"dungeons",icon:"🏰",label:"Dungeons Completed",detail:"Successful Dungeon returns"},
    {key:"expeditions",icon:"🧭",label:"Expeditions Completed",detail:"Successful Expedition returns"},
    {key:"adventures",icon:"🗺️",label:"All Adventures",detail:"Expeditions, Dungeons, and Raids"},
  ]},
  work:{label:"Work",metrics:[
    {key:"workLevel",icon:"📈",label:"Total Work Level",detail:"All five independent skills"},
    {key:"workXP",icon:"📚",label:"Total Work XP",detail:"Lifetime XP across all work skills"},
    {key:"workActions",icon:"📋",label:"Work Actions",detail:"Completed town and obstacle actions"},
    {key:"food",icon:"🌾",label:"Ingredients Harvested",detail:"Raw farm ingredients produced"},
    {key:"cooking",icon:"🍳",label:"Meals Cooked",detail:"Combat-ready meals prepared"},
    {key:"metal",icon:"⛏️",label:"Metal Mined",detail:"Ore items extracted"},
    {key:"wood",icon:"🌲",label:"Wood Gathered",detail:"Wood items harvested"},
    {key:"kits",icon:"🧰",label:"Repair Kits Forged",detail:"Completed Smithing kits"},
    {key:"gathered",icon:"📦",label:"Total Materials",detail:"Harvesting, cooking, metal, and wood combined"},
  ]},
  legacy:{label:"Legacy",metrics:[
    {key:"gold",icon:"🪙",label:"Gold Earned",detail:"Personal share of adventure rewards"},
    {key:"items",icon:"💎",label:"Rare Finds",detail:"Equipment, pets, and treasures found"},
    {key:"activeTime",icon:"⌛",label:"Time Active",detail:"Lifetime assigned time",format:"duration"},
    {key:"beers",icon:"🍺",label:"Tavern Visits",detail:"Recovery sessions started"},
    {key:"defeats",icon:"🛒",label:"Trips to the Inn",detail:"Times defeated in combat"},
  ]},
};

function heroLeagueValue(hero,metric){
  const records=hero.records||{},values={totalLevel:heroTotalLevel(hero),totalXP:heroTotalXP(hero),power:Math.floor(heroPower(hero)),combatLevel:hero.level,workLevel:heroWorkTotalLevel(hero),activeTime:records.secondsActive,damage:records.damageDealt,kills:records.kills,combatXP:heroCombatTotalXP(hero),healing:records.healingDone,damageTaken:records.damageTaken,combatActions:records.combatActions,raidBosses:records.raidBosses,dungeonBosses:records.dungeonBosses,totalBosses:heroBossTotal(hero),raids:records.raids,dungeons:records.dungeons,expeditions:records.expeditions,adventures:heroAdventureTotal(hero),workXP:heroWorkTotalXP(hero),workActions:records.workActions,food:records.foodGathered,cooking:records.foodCooked,metal:records.metalMined,wood:records.woodGathered,kits:records.kitsForged,gathered:heroGatheredTotal(hero),gold:records.goldEarned,items:records.itemsFound,beers:records.beers,defeats:records.defeats};return Math.max(0,Number(values[metric])||0);
}
function heroLeagueMetricDefinition(key){return Object.values(HERO_LEAGUE_CATEGORIES).flatMap(category=>category.metrics).find(metric=>metric.key===key);}
function heroLeagueStandings(metric){return state.heroes.map(hero=>({hero,value:heroLeagueValue(hero,metric.key)})).sort((a,b)=>b.value-a.value||heroTotalLevel(b.hero)-heroTotalLevel(a.hero)||a.hero.name.localeCompare(b.hero.name));}
function formatHeroLeagueValue(value,metric){return metric.format==="duration"?formatDuration(value):fmt(value);}
function heroLeagueBoard(metric){const entries=heroLeagueStandings(metric),max=Math.max(1,...entries.map(entry=>entry.value)),top=entries.slice(0,3),rest=entries.slice(3),leader=entries[0],runner=entries[1],gap=leader&&runner?Math.max(0,leader.value-runner.value):0,podiumOrder=[top[1],top[0],top[2]];return `<article class="league-focus-board"><header><span class="league-focus-icon">${metric.icon}</span><div><small>Ranking by</small><strong>${escapeHTML(metric.label)}</strong><p>${escapeHTML(metric.detail)}</p></div>${leader?.value?`<div class="league-lead-gap"><small>Lead</small><b>${gap?`+${formatHeroLeagueValue(gap,metric)}`:"Tied"}</b></div>`:""}</header><div class="league-podium">${podiumOrder.map(entry=>{if(!entry)return "";const actualRank=entries.indexOf(entry)+1,medal=actualRank===1?"🥇":actualRank===2?"🥈":"🥉";return `<button class="league-podium-place rank-${actualRank}" data-action="open-hero" data-hero="${entry.hero.id}" style="--hero-color:${entry.hero.color}"><span class="league-medal">${medal}</span><span class="league-podium-portrait">${heroImage(entry.hero)}</span><strong>${escapeHTML(entry.hero.name)}</strong><small>${escapeHTML(entry.hero.className)}</small><b>${formatHeroLeagueValue(entry.value,metric)}</b><i><span style="--standing-width:${entry.value/max*100}%"></span></i></button>`;}).join("")}</div><div class="league-rest">${rest.map((entry,index)=>`<button class="league-rest-row" data-action="open-hero" data-hero="${entry.hero.id}"><span class="league-rest-rank">${index+4}</span><span class="league-standing-portrait" style="--hero-color:${entry.hero.color}">${heroImage(entry.hero)}</span><span><strong>${escapeHTML(entry.hero.name)}</strong><small>${escapeHTML(entry.hero.className)}</small></span><b>${formatHeroLeagueValue(entry.value,metric)}</b></button>`).join("")}</div></article>`;}
function heroLeagueSummary(metricKey){const metric=heroLeagueMetricDefinition(metricKey),standings=heroLeagueStandings(metric),leader=standings[0];if(!leader?.value)return `<article class="league-summary-card empty"><span>${metric.icon}</span><div><small>${escapeHTML(metric.label)} leader</small><strong>No record yet</strong><b>0</b></div></article>`;const tied=standings.filter(entry=>entry.value===leader.value);if(tied.length>1)return `<article class="league-summary-card tie"><span>${metric.icon}</span><div><small>${escapeHTML(metric.label)} leaders</small><strong>${tied.length}-way tie</strong><b>${formatHeroLeagueValue(leader.value,metric)}</b></div></article>`;return `<button class="league-summary-card" data-action="open-hero" data-hero="${leader.hero.id}"><span class="league-summary-portrait" style="--hero-color:${leader.hero.color}">${heroImage(leader.hero)}</span><div><small>${escapeHTML(metric.label)} leader</small><strong>${escapeHTML(leader.hero.name)}</strong><b>${formatHeroLeagueValue(leader.value,metric)}</b></div></button>`;}
function renderHeroLeague(){const host=$("#heroLeague");if(!host)return;if(!HERO_LEAGUE_CATEGORIES[heroLeagueMetric])heroLeagueMetric="overview";$$('[data-action="hero-league-metric"]').forEach(button=>button.classList.toggle("active",button.dataset.metric===heroLeagueMetric));const category=HERO_LEAGUE_CATEGORIES[heroLeagueMetric];if(!category.metrics.some(metric=>metric.key===heroLeagueStat))heroLeagueStat=category.metrics[0].key;const metric=category.metrics.find(candidate=>candidate.key===heroLeagueStat)||category.metrics[0];host.innerHTML=`<div class="league-metric-picker" role="tablist" aria-label="${escapeHTML(category.label)} leaderboard metric">${category.metrics.map(candidate=>`<button class="${candidate.key===heroLeagueStat?"active":""}" data-action="hero-league-stat" data-stat="${candidate.key}"><span>${candidate.icon}</span><strong>${escapeHTML(candidate.label)}</strong></button>`).join("")}</div>${heroLeagueBoard(metric)}<div class="league-help"><span>👆</span><p><strong>Tap any hero</strong> to open their profile. Switch the buttons above to compare a different record.</p></div>`;}

function renderSyncUser(){
  $("#versionLabel").textContent=`v${VERSION}`;const label=currentUser?(currentUser.displayName||currentUser.email||"A").charAt(0).toUpperCase():"G";$("#accountButton").textContent=label;
  renderSoundButton();
}
function setSync(status){const dot=$("#syncDot"),label=$("#syncLabel");dot.className=`status-dot ${status==="online"?"online":status==="error"?"error":""}`;label.textContent=status==="online"?"Cloud saved":status==="saving"?"Saving…":status==="error"?"Sync problem":"Device save";}

function openView(view){currentView=view;$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.viewPanel===view));$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));window.scrollTo({top:0,behavior:"smooth"});renderAll();}
function openDrawer(title,eyebrow,html,mode=""){$("#drawerTitle").textContent=title;$("#drawerEyebrow").textContent=eyebrow;$("#drawerContent").innerHTML=html;$("#drawer").dataset.mode=mode;$("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeDrawer(){$("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true");$("#drawer").dataset.mode="";document.body.style.overflow="";}

function profileEquipmentSlot(h,slot,label){const d=h.equipment[slot]?itemData(h.equipment[slot]):null,detail=d?[d.attack?`+${d.attack} ATK`:"",d.defense?`+${d.defense} DEF`:"",d.element,d.effectText,["weapon","armor"].includes(slot)?`${Math.floor(d.durability??100)}% durability`:""].filter(Boolean).join(" · "):slot==="pet"?"Find pets while skilling or hatch a raid egg":slot==="trinket"?"Find trinkets in Dungeons":"No item equipped";return `<article class="profile-gear-slot"><span>${d?itemImage(d,"profile-item-art"):"＋"}</span><div><small>${label}</small><strong>${d?escapeHTML(d.name):"Empty slot"}</strong><p>${escapeHTML(detail)}</p></div></article>`;}
function heroStoryHTML(h){const adventures=(h.records.expeditions||0)+(h.records.dungeons||0)+(h.records.raids||0),best=Object.entries(h.skills).sort((a,b)=>b[1].level-a[1].level)[0],bestName=WORK_SKILL_NAMES[best[0]],workTotal=h.records.workActions||0,damage=h.records.damageDealt||0;return `<div class="hero-story"><div class="story-lead"><span>“</span><p>${escapeHTML(h.name)} has spent ${formatDuration(h.records.secondsActive)} shaping Briarwatch—fighting as a ${CLASS_COMBAT[h.className].identity.toLowerCase()}, mastering ${bestName}, and building a record that belongs to this save alone.</p></div><div class="story-timeline"><article><i>⚔️</i><div><small>Combat chapter</small><strong>${fmt(h.records.kills)} enemies defeated · ${fmt(damage)} damage dealt</strong><p>${fmt(h.records.damageTaken)} damage endured, ${fmt(h.records.healingDone)} HP restored, and ${fmt(h.records.defeats)} trips back by cart.</p></div></article><article><i>🧭</i><div><small>Road chapter</small><strong>${fmt(adventures)} adventures completed</strong><p>${fmt(h.records.expeditions)} expeditions, ${fmt(h.records.dungeons)} dungeons, and ${fmt(h.records.raids)} raids returned from.</p></div></article><article><i>🛠️</i><div><small>Town chapter</small><strong>${fmt(workTotal)} work actions · ${bestName} ${best[1].level}</strong><p>${fmt(h.records.foodGathered)} ingredients harvested, ${fmt(h.records.foodCooked||0)} meals cooked, ${fmt(h.records.metalMined)} metal, ${fmt(h.records.woodGathered)} wood, and ${fmt(h.records.kitsForged)} kits added to the town.</p></div></article><article><i>🏆</i><div><small>Legacy chapter</small><strong>${fmt(h.records.goldEarned)} Gold earned · ${fmt(h.records.itemsFound)} rare finds</strong><p>${fmt(h.records.raidBosses)} raid bosses and ${fmt(h.records.dungeonBosses)} dungeon bosses appear in ${escapeHTML(h.name)}'s record.</p></div></article></div></div>`;}
function openHero(id){
  const h=heroById(id);if(!h)return;const maxHP=heroMaxHP(h),specials=heroSpecials(h),progress=combatXPProgress(h),identity=CLASS_COMBAT[h.className];
  openDrawer(h.name,`${h.className} · Combat Level ${h.level}`,`<div class="character-command" style="--hero-color:${h.color}"><span class="command-portrait">${heroImage(h)}</span><div class="command-identity"><div><h2>${escapeHTML(h.name)}</h2><button class="edit-name-button" data-action="toggle-hero-rename" aria-label="Rename ${escapeHTML(h.name)}">✎</button></div><p>${h.className} · ${escapeHTML(statusFor(h))}</p><div>${combatStyleBadge(heroCombatStyle(h))}<span class="identity-chip">${escapeHTML(identity.identity)}</span></div></div><div class="command-meta"><div class="command-level"><small>Combat</small><strong>${h.level}</strong></div><div class="command-wallet"><small>Gold</small><strong>🪙 ${fmt(h.gold||0)}</strong></div></div></div><div id="heroRenameForm" class="inline-rename" hidden><input id="heroNameInput" maxlength="24" value="${escapeHTML(h.name)}" aria-label="New hero name"><button class="primary-button" data-action="rename-hero" data-hero="${h.id}">Save</button></div><section class="profile-core"><div class="profile-xp"><div><strong>${h.level>=100?"Maximum Combat Level":`${fmt(progress.current)} / ${fmt(progress.required)} XP`}</strong><small>${h.level>=100?"Level 100":`${fmt(progress.remaining)} XP to Level ${h.level+1}`}</small></div><div class="meter"><span style="--value:${progress.percent}%;--meter-color:${h.color}"></span></div></div><div class="compact-combat-stats"><div><span>⚔️</span><strong>${fmt(heroAttack(h))}</strong><small>Attack</small></div><div><span>💥</span><strong>${fmt(heroMaxHit(h))}</strong><small>Max hit</small></div><div><span>🛡️</span><strong>${fmt(heroDefense(h))}</strong><small>Defence</small></div><div><span>❤️</span><strong>${fmt(Math.min(h.hp??maxHP,maxHP))}/${fmt(maxHP)}</strong><small>HP</small></div><div><span>⏱️</span><strong>${heroAttackSpeed(h).toFixed(2)}s</strong><small>Attack</small></div><div><span>🎯</span><strong>${Math.round(heroCritChance(h)*100)}%</strong><small>Crit</small></div><div><span>🧠</span><strong>${heroResolve(h)}</strong><small>Resolve</small></div><div><span>✦</span><strong>${fmt(heroPower(h))}</strong><small>Power</small></div></div><div class="profile-triangle"><span>⚔️ Melee → 🏹 Ranged → ✨ Magic → ⚔️</span><b>Advantage +25% dealt / −25% taken</b></div>${CLASS_PASSIVES[h.className]?`<div class="class-passive"><strong>${CLASS_PASSIVES[h.className].icon} ${escapeHTML(CLASS_PASSIVES[h.className].name)}</strong><span>${escapeHTML(CLASS_PASSIVES[h.className].detail)}</span></div>`:""}${specials.length?`<div class="special-chip-list">${specials.map(x=>`<span>${escapeHTML(x)}</span>`).join("")}</div>`:""}</section><div class="drawer-section skills-first"><div class="profile-section-title"><h3>Independent Work Skills</h3>${workActionStatus(h)?`<small data-work-timer="${h.id}">${escapeHTML(workActionStatus(h))}</small>`:""}</div><div class="profile-skill-grid">${Object.entries(h.skills).map(([key,skill])=>`<article><span>${{farming:"🌾",cooking:"🍳",mining:"⛏️",woodcutting:"🌲",smithing:"⚒️",plundering:"🏴‍☠️"}[key]}</span><div><small>${WORK_SKILL_NAMES[key]}</small><strong>Level ${skill.level}</strong><div class="meter"><span style="--value:${skill.level>=100?100:skill.xp/xpForLevel(skill.level)*100}%"></span></div></div></article>`).join("")}</div></div><div class="drawer-section"><div class="profile-section-title"><h3>Equipment</h3><button class="text-button" data-action="open-view" data-view="warehouse">Open Warehouse</button></div><div class="profile-equipment-grid">${profileEquipmentSlot(h,"weapon","Weapon")}${profileEquipmentSlot(h,"armor","Armor")}${profileEquipmentSlot(h,"pet","Pet")}${profileEquipmentSlot(h,"trinket","Trinket")}</div></div><div class="drawer-section"><h3>${escapeHTML(h.name)}'s Story</h3>${heroStoryHTML(h)}</div><div class="drawer-section quick-assignment"><h3>Quick Assignment</h3><div class="quick-assignment-grid">${["idle","farm","cook","mine","forest","smith","plunder","tavern"].map(a=>`<button class="${h.assignment===a?"selected":""}" data-action="assign" data-hero="${h.id}" data-assignment="${a}" ${h.assignment==="combat"||h.assignment==="inn"?"disabled":""}><span>${ASSIGNMENTS[a].icon}</span><strong>${ASSIGNMENTS[a].name}</strong></button>`).join("")}</div></div>`,"hero-profile");
}

function taskWorkerCount(assignment,taskId){return state.heroes.filter(hero=>hero.assignment===assignment&&workTaskForHero(hero,assignment)?.id===taskId).length;}
function taskRequirementText(assignment,task){return `${WORK_SKILL_NAMES[BUILDINGS[assignment].skill]} ${task.level} + ${BUILDINGS[assignment].name} ${task.building}`;}
function taskOutputDetail(assignment,task){if(assignment==="plunder")return `${formatDuration(task.seconds)} base · ${Math.round(task.success*100)}% base success · ${fmt(task.gold[0])}–${fmt(task.gold[1])} personal Gold`;
  if(assignment==="farm")return `Raw ingredient for Cooking · ${workTaskTime(task)}s base`;
  if(assignment==="cook"){const raw=resourceTierData("rawFood",task.rawTier);return `Uses 1 ${raw?.name||"ingredient"} → ${task.name} (${task.heal} HP) · ${workTaskTime(task)}s base`; }
  if(assignment==="mine"||assignment==="forest")return `${task.tier} recipe material · ${workTaskTime(task)}s base`;
  const metal=resourceTierData("metal",REPAIR_KIT_RECIPE.metalTier),wood=resourceTierData("wood",REPAIR_KIT_RECIPE.woodTier);return `Uses ${REPAIR_KIT_RECIPE.metalCost} ${metal.name} + ${REPAIR_KIT_RECIPE.woodCost} ${wood.name} · ${workTaskTime(task)}s base`;
}
function resourceTierHTML(id){
  const resource=RESOURCE_ASSIGNMENTS[id];if(id==="cook")return cookingTaskHTML();if(!resource)return "";const b=BUILDINGS[id],buildingLevel=state.buildings[id]||1;
  const title=resource==="rawFood"?"Farming Tasks":resource==="metal"?"Mining Tasks":"Woodcutting Tasks",explanation=resource==="rawFood"?"Every completed Farming action creates one raw ingredient. Raw ingredients must be cooked in the Kitchen before combat can consume them.":`Every completed action creates one distinct ${resource} item. Each stack is its own crafting material and cannot substitute for another tier.`;
  return `<div class="drawer-section"><div class="profile-section-title"><h3>${title}</h3><small>Choose task → choose hero</small></div><p class="tier-explainer">${explanation} Tap any unlocked task to assign an eligible hero directly.</p><div class="resource-tier-list">${RESOURCE_TIERS[resource].map(task=>{const eligible=state.heroes.some(hero=>(hero.skills[b.skill]?.level||1)>=task.level),unlocked=eligible&&buildingLevel>=task.building,amount=Math.floor(state.resourceTiers[resource][task.id]||0),detail=`${fmt(amount)} stored · ${taskOutputDetail(id,task)}`,workers=taskWorkerCount(id,task.id),badge=workers?`${workers} hero${workers===1?"":"es"}`:"Choose hero";return unlocked?`<button class="resource-tier task-select ${workers?"assigned":""}" data-action="open-task-assignment" data-assignment="${id}" data-task="${task.id}" aria-label="Assign a hero to ${escapeHTML(task.name)}"><span>${task.icon}</span><div><strong>${task.tier} · ${escapeHTML(task.name)}</strong><small>${detail}</small></div><b>${badge}</b></button>`:`<div class="resource-tier locked"><span>🔒</span><div><strong>${task.tier} · ${escapeHTML(task.name)}</strong><small>Requires ${taskRequirementText(id,task)}</small></div><b>Locked</b></div>`;}).join("")}</div></div>`;
}
function cookingTaskHTML(){const workers=state.heroes.filter(h=>h.assignment==="cook").length;return `<div class="drawer-section"><div class="profile-section-title"><h3>Cooking Tasks</h3><small>Raw ingredients → usable meals</small></div><p class="tier-explainer">Farmed ingredients cannot be eaten. Assign a Cook and choose which meal tier to prepare.</p><div class="resource-tier-list">${COOK_WORK_TASKS.map(task=>{const raw=resourceTierData("rawFood",task.rawTier),stored=resourceTierCount("rawFood",task.rawTier),meals=resourceTierCount("food",task.id),eligible=state.heroes.some(h=>h.skills.cooking.level>=task.level)&&state.buildings.cook>=task.building,assigned=taskWorkerCount("cook",task.id);return eligible?`<button class="resource-tier task-select ${assigned?"assigned":""}" data-action="open-task-assignment" data-assignment="cook" data-task="${task.id}"><span>${task.icon}</span><div><strong>${task.tier} · ${task.name}</strong><small>${fmt(stored)} ${raw.name} → ${fmt(meals)} meals stored · ${task.baseSeconds}s base</small></div><b>${assigned?`${assigned} hero${assigned===1?"":"es"}`:"Choose hero"}</b></button>`:`<div class="resource-tier locked"><span>🔒</span><div><strong>${task.tier} · ${task.name}</strong><small>Cooking ${task.level} + Kitchen ${task.building}</small></div><b>Locked</b></div>`;}).join("")}</div></div>`;}
function smithWorkTaskHTML(){
  const task=SMITH_WORK_TASKS[0],workers=taskWorkerCount("smith",task.id),metal=resourceTierData("metal",REPAIR_KIT_RECIPE.metalTier),wood=resourceTierData("wood",REPAIR_KIT_RECIPE.woodTier);
  return `<div class="drawer-section"><div class="profile-section-title"><h3>Smithing Tasks</h3><small>Choose task → choose hero</small></div><p class="tier-explainer">Assigned Smiths continuously perform the exact work selected here. Equipment recipes below remain deliberate one-time crafts.</p><div class="resource-tier-list"><button class="resource-tier task-select ${workers?"assigned":""}" data-action="open-task-assignment" data-assignment="smith" data-task="${task.id}"><span>${task.icon}</span><div><strong>${task.tier} · ${task.name}</strong><small>${fmt(state.resources.repairKits)} stored · Uses ${REPAIR_KIT_RECIPE.metalCost} ${metal.name} + ${REPAIR_KIT_RECIPE.woodCost} ${wood.name} · ${task.baseSeconds}s base</small></div><b>${workers?`${workers} hero${workers===1?"":"es"}`:"Choose hero"}</b></button></div></div>`;
}
function heroTaskEligibility(hero,assignment,task){
  if(hero.assignment==="inn")return {eligible:false,note:"Recovering at the Inn"};
  if(hero.assignment==="combat")return {eligible:false,note:"Recall from combat first"};
  const skill=BUILDINGS[assignment].skill,level=hero.skills[skill]?.level||1;if(level<task.level)return {eligible:false,note:`Needs ${WORK_SKILL_NAMES[skill]} ${task.level}`};
  if((state.buildings[assignment]||1)<task.building)return {eligible:false,note:`Needs ${BUILDINGS[assignment].name} ${task.building}`};
  return {eligible:true,note:`${WORK_SKILL_NAMES[skill]} ${level}`};
}
function taskHeroChoiceHTML(hero,assignment,task){
  const eligibility=heroTaskEligibility(hero,assignment,task),current=workTaskForHero(hero,assignment),working=hero.assignment===assignment&&current?.id===task.id,currentAction=workActionStatus(hero)||statusFor(hero),status=!eligibility.eligible?"Unavailable":working?"Working this task":hero.assignment===assignment?`Switch from ${current?.name||ASSIGNMENTS[assignment].name}`:hero.assignment==="tavern"?"Leave Tavern & assign":"Assign";
  return `<button class="task-hero-card ${working?"selected":""}" data-action="assign-specific-task" data-hero="${hero.id}" data-assignment="${assignment}" data-task="${task.id}" ${!eligibility.eligible?"disabled":""}><span class="task-hero-portrait" style="--hero-color:${hero.color}">${heroImage(hero)}</span><span class="task-hero-copy"><strong>${escapeHTML(hero.name)} · ${hero.className}</strong><small>Current: ${escapeHTML(currentAction)} · ${escapeHTML(eligibility.note)}</small></span><b>${escapeHTML(status)}</b></button>`;
}
function openTaskAssignment(assignment,taskId){
  const task=workTasksFor(assignment).find(candidate=>candidate.id===taskId);if(!task)return toast("⚠️","That task is unavailable");const output=taskOutputDetail(assignment,task),stored=assignment==="farm"?resourceTierCount("food",task.id):assignment==="mine"?resourceTierCount("metal",task.id):assignment==="forest"?resourceTierCount("wood",task.id):state.resources.repairKits;
  openDrawer(task.name,`${BUILDINGS[assignment].name} · choose a hero`,`<div class="task-command"><span>${task.icon}</span><div><small>${task.tier} task</small><strong>${escapeHTML(task.name)}</strong><p>${escapeHTML(output)}</p></div><b>${fmt(stored)} stored</b></div><div class="drawer-section"><div class="profile-section-title"><h3>Choose a Hero</h3><small>${taskRequirementText(assignment,task)}</small></div><div class="task-hero-list">${state.heroes.map(hero=>taskHeroChoiceHTML(hero,assignment,task)).join("")}</div></div><div class="drawer-footer"><button class="soft-button" data-action="open-building" data-building="${assignment}">Back to ${BUILDINGS[assignment].name}</button></div>`,`task-${assignment}`);
}
function openHeroWorkPicker(heroId,assignment){
  const hero=heroById(heroId);if(!hero||!WORK_ASSIGNMENTS.includes(assignment))return;if(hero.assignment==="inn")return toast("🛏️","Hero is still recovering");const tasks=unlockedWorkTasks(hero,assignment),current=workTaskForHero(hero,assignment);
  openDrawer(`${ASSIGNMENTS[assignment].name} Task`,`${hero.name} · choose exact work`,`<div class="task-command hero-task-command"><span class="task-picker-portrait" style="--hero-color:${hero.color}">${heroImage(hero)}</span><div><small>${hero.className}</small><strong>${escapeHTML(hero.name)}</strong><p>${WORK_SKILL_NAMES[BUILDINGS[assignment].skill]} Level ${hero.skills[BUILDINGS[assignment].skill]?.level||1} · ${BUILDINGS[assignment].name} Level ${state.buildings[assignment]||1}</p></div></div>${hero.assignment==="combat"?`<div class="notice">Recall ${escapeHTML(hero.name)} from combat before assigning town work.</div>`:""}<div class="drawer-section"><div class="profile-section-title"><h3>Choose the exact task</h3><small>${tasks.length} unlocked</small></div><div class="task-choice-list">${tasks.map(task=>`<button class="resource-tier task-select ${hero.assignment===assignment&&current?.id===task.id?"assigned":""}" data-action="assign-specific-task" data-hero="${hero.id}" data-assignment="${assignment}" data-task="${task.id}" ${hero.assignment==="combat"?"disabled":""}><span>${task.icon}</span><div><strong>${task.tier} · ${escapeHTML(task.name)}</strong><small>${escapeHTML(taskOutputDetail(assignment,task))}</small></div><b>${hero.assignment===assignment&&current?.id===task.id?"Current":"Choose"}</b></button>`).join("")}</div></div><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Cancel</button></div>`,`hero-task-${assignment}`);
}
function buildingWorkersHTML(id,workers){
  if(!workers.length)return `<div class="empty-state">No heroes are assigned here. Choose an unlocked task above to add one.</div>`;
  if(!WORK_ASSIGNMENTS.includes(id))return `<div class="action-list">${workers.map(hero=>`<button data-action="open-hero" data-hero="${hero.id}"><span class="inline-hero">${heroImage(hero)} ${escapeHTML(hero.name)}</span><small>${escapeHTML(statusFor(hero))}</small></button>`).join("")}</div>`;
  return `<div class="building-worker-list">${workers.map(hero=>{const task=workTaskForHero(hero,id);return `<article class="building-worker"><button class="worker-identity" data-action="open-hero" data-hero="${hero.id}"><span class="inline-hero">${heroImage(hero)}</span><span><strong>${escapeHTML(hero.name)}</strong><small>${hero.className} · ${WORK_SKILL_NAMES[BUILDINGS[id].skill]} ${hero.skills[BUILDINGS[id].skill]?.level||1}</small></span></button><div class="worker-task"><strong>${task?.icon||ASSIGNMENTS[id].icon} ${escapeHTML(task?.name||ASSIGNMENTS[id].name)}</strong><small data-work-timer="${hero.id}">${escapeHTML(workActionStatus(hero))}</small><button class="text-button" data-action="open-hero-work-picker" data-hero="${hero.id}" data-assignment="${id}">Change task</button></div></article>`;}).join("")}</div>`;
}
function openBuilding(id){
  const b=BUILDINGS[id],level=state.buildings[id],cost=buildingUpgradeCost(id),workers=state.heroes.filter(hero=>hero.assignment===id),activity=id==="tavern"?heroEconomyHTML()+tavernMarketHTML()+questBoardHTML():"",tasks=resourceTierHTML(id)||(id==="smith"?smithWorkTaskHTML():"");
  openDrawer(b.name,`Building level ${level}`,`<div class="drawer-section"><div class="info-grid"><div class="info-tile"><small>Assigned heroes</small><strong>${workers.length} / 6</strong></div><div class="info-tile"><small>Action speed</small><strong>+${(level-1)*8}%</strong></div><div class="info-tile"><small>Next upgrade</small><strong>🪙 ${fmt(cost.gold)} · 🌲 ${fmt(cost.wood)} · ⛏️ ${fmt(cost.metal)}</strong></div><div class="info-tile"><small>Role</small><strong>${escapeHTML(b.description)}</strong></div></div></div>${activity}${tasks}${id==="smith"?smithCraftHTML():""}<div class="drawer-section"><h3>Heroes here</h3>${buildingWorkersHTML(id,workers)}</div><div class="drawer-footer"><button class="soft-button" data-action="open-view" data-view="assign">Assignments</button><button class="primary-button" data-action="upgrade-building" data-building="${id}">Upgrade · 🪙 ${fmt(cost.gold)} · 🌲 ${fmt(cost.wood)} · ⛏️ ${fmt(cost.metal)}</button></div>`,id==="tavern"?"tavern":`building-${id}`);
}
function itemCraftingRecipe(d){const tierId=d.recipeTier||String(d.tier||"starter").toLowerCase(),metal=resourceTierData("metal",tierId)||RESOURCE_TIERS.metal[0],wood=resourceTierData("wood",tierId)||RESOURCE_TIERS.wood[0];return {metal,wood,metalCost:d.metalCost||0,woodCost:d.woodCost||0};}
function smithingCapability(){return {level:Math.max(...state.heroes.map(hero=>hero.skills.smithing.level)),building:state.buildings.smith};}
function normalGearTierUnlocked(tier,capability=smithingCapability()){return capability.level>=tier.smithLevel&&capability.building>=tier.building;}
function smithRecipeButton(key){const d=ITEMS[key],r=itemCraftingRecipe(d),metalOwned=resourceTierCount("metal",r.metal.id),woodOwned=resourceTierCount("wood",r.wood.id),stat=d.type==="weapon"?`+${d.attack} ATK`:`+${d.defense} DEF`,ready=metalOwned>=r.metalCost&&woodOwned>=r.woodCost,forgeTime=smithOrderSeconds(d);return `<button class="smith-recipe ${ready?"ready":"missing-materials"}" data-action="craft-item" data-key="${key}"><span class="recipe-item">${itemImage(d,"recipe-item-art")}<span><strong>${escapeHTML(d.name)}</strong><small>${stat} · Combat ${d.requiredLevel} · ${formatDuration(forgeTime)} forge time</small></span></span><span class="recipe-cost"><strong>${r.metal.icon} ${r.metalCost} · ${r.wood.icon} ${r.woodCost}</strong><small>${fmt(metalOwned)} ${escapeHTML(r.metal.name)} · ${fmt(woodOwned)} ${escapeHTML(r.wood.name)}</small></span></button>`;}
function smithTierHTML(tier,capability,currentTier){
  const metal=resourceTierData("metal",tier.id),wood=resourceTierData("wood",tier.id),unlocked=normalGearTierUnlocked(tier,capability),requirement=`Smithing ${tier.smithLevel} + Blacksmith ${tier.building}`,materialText=`${metal.icon} ${metal.name} + ${wood.icon} ${wood.name}`;
  if(!unlocked)return `<div class="smith-tier locked"><span class="smith-tier-badge">🔒</span><div><strong>${tier.name} Equipment</strong><small>${escapeHTML(materialText)} · Requires ${escapeHTML(requirement)}</small></div><b>Locked</b></div>`;
  return `<details class="smith-tier unlocked" ${tier.id===currentTier.id?"open":""}><summary><span class="smith-tier-badge">${metal.icon}</span><span><strong>${tier.name} Equipment</strong><small>${escapeHTML(materialText)} · ${escapeHTML(requirement)}</small></span><b>12 recipes</b></summary><div class="smith-tier-recipes"><h4>Weapons</h4><div class="action-list">${NORMAL_GEAR_RECIPE_KEYS[tier.id].weapon.map(smithRecipeButton).join("")}</div><h4>Armor</h4><div class="action-list">${NORMAL_GEAR_RECIPE_KEYS[tier.id].armor.map(smithRecipeButton).join("")}</div></div></details>`;
}
function smithCraftHTML(){
  const capability=smithingCapability(),unlocked=NORMAL_GEAR_TIER_SPECS.filter(tier=>normalGearTierUnlocked(tier,capability)),currentTier=unlocked[unlocked.length-1],nextTier=NORMAL_GEAR_TIER_SPECS.find(tier=>!normalGearTierUnlocked(tier,capability));
  return `<div class="drawer-section"><h3>Equipment Forging</h3><p class="tier-explainer">Equipment consumes exact materials immediately, then assigned Smiths must spend real forge time completing it. Only one equipment order can be active at once.</p>${state.smithOrder?`<div class="notice"><strong>🔥 Forging ${escapeHTML(ITEMS[state.smithOrder.key]?.name||"equipment")}</strong><br><small>${Math.ceil(state.smithOrder.remaining)} work-seconds remaining. More assigned Smiths help, with diminishing returns.</small></div>`:""}<div class="smith-capability"><div><small>Highest Smithing</small><strong>Level ${capability.level}</strong></div><div><small>Blacksmith</small><strong>Level ${capability.building}</strong></div><div><small>Next equipment tier</small><strong>${nextTier?`${nextTier.name} · Smithing ${nextTier.smithLevel} / Blacksmith ${nextTier.building}`:"All tiers mastered"}</strong></div></div><div class="smith-tier-list">${NORMAL_GEAR_TIER_SPECS.map(tier=>smithTierHTML(tier,capability,currentTier)).join("")}</div></div>`;
}
function craftItem(key){const d=ITEMS[key];if(!d?.metalCost)return;if(state.smithOrder)return toast("🔥","The forge is already busy",`${ITEMS[state.smithOrder.key]?.name||"Equipment"} must finish first.`);const smiths=state.heroes.filter(h=>h.assignment==="smith");if(!smiths.length)return toast("⚒️","Assign a Smith first","Equipment forging now takes real time and requires at least one hero at the Blacksmith.");const tier=d.normalGear?NORMAL_GEAR_TIER_SPECS.find(entry=>entry.id===d.recipeTier):null;if(tier&&!normalGearTierUnlocked(tier))return toast("🔒",`${tier.name} equipment is locked`,`Requires Smithing ${tier.smithLevel} and Blacksmith Level ${tier.building}.`);const r=itemCraftingRecipe(d),metalOwned=resourceTierCount("metal",r.metal.id),woodOwned=resourceTierCount("wood",r.wood.id);if(occupiedSlots()>=warehouseCapacity())return toast("📦","Warehouse is full");if(metalOwned<r.metalCost||woodOwned<r.woodCost)return toast("⚒️","Not enough exact materials",`Need ${r.metalCost} ${r.metal.name} and ${r.woodCost} ${r.wood.name}. You have ${metalOwned} and ${woodOwned}.`);spendSpecificResource("metal",r.metal.id,r.metalCost);spendSpecificResource("wood",r.wood.id,r.woodCost);const total=smithOrderSeconds(d);state.smithOrder={key,totalSeconds:total,remaining:total,startedAt:Date.now()};notify("Forge order started",`${d.name} will take ${formatDuration(total)} of forge work. Materials are committed.`,d.icon);markDirty();renderAll();openBuilding("smith");}

function openCombat(combatId){
  const c=COMBAT[combatId];if(!c)return;const available=state.heroes.filter(h=>!heroReservedForCombat(h.id)&&h.assignment!=="combat"&&h.assignment!=="inn"&&h.sanity>0&&(h.hp||0)>0),max=c.maxParty,entry=runEntryLabel(c),layout=COMBAT_LAYOUTS[c.id];
  openDrawer(c.name,c.eyebrow,`<div class="drawer-section"><p>${c.description}</p><div class="info-grid"><div class="info-tile"><small>Route</small><strong>${combatRoomsFor(c).length} fights · ${layout.filter(r=>r.type==="skill").length} skill rooms</strong></div><div class="info-tile"><small>Required level</small><strong>Combat ${c.minLevel}+</strong></div><div class="info-tile"><small>Party size</small><strong>Up to ${max}</strong></div><div class="info-tile"><small>Auto-healing</small><strong>Eat below 45% HP</strong></div><div class="info-tile"><small>Entry per clear</small><strong id="combatEntryCost">${entry}</strong></div><button class="info-tile loot-preview" data-action="open-loot" data-combat="${c.id}"><small>Possible rewards</small><strong><span class="loot-chest-icon" aria-hidden="true"></span> View loot & rates</strong></button></div></div><div class="drawer-section"><h3>${c.category==="raid"?"Possible rooms · order changes each raid":"Rooms in this route"}</h3><div class="route-preview">${layout.map((r,i)=>`<div><span>${roomImage(r,"route-room-art")}</span><div><strong>${i+1}. ${escapeHTML(r.name)}</strong><small>${r.type==="skill"?`${r.skill} obstacle · time scales with party skill`:`${r.boss?"Boss":"Enemy"} fight · ${COMBAT_STYLE_META[r.combatStyle].icon} ${COMBAT_STYLE_META[r.combatStyle].name}`}</small></div></div>`).join("")}</div><div class="triangle-reminder light"><span>⚔️ Melee beats Ranged</span><span>🏹 Ranged beats Magic</span><span>✨ Magic beats Melee</span><b>±25%</b></div></div><div class="drawer-section"><h3>Choose the party</h3><div class="choice-grid" id="partyChoices">${available.map(h=>`<button class="choice-card hero-choice ${h.level<c.minLevel?"locked":""}" data-action="toggle-party" data-hero="${h.id}" data-max="${max}" data-combat="${c.id}" ${h.level<c.minLevel?"disabled":""}><span>${heroImage(h)}</span><strong>${escapeHTML(h.name)} · Lv ${h.level}</strong>${combatStyleBadge(heroCombatStyle(h),true)}<small>${h.level<c.minLevel?`Needs Level ${c.minLevel}`:`Max ${heroMaxHit(h)} · ${heroAttackSpeed(h).toFixed(2)}s · ${fmt(h.hp)} HP`}</small></button>`).join("")}</div></div><div id="combatPartyPreview" class="combat-party-preview empty"><div><span>💥</span><strong id="partyMaxHit">Choose heroes</strong><small>Highest max hit</small></div><div><span>⚔️</span><strong id="partyDps">—</strong><small>Estimated DPS</small></div><div><span>⏱️</span><strong id="partyDuration">—</strong><small id="partySpeed">Estimated clear</small></div><div><span>🥕</span><strong id="partyFood">${fmt(state.resources.food)}</strong><small>Meals stored</small></div></div><p id="combatPreviewNote" class="combat-preview-note">The triangle applies to both outgoing and incoming damage. A mixed party is safest when a route changes styles.</p><label class="notice"><input id="autoRepeatChoice" type="checkbox" checked> Automatically repeat while entry supplies, meals, Sanity, and heroes allow.</label><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Cancel</button><button class="primary-button" data-action="start-run" data-combat="${c.id}">Enter ${c.short}</button></div>`);
  for(const card of $$("#partyChoices .hero-choice")){const hero=heroById(card.dataset.hero),detail=card.querySelector("small");if(hero&&detail&&hero.level>=c.minLevel)detail.textContent+=` · RES ${heroResolve(hero)} · −${heroSanityDrain(hero,c)} Sanity/clear`;}
  const repeatLabel=$("#autoRepeatChoice")?.closest("label");if(repeatLabel&&c.category==="expedition")repeatLabel.lastChild.textContent=` Automatically repeat. Heroes take individual Tavern breaks at ${EXPEDITION_BREAK_SANITY} Sanity and automatically rejoin at checkpoints.`;updateCombatPreview(c.id);
}
function estimatedClearTime(c,party){const dps=Math.max(.1,estimatedPartyDPS(party,c));return COMBAT_LAYOUTS[c.id].reduce((total,room)=>{if(room.type==="combat")return total+createEnemy(c,room).maxHP/dps;const ranked=party.map(h=>h.skills[room.skill]?.level||1).sort((a,b)=>b-a),effective=ranked.reduce((n,l,i)=>n+l*(i?0.25:1),0);return total+room.baseSeconds*raidPaceScale(c)/(1+effective/25);},0);}
function updateCombatPreview(combatId){
  const c=COMBAT[combatId],panel=$("#combatPartyPreview");if(!c||!panel)return;const party=$$("#partyChoices .selected").map(x=>heroById(x.dataset.hero)).filter(Boolean),maxHit=$("#partyMaxHit"),dps=$("#partyDps"),duration=$("#partyDuration"),speed=$("#partySpeed"),food=$("#partyFood"),note=$("#combatPreviewNote"),entryCost=$("#combatEntryCost");food.textContent=fmt(state.resources.food);if(entryCost)entryCost.textContent=runEntryLabel(c,party.length||null);
  if(!party.length){panel.classList.add("empty");maxHit.textContent="Choose heroes";dps.textContent="—";duration.textContent="—";speed.textContent="Estimated clear";note.textContent="There is no pass/fail roll. Select heroes to see their real damage and route time.";return;}
  const partyDPS=estimatedPartyDPS(party,c),clearTime=estimatedClearTime(c,party),highest=Math.max(...party.map(heroMaxHit)),avgDef=party.reduce((n,h)=>n+heroDefense(h),0)/party.length,resolve=party.reduce((n,h)=>n+heroResolve(h),0)/party.length;panel.classList.remove("empty");maxHit.textContent=fmt(highest);dps.textContent=partyDPS.toFixed(1);duration.textContent=formatDuration(clearTime);speed.textContent=`DEF ${Math.floor(avgDef)} · RES ${Math.floor(resolve)}`;note.textContent=`Weapons raise max hit; Resolve lowers Sanity drain and rises slowly with Combat Level. ${c.category==="expedition"?`At ${EXPEDITION_BREAK_SANITY} Sanity, heroes take staggered Tavern breaks and rejoin at ${EXPEDITION_RETURN_SANITY} at the next checkpoint. `:""}${state.resources.food?"Stored meals are eaten automatically below 45% HP.":"Warning: no food is stored, so this party cannot auto-heal."}`;
}
function openCombatCategory(category){closeDrawer();openView("combat");setTimeout(()=>document.querySelector(`#combat-${category}`)?.scrollIntoView({behavior:"smooth",block:"start"}),80);}

function openNotifications(){openDrawer("Town Reports","The living history of Briarwatch",`<div class="action-list">${state.notifications.map(n=>`<article class="notice"><strong>${n.icon||"✦"} ${escapeHTML(n.title)}</strong><br><small>${new Date(n.time).toLocaleString()}</small><p>${escapeHTML(n.text)}</p></article>`).join("")}</div><div class="drawer-footer"><button class="soft-button" data-action="clear-reports">Clear reports</button><button class="primary-button" data-action="close-drawer">Done</button></div>`);}


function heroEconomyHTML(){return `<div class="drawer-section"><div class="profile-section-title"><h3>Guild Economy</h3><small>Heroes own their earnings</small></div><p class="tier-explainer">Monster/chest Gold goes to the heroes who earned it. Your treasury receives ${state.taxRate}% tax plus what heroes spend on meals, Tavern recovery, and Inn care.</p><div class="info-grid"><div class="info-tile"><small>Tax rate</small><strong>${state.taxRate}%</strong></div><div class="info-tile"><small>Town treasury</small><strong>🪙 ${fmt(state.resources.gold)}</strong></div></div><div class="drawer-footer"><button class="soft-button" data-action="tax-down">−5% Tax</button><button class="soft-button" data-action="tax-up">+5% Tax</button></div><div class="action-list">${state.heroes.map(h=>`<button data-action="donate-hero" data-hero="${h.id}"><span>${escapeHTML(h.name)} · 🪙 ${fmt(h.gold||0)}</span><small>Donate 100 treasury Gold</small></button>`).join("")}</div></div>`;}
function changeTax(delta){state.taxRate=clamp((state.taxRate||0)+delta,0,50);markDirty();renderAll();openBuilding("tavern");}
function donateHeroGold(id){const h=heroById(id);if(!h)return;if(state.resources.gold<100)return toast("🪙","Treasury needs 100 Gold");state.resources.gold-=100;h.gold=(h.gold||0)+100;notify("Donation sent",`${h.name} received 100 Gold from the town treasury.`,"🎁");markDirty();renderAll();openHero(id);}

function openAccount(){
  const cloud=!!currentUser,accountActions=cloud?`<button data-action="sync"><span>☁️ Save to cloud now</span><small>Sync this device</small></button><button data-action="sign-out"><span>🚪 Sign out</span><small>Device save remains</small></button>`:`<button data-action="open-auth"><span>☁️ Sign in for cloud saves</span><small>Device play is active</small></button>`;
  openDrawer("Account & Town",cloud?(currentUser.email||"Cloud adventurer"):"Playing on this device",`<div class="drawer-section"><div class="info-grid"><div class="info-tile"><small>Save</small><strong>${cloud?"Firebase cloud + device":"This device"}</strong></div><div class="info-tile"><small>Version</small><strong>${VERSION}</strong></div><div class="info-tile"><small>Town created</small><strong>${new Date(state.createdAt).toLocaleDateString()}</strong></div><div class="info-tile"><small>Offline time</small><strong>${formatDuration(state.stats.offlineSeconds)}</strong></div></div></div><div class="action-list">${accountActions}<button data-action="export-save"><span>📤 Export save backup</span><small>Download JSON</small></button><button data-action="reset-game"><span>⚠️ Begin a new town</span><small>Starts with zero resources</small></button></div>`);
}

function upgradeBuilding(id){const b=BUILDINGS[id],cost=buildingUpgradeCost(id);if(state.resources.gold<cost.gold)return toast("🪙","Not enough Gold");if(state.resources.wood<cost.wood)return toast("🌲","Not enough Wood");if(state.resources.metal<cost.metal)return toast("⛏️","Not enough Metal");state.resources.gold-=cost.gold;spendQuestResource("wood",cost.wood);spendQuestResource("metal",cost.metal);state.buildings[id]++;notify(`${b.name} upgraded`,`Building Level ${state.buildings[id]} is now complete.`,b.icon);const speaker=state.heroes.find(hero=>hero.assignment===id)||chatPick(state.heroes.filter(hero=>hero.assignment==="idle"));if(speaker)postHeroChat(speaker,`${b.name} Level ${state.buildings[id]} is complete. ${RESOURCE_ASSIGNMENTS[id]?"Check our exact tasks—higher materials may be available.":"The town feels a little stronger already."}`,"upgrade");markDirty();renderAll();openBuilding(id);}

function equipItem(id){const item=state.inventory.find(i=>i.id===id);if(!item)return;const d=itemData(item);if(["pet","trinket"].includes(d.type))return openEquipPicker(id);const hero=state.heroes.find(h=>h.className===d.className);if(!hero)return toast("⚠️","No matching hero");equipItemToHero(id,hero.id);}
function openEquipPicker(itemId){const item=state.inventory.find(i=>i.id===itemId);if(!item)return;const d=itemData(item),slot=d.type;openDrawer(`Equip ${d.name}`,`${slot[0].toUpperCase()+slot.slice(1)} · Any hero`, `<div class="loot-summary"><span>${itemImage(d,"loot-summary-art")}</span><div><strong>${escapeHTML(d.name)}</strong><p>${escapeHTML(d.effectText||d.element||"Choose who will carry this item.")}</p></div></div><div class="drawer-section"><h3>Choose a hero</h3><div class="action-list">${state.heroes.map(h=>{const current=h.equipment[slot]?itemData(h.equipment[slot]):null,busy=h.assignment==="combat";return `<button data-action="equip-to-hero" data-item="${itemId}" data-hero="${h.id}" ${busy?"disabled":""}><span class="inline-hero">${heroImage(h)} ${escapeHTML(h.name)}</span><small>${busy?"Recall from combat first":current?`Replace ${escapeHTML(current.name)}`:`Empty ${slot} slot`}</small></button>`}).join("")}</div></div><div class="drawer-footer"><button class="soft-button" data-action="close-drawer">Cancel</button></div>`);}
function equipItemToHero(itemId,heroId){const idx=state.inventory.findIndex(i=>i.id===itemId),hero=heroById(heroId);if(idx<0||!hero)return;if(hero.assignment==="combat")return toast("⚔️","Recall this hero before changing equipment");const item=state.inventory[idx],d=itemData(item),slot=d.type;if(!["weapon","armor","pet","trinket"].includes(slot))return toast("⚠️","That item cannot be equipped");if(d.className&&hero.className!==d.className)return toast("⚠️",`${d.name} is for the ${d.className}`);if(hero.level<(d.requiredLevel||1))return toast("🔒",`${hero.name} needs Combat Level ${d.requiredLevel}`);if(hero.equipment[slot])state.inventory.push({...hero.equipment[slot],id:uid()});hero.equipment[slot]={...item};state.inventory.splice(idx,1);hero.hp=Math.min(hero.hp??heroMaxHP(hero),heroMaxHP(hero));notify("Equipment changed",`${hero.name} equipped ${d.name}.`,d.icon);markDirty();renderAll();closeDrawer();}
function hatchEgg(itemId){const idx=state.inventory.findIndex(i=>i.id===itemId),egg=state.inventory[idx];if(idx<0||!egg)return;const d=itemData(egg),pet=ITEMS[d.hatchesTo];if(d.type!=="egg"||!pet)return toast("🥚","This egg cannot hatch");state.inventory.splice(idx,1);state.inventory.push({id:uid(),key:d.hatchesTo,acquiredAt:Date.now()});notify("The egg hatched!",`${pet.name} is ready to assist one of your heroes.`,pet.icon);markDirty();renderAll();}
function renameHero(heroId){const h=heroById(heroId),input=$("#heroNameInput");if(!h||!input)return;const name=input.value.trim().replace(/\s+/g," ");if(!name)return toast("✏️","A hero needs a name");if(name.length>24)return toast("✏️","Keep hero names to 24 characters");h.name=name;notify("A new name",`${h.className} is now known as ${name}.`,h.icon);markDirty();renderAll();openHero(heroId);}
function upgradeItem(id){const target=state.inventory.find(i=>i.id===id);if(!target)return;const d=itemData(target);if(!["weapon","armor"].includes(d.type))return;const level=Math.max(0,Number(target.upgrade)||0);if(level>=5)return toast("✨","This item is already +5");const needed=level===0?2:level===1?2:level+1,candidates=state.inventory.filter(i=>i.id!==id&&i.key===target.key&&(Number(i.upgrade)||0)===level);if(candidates.length<needed-1)return toast("⚒️",`Need ${needed} matching ${level?`+${level}`:"base"} items`,`Keep this one plus ${needed-1} more copies at the same upgrade level. +3 requires 3 +2s, +4 requires 4 +3s, and +5 requires 5 +4s.`);const consume=candidates.slice(0,needed-1).map(i=>i.id);state.inventory=state.inventory.filter(i=>!consume.includes(i.id));target.upgrade=level+1;target.durability=100;notify("Equipment upgraded",`${ITEMS[target.key].name} is now +${target.upgrade}. Base combat stat increased by ${target.upgrade*8}%.`,`⚒️`);markDirty();renderAll();}
function repairItem(id){const i=state.inventory.find(x=>x.id===id);if(!i)return;const d=itemData(i),needed=Math.ceil((100-(i.durability??100))/20);if(!needed)return toast("🧰","Item is already fully repaired");if(state.resources.repairKits<needed)return toast("🧰","Not enough Repair Kits");const essence=d.special?Math.ceil(needed/2):0;if(state.resources.essence<essence)return toast("✨","Special gear also needs Essence");state.resources.repairKits-=needed;state.resources.essence-=essence;i.durability=100;notify("Equipment repaired",`${d.name} is restored to full durability.`,"🧰");markDirty();renderAll();}
function salvageItem(id){const idx=state.inventory.findIndex(x=>x.id===id),i=state.inventory[idx];if(!i)return;const d=itemData(i);if(d.salvage){state.resources.essence+=d.salvage;state.inventory.splice(idx,1);notify("Item salvaged",`${d.name} became ${d.salvage} Essence.`,"✨");markDirty();renderAll();return;}if(d.tier==="Starter"&&["weapon","armor"].includes(d.type)){state.resourceTiers.metal.starter=(state.resourceTiers.metal.starter||0)+1;recalculateTieredTotal("metal");state.inventory.splice(idx,1);notify("Item salvaged",`${d.name} became 1 Scrap Metal.`,"🔩");markDirty();renderAll();}}

async function initializeFirebase(){
  try{firebaseApi=await import("./firebase-config.js");firebaseApi.watchAuth(async user=>{
    currentUser=user;renderSyncUser();
    if(user){
      setSync("saving");cloudReconciled=false;const cloud=await firebaseApi.loadGame(user.uid);
      const shouldRestoreCloud=!!cloud&&(!startupHadLocalSave||Number(cloud.updatedAt||0)>Number(state.updatedAt||0));
      if(shouldRestoreCloud){const restoredAt=Date.now();state=migrate(cloud);const away=Math.min(OFFLINE_LIMIT,Math.max(0,(restoredAt-(state.lastTick||restoredAt))/1000)),report=simulate(away,true);postOfflineProgressChat(report);lastSimulationAt=restoredAt;state.lastTick=restoredAt;saveLocal({touchUpdatedAt:false});notify("Cloud town restored","Your Firebase town was restored before this device was allowed to save over it.","☁️");showOffline(report);}
      cloudReconciled=true;await claimPayouts();subscribeOnline();scheduleCloudSave();if($("#authDialog").open)$("#authDialog").close();
    }else{cloudReconciled=false;setSync("device");unsubscribeOnline();}
    renderAll();
  });}
  catch(err){console.warn("Firebase unavailable",err);setSync("error");}
}
function subscribeOnline(){unsubscribeOnline();cloudUnsubscribe=firebaseApi.watchMarket(list=>{marketListings=list;renderMarket();});firebaseApi.loadLeaderboard().then(x=>{leaderboard=x;renderProgress();}).catch(console.warn);}
function unsubscribeOnline(){if(cloudUnsubscribe){cloudUnsubscribe();cloudUnsubscribe=null;}marketListings=[];leaderboard=[];}
async function claimPayouts(){if(!currentUser||!firebaseApi)return;try{const payouts=await firebaseApi.claimPayouts(currentUser.uid);if(payouts.total>0){state.resources.gold+=payouts.total;state.stats.marketSales+=payouts.count;notify("Marketplace payout",`${fmt(payouts.total)} Gold was delivered from ${payouts.count} sale${payouts.count===1?"":"s"}.`,"🪙");}}catch(err){console.warn(err);}}

async function createListing(itemId,price){if(!currentUser||!firebaseApi)return toast("☁️","Sign in to create a listing");const idx=state.inventory.findIndex(i=>i.id===itemId),i=state.inventory[idx];if(!i)return;const d=itemData(i);if(d.soulbound)return toast("🔒","Pets and trinkets cannot be traded");try{await firebaseApi.createMarketListing({sellerId:currentUser.uid,sellerName:currentUser.displayName||currentUser.email?.split("@")[0]||"Adventurer",itemKey:i.key,itemData:{durability:i.durability??100,upgrade:i.upgrade||0},itemName:d.name,icon:d.icon,quantity:1,price:Number(price)});state.inventory.splice(idx,1);notify("Listing created",`${d.name} is listed for ${fmt(price)} Gold.`,"⚖️");markDirty();renderAll();}catch(err){toast("⚠️","Listing failed",friendlyError(err));}}
async function buyListing(id){if(!currentUser||!firebaseApi)return toast("☁️","Sign in to buy from players");const l=marketListings.find(x=>x.id===id);if(!l)return;if(ITEMS[l.itemKey]?.soulbound)return toast("🔒","That account-bound item cannot be traded");if(state.resources.gold<l.price)return toast("🪙","Not enough Gold");if(occupiedSlots()>=warehouseCapacity())return toast("📦","Warehouse is full");try{await firebaseApi.buyMarketListing(l,currentUser.uid,currentUser.displayName||"Adventurer");state.resources.gold-=l.price;state.inventory.push({id:uid(),key:l.itemKey,durability:l.itemData?.durability??100,upgrade:l.itemData?.upgrade||0,acquiredAt:Date.now()});notify("Marketplace purchase",`${l.itemName} arrived in your Warehouse.`,"📦");markDirty();renderAll();}catch(err){toast("⚠️","Purchase failed",friendlyError(err));}}
async function cancelListing(id){if(!currentUser||!firebaseApi)return;const l=marketListings.find(x=>x.id===id);if(!l)return;try{await firebaseApi.cancelMarketListing(l);if(occupiedSlots()<warehouseCapacity())state.inventory.push({id:uid(),key:l.itemKey,durability:l.itemData?.durability??100,upgrade:l.itemData?.upgrade||0,acquiredAt:Date.now()});notify("Listing cancelled",`${l.itemName} returned to the Warehouse.`,"📦");markDirty();renderAll();}catch(err){toast("⚠️","Could not cancel listing",friendlyError(err));}}

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
  else if(a==="hero-league-metric"){heroLeagueMetric=b.dataset.metric;const category=HERO_LEAGUE_CATEGORIES[heroLeagueMetric];heroLeagueStat=category?.metrics?.[0]?.key||"totalLevel";renderHeroLeague();}
  else if(a==="hero-league-stat"){heroLeagueStat=b.dataset.stat;renderHeroLeague();}
  else if(a==="open-battle-stats")openBattleStats(b.dataset.run);
  else if(a==="open-notifications")openNotifications();
  else if(a==="account")openAccount();
  else if(a==="open-auth"){closeDrawer();$("#authDialog").showModal();}
  else if(a==="assign")assignHero(b.dataset.hero,b.dataset.assignment);
  else if(a==="open-task-assignment")openTaskAssignment(b.dataset.assignment,b.dataset.task);
  else if(a==="open-hero-work-picker")openHeroWorkPicker(b.dataset.hero,b.dataset.assignment);
  else if(a==="assign-specific-task")assignSpecificTask(b.dataset.hero,b.dataset.assignment,b.dataset.task);
  else if(a==="stop-run")stopRun(b.dataset.run);
  else if(a==="watch-run"){watchedRunId=b.dataset.run;renderCombatLive(true);$("#combatBattlefield")?.scrollIntoView({behavior:"smooth",block:"start"});}
  else if(a==="toggle-party"){const max=Number(b.dataset.max);if(!b.classList.contains("selected")&&$$("#partyChoices .selected").length>=max)return toast("⚠️",`This activity allows ${max} heroes`);b.classList.toggle("selected");updateCombatPreview(b.dataset.combat);}
  else if(a==="start-run")startRun(b.dataset.combat,$$("#partyChoices .selected").map(x=>x.dataset.hero),$("#autoRepeatChoice").checked);
  else if(a==="upgrade-building")upgradeBuilding(b.dataset.building);
  else if(a==="tax-down")changeTax(-5);
  else if(a==="tax-up")changeTax(5);
  else if(a==="donate-hero")donateHeroGold(b.dataset.hero);
  else if(a==="claim-quest")claimQuest(b.dataset.quest);
  else if(a==="craft-item")craftItem(b.dataset.key);
  else if(a==="warehouse-filter"){warehouseFilter=b.dataset.filter;renderWarehouse();}
  else if(a==="equip-item")equipItem(b.dataset.item);
  else if(a==="equip-to-hero")equipItemToHero(b.dataset.item,b.dataset.hero);
  else if(a==="hatch-egg")hatchEgg(b.dataset.item);
  else if(a==="rename-hero")renameHero(b.dataset.hero);
  else if(a==="toggle-hero-rename"){const form=$("#heroRenameForm");if(form){form.hidden=!form.hidden;if(!form.hidden){const input=$("#heroNameInput");input?.focus();input?.select();}}}
  else if(a==="repair-item")repairItem(b.dataset.item);
  else if(a==="upgrade-item")upgradeItem(b.dataset.item);
  else if(a==="salvage-item" && await confirmAction("Salvage this item?","The equipment will be permanently converted into salvage materials.","🔧"))salvageItem(b.dataset.item);
  else if(a==="sell-item")openSell(b.dataset.item);
  else if(a==="open-sell")openSell();
  else if(a==="confirm-listing")createListing($("#sellItemChoice").value,$("#sellPrice").value);
  else if(a==="buy-listing")buyListing(b.dataset.listing);
  else if(a==="cancel-listing")cancelListing(b.dataset.listing);
  else if(a==="clear-reports"){state.notifications=[];markDirty();closeDrawer();renderTown();}
  else if(a==="sync"){saveLocal();if(currentUser&&firebaseApi&&cloudReconciled)await scheduleCloudSave({manual:true});else toast("⚠️","Cloud is not ready yet");}
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

let startupReleased=false;
function releaseStartup(report,failedAssets=[]){
  if(startupReleased)return;startupReleased=true;const screen=$("#loadingScreen"),app=$("#app"),text=$("#loadingText");if(text)text.textContent=failedAssets.length?"The town is ready. Remaining artwork will finish in the background.":"The town is ready.";if(app)app.hidden=false;setTimeout(()=>{screen?.classList.add("fade");setTimeout(()=>screen?.remove(),500);if(!settings.authDismissed)setTimeout(()=>$("#authDialog")?.showModal(),450);showOffline(report);},180);
}
function registerServiceWorker(){
  if(!("serviceWorker" in navigator))return;const registration=navigator.serviceWorker.register("./service-worker.js");Promise.race([registration,new Promise((_,reject)=>setTimeout(()=>reject(new Error("Service worker registration timed out")),3500))]).catch(err=>console.warn("Offline cache will retry later",err));
}
async function init(){
  let report=null;const watchdog=setTimeout(()=>{if(startupReleased)return;console.warn("Startup artwork budget reached; opening the town.");try{if(!state)state=freshState();renderAll();releaseStartup(report,["startup-time-budget"]);warmRemainingAssets();}catch(err){console.error("Startup recovery failed",err);}},9000);
  try{
    const raw=storedJSON(SAVE_KEY,null);startupHadLocalSave=!!raw;state=migrate(raw);const now=Date.now(),elapsed=Math.min(OFFLINE_LIMIT,Math.max(0,(now-(state.lastTick||now))/1000));report=simulate(elapsed,true);postOfflineProgressChat(report);lastSimulationAt=now;state.lastTick=now;saveLocal({touchUpdatedAt:false});
    initializeFirebase();registerServiceWorker();
    const failedAssets=await preloadAssetBatch(STARTUP_ASSETS,{showProgress:true,timeoutMs:3500,concurrency:6});renderAll();releaseStartup(report,failedAssets);warmRemainingAssets();
  }catch(err){
    console.error("Adventure Town startup recovered from an error",err);if(!state)state=freshState();try{renderAll();releaseStartup(report,["startup-error"]);warmRemainingAssets();}catch(renderError){console.error("Adventure Town could not render",renderError);const text=$("#loadingText");if(text)text.textContent="The town could not open. Please refresh once; your device save is still intact.";}
  }finally{clearTimeout(watchdog);}
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
