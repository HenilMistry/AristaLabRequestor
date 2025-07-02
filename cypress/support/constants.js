export const tools = Object.freeze({
    TOOL_NODE: "Node Tool",
    TOOL_CONNECTION: "Connection Tool",
    TOOL_OUTPUT: "Output Tool",
    TOOL_SETTINGS: "Settings Tool",
    TOOL_MANUAL: "User Manual",
    TOOL_ISSUE: "Report an issue",
})

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

export const ports = Object.freeze({
    port_one: {
        identifier_a: "eth1",
        identifier_b: "eth1",
        bandwidth: "10G"
    },
    port_two: {
        identifier_a: "Ethernet2",
        identifier_b: "Ethernet2",
        bandwidth: "1G"
    },
    port_three: {
        identifier_a: "e3",
        identifier_b: "e3",
        bandwidth: "100G"
    },
    port_four: {
        identifier_a: "eth4/1",
        identifier_b: "eth4/2",
        bandwidth: "10G"
    }
});