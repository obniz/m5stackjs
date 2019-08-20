const M5Stack = require("m5stackjs");

let m5 = new M5Stack('OBNIZ_ID_HERE');

console.log("connecting");

m5.onconnect = async ()=> {
  console.log("connected");

  m5.buttonA.onchange = (state) => {
    console.log("buttonA :"  + (state ? "pushed" : "released"));
  }

  m5.buttonB.onchange = (state) => {
    console.log("buttonB :"  + (state ? "pushed" : "released"));
  }

  m5.buttonC.onchange = (state) => {
    console.log("buttonC :"  + (state ? "pushed" : "released"));
  }
}