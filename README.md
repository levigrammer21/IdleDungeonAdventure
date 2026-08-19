# Adventure Town

Adventure Town is a mobile-first, persistent idle RPG built around six permanent adventurers who are both the player's heroes and workforce.

## Included systems

- Hand-painted responsive fantasy town map in portrait and landscape
- Six fixed classes with custom portraits: Warrior, Wizard, Archer, Druid, Assassin, and Summoner
- Per-hero Combat Level on a steep OSRS/Melvor-shaped curve, plus independent Farming, Mining, Woodcutting, and Smithing levels
- Every Combat Level directly improves class-weighted Attack, Defence, Max HP, and Max Hit
- Compact hero command sheets with inline renaming, combat identity, work skills, equipment, and narrative career timelines
- Timed work, room-by-room combat, recovery, and supplies with exact active-run restoration and a 12-hour offline progress cap
- Four-hero combat cap with 6 Expeditions, 5 solo/duo Dungeons, and 3 four-person Raids
- Live HP combat with Melee/Ranged/Magic identities, a two-way ±25% combat triangle, individual attack timers, critical hits, class actions, enemy retaliation, healing, and per-hero damage analytics
- Three enemies in every Expedition; three shared enemies plus a unique boss in every Dungeon; fully unique Raid enemies and bosses
- Raid Woodcutting, Farming, Mining, and Smithing obstacle rooms whose duration is driven by the party's real work levels
- Party previews showing max hit, estimated DPS, Defence, real room lists, and estimated clear time—there is no pass/fail roll
- Clickable loot chests with exact reward ranges and per-victory drop rates
- Eight discrete named items each for food, metal, and wood from Starter through Divine; there is no generic-resource conversion
- Complete eight-tier normal equipment progression for every class: Starter through Divine recipes use their exact matching metal and wood, with Smithing and Blacksmith requirements enforced
- Per-hero task selection so workers stay on the exact unlocked resource tier chosen by the player
- Persistent live-styled party chat with distinct voices for all six heroes, conversational replies, map speech, and real hooks for assignments, exact tasks, outdated work tiers, level gains, unlocks, milestones, combat danger, food shortages, victories, rare finds, broken gear, building upgrades, and offline progress
- Tavern stock diversion with three volatile fantasy companies, persistent/offline quotes, whole-share trading, portfolio P/L, and live sparkline charts
- Procedural, user-toggleable sound cues for interface actions, chat, combat, levels, loot, victories, and tavern trading—no external audio files required
- A private Heroes' League with four sortable metrics and compact work-skill charts
- Named Warehouse meals with explicit HP values that heroes auto-eat below 45% HP, plus exact-material crafting, Sanity, defeat, Inn, Tavern, durability, repairs, Essence, and Raid Keys
- Complete, individually named 12-item class sets in every Dungeon and Raid, with transparent rare-table rates
- Account-bound pets, raid-boss eggs, Dungeon trinkets, equipping, repairs, and salvage
- Firebase Google and email/password accounts with cloud saves
- Firestore player marketplace, delayed seller payouts, and leaderboards
- Building upgrades, milestones, town reports, save export, and installable PWA support

The visible game version is `1.6.0`.

New towns begin with zero Gold, meals, ores, woods, Essence, Raid Keys, and Repair Kits. Existing named stacks are preserved; use **Account → Begin a new town** to test the new starting experience.

## File layout

Every deployable file is in the repository root. `img/` is the only folder. There is no build command and no package installation.

## GitHub Pages

Upload every file and the `img` folder to the repository root. Open **Settings → Pages**, choose **Deploy from a branch**, select the default branch and `/ (root)`, then save.

## Firebase setup

The supplied `adventuretown-43666` web configuration is already in `firebase-config.js`.

1. In Firebase **Authentication → Sign-in method**, enable **Google** and **Email/Password**.
2. In **Authentication → Settings → Authorized domains**, add the GitHub Pages domain.
3. Create a Cloud Firestore database.
4. Publish `firestore.rules` and create the index described by `firestore.indexes.json`.

The Firebase API key in a web application is a public project identifier. Security comes from Firebase Authentication and Firestore Security Rules.

## Economy security note

The free-tier build supports a functional Firestore marketplace for trusted players. Combat and economy simulation run in the browser, so a determined player can manipulate their own client. Before opening a large public economy, move reward resolution, wallet changes, purchases, and leaderboard submissions into Cloud Functions on Firebase's Blaze plan.

## Custom artwork

The town map, six hero portraits, complete combat enemy roster, pets, raid eggs, all normal/Dungeon/Raid equipment and trinket art, loot chest, and the unified hand-painted map/navigation icon atlas are loaded from `img/`. Enemy artwork appears in route previews, active-run summaries, timelines, and the live battlefield. Every one of the 228 item records resolves to custom art anywhere it is shown, including old save-compatible equipment definitions.

Startup preloads the complete local art catalog behind a real progress screen. A failed image never blocks entry into the game and falls back to its interface symbol when rendered. The service worker also caches the full catalog for subsequent visits and offline play.

## Saving

- Signed-out play uses a local device save.
- Signed-in play keeps a Firebase cloud save and local fallback.
- The account panel downloads a readable JSON backup.
- Offline progress is simulated for up to 12 hours, including after a mobile browser suspends and resumes the page. Starting a combat run immediately checkpoints it; hidden-page timers cannot consume the away-time window, and freeze, page-hide, and unload lifecycle events also checkpoint synchronously. Active combat resumes from the saved room, enemy HP, hero HP, attack timers, and cycle state.
- The return report audits each saved route with clears, kills, continuation/stop reason, and exact Combat XP per participating hero, alongside chest rewards and town production.

## Smithing progression

The Blacksmith exposes the full normal weapon-and-armor ladder for all six classes. Starter recipes begin at Smithing 1 and Blacksmith 1; Weak, Average, Good, Great, Epic, Legendary, and Divine tiers unlock against the same established skill/building thresholds as their exact Mining and Woodcutting materials. Existing Starter and Good equipment keys are retained so older saves, equipped items, and market listings remain valid.
