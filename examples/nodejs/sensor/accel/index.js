const M5Stack = require("m5stackjs");

let m5 = new M5Stack('OBNIZ_ID_HERE');

console.log("connecting");
m5.onconnect = async function () {
  console.log("connected");

  m5.setupIMU();
  while(1) {
    let data = await m5.accelerationWait();
    Object.keys(data).map(function(key, index) {
      data[key] = data[key].toFixed(2);
    });

    console.log(data);
  }

};
