import { KeyboardControls } from "./keyboardControls";
import { EAnimation } from "../eAnimation";

export class WebRtcSender {
    keyboardControls: KeyboardControls;
    constructor(private dataChannel: RTCDataChannel) {
        var animation = new EAnimation();
        animation.addUpdateFunction(this.update);
        this.startup();
    }

    private x = 0;
    private y = 0;

    private update = (timeDiff: number) => {
        this.dataChannel.send("x:" + this.x);
        this.dataChannel.send("y:" + this.y);
    }

    public draw = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "black";
        for (let i = 0; i < this.ongoingTouches.length; i++) {
            const touch = this.ongoingTouches[i];
            this.x = touch.clientX / width * 2 - 1
            this.y = touch.clientY / height * 2 - 1

            ctx.beginPath();
            ctx.arc(touch.clientX, touch.clientY, 50, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    startup() {
        document.addEventListener("touchstart", this.handleStart, false);
        document.addEventListener("touchend", this.handleEnd, false);
        document.addEventListener("touchcancel", this.handleCancel, false);
        document.addEventListener("touchleave", this.handleEnd, false);
        document.addEventListener("touchmove", this.handleMove, false);
    }

    ongoingTouches: ETouch[] = [];

    handleStart = (evt: TouchEvent) => {
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            evt.preventDefault();
            console.log("touchstart:" + i + "...");
            this.ongoingTouches.push(this.copyTouch(touches[i]));
            console.log("touchstart:" + i + ".");
        }
    }

    handleMove = (evt: TouchEvent) => {
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            evt.preventDefault();
            var idx = this.ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i]));
            } else {
                console.log("can't figure out which touch to continue");
            }
        }
    }

    handleEnd = (evt: TouchEvent) => {
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            evt.preventDefault();
            var idx = this.ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                this.ongoingTouches.splice(i, 1);
                this.x = 0;
                this.y = 0;
            } else {
                console.log("can't figure out which touch to end");
            }
        }
    }

    handleCancel = (evt: TouchEvent) => {
        evt.preventDefault();
        console.log("touchcancel.");
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            this.ongoingTouches.splice(i, 1); // remove it; we're done
        }
    }
    copyTouch = (touch: Touch): ETouch => {
        return {
            identifier: touch.identifier,
            clientX: touch.clientX,
            clientY: touch.clientY
        };
    }
    ongoingTouchIndexById = (idToFind: number) => {
        for (var i = 0; i < this.ongoingTouches.length; i++) {
            var id = this.ongoingTouches[i].identifier;

            if (id == idToFind) {
                return i;
            }
        }
        return -1; // not found
    }
}

interface ETouch {
    identifier: number,
    clientX: number,
    clientY: number
}