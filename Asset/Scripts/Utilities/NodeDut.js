const NO_MOVETO = "DO NOT MOVE";
class Dut {
    constructor(alias, location, movement) {
        this.alias = alias;
        this.location = location;
        this.movement = movement;
    }
    
    static get NO_MOVETO() {
        return NO_MOVETO;
    }
}