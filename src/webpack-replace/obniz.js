
let obniz;
if (typeof Obniz !== "undefined") {
    obniz = Obniz;
} else {
    obniz = window.Obniz;
}

module.exports=obniz;
