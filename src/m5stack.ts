import Obniz from "obniz";

import {Button} from "obniz/parts/MovementSensor/Button";
import {M5Display} from "./component/m5display";

import {I2C} from "obniz/obniz/libs/io_peripherals/i2c";
import {IO} from "obniz/obniz/libs/io_peripherals/io";
import {Ak8963} from "./component/ak8963";
import {Mpu6500, Xyz} from "./component/mpu6500";
import {Mpu9250} from "./component/mpu9250";

// @ts-ignore
Obniz.PartsRegistrate(Ak8963);
// @ts-ignore
Obniz.PartsRegistrate(Mpu6500);
// @ts-ignore
Obniz.PartsRegistrate(Mpu9250);

export class M5Stack extends Obniz {

    public m5display?: M5Display;
    public buttonA?: Button;
    public buttonB?: Button;
    public buttonC?: Button;

    // auto assign
    public io12?: IO;
    public io13?: IO;
    public io14?: IO;
    public io15?: IO;
    public io16?: IO;
    public io17?: IO;
    public io18?: IO;
    public io19?: IO;
    public io21?: IO;
    public io22?: IO;
    public io23?: IO;
    public io25?: IO;
    public io26?: IO;
    public io27?: IO;
    public io32?: IO;
    public io33?: IO;
    public io34?: IO;
    public io35?: IO;
    public io36?: IO;
    public io39?: IO;

    public m5i2c?: I2C;
    private mpu9250?: Mpu9250;
    private hasIMU: boolean = false;

    constructor(id: string, options?: any) {
        super(id, options);

    }

    public _prepareComponents() {

        // @ts-ignore
        super._prepareComponents();

        const i2cParams = {sda: 21, scl: 22, clock: 100000, pull: "3v", mode: "master"};
        this.m5display = new M5Display(this);

        // @ts-ignore
        this.m5i2c = this.getI2CWithConfig(i2cParams);

        this.buttonA = this.wired("Button", {signal: 39});
        this.buttonB = this.wired("Button", {signal: 38});
        this.buttonC = this.wired("Button", {signal: 37});

        const keys = [
            "m5display",
            "buttonA",
            "buttonB",
            "buttonC",
        ];

        for (const key of keys) {
            // @ts-ignore
            this._allComponentKeys.push(key);

            // @ts-ignore
            if (this[key] && !this[key]._reset) {

                // @ts-ignore
                this[key]._reset = () => {
                    return;
                };
            }
        }

    }

    public setupIMU() {
        // @ts-ignore
        this.mpu9250 = this.wired("MPU9250", {i2c: this.m5i2c});
        // @ts-ignore
        this._allComponentKeys.push("MPU9250");
        this.hasIMU = true;
    }

    public gyroWait(): Promise<Xyz> {
        if (!this.hasIMU) {
            throw new Error("gyroWait is supported only M5stack gray. If this device is, please call setupIMU().");
        }
        return this.mpu9250!.mpu6500!.gyroWait();
    }

    public accelerationWait(): Promise<Xyz> {
        if (!this.hasIMU) {
            throw new Error(
                "accelerationWait is supported only M5stack gray. If this device is, please call setupIMU().",
            );
        }
        return this.mpu9250!.mpu6500!.accelerationWait();
    }

}
