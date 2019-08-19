import Obniz from "obniz";

import {Button} from "obniz/parts/MovementSensor/Button";
import {M5Display} from "./component/m5display";

export class M5Stack extends Obniz {

    public m5display?: M5Display;
    public buttonA?: Button;
    public buttonB?: Button;
    public buttonC?: Button;

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
        ]

        for(let key of keys){
            // @ts-ignore
            this._allComponentKeys.push(key);

        }

    }

}
