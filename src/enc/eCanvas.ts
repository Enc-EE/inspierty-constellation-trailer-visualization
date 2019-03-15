import { EAnimation } from "./eAnimation";

export type DrawFunction = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => void;

export class ECanvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private drawFunctions: DrawFunction[] = [];

    public get width(): number {
        return this.canvas.width;
    }

    public get height(): number {
        return this.canvas.height;
    }

    private constructor() { }

    public static createFullScreen(): ECanvas {
        document.body.parentElement.style.height = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.overflow = "hidden";

        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        canvas.style.width = "100%"
        canvas.style.height = "100%";

        var enCanvas = new ECanvas();
        enCanvas.canvas = canvas;
        enCanvas.ctx = canvas.getContext('2d');
        window.addEventListener("resize", enCanvas.resize);
        enCanvas.resize();
        return enCanvas;
    }

    public resize = () => {
        console.log("canvas.resize()");
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    public draw = () => {
        for (const drawFunction of this.drawFunctions) {
            drawFunction(this.ctx, this.width, this.height);
        }
    }

    public addDrawFunction = (func: DrawFunction) => {
        this.drawFunctions.push(func);
    }

    public removeDrawFunction = (func: DrawFunction) => {
        this.drawFunctions.splice(this.drawFunctions.indexOf(func), 1);
    }
}