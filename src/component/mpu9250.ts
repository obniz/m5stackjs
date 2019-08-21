import Obniz = require("obniz");
import {I2C} from "obniz/obniz/libs/io_peripherals/i2c";
import {Ak8963} from "./ak8963";
import {Mpu6500} from "./mpu6500";

export class Mpu9250 {

    public static info() {
        return {
            name: "MPU9250",
        };
    }
    public keys = ["gnd", "sda", "scl", "i2c"];
    public requiredKeys = [];
    public mpu6500?: Mpu6500;
    public ak8963?: Ak8963;
    private obniz?: Obniz;

    private params: any;
    private i2c?: I2C;

    public wired(obniz: Obniz) {
        this.obniz = obniz;

        // @ts-ignore
        obniz.setVccGnd(null, this.params.gnd, "3v");

        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";

        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);

        // @ts-ignore
        this.ak8963 = this.obniz.wired("Ak8963", {i2c: this.i2c});

        // @ts-ignore
        this.mpu6500 = this.obniz.wired("MPU6500", {i2c: this.i2c});
        this.mpu6500!.bypassMagnetometerWait();

        this.obniz.wait(500);
    }

}
