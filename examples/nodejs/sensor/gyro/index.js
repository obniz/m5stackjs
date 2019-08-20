const M5Stack = require("../../../../dist/index"); //replace to require("m5stackjs")

let m5 = new M5Stack('01067965');

console.log("connecting");
m5.onconnect = async function () {
  console.log("connected");

  m5.setupIMU();
  while(1) {
    let data = await m5.gyroWait();
    Object.keys(data).map(function(key, index) {
      data[key] = data[key].toFixed(2);
    });

    console.log(data);
  }

};
