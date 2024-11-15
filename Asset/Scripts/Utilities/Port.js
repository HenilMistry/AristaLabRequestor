class Port {
    constructor(id, identifier, speed) {
        this.id = id;
        this.identifier = identifier;
        this.speed = speed;
        this.used = false;
    }

    toString() {
        return this.identifier + " - " + this.speed;
    }
}