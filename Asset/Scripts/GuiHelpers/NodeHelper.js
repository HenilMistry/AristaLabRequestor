let defaultImg_NodeDut = new Image();
defaultImg_NodeDut.src = "./Asset/Icons/DutImg.png";
let defaultImg_NodeIxia = new Image();
defaultImg_NodeIxia.src = "./Asset/Icons/IxiaImg.png";

// A class for rendering the node for graph on canvas 
class Node {
    constructor(label,x,y,radius,color,context) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.c = context;
        this.NodeProperties;
        this.selected = false;
    }

    getJSON() {
        return {
            label: this.label,
            x: this.x,
            y: this.y,
            radius: this.radius,
            color: this.color,
            nodeProperties: this.NodeProperties.getJSON()
        };  
    }
    
    draw() {
        // basic start point of drawing...
        this.c.save();
        this.c.beginPath();
        // first of all setting the style of fonts...
        this.c.font = 'bold italic 18px Arial';
        this.c.fillStyle = this.color;

        // highlighting for selection of node...
        if (this.selected) {
            this.c.shadowColor = "Red";
            this.c.shadowBlur = 20;
        } else {
            this.c.shadowColor = null;
        }

        // drawing image if selected from setting...
        if (settingsObj.canvasUtilities.isEnabled && settingsObj.canvasUtilities.customNodeDut.isEnabled && this.NodeProperties instanceof Dut) {
            // condition 1 - if canvas utilities is enabled
            // condition 2 - if custom node dut is enabled
            // condition 3 - this node is type of dut
            defaultImg_NodeDut = new Image();
            defaultImg_NodeDut.src = settingsObj.canvasUtilities.customNodeDut.url;
            this.c.drawImage(defaultImg_NodeDut, this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
        } else if (settingsObj.canvasUtilities.isEnabled && settingsObj.canvasUtilities.customNodeIxia.isEnabled && this.NodeProperties instanceof Ixia) {
            defaultImg_NodeIxia = new Image();
            defaultImg_NodeIxia.src = settingsObj.canvasUtilities.customNodeIxia.url;
            this.c.drawImage(defaultImg_NodeIxia, this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
        } else {
            // drawing default node...
            this.c.arc(this.x,this.y,this.radius,Math.PI*2,false);
            this.c.fill();
        }

        this.c.fillStyle = "Black";
        this.c.fillText(this.label,this.x,this.y);
        this.c.closePath();
        this.c.restore();
    }

    select(selected) {
        this.selected = selected;
    }

    animate(fillColor) {
        this.color = fillColor;
        this.draw();
    }

    update() {
        this.draw();
    }

    paint(fillColor) {
        this.animate(fillColor);
    }

    getNodePortableLocation() {
        // example : cmp257 - dm1-rack118-tb10
        return this.NodeProperties.alias + " - " + this.NodeProperties.location;
    }

    getNodeMovement() {
        // only applicable to DUTs
        // example : sdm454 - MOVE TO dm1-rack111-tb31
        // example : gla358 - DO NOT MOVE
        if (this.NodeProperties instanceof Dut) {
            if (this.NodeProperties.movement == Dut.NO_MOVETO) {
                return this.NodeProperties.alias + " - " + this.NodeProperties.movement+"\n";
            } else {
                return this.NodeProperties.alias + " - MOVE TO " + this.NodeProperties.movement+"\n";
            }
        } else {
            return "";
        }
    }
}