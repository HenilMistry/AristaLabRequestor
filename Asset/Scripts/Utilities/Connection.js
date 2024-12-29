class Connection {
    // Object Identification Number ...
    #id = undefined;
    #hasIxiaNode = undefined;
    #IxiaNodeFirst = undefined;

    constructor(nodeA, nodeB, ports) {
        this.#id = this.#generateUniqueID();
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.ports = ports;
    }

    getID() {
        return this.#id;
    }

    /**
     * This function will return connections in form of string ...
     *      Ex. nodeIdentifier-PortIdentifier=====================Speed=====================PortIdentifier-nodeIdentifier
     * 
     * @returns String of connections
     */
    getConnections() {
        let resultStr = "";
        this.ports.forEach((port) => {
            resultStr += this.nodeA.NodeProperties.alias+"-"+port.identifierA+"====================="+port.speed+"====================="+port.identifierB+"-"+this.nodeB.NodeProperties.alias+"\n";
        });
        return resultStr;
    }

    // example : dm1-rack107-ixia1 - Port 5/5 (100G)
    getIxiaPorts() {
        if(this.#hasIxiaNode==undefined) { // if this connection is not sure about Ixia Node ...
            // Below LOC will set hasIxiaNode and IxiaNode for the rest of the calls ...
            if (this.nodeA.NodeProperties instanceof Ixia) {
                this.#hasIxiaNode = true;
                this.#IxiaNodeFirst = true;
            } else if (this.nodeB.NodeProperties instanceof Ixia) {
                this.#hasIxiaNode = true;
                this.#IxiaNodeFirst = false;
            } else {
                this.#hasIxiaNode = false;
            }
        }

        // After first time called ...
        if (this.#hasIxiaNode) {
            let resultStr = "";
            if (this.#IxiaNodeFirst) {
                this.ports.forEach((port) => {
                    resultStr+=this.nodeA.NodeProperties.location+"-"+this.nodeA.NodeProperties.alias+" - "+port.identifierA+" ("+port.speed+")"+"\n";
                });
            } else {
                this.ports.forEach((port) => {
                    resultStr+=this.nodeB.NodeProperties.location+"-"+this.nodeB.NodeProperties.alias+" - "+port.identifierB+" ("+port.speed+")"+"\n";
                });
            }
            return resultStr;
        } else {
            return "";
        }
    }

    /**
     * This function will assign the random ID to each and every object of type Connection ...
     * 
     * @returns Randome and Unique ID String...
     */
    #generateUniqueID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
    }
}