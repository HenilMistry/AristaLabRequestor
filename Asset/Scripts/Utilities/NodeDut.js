const NO_MOVETO = "NO MOVEMENT";
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