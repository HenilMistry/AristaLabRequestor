class ConnectionHelper {
    constructor(nodeA, nodeB, context, portsList) {
        this.c = context;
        this.strokeColor = "Black";
        this.connectionProperties = new Connection(nodeA, nodeB, portsList);
    }

    draw() {
        this.c.beginPath();
        this.c.setLineDash([]);
        this.c.strokeStyle = this.strokeColor;
        this.c.lineWidth = 5;
        this.c.moveTo(this.connectionProperties.nodeA.x,this.connectionProperties.nodeA.y);
        this.c.lineTo(this.connectionProperties.nodeB.x,this.connectionProperties.nodeB.y);
        this.c.stroke();
        this.c.closePath();
    }

    update() {
        this.draw();
    }

    static getDutToIxiaConnections() {
        // DUT - TO - IXIA Connection
        // example : lyd592-Et24/1---------100G---------------dm1-rack107-ixia1 - Port 5/5
        let finalString = "";
        Connections.forEach((connection) => {
            if(connection.connectionProperties.nodeA.NodeProperties instanceof Ixia || connection.connectionProperties.nodeB.NodeProperties instanceof Ixia) {
                // either one of a node is ixia ...
                finalString += connection.connectionProperties.getConnections();
            }
        });
        return finalString;
        
    }

    static getDutToDutConnections() {
        // DUT - TO - DUT Connection
        // example : smd420-Et33/1-------------400G------------Et3/1/1-cmp338
        let finalString = "";
        Connections.forEach((connection) => {
            if(connection.connectionProperties.nodeA.NodeProperties instanceof Dut && connection.connectionProperties.nodeB.NodeProperties instanceof Dut) {
                finalString += connection.connectionProperties.getConnections();
            }
        });
        return finalString;

    }
}