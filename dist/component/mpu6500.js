"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class MPU6500 {
    constructor() {
        this.keys = ['gnd', 'sda', 'scl', 'i2c'];
        this.requiredKeys = [];
        this.address = 0x68;
        this.commands = {
            whoami: 0x75,
            whoami_results: 0x71,
            int_pin_config: 0x37,
            accel_x_h: 0x3b,
            accel_x_l: 0x3c,
            accel_y_h: 0x3d,
            accel_y_l: 0x3e,
            accel_z_h: 0x3f,
            accel_z_l: 0x40,
            gyro_x_h: 0x43,
            gyro_x_l: 0x44,
            gyro_y_h: 0x45,
            gyro_y_l: 0x46,
            gyro_z_h: 0x47,
            gyro_z_l: 0x48,
        };
        this.intPinConfigMask = {
            "bypass_en": 0b00000010,
        };
        this.settingParams = {
            accel: {
                so: {
                    "2g": 16384,
                    "4g": 8192,
                    "8g": 4096,
                    "16g": 2048,
                },
                m_s2: 9.80665,
                g: 1,
            },
            gyro: {
                so: {
                    "250dps": 131,
                    "500dps": 62.5,
                    "1000dps": 1000,
                    "2000dps": 16.4,
                },
                deg: 1,
                rad: 57.295779578552 //1 rad/s is 57.295779578552 deg/s
            }
        };
        this.accel_so = "2g";
        this.gyro_so = "250dps";
    }
    static info() {
        return {
            name: 'MPU6500',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        // @ts-ignore
        obniz.setVccGnd(null, this.params.gnd, '3v');
        this.params.clock = 100000;
        this.params.pull = '3v';
        this.params.mode = 'master';
        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);
    }
    bypassMagnetometerWait() {
        return __awaiter(this, void 0, void 0, function* () {
            // Enable I2C bypass to access for MPU9250 magnetometer access.
            this.i2c.write(this.address, [this.commands.int_pin_config]);
            let data = yield this.i2c.readWait(this.address, 1);
            data[0] |= this.intPinConfigMask.bypass_en;
            this.i2c.write(this.address, [this.commands.int_pin_config, data[0]]);
        });
    }
    whoamiWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [this.commands.whoami]);
            return yield this.i2c.readWait(this.address, 1);
        });
    }
    gyroWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [this.commands.gyro_x_h]);
            let data = yield this.i2c.readWait(this.address, 6);
            const { gyro } = this.settingParams;
            let scale = gyro.deg / gyro.so[this.gyro_so];
            return {
                x: this.char2short(data.slice(0, 2)) * scale,
                y: this.char2short(data.slice(2, 4)) * scale,
                z: this.char2short(data.slice(4, 6)) * scale,
            };
        });
    }
    accelerationWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [this.commands.accel_x_h]);
            let data = yield this.i2c.readWait(this.address, 6);
            const { accel } = this.settingParams;
            let scale = accel.m_s2 / accel.so[this.accel_so];
            return {
                x: this.char2short(data.slice(0, 2)) * scale,
                y: this.char2short(data.slice(2, 4)) * scale,
                z: this.char2short(data.slice(4, 6)) * scale,
            };
        });
    }
    char2short(values) {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, values[0]);
        dv.setUint8(1, values[1]);
        return dv.getInt16(0, false);
    }
}
exports.MPU6500 = MPU6500;
