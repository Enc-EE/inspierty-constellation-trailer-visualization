export type UpdateFunction = (timeDiff: number) => void;

export class EAnimation {
    private updateFunctions: UpdateFunction[] = [];
    private isRunning = false;
    private lastFrameTime: number;
    private fps: number;
    private fpsInterval: number;

    public constructor() {
        this.setFps(30);
        this.play();
        document.addEventListener('keyup', (event) => {
            if (event.keyCode == 80) {
                this.playPause();
            }
        });
    }

    public play() {
        if (!this.isRunning) {
            console.log("play");
            this.isRunning = true;
            this.lastFrameTime = Date.now();
            this.animationLoop();
        }
    }

    public pause() {
        if (this.isRunning) {
            console.log("pause");
            this.isRunning = false;
        }
    }

    public playPause() {
        this.isRunning ? this.pause() : this.play();
    }

    public addUpdateFunction = (func: UpdateFunction) => {
        this.updateFunctions.push(func);
    }

    public removeUpdateFunction = (func: UpdateFunction) => {
        this.updateFunctions.splice(this.updateFunctions.indexOf(func), 1);
    }

    public setFps = (fps: number) => {
        this.fps = fps;
        this.fpsInterval = 1000 / this.fps;
    }

    private animationLoop = () => {
        if (this.isRunning) {
            requestAnimationFrame(this.animationLoop);
        }

        var now = Date.now();
        var elapsed = now - this.lastFrameTime;

        if (elapsed > this.fpsInterval) {
            this.lastFrameTime = now;
            var timeDiff = elapsed / 1000;

            for (const updateFunction of this.updateFunctions) {
                updateFunction(timeDiff);
            }
        }
    }
}