"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mpu9250 {
    constructor() {
        this.keys = ["gnd", "sda", "scl", "i2c"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "MPU9250",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        // @ts-ignore
        obniz.setVccGnd(null, this.params.gnd, "3v");
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);
        // @ts-ignore
        this.ak8963 = this.obniz.wired("Ak8963", { i2c: this.i2c });
        // @ts-ignore
        this.mpu6500 = this.obniz.wired("MPU6500", { i2c: this.i2c });
        this.mpu6500.bypassMagnetometerWait();
        this.obniz.wait(500);
    }
}
exports.Mpu9250 = Mpu9250;
