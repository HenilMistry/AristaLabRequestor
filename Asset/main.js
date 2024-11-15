const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: innerWidth/2,
    y: innerHeight/2 
};

const chk_enableMoveTo = document.getElementById("enableMoveTo");
const field_moveTo = document.getElementById("moveTo");

chk_enableMoveTo.addEventListener("click",(e) => {
    field_moveTo.disabled = !chk_enableMoveTo.checked;
});

// What to do when window is resized 
addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  
    init();
});

// What to do when mousemove event is occurred 
addEventListener("mousemove",(e)=>{
    // console lines are just for testing 
    // console.log(e.x+" "+e.y);
    mouse.x = e.x;
    mouse.y = e.y;
});
  
// What to do when mouse is clicked...
addEventListener("click",(e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (ActiveTool == Tools.NODE) {
       if (NodeToolActivated != 1) {
        Nodes.push(new Node(Nodes.length, mouse.x, mouse.y, 20, "Red", c));
        ActiveTool = null;
        openNodeConfig();
       }
       NodeToolActivated = 0;
    }
});  

let Nodes, Connections;
let NodeToolActivated = 0;
let ports;
let PORT_ID = 0;

// something to be done initially, put here...
function init() {
    Nodes = [];
    Connections = [];
    ports = [];
}

// Animation Loop
function animationLoop() {
    requestAnimationFrame(animationLoop);
    c.clearRect(0, 0, canvas.width, canvas.height);

    Nodes.forEach((node)=>{
        node.update();
    });
}

init();
animationLoop();
