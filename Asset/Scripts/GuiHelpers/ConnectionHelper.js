class ConnectionHelper {
    constructor(nodeA, nodeB, context) {
        this.a = nodeA;
        this.b = nodeB;
        this.c = context;
        this.strokeColor = "Black";
        this.DutPorts = [];
        this.IxiaPort;
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

    static getDutToIxiaConnections() {
        // DUT - TO - IXIA Connection
        // example : lyd592-Et24/1---------100G---------------dm1-rack107-ixia1 - Port 5/5
        let finalString = "";
        Connections.forEach((connection) => {
            if(connection.IxiaPort != null) { // DUT - TO - DUT 
                if(connection.a.NodeProperties instanceof Dut) {
                    finalString += connection.a.NodeProperties.alias+"-"+connection.DutPorts[0].identifier+"----------"+connection.DutPorts[0].speed+"----------"+connection.b.NodeProperties.location+"-"+connection.IxiaPort.identifier+"\n";
                } else {
                    finalString += connection.b.NodeProperties.alias+"-"+connection.DutPorts[0].identifier+"----------"+connection.DutPorts[0].speed+"----------"+connection.a.NodeProperties.location+"-"+connection.IxiaPort.identifier+"\n";
                }
            }
        });
        return finalString;
        
    }

    static getDutToDutConnections() {
        // DUT - TO - DUT Connection
        // example : smd420-Et33/1-------------400G------------Et3/1/1-cmp338
        let finalString = "";
        Connections.forEach((connection) => {
            if(connection.IxiaPort == null) { // DUT - TO - DUT 
                finalString += connection.a.NodeProperties.alias+"-"+connection.DutPorts[0].identifier+"----------"+connection.DutPorts[0].speed+"----------"+connection.DutPorts[1].identifier+"-"+connection.b.NodeProperties.alias+"\n";
            }
        });
        return finalString;

    }
}