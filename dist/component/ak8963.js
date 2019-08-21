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
class AK8963 {
    constructor() {
        this.keys = ['gnd', 'sda', 'scl', 'i2c'];
        this.requiredKeys = [];
        this.address = 0x0c;
        this.commands = {
            whoami: 0x00,
            whoami_results: 0x48,
        };
    }
    static info() {
        return {
            name: 'AK8963',
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
    whoamiWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [this.commands.whoami]);
            return yield this.i2c.readWait(this.address, 1);
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
exports.AK8963 = AK8963;
