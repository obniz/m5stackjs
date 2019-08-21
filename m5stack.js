var M5Stack =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/component/ak8963.ts":
/***/ (function(module, exports, __webpack_require__) {

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
class Ak8963 {
    constructor() {
        this.keys = ["gnd", "sda", "scl", "i2c"];
        this.requiredKeys = [];
        this.address = 0x0c;
        this.commands = {
            whoami: 0x00,
            whoami_results: 0x48,
        };
    }
    static info() {
        return {
            name: "Ak8963",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        // @ts-ignore
        obniz.setVccGnd(null, this.params.gnd, "3v");
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
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
exports.Ak8963 = Ak8963;


/***/ }),

/***/ "./src/component/m5display.ts":
/***/ (function(module, exports, __webpack_require__) {

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
class M5Display {
    constructor(obniz) {
        this.ready = false;
        this.requiredKeys = [];
        this.width = 320;
        this.height = 240;
        this.fontSize = 16;
        this.autoFlush = true;
        this.m5defines = {
            CMD_SLEEP_OUT: 0x11,
            CMD_DISPLAY_ON: 0x29,
            CMD_COLUMN_ADDRESS_SET: 0x2a,
            CMD_PAGE_ADDRESS_SET: 0x2b,
            CMD_MEMORY_WRITE: 0x2c,
            CMD_MEMORY_ACCESS_CONTROL: 0x36,
            CMD_COLMOD: 0x3a,
            MAC_PORTRAIT: 0xe8,
            MAC_LANDSCAPE: 0x48,
            COLMOD_16BIT: 0x55,
            COLMOD_18BIT: 0x66,
            MAC_CONFIG: 0xe8,
            WIDTH: 240,
            HEIGHT: 320,
            TFT_CS: 14,
            TFT_RESET: 33,
            TFT_RS: 27,
            TFT_MOSI: 23,
            TFT_SCK: 18,
        };
        this._pos = { x: 0, y: 0 };
        this.obniz = obniz;
        // @ts-ignore
        this.spi = this.obniz.getFreeSpi();
        this.setup();
    }
    static info() {
        return {
            name: "M5Display",
        };
    }
    getIO(pin) {
        // @ts-ignore
        return this.obniz.getIO(pin);
    }
    printScreenOneColorRGB(r, g, b) {
        const hexColor = ((r & 0xf) << 12) | ((g & 0xf) << 8) | ((b & 0xf) << 4);
        this.printScreenOneColor(hexColor);
    }
    printScreenOneColor(hexColor) {
        const data = [];
        for (let i = 0; i < 320 * 240; i++) {
            data.push(hexColor);
        }
        this.printScreenRaw(data);
    }
    _drawCtx(ctx) {
        const stride = this.m5defines.WIDTH / 8;
        const vram = new Array(320 * 240);
        const imageData = ctx.getImageData(0, 0, 320, 240);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const hexColor = (((data[i] >> 3) & 0x1f) << 11)
                | (((data[i + 1] >> 2) & 0x3f) << 5)
                | (((data[i + 2] >> 3) & 0x1f) << 0);
            const index = Math.floor(i / 4);
            const line = Math.floor(index / 320);
            const col = Math.floor(index - line * 320);
            vram[(240 - line - 1) + (320 - col - 1) * 240] = hexColor;
        }
        this.printScreenRaw(vram);
    }
    draw(ctx) {
        if (this.autoFlush) {
            this._drawCtx(ctx);
        }
    }
    warnCanvasAvailability() {
        // @ts-ignore
        if (this.obniz.isNode) {
            throw new Error("obniz.js require node-canvas to draw rich contents. see more detail on docs");
        }
        else {
            throw new Error("obniz.js cant create canvas element to body");
        }
    }
    _preparedCanvas() {
        if (this._canvas) {
            return this._canvas;
        }
        // @ts-ignore
        if (this.obniz.isNode) {
            try {
                const { createCanvas } = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
                this._canvas = createCanvas(this.width, this.height);
            }
            catch (e) {
                this.warnCanvasAvailability();
                return null;
            }
        }
        else {
            // @ts-ignore
            const identifier = "obnizcanvas-" + this.obniz.id;
            let canvas = document.getElementById(identifier);
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.setAttribute("id", identifier);
                canvas.style.visibility = "hidden";
                canvas.width = this.width;
                canvas.height = this.height;
                // @ts-ignore
                canvas.style["-webkit-font-smoothing"] = "none";
                const body = document.getElementsByTagName("body")[0];
                body.appendChild(canvas);
            }
            this._canvas = canvas;
        }
        const ctx = this._canvas.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#FFF";
        this._pos.x = 0;
        this._pos.y = 0;
        this.fontSize = 16;
        ctx.font = `${this.fontSize}px Arial`;
        return this._canvas;
    }
    _ctx() {
        const canvas = this._preparedCanvas();
        if (canvas) {
            return canvas.getContext("2d");
        }
        return null;
    }
    font(font, size) {
        const ctx = this._ctx();
        if (typeof size !== "number") {
            size = 16;
        }
        if (typeof font !== "string") {
            font = "Arial";
        }
        this.fontSize = size;
        ctx.font = "" + +" " + size + "px " + font;
    }
    clear() {
        const ctx = this._ctx();
        this._pos.x = 0;
        this._pos.y = 0;
        if (ctx) {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = "#FFF";
            ctx.strokeStyle = "#FFF";
            this.draw(ctx);
        }
    }
    pos(x, y) {
        this._ctx(); // crete first
        // tslint:disable-next-line
        if (typeof x == "number") {
            this._pos.x = x;
        }
        // tslint:disable-next-line
        if (typeof y == "number") {
            this._pos.y = y;
        }
        return this._pos;
    }
    print(text, color = "#FFFFFF") {
        const ctx = this._ctx();
        if (ctx) {
            ctx.fillStyle = color;
            ctx.fillText(text, this._pos.x, this._pos.y + this.fontSize);
            this.draw(ctx);
            this._pos.y += this.fontSize;
        }
        else {
            this.warnCanvasAvailability();
        }
    }
    line(x_0, y_0, x_1, y_1) {
        const ctx = this._ctx();
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x_0, y_0);
            ctx.lineTo(x_1, y_1);
            ctx.stroke();
            this.draw(ctx);
        }
        else {
            this.warnCanvasAvailability();
        }
    }
    rect(x, y, width, height, mustFill) {
        const ctx = this._ctx();
        if (ctx) {
            if (mustFill) {
                ctx.fillRect(x, y, width, height);
            }
            else {
                ctx.strokeRect(x, y, width, height);
            }
            this.draw(ctx);
        }
        else {
            this.warnCanvasAvailability();
        }
    }
    circle(x, y, r, mustFill) {
        const ctx = this._ctx();
        if (ctx) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            if (mustFill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
            this.draw(ctx);
        }
        else {
            this.warnCanvasAvailability();
        }
    }
    onWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.getIO(32).output(true);
            yield this.obniz.wait(1);
            yield this.lcd_init();
            this.ready = true;
        });
    }
    off() {
        this.getIO(32).output(false);
        this.ready = false;
    }
    setup() {
        this.getIO(this.m5defines.TFT_CS).output(false);
        this.getIO(this.m5defines.TFT_RESET).output(false);
        this.getIO(this.m5defines.TFT_RS).output(true);
        // @ts-ignore
        this.spi.start({
            mode: "master",
            clk: this.m5defines.TFT_SCK,
            mosi: this.m5defines.TFT_MOSI,
            frequency: 26 * 1000 * 1000,
        });
    }
    write_command(c) {
        this.getIO(this.m5defines.TFT_RS).output(false);
        this.spi.write([c]);
    }
    write_data(d) {
        this.getIO(this.m5defines.TFT_RS).output(true);
        this.spi.write([d]);
    }
    write_data16(d) {
        this.getIO(this.m5defines.TFT_RS).output(true);
        this.spi.write([(d >> 8) & 0xff, d & 0xff]);
    }
    write_data_array(array) {
        let data = [];
        for (const one of array) {
            data.push((one >> 8) & 0xff);
            data.push((one >> 0) & 0xff);
            if (data.length >= 1020) {
                this.spi.write(data);
                data = [];
            }
        }
        if (data.length > 0) {
            this.spi.write(data);
        }
    }
    lcd_init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.getIO(25).output(false);
            // リセット後の20ms待ちはデータシートが要求してます
            this.getIO(this.m5defines.TFT_RESET).output(false);
            yield this.obniz.wait(20);
            this.getIO(this.m5defines.TFT_RESET).output(true);
            yield this.obniz.wait(20);
            // 液晶しか繋いでないのでチップセレクトは常時選択
            this.getIO(this.m5defines.TFT_CS).output(false);
            // メモリの読み出し方向の設定で縦画面、横画面が作れる
            this.write_command(this.m5defines.CMD_MEMORY_ACCESS_CONTROL);
            this.write_data(this.m5defines.MAC_CONFIG);
            // デフォルトの18bitモードより16bitモードの方が速くて楽
            this.write_command(this.m5defines.CMD_COLMOD);
            this.write_data(this.m5defines.COLMOD_16BIT);
            // スリープ解除後の60ms待ちはデータシートが要求してます
            this.write_command(this.m5defines.CMD_SLEEP_OUT);
            yield this.obniz.wait(60);
            this.write_command(this.m5defines.CMD_DISPLAY_ON);
        });
    }
    set_update_rect(sx, sy, ex, ey) {
        return __awaiter(this, void 0, void 0, function* () {
            // VRAM内の書き込み矩形領域を設定するとCMD_MEMORY_WRITEに続くデータがその領域内に書かれる
            this.write_command(this.m5defines.CMD_COLUMN_ADDRESS_SET);
            this.write_data16(sx);
            this.write_data16(ex);
            this.write_command(this.m5defines.CMD_PAGE_ADDRESS_SET);
            this.write_data16(sy);
            this.write_data16(ey);
            this.write_command(this.m5defines.CMD_MEMORY_WRITE);
        });
    }
    /**
     *
     * @param x
     * @param y
     * @param width
     * @param height
     * @param data [0xRRRG GGBBB]の１次配列
     */
    printScreenRawRect(x, y, width, height, data) {
        if (!this.ready) {
            return;
        }
        this.set_update_rect(0, 0, this.m5defines.WIDTH, this.m5defines.HEIGHT);
        this.getIO(this.m5defines.TFT_RS).output(true);
        this.write_data_array(data);
    }
    printScreenRaw(data) {
        this.printScreenRawRect(0, 0, this.m5defines.WIDTH, this.m5defines.HEIGHT, data);
    }
}
exports.M5Display = M5Display;


/***/ }),

/***/ "./src/component/mpu6500.ts":
/***/ (function(module, exports, __webpack_require__) {

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
class Mpu6500 {
    constructor() {
        this.keys = ["gnd", "sda", "scl", "i2c"];
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
            bypass_en: 0b00000010,
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
                rad: 57.295779578552,
            },
        };
        this.accel_so = "2g";
        this.gyro_so = "250dps";
    }
    static info() {
        return {
            name: "MPU6500",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        // @ts-ignore
        obniz.setVccGnd(null, this.params.gnd, "3v");
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);
    }
    bypassMagnetometerWait() {
        return __awaiter(this, void 0, void 0, function* () {
            // Enable I2C bypass to access for MPU9250 magnetometer access.
            this.i2c.write(this.address, [this.commands.int_pin_config]);
            const data = yield this.i2c.readWait(this.address, 1);
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
            const data = yield this.i2c.readWait(this.address, 6);
            const { gyro } = this.settingParams;
            const scale = gyro.deg / gyro.so[this.gyro_so];
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
            const data = yield this.i2c.readWait(this.address, 6);
            const { accel } = this.settingParams;
            const scale = accel.m_s2 / accel.so[this.accel_so];
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
exports.Mpu6500 = Mpu6500;


/***/ }),

/***/ "./src/component/mpu9250.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Mpu9250 {
    constructor() {
        this.keys = ["gnd", "sda", "scl", "i2c"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "MPU9250",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        // @ts-ignore
        obniz.setVccGnd(null, this.params.gnd, "3v");
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);
        // @ts-ignore
        this.ak8963 = this.obniz.wired("Ak8963", { i2c: this.i2c });
        // @ts-ignore
        this.mpu6500 = this.obniz.wired("MPU6500", { i2c: this.i2c });
        this.mpu6500.bypassMagnetometerWait();
        this.obniz.wait(500);
    }
}
exports.Mpu9250 = Mpu9250;


/***/ }),

/***/ "./src/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const m5stack_1 = __webpack_require__("./src/m5stack.ts");
module.exports = m5stack_1.M5Stack;


/***/ }),

/***/ "./src/m5stack.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const obniz_1 = __importDefault(__webpack_require__("./src/webpack-replace/obniz.js"));
const m5display_1 = __webpack_require__("./src/component/m5display.ts");
const ak8963_1 = __webpack_require__("./src/component/ak8963.ts");
const mpu6500_1 = __webpack_require__("./src/component/mpu6500.ts");
const mpu9250_1 = __webpack_require__("./src/component/mpu9250.ts");
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
        this.m5display = new m5display_1.M5Display(this);
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
        this.mpu9250 = this.wired("MPU9250", { sda: 21, scl: 22 });
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


/***/ }),

/***/ "./src/webpack-replace/obniz.js":
/***/ (function(module, exports) {


let obniz;
if (typeof Obniz !== "undefined") {
    obniz = Obniz;
} else {
    obniz = window.Obniz;
}

module.exports=obniz;


/***/ })

/******/ });