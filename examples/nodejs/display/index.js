const M5Stack = require("m5stackjs");

let m5 = new M5Stack('OBNIZ_ID_HERE');

console.log("connecting");

m5.onconnect = async ()=> {
  console.log("connected");
  await m5.m5display.onWait();
  m5.m5display.print("Hello,world.");
  m5.m5display.print("This text show from browser.","yellow");
  m5.m5display.print("こんにちは");
  m5.m5display.print("안녕하세요");


  m5.m5display.font('Avenir',30);
  m5.m5display.print("Avenir");


  m5.m5display.font('Noteworthy',40);
  m5.m5display.print("Noteworthy","#FF0000")

}