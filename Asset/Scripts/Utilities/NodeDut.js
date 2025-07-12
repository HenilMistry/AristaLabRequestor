const NO_MOVETO = "DO NOT MOVE";
class Dut {
    // Identification Number...
    #id = undefined;

    constructor(alias, location, movement) {
        // Assign the random, unique ID to this object...
        this.#id = this.#generateUniqueID();
        // Get the values of variables...
        this.alias = alias;
        this.location = location;
        this.movement = movement;
    }

    getID() {
        return this.#id;
    }

    getJSON() {
        return {
            id: this.#id,
            alias: this.alias,
            location: this.location,
            movement: this.movement
        };
    }

    /**
     * This function will assign the random ID to each and every object of type Dut
     * 
     * @returns Randome and Unique ID String...
     */
    #generateUniqueID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
    }
    
    static get NO_MOVETO() {
        return NO_MOVETO;
    }
}