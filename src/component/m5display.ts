import Obniz = require("obniz");
import {IO} from "obniz/obniz/libs/io_peripherals/io";
import {SPI} from "obniz/obniz/libs/io_peripherals/spi";
import {M5Stack} from "../m5stack";

export class M5Display {

    public static info() {
        return {
            name: "M5Display",
        };
    }

    public ready: boolean = false;

    public requiredKeys = [];

    public width = 320;
    public height = 240;
    public fontSize: number = 16;
    public autoFlush: boolean = true;

    private m5defines = {
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

        MAC_CONFIG: 0xe8, // MAC_PORTRAIT
        WIDTH: 240,
        HEIGHT: 320,

        TFT_CS: 14,
        TFT_RESET: 33,
        TFT_RS: 27,
        TFT_MOSI: 23,
        TFT_SCK: 18,
    };
    private obniz: Obniz;
    private spi: SPI;

    private _canvas?: HTMLCanvasElement;
    private _pos: {x: number, y: number} = { x: 0, y: 0 };

    constructor(obniz: Obniz) {

        this.obniz = obniz;

        // @ts-ignore
        this.spi = this.obniz.getFreeSpi();
        this.setup();

    }

    public getIO(pin: number): IO {
        // @ts-ignore
        return this.obniz.getIO(pin);
    }

    public printScreenOneColorRGB(r: number, g: number, b: number) {
        const hexColor = ((r & 0xf) << 12) | ((g & 0xf) << 8) | ((b & 0xf) << 4);
        this.printScreenOneColor(hexColor);
    }

    public printScreenOneColor(hexColor: number) {
        const data = [];
        for (let i = 0; i < 320 * 240; i++) {
            data.push(hexColor);
        }
        this.printScreenRaw(data);
    }

    public _drawCtx(ctx: CanvasRenderingContext2D) {
        const stride = this.m5defines.WIDTH / 8;
        const vram = new Array(320 * 240);
        const imageData = ctx.getImageData(0, 0, 320, 240);
        const data = imageData.data;

        for (let i: number = 0; i < data.length; i += 4) {
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

    public draw(ctx: CanvasRenderingContext2D) {
        if (this.autoFlush) {
            this._drawCtx(ctx);
        }
    }

    public warnCanvasAvailability() {
        // @ts-ignore
        if (this.obniz.isNode) {
            throw new Error(
                "obniz.js require node-canvas to draw rich contents. Please run `npm install canvas`",
            );
        } else {
            throw new Error("obniz.js cant create canvas element to body");
        }
    }

    public _preparedCanvas(): HTMLCanvasElement|null {
        if (this._canvas) {
            return this._canvas;
        }
        // @ts-ignore
        if (this.obniz.isNode) {
            try {
                const { createCanvas } = require("canvas");
                this._canvas = createCanvas(this.width, this.height);
            } catch (e) {
                this.warnCanvasAvailability();
                return null;
            }
        } else {

            // @ts-ignore
            const identifier = "obnizcanvas-" + this.obniz.id;
            let canvas: HTMLCanvasElement = document.getElementById(identifier) as HTMLCanvasElement;
            if (!canvas) {
                canvas = document.createElement("canvas")  ;
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
        const ctx = this._canvas!.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#FFF";
        this._pos.x = 0;
        this._pos.y = 0;
        this.fontSize = 16;
        ctx.font = `${this.fontSize}px Arial`;
        return this._canvas!;
    }

    public _ctx(): CanvasRenderingContext2D | null {
        const canvas = this._preparedCanvas();
        if (canvas) {
            return canvas.getContext("2d") as CanvasRenderingContext2D;
        }
        return null;
    }

    public font(font: string, size: number) {
        const ctx = this._ctx() as CanvasRenderingContext2D;
        if (typeof size !== "number") {
            size = 16;
        }
        if (typeof font !== "string") {
            font = "Arial";
        }
        this.fontSize = size;
        ctx.font = "" + +" " + size + "px " + font;
    }

    public clear() {
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

    public pos(x: number, y: number) {
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

    public print(text: string, color = "#FFFFFF") {
        const ctx = this._ctx();
        if (ctx) {
            ctx.fillStyle = color;
            ctx.fillText(text, this._pos.x, this._pos.y + this.fontSize);
            this.draw(ctx);
            this._pos.y += this.fontSize;
        } else {
            this.warnCanvasAvailability();
        }
    }

    public line(x_0: number, y_0: number, x_1: number, y_1: number) {
        const ctx = this._ctx();
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x_0, y_0);
            ctx.lineTo(x_1, y_1);
            ctx.stroke();
            this.draw(ctx);
        } else {
            this.warnCanvasAvailability();
        }
    }

    public rect(x: number, y: number, width: number, height: number, mustFill: boolean) {
        const ctx = this._ctx();
        if (ctx) {
            if (mustFill) {
                ctx.fillRect(x, y, width, height);
            } else {
                ctx.strokeRect(x, y, width, height);
            }
            this.draw(ctx);
        } else {
            this.warnCanvasAvailability();
        }
    }

    public circle(x: number, y: number, r: number, mustFill: boolean) {
        const ctx = this._ctx();
        if (ctx) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            if (mustFill) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
            this.draw(ctx);
        } else {
            this.warnCanvasAvailability();
        }
    }

    public async onWait() {
        this.getIO(32).output(true);
        await this.obniz.wait(1);
        await this.lcd_init();
        this.ready = true;
    }
    public off() {
        this.getIO(32).output(false);
        this.ready = false;
    }

    private setup() {

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

    private write_command(c: number) {
        this.getIO(this.m5defines.TFT_RS).output(false);
        this.spi.write([c]);
    }

    private write_data(d: number) {
        this.getIO(this.m5defines.TFT_RS).output(true);
        this.spi.write([d]);
    }

    private write_data16(d: number) {
        this.getIO(this.m5defines.TFT_RS).output(true);
        this.spi.write([(d >> 8) & 0xff, d & 0xff]);
    }

    private write_data_array(array: number[]) {

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

    private async lcd_init() {
        this.getIO(25).output(false);
        // リセット後の20ms待ちはデータシートが要求してます
        this.getIO(this.m5defines.TFT_RESET).output(false);
        await this.obniz.wait(20);
        this.getIO(this.m5defines.TFT_RESET).output(true);
        await this.obniz.wait(20);

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
        await this.obniz.wait(60);
        this.write_command(this.m5defines.CMD_DISPLAY_ON);
    }

    private async set_update_rect(sx: number, sy: number, ex: number, ey: number) {
        // VRAM内の書き込み矩形領域を設定するとCMD_MEMORY_WRITEに続くデータがその領域内に書かれる
        this.write_command(this.m5defines.CMD_COLUMN_ADDRESS_SET);
        this.write_data16(sx);
        this.write_data16(ex);
        this.write_command(this.m5defines.CMD_PAGE_ADDRESS_SET);
        this.write_data16(sy);
        this.write_data16(ey);
        this.write_command(this.m5defines.CMD_MEMORY_WRITE);
    }

    /**
     *
     * @param x
     * @param y
     * @param width
     * @param height
     * @param data [0xRRRG GGBBB]の１次配列
     */
    private printScreenRawRect(x: number, y: number, width: number, height: number, data: number[]) {
        if (!this.ready) {return; }
        this.set_update_rect(0, 0, this.m5defines.WIDTH, this.m5defines.HEIGHT);
        this.getIO(this.m5defines.TFT_RS).output(true);
        this.write_data_array(data);

    }

    private printScreenRaw(data: number[]) {
        this.printScreenRawRect(
            0,
            0,
            this.m5defines.WIDTH,
            this.m5defines.HEIGHT,
            data,
        );
    }

}
