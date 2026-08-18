# Adventure Town

Adventure Town is a mobile-first, persistent idle RPG built around six permanent adventurers who are both the player's heroes and workforce.

## Included systems

- Hand-painted responsive fantasy town map in portrait and landscape
- Six fixed classes: Warrior, Wizard, Archer, Druid, Assassin, and Summoner
- Per-hero Combat Level and independent Farming, Mining, Woodcutting, and Smithing levels
- Full hero character pages with renaming, combat stats, four equipment slots, special effects, and lifetime records
- Timed work, combat, recovery, and supplies with a 12-hour offline progress cap
- Four-hero combat cap with 6 Expeditions, 5 solo/duo Dungeons, and 3 four-person Raids
- Live party previews showing exact success chance, total power, Food cost, and power-adjusted clear time
- Clickable loot chests with exact reward ranges and per-victory drop rates
- Eight tiers each of Food, Metal, and Wood from Starter through Divine
- Food, Sanity, defeat, Inn, Tavern, durability, repairs, Essence, and Raid Keys
- Complete, individually named 12-item class sets in every Dungeon and Raid, with transparent rare-table rates
- Account-bound pets, raid-boss eggs, Dungeon trinkets, equipping, repairs, and salvage
- Firebase Google and email/password accounts with cloud saves
- Firestore player marketplace, delayed seller payouts, and leaderboards
- Building upgrades, milestones, town reports, save export, and installable PWA support

The visible game version is `1.3.0`.

New towns begin with zero Gold, Food, Metal, Wood, Essence, Raid Keys, and Repair Kits. Existing saves are preserved; use **Account → Begin a new town** to test the new starting experience.

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

The game currently uses emoji and CSS illustration. Put future hero, equipment, and building files directly inside `img/`. Stable hero and item keys make it possible to add image lookups later without changing the save format.

## Saving

- Signed-out play uses a local device save.
- Signed-in play keeps a Firebase cloud save and local fallback.
- The account panel downloads a readable JSON backup.
- Offline progress is simulated for up to 12 hours.
