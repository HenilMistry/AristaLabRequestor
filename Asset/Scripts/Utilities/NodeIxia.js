// Changed this on 26th Dec.
// Removed Ports from Ixia moving for central management --> in connection.
class Ixia {
    // Identification Number...
    #id = undefined;

    constructor(alias, location) {
        // Assign random, unique ID to this object...
        this.#id = this.#generateUniqueID();
        // Get the varibles...
        this.alias = alias;
        this.location = location;
    }

    getID() {
        return this.#id;
    }

    /**
     * This function will assign the random ID to each and every object of type Ixia
     * 
     * @returns Randome and Unique ID String...
     */
    #generateUniqueID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
    }
} 