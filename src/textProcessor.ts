import { EAnimation } from "./enc/eAnimation";
import { Point } from "./enc/Point";
import { Helper } from "./enc/helper";
import { TextPixel } from "./textPixel";
import { ImagePixels } from "./enc/imagePixels";

export class TextProcessor {
    animatedPixels: TextPixel[] = [];
    pixels: ImagePixels;

    private isInitialized = false;
    private isDeinitialized = false;

    constructor(private animation: EAnimation, text: string, private animationStart: number, public endTime: number) {
        this.animation.addUpdateFunction(this.update);

        this.pixels = Helper.getPixels(text);
        var scale = 2;
        for (let i = 0; i < this.pixels.pixels.length; i++) {
            this.pixels.pixels[i].x *= scale;
            this.pixels.pixels[i].y *= scale;
        }
        this.pixels.width *= scale;
        this.pixels.height *= scale;
    }

    public process = (relDataValue: number, width: number, height: number) => {
        if (!this.isInitialized) {
            this.isInitialized = true;
            for (let i = 0; i < this.pixels.pixels.length; i++) {
                if (Math.random() > 0.5) {
                    const pixel = this.pixels.pixels[i];
                    var startX = Math.random() * width;
                    var startY = Math.random() * height;
                    this.animatedPixels.push({
                        startX: startX,
                        startY: startY,
                        x: startX,
                        y: startY,
                        targetX: width / 2 - this.pixels.width / 2 + pixel.x,
                        targetY: height / 4 * 3 - this.pixels.height / 2 + pixel.y,
                        startSize: 0,
                        size: 0,
                        targetSize: Math.random() * 1.5 + 0.5,
                        animationDuration: Math.random() * 4 + 2,
                        animationStart: this.animationStart + Math.random()
                    });
                }
            }
        }
        if (this.endTime <= Date.now() / 1000 && !this.isDeinitialized) {
            this.isDeinitialized = true;
            for (let i = 0; i < this.animatedPixels.length; i++) {
                const p = this.animatedPixels[i];
                var targetX = Math.random() * width;
                var targetY = Math.random() * height;
                this.animatedPixels[i] = {
                    startX: p.x,
                    startY: p.y,
                    x: p.x,
                    y: p.y,
                    targetX: targetX,
                    targetY: targetY,
                    startSize: p.size,
                    size: p.size,
                    targetSize: 0,
                    animationDuration: Math.random() * 2 + 1.5,
                    animationStart: Date.now() / 1000 + Math.random()
                }
            }
        }
    }

    public update = (timeDiff: number) => {
        var time = Date.now() / 1000;
        if (time >= this.animationStart && time <= this.endTime + 10) {
            for (let i = 0; i < this.animatedPixels.length; i++) {
                const p = this.animatedPixels[i];
                if (p.animationStart && time >= p.animationStart) {
                    var easing = this.isDeinitialized ? EasingFunctions.easeOutQuart : EasingFunctions.easeInQuart;
                    var ease = new Easer(p.animationStart, time, p.animationDuration, easing);
                    p.x = ease.getValue(p.startX, p.targetX);
                    p.y = ease.getValue(p.startY, p.targetY);
                    p.size = ease.getValue(p.startSize, p.targetSize);
                }
            }
        }
    }

    public draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        if (Date.now() / 1000 >= this.animationStart) {
            ctx.strokeStyle = "#a3d3ff";
            ctx.fillStyle = "#13c3ff";
            for (let i = 0; i < this.animatedPixels.length; i++) {
                const p = this.animatedPixels[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    private ease(startTime: number, currentTime: number, duration: number, startValue: number, targetValue: number, easeFunc: (t: number) => number) {
        var tDelta = currentTime - startTime;
        var tRel = tDelta / duration;
        tRel = tRel > 1 ? 1 : tRel;
        var scaledT = easeFunc(tRel);
        var maxScaledT = easeFunc(1);
        var x = startValue + (targetValue - startValue) * (scaledT / maxScaledT);
        return x;
    }
}

export class Easer {
    scaledT: number;
    maxScaledT: number;

    constructor(startTime: number, currentTime: number, duration: number, easeFunc: (t: number) => number) {
        var tDelta = currentTime - startTime;
        var tRel = tDelta / duration;
        tRel = tRel > 1 ? 1 : tRel;
        this.scaledT = easeFunc(tRel);
        this.maxScaledT = easeFunc(1);
    }

    public getValue = (startValue: number, targetValue: number) => {
        return startValue + (targetValue - startValue) * (this.scaledT / this.maxScaledT);
    }
}

export class EasingFunctions {
    public static linear = (t: number) => { return t }
    public static easeInQuad = (t: number) => { return t * t }
    public static easeOutQuad = (t: number) => { return t * (2 - t) }
    public static easeInOutQuad = (t: number) => { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
    public static easeInCubic = (t: number) => { return t * t * t }
    public static easeOutCubic = (t: number) => { return (--t) * t * t + 1 }
    public static easeInOutCubic = (t: number) => { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }
    public static easeInQuart = (t: number) => { return t * t * t * t }
    public static easeOutQuart = (t: number) => { return 1 - (--t) * t * t * t }
    public static easeInOutQuart = (t: number) => { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t }
    public static easeInQuint = (t: number) => { return t * t * t * t * t }
    public static easeOutQuint = (t: number) => { return 1 + (--t) * t * t * t * t }
    public static easeInOutQuint = (t: number) => { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}