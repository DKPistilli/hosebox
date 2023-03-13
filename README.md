<h3 align='center'> Welcome to... </h3>
<br>
<p align="center">
    <img src="https://user-images.githubusercontent.com/8059632/221677261-528c2ae4-a199-4fff-92a5-bdeab8bfb812.jpeg" />
    <h1 align='center'> hosebox.net </h1>
    <h3 align='center'> The official deckbuilding and inventory-management application for the competitors of the Meadow Lane: Magic the Gathering (MLMTG) league. </h3>
</p>

<p align='center'> Unlike other Magic: The Gathering deckbuilding and inventory-management sites, hosebox has a host of wonderful features -- designed specifically for ML:MTG competitors -- that it provides free of charge, alongide help from the Scryfall API and the Hosebot discord bot (who happens to be hosebox's #1 pal in the world...)</p>

## Features
That's right, folks -- hosebox and hosebot are teaming up, allowing MLMTG Wizards to...
- Create and manage decklists, sideboards, and scratchpads, all free of charge.
- Manage privacy for each individual decklist, allowing Wizards to display public decks (e.g. playoff lists) while leaving the rest of their decks safe from Goose and Gavin's prying eyes. Massively, this removes the need to maintain multiple deckbox accounts and inventories.
- Generate random reward (!reward) cards/packs via Discord (!reward), post those rewards, then have those rewards auto-added to the correct wizard's inventory.
- Initiate trades via Discord (!trade), generate/post correct trade image, then auto-update both wizard's inventories to reflect the trade.
- Submit decklists via Discord (!submit), taking each wizard's OFFICIAL DECKLIST and emailing it to the official MLMTG email account for record-keeping. No more late decklists!
- View the current season's MLMTG schedules, records, and standings.

## To-Do (Car (Bicycle (Skateboard)))

### Back End

- [ ] Decks
    - [X] design deckSchema and corresponding api calls. Big Question: how to structure mainboard/sideboard/scratchpad (needs privateList option! don't forget).
    - [ ] implement decks model, router, and controller
- [ ] Users
    - [ ] Validate username (no weird chars, no spaces)
    - [ ] Add user GET func which returns username and (public) decks
    - [ ] Add FOLLOWING [{name, userId}] so users can follow others
- [ ] update api to NO LONGER USE CARDIDS, instead taking cardNames, then using middleware to go from name -> cardId
- [X] inventoryCards
    - [X] design inventoryCardSchema model (what card info is needed on our server) and corresponding api calls
    - [X] implement inventoryCard model, router, and controller
- [X] scryfallCards
    - [X] design local scryfall DB and corresponding api (non-http, local server requests only). 
    - [X] implement scryfallCard model, router, and controller, so that all card information is blackboxed from the front end -- they send cardId, they get a full card, and never need to know about implementation or what extra fields we're removing from the actual scryfall.com card schema.
- [ ] \(potential) add userInventory to User with array of first 50 cards (true scryfall card objects, not pointers) so init inventory doesn't require a scryfall api call
- [ ] \(potential) add some sort of LeagueModel which stores season, standings (all manually updated??), and like..."about"? So that I can add some of the flavor currently relegated to challonge.com

### Front End
- [ ] Inventory
    - [X] implement <Inventory /> component which queries our server for cardIds
    - [X] implement <Sidebar /> component which has a button to view <Inventory />, <Wishlist />, <Decks />
    - [ ] Create file structure for Sidebar so that decks can display down the sidebar (and scroll)
    - [ ] implement <Decks /> component which grabs all decks w/ userId and lists them on left sidebar. Clicking navs to hosebox.net/decks/:deckId
- [ ] Register
    - [X] Hide passwords
    - [ ] Validate username (no weird chars, no spaces)
- [ ] Deckview
    - [ ] design and implement <Deckview /> page/component, which is GUI for user to view/edit their decklists
    - [ ] mainboard/sideboard/scratchpad
- [ ] Fix Toast not displaying err messages correctly
- [ ] \(potential) add "League" to front-end
    - [ ] create "/league" page and add League button to <Header/>
    - [ ] create some sort of league schedule-view and/or standings-view.
    - [ ] write and display some sort of flavor about the history of the league?
- [X] Add hosebot and generate mock "Welcome" landing index
- [X] make the to-do list lol


