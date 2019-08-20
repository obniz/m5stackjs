import Obniz = require("obniz");
import {I2C} from "obniz/obniz/libs/io_peripherals/i2c";

export class AK8963 {
    public keys = ['gnd', 'sda', 'scl', 'i2c'];
    public requiredKeys = [];
    private obniz?:Obniz;

    private params:any;
    private i2c?:I2C;


    public static info() {
        return {
            name: 'AK8963',
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

        this.obniz.wait(500);
    }


}