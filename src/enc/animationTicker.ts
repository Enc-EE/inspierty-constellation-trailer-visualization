export class AnimationTicker {
    lastFrameTime: number;
    constructor(private intervalMs: number, private func: () => void) { }

    public update = (timeDiff: number) => {
        if (!this.lastFrameTime) {
            this.lastFrameTime = Date.now();
        }

        var now = Date.now();
        var elapsed = now - this.lastFrameTime;

        if (elapsed > this.intervalMs) {

            this.lastFrameTime = now;
            this.func();
        }
    }
}