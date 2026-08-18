# Phone-only publishing checklist

1. Download and extract the Adventure Town ZIP on your phone.
2. Upload all root files to `levigrammer21/IdleDungeonAdventure`.
3. Upload `img` as the only folder.
4. Enable GitHub Pages from the repository root.
5. Add the resulting GitHub Pages host to Firebase Authentication's Authorized domains.
6. Enable Google and Email/Password authentication.
7. Paste `firestore.rules` into Firestore **Rules** and publish.
8. Create the composite index described in `firestore.indexes.json` if Firebase prompts for it.
9. Open the game, create an account, and press **Save to cloud now**.

If Google sign-in reports an unauthorized domain, add the exact GitHub Pages host in Firebase Authentication.
