class ConnectionHelper {
    constructor(nodeA, nodeB, context) {
        this.a = nodeA;
        this.b = nodeB;
        this.c = context;
        this.strokeColor = "Black";
    }

    draw() {
        this.c.beginPath();
        this.c.setLineDash([]);
        this.c.strokeStyle = this.strokeColor;
        this.c.lineWidth = 5;
        this.c.moveTo(this.a.x,this.a.y);
        this.c.lineTo(this.b.x,this.b.y);
        this.c.stroke();
        this.c.closePath();
    }

    update() {
        this.draw();
    }
}