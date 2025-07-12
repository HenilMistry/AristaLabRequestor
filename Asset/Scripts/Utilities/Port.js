class Port {
    // Identification nuber...
    #id = undefined;

    constructor(identifierA, identifierB, speed) {
        // Assign the random id to this object when initiated...
        this.#id = this.#generateUniqueID();
        // Get the values of parameters...
        this.identifierA = identifierA;
        this.identifierB = identifierB;
        this.speed = speed;
        this.used = false;
    }

    getID() {
        return this.#id;
    }

    getJSON() {
        return {
            id: this.#id,
            identifierA: this.identifierA,
            identifierB: this.identifierB,
            speed: this.speed
        };  
    }

    toString() {
        return this.identifier + " - " + this.speed;
    }

    /**
     * This function will assign the random ID to each and every object of type Port
     * 
     * @returns Randome and Unique ID String...
     */
    #generateUniqueID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
    }
}