# hosebox

![hoseboxSmall](https://user-images.githubusercontent.com/8059632/221676770-7817d0e9-d531-449b-9c8c-4d913f56c731.png)

An inventory-management web application designed for the "Meadow Lane: Magic the Gathering" (MLMTG) league.

Unlike other deck management sites, hosebox has a host of wonderful features that it provides, alongide its fellow robot (and best pal in the world...), hosebot.

## Features
That's right, folks -- hosebox and hosebot are teaming up, allowing MLMTG Wizards to...
- Create and manage decklists, sideboards, and scratchpads, all free of charge.
- Manage privacy for each individual decklist, allowing Wizards to display public decks (e.g. playoff lists) while leaving the rest of their decks safe from Goose and Gavin's prying eyes. Massively, this removes the need to maintain multiple deckbox accounts and inventories.
- Generate random reward (!reward) cards/packs via Discord (!reward), post those rewards, then have those rewards auto-added to the correct wizard's inventory.
- Initiate trades via Discord (!trade), generate/post correct trade image, then auto-update both wizard's inventories to reflect the trade.
- Submit decklists via Discord (!submit), taking each wizard's OFFICIAL DECKLIST and emailing it to the official MLMTG email account for record-keeping. No more late decklists!
- View the current season's MLMTG schedules, records, and standings.

## To-Do

### Back End
- [ ] inventoryCards
    - [X] design inventoryCardSchema model (what card info is needed on our server) and corresponding api calls
    - [ ] implement inventoryCard model, router, and controller
- [ ] Decks
    - [ ] design deckSchema and corresponding api calls. Big Question: how to structure mainboard/sideboard/scratchpad (needs privateList option! don't forget).
    - [ ] implement decks model, router, and controller
- [ ] \(potential) add userInventory to User with array of first 50 cards (true scryfall card objects, not pointers) so init inventory doesn't require a scryfall api call
- [ ] \(potential) add some sort of LeagueModel which stores season, standings (all manually updated??), and like..."about"? So that I can add some of the flavor currently relegated to challonge.com

### Front End
- [ ] Dashboard
    - [ ] implement <Inventory /> component which queries our server for cardIds and scryfall API to populate those Ids with information
    - [ ] implmenet <Sidebar /> component which has a button to view <Inventory />, <Wishlist />, <Deckslist />
    - [ ] implement <Deckslist /> component which grabs all decks w/ userId and lists them on left sidebar. Clicking navs to hosebox.net/decks/:deckId
- [ ] Deckview
    - [ ] design and implement <Deckview /> page/component, which is GUI for user to view/edit their decklists
    - [ ] mainboard/sideboard/scratchpad
- [ ] \(potential) add "League" to front-end
    - [ ] create "/league" page and add League button to <Header/>
    - [ ] create some sort of league schedule-view and/or standings-view.
    - [ ] write and display some sort of flavor about the history of the league?
- [X] Add hosebot and generate mock "Welcome" landing index
- [X] make the to-do list lol
