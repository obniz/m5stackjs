import Obniz from "obniz";

import {Button} from "obniz/parts/MovementSensor/Button";
import {M5Display} from "./component/m5display";

import {AK8963} from "./component/ak8963";
import {MPU6500} from "./component/mpu6500";
import {MPU9250} from "./component/mpu9250";
import {IO} from "obniz/obniz/libs/io_peripherals/io";
import {Display} from "obniz/obniz/libs/embeds/display";


// @ts-ignore
Obniz.PartsRegistrate(AK8963);
// @ts-ignore
Obniz.PartsRegistrate(MPU6500);
// @ts-ignore
Obniz.PartsRegistrate(MPU9250);

export class M5Stack extends Obniz {

    public m5display?: M5Display;
    public buttonA?: Button;
    public buttonB?: Button;
    public buttonC?: Button;

    private mpu9250?: MPU9250;
    private hasIMU :boolean = false;


    // auto assign
    public i012?:IO;
    public i013?:IO;
    public i014?:IO;
    public i015?:IO;
    public i016?:IO;
    public i017?:IO;
    public i018?:IO;
    public i019?:IO;
    public i021?:IO;
    public i022?:IO;
    public i023?:IO;
    public i025?:IO;
    public i026?:IO;
    public i027?:IO;
    public i032?:IO;
    public i033?:IO;
    public i034?:IO;
    public i035?:IO;
    public i036?:IO;
    public i039?:IO;


    constructor(id: string, options?: any) {
        super(id, options);


    }

    public _prepareComponents() {

        // @ts-ignore
        super._prepareComponents();

        this.m5display = new M5Display(this);
        this.buttonA = this.wired("Button", {signal: 39});
        this.buttonB = this.wired("Button", {signal: 38});
        this.buttonC = this.wired("Button", {signal: 37});

        const keys = [
            "m5display",
            "buttonA",
            "buttonB",
            "buttonC",
        ];

        for(let key of keys){
            // @ts-ignore
            this._allComponentKeys.push(key);

        }

    }

    public setupIMU(){
        //@ts-ignore
        this.mpu9250 = this.wired("MPU9250", {sda: 21, scl:22});
        // @ts-ignore
        this._allComponentKeys.push("mpu9250");
        this.hasIMU = true;
    }

    public gyroWait(): Promise<{x:number,y:number,z:number}>{
        if( !this.hasIMU){
            throw new Error("gyroWait is supported only M5stack gray. If this device is, please call setupIMU().")
        }
        return this.mpu9250!.mpu6500!.gyroWait();
    }

    public accelerationWait() : Promise<{x:number,y:number,z:number}>{
        if( !this.hasIMU){
            throw new Error("accelerationWait is supported only M5stack gray. If this device is, please call setupIMU().")
        }
        return this.mpu9250!.mpu6500!.accelerationWait();
    }

}
