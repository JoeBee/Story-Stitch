import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PenNameGeneratorService {

    private readonly adjectives: string[] = [
        "Silver", "Mystic", "Crimson", "Whispering", "Bold", "Silent", "Golden", "Iron",
        "Vagrant", "Ancient", "Azure", "Blazing", "Charming", "Daring", "Elegant", "Fierce",
        "Gentle", "Hollow", "Inky", "Jaded", "Keen", "Luminous", "Misty", "Noble",
        "Opal", "Phantom", "Quaint", "Rustic", "Serene", "Timeless", "Unseen", "Vivid",
        "Winding", "Xenon", "Yielding", "Zephyr"
    ];

    private readonly nounsNatureObjects: string[] = [
        "Willow", "Stone", "Raven", "Brook", "Ink", "Quill", "Oak", "River",
        "Star", "Moon", "Sun", "Cloud", "Forest", "Mountain", "Ocean", "Desert",
        "Pearl", "Crystal", "Shadow", "Flame", "Echo", "Whisper", "Leaf", "Petal",
        "Dew", "Frost", "Glimmer", "Harbor", "Island", "Jewel", "Kite", "Lantern",
        "Meadow", "Nightingale", "Orchid", "Pebble", "Quasar", "Rose", "Stream", "Thorn",
        "Urchin", "Valley", "Wave", "Xylos", "Yew", "Zenith"
    ];

    private readonly nounsOccupationsRoles: string[] = [
        "Scribe", "Warden", "Bard", "Seeker", "Pilot", "Weaver", "Hunter", "Scholar",
        "Alchemist", "Apprentice", "Artisan", "Chronicler", "Dreamer", "Enchanter", "Explorer",
        "Guardian", "Herbalist", "Innovator", "Jester", "Knight", "Librarian", "Magician",
        "Navigator", "Oracle", "Poet", "Ranger", "Sage", "Tailor", "Voyager", "Watcher",
        "Zealot"
    ];

    private readonly fictionalMythological: string[] = [
        "Glimmer", "Shadow", "Ember", "Phoenix", "Dragon", "Cipher", "Specter", "Echo",
        "Griffin", "Chimera", "Basilisk", "Unicorn", "Sphinx", "Hydra", "Centaur", "Faerie",
        "Goblin", "Sprite", "Titan", "Valkyrie", "Werewolf", "Yeti", "Zombie", "Wraith",
        "Seraph", "Djinn", "Nymph", "Golem", "Kraken", "Leviathan", "Manticore", "Ogre",
        "Pixie", "Roc", "Siren", "Troll", "Vampire", "Warlock", "Wyvern", "Zeus"
    ];

    constructor() { }

    /**
     * Generates a random pen name based on predefined word lists and patterns.
     * The function randomly selects a pattern and then picks words from the
     * appropriate categories to form a unique pen name.
     */
    generateRandomPenName(): string {
        // Define possible naming patterns as an array of functions.
        // Each function returns a string combining random words from the lists.
        const patterns = [
            () => `${this.getRandomElement(this.adjectives)} ${this.getRandomElement(this.nounsNatureObjects)}`,
            () => `${this.getRandomElement(this.nounsNatureObjects)} ${this.getRandomElement(this.nounsOccupationsRoles)}`,
            () => this.getRandomElement(this.adjectives), // Single adjective
            () => this.getRandomElement(this.nounsNatureObjects), // Single nature/object noun
            () => `${this.getRandomElement(this.adjectives)} ${this.getRandomElement(this.fictionalMythological)}`,
            () => `${this.getRandomElement(this.nounsNatureObjects)} ${this.getRandomElement(this.fictionalMythological)}`,
            () => `${this.getRandomElement(this.fictionalMythological)} ${this.getRandomElement(this.nounsOccupationsRoles)}`,
            () => `${this.getRandomElement(this.adjectives)} ${this.getRandomElement(this.nounsOccupationsRoles)}`,
        ];

        // Randomly select one of the defined patterns
        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];

        // Execute the selected pattern to generate the pen name
        return selectedPattern();
    }

    /**
     * Helper method to get a random element from an array
     */
    private getRandomElement(array: string[]): string {
        return array[Math.floor(Math.random() * array.length)];
    }
} 