///
/// SCRYFALL CARD SCHEMA
/// Note: The official Scryfall Card Schema, matching Scryfall's API
///       which is static and should not change frequently if ever. This is essentially
///       a local scryfall server of cards, updated infrequently w/ new sets.
///       If scryfall card schema changes, it should be a simple matter of updating fields below
///       to new card model, then regrabbing/hosting cards.

const mongoose = require('mongoose');

const scryfallCardSchema = mongoose.Schema({
    "object": String,
    "id": String,
    "oracle_id": String,
    "multiverse_ids":[Number],
    "mtgo_id":Number,
    "mtgo_foil_id":Number,
    "tcgplayer_id":Number,
    "cardmarket_id":Number,
    "name":String,
    "lang":String,
    "released_at":String,
    "uri":String,
    "scryfall_uri":String,
    "layout":String,
    "highres_image":Boolean,
    "image_status":String,
    "image_uris":{
        "small":String,
        "normal":String,
        "large":String,
        "png":String,
        "art_crop":String,
        "border_crop":String,
    },
    "mana_cost":String,
    "cmc":Number,
    "type_line":String,
    "oracle_text":String,
    "colors":[String],
    "color_identity":[String],
    "card_faces":[],
    "keywords":[],
    "legalities":{
        "standard":         String,
        "future":           String,
        "historic":         String,
        "gladiator":        String,
        "pioneer":          String,
        "explorer":         String,
        "modern":           String,
        "legacy":           String,
        "pauper":           String,
        "vintage":          String,
        "penny":            String,
        "commander":        String,
        "brawl":            String,
        "historicbrawl":    String,
        "alchemy":          String,
        "paupercommander":  String,
        "duel":             String,
        "oldschool":        String,
        "premodern":        String,
        "predh":            String
    },
    "games":[String],
    "reserved":Boolean,
    "foil":Boolean,
    "nonfoil":Boolean,
    "finishes":[String],
    "oversized":Boolean,
    "promo":Boolean,
    "reprint":Boolean,
    "variation":Boolean,
    "set_id":String,
    "set":String,
    "set_name":String,
    "set_type":String,
    "set_uri":String,
    "set_search_uri":String,
    "scryfall_set_uri":String,
    "rulings_uri":String,
    "prints_search_uri":String,
    "collector_number":String,
    "digital":Boolean,
    "rarity":String,
    "flavor_text":String,
    "card_back_id":String,
    "artist":String,
    "artist_ids":[String],
    "illustration_id":String,
    "border_color":String,
    "frame":String,
    "full_art":Boolean,
    "textless":Boolean,
    "booster":Boolean,
    "story_spotlight":Boolean,
    "edhrec_rank":Number,
    "prices":{
        "usd":String,
        "usd_foil":String,
        "usd_etched":String,
        "eur":String,
        "eur_foil":String,
        "tix":String
    },
    "related_uris":{
        "gatherer":String,
        "tcgplayer_infinite_articles":String,
        "tcgplayer_infinite_decks":String,
        "edhrec":String,
    },
});

module.exports = mongoose.model('ScryfallCard', scryfallCardSchema);