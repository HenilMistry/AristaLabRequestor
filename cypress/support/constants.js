export const points = Object.freeze({
    a: {
        x: 300,
        y: 300
    },
    b: {
        x: 500,
        y: 300
    },
    c: {
        x: 400,
        y: 500
    }
});

export const nodes = Object.freeze({
        node_one: {
            x: points.a.x,
            y: points.a.y,
            type: "DUT",
            alias: "node-one",
            location: "surat",
            moveto: "blr"
        },
        node_two: {
            x: points.b.x,
            y: points.b.y,
            type: "IXIA",
            alias: "node-two",
            location: "blr",
            moveto: false
        },
        node_three: {
            x: points.c.x,
            y: points.c.y,
            type: "DUT",
            alias: "node-three",
            location: "blr",
            moveto: false
        }
    });