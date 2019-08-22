"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const obniz_1 = __importDefault(require("obniz"));
const m5display_1 = require("./component/m5display");
const ak8963_1 = require("./component/ak8963");
const mpu6500_1 = require("./component/mpu6500");
const mpu9250_1 = require("./component/mpu9250");
// @ts-ignore
obniz_1.default.PartsRegistrate(ak8963_1.Ak8963);
// @ts-ignore
obniz_1.default.PartsRegistrate(mpu6500_1.Mpu6500);
// @ts-ignore
obniz_1.default.PartsRegistrate(mpu9250_1.Mpu9250);
class M5Stack extends obniz_1.default {
    constructor(id, options) {
        super(id, options);
        this.hasIMU = false;
    }
    _prepareComponents() {
        // @ts-ignore
        super._prepareComponents();
        const i2cParams = { sda: 21, scl: 22, clock: 100000, pull: "3v", mode: "master" };
        this.m5display = new m5display_1.M5Display(this);
        // @ts-ignore
        this.m5i2c = this.getI2CWithConfig(i2cParams);
        this.buttonA = this.wired("Button", { signal: 39 });
        this.buttonB = this.wired("Button", { signal: 38 });
        this.buttonC = this.wired("Button", { signal: 37 });
        const keys = [
            "m5display",
            "buttonA",
            "buttonB",
            "buttonC",
        ];
        for (const key of keys) {
            // @ts-ignore
            this._allComponentKeys.push(key);
        }
    }
    setupIMU() {
        // @ts-ignore
        this.mpu9250 = this.wired("MPU9250", { i2c: this.m5i2c });
        // @ts-ignore
        this._allComponentKeys.push("MPU9250");
        this.hasIMU = true;
    }
    gyroWait() {
        if (!this.hasIMU) {
            throw new Error("gyroWait is supported only M5stack gray. If this device is, please call setupIMU().");
        }
        return this.mpu9250.mpu6500.gyroWait();
    }
    accelerationWait() {
        if (!this.hasIMU) {
            throw new Error("accelerationWait is supported only M5stack gray. If this device is, please call setupIMU().");
        }
        return this.mpu9250.mpu6500.accelerationWait();
    }
}
exports.M5Stack = M5Stack;
