import Obniz = require("obniz");
import {I2C} from "obniz/obniz/libs/io_peripherals/i2c";

export type accelScale = "2g" | "4g" | "8g" | "16g";
export type gyroScale = "250dps" | "500dps" | "1000dps" | "2000dps";

export class MPU6500 {
    public keys = ['gnd', 'sda', 'scl', 'i2c'];
    public requiredKeys = [];
    private obniz?:Obniz;

    private params:any;
    private i2c?:I2C;

    private address = 0x68;

    private commands = {
        whoami : 0x75,
        whoami_results : 0x71,

        int_pin_config : 0x37,

        accel_x_h : 0x3b,
        accel_x_l : 0x3c,
        accel_y_h : 0x3d,
        accel_y_l : 0x3e,
        accel_z_h : 0x3f,
        accel_z_l : 0x40,

        gyro_x_h: 0x43,
        gyro_x_l: 0x44,
        gyro_y_h: 0x45,
        gyro_y_l: 0x46,
        gyro_z_h: 0x47,
        gyro_z_l: 0x48,

    };

    private intPinConfigMask ={
        "bypass_en" : 0b00000010,
    }


    private settingParams = {
        accel :{
            so : {
                "2g" : 16384,  // 1 / 16384 ie. 0.061 mg / digit
                "4g" : 8192,   //  1 / 8192 ie. 0.122 mg / digit
                "8g" : 4096,   // 1 / 4096 ie. 0.244 mg / digit
                "16g" : 2048,  // 1 / 2048 ie. 0.488 mg / digit
            },
            m_s2 : 9.80665,
            g : 1,
        },
        gyro : {
            so : {
                "250dps" : 131,
                "500dps" : 62.5,
                "1000dps" : 1000,
                "2000dps" : 16.4,
            },
            deg :  1,
            rad :  57.295779578552 //1 rad/s is 57.295779578552 deg/s
        }
    };

    private accel_so :accelScale =   "2g";
    private gyro_so :gyroScale =   "250dps";


    public static info() {
        return {
            name: 'MPU6500',
        };
    }

    public wired(obniz:Obniz) {
        this.obniz = obniz;

        // @ts-ignore
        obniz.setVccGnd(null, this.params.gnd, '3v');

        this.params.clock = 100000;
        this.params.pull = '3v';
        this.params.mode = 'master';

        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);



    }

    public async bypassMagnetometerWait(){
        // Enable I2C bypass to access for MPU9250 magnetometer access.
        this.i2c!.write(this.address, [this.commands.int_pin_config]);
        let data =  await this.i2c!.readWait(this.address, 1)

        data[0] |= this.intPinConfigMask.bypass_en;

        this.i2c!.write(this.address, [this.commands.int_pin_config, data[0]]);
    }


    public async whoamiWait(){
        this.i2c!.write(this.address, [this.commands.whoami]);
        return await this.i2c!.readWait(this.address, 1)
    }

    public async gyroWait(): Promise<{x:number,y:number,z:number}>{
        this.i2c!.write(this.address, [this.commands.gyro_x_h]);
        let data =  await this.i2c!.readWait(this.address, 6) as number[];
        const {gyro} = this.settingParams;
        let scale = gyro.deg / gyro.so[this.gyro_so];

        return {
            x : this.char2short(data.slice(0,2) as [number,number]) * scale,
            y : this.char2short(data.slice(2,4) as [number,number]) * scale,
            z : this.char2short(data.slice(4,6) as [number,number]) * scale,
        }

    }

    public async accelerationWait() : Promise<{x:number,y:number,z:number}>{
        this.i2c!.write(this.address, [this.commands.accel_x_h]);
        let data =  await this.i2c!.readWait(this.address, 6) as number[];

        const {accel} = this.settingParams;
        let scale = accel.m_s2 / accel.so[this.accel_so];

        return {
            x : this.char2short(data.slice(0,2) as [number,number]) * scale,
            y : this.char2short(data.slice(2,4) as [number,number]) * scale,
            z : this.char2short(data.slice(4,6) as [number,number]) * scale,
        }

    }

    private char2short(values: [number, number]): number {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, values[0]);
        dv.setUint8(1, values[1]);
        return dv.getInt16(0, false );
    }


}