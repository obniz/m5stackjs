import Obniz = require("obniz");
import {I2C} from "obniz/obniz/libs/io_peripherals/i2c";
import {MPU6500} from "./mpu6500";
import {AK8963} from "./ak8963";

export class MPU9250 {
    public keys = ['gnd', 'sda', 'scl', 'i2c'];
    public requiredKeys = [];
    private obniz?:Obniz;

    private params:any;
    private i2c?:I2C;
    public mpu6500?:MPU6500;
    public ak8963?:AK8963;


    public static info() {
        return {
            name: 'MPU9250',
        };
    }

    wired(obniz:Obniz) {
        this.obniz = obniz;

        // @ts-ignore
        obniz.setVccGnd(null, this.params.gnd, '3v');

        this.params.clock = 100000;
        this.params.pull = '3v';
        this.params.mode = 'master';

        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);

        //@ts-ignore
        this.ak8963 = this.obniz.wired("AK8963", {i2c:this.i2c});

        //@ts-ignore
        this.mpu6500 = this.obniz.wired("MPU6500", {i2c:this.i2c});

        this.obniz.wait(500);
    }

}