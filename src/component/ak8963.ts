import Obniz = require("obniz");
import {I2C} from "obniz/obniz/libs/io_peripherals/i2c";

export class AK8963 {
    public keys = ['gnd', 'sda', 'scl', 'i2c'];
    public requiredKeys = [];
    private obniz?:Obniz;

    private params:any;
    private i2c?:I2C;

    private address = 0x0c;
    private commands = {
        whoami : 0x00,
        whoami_results : 0x48,
    };



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
    }


    public async whoamiWait(){
        this.i2c!.write(this.address, [this.commands.whoami]);
        return await this.i2c!.readWait(this.address, 1)
    }




    private char2short(values: [number, number]): number {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, values[0]);
        dv.setUint8(1, values[1]);
        return dv.getInt16(0, false );
    }
}