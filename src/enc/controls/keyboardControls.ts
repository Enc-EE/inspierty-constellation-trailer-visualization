import { Controller, Signals, ControllerType } from "./controller";
import { EEventTT } from "../eEvent";

export class KeyboardControls implements Controller {
    type: ControllerType;
    signal: EEventTT<Controller, string>;
    public a: boolean;
    public xAxes: number;
    public yAxes: number;

    public start: boolean;

    constructor(public name: string, upKey: number, leftKey: number, downKey: number, rightKey: number, a: number) {
        this.type = ControllerType.keyboard;
        this.signal = new EEventTT<Controller, string>();
        this.xAxes = 0;
        this.yAxes = 0;
        this.start = false;

        document.addEventListener('keydown', (event) => {
            if (event.keyCode == leftKey) {
                this.xAxes = -1
                this.signal.dispatchEvent(this, Signals.left);
            }
            if (event.keyCode == upKey) {
                this.yAxes = -1;
                this.signal.dispatchEvent(this, Signals.up);
            }
            if (event.keyCode == rightKey) {
                this.xAxes = 1;
                this.signal.dispatchEvent(this, Signals.right);
            }
            if (event.keyCode == downKey) {
                this.yAxes = 1;
                this.signal.dispatchEvent(this, Signals.down);
            }
            if (event.keyCode == 13) {
                this.start = true;
                this.signal.dispatchEvent(this, Signals.start);
            }
            if (event.keyCode == a) {
                this.a = true;
                this.signal.dispatchEvent(this, Signals.a);
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.keyCode == leftKey) {
                if (this.xAxes = -1) {
                    this.xAxes = 0;
                }
            }
            if (event.keyCode == upKey) {
                if (this.yAxes = -1) {
                    this.yAxes = 0;
                }
            }
            if (event.keyCode == rightKey) {
                if (this.xAxes = 1) {
                    this.xAxes = 0;
                }
            }
            if (event.keyCode == downKey) {
                if (this.yAxes = 1) {
                    this.yAxes = 0;
                }
            }
            if (event.keyCode == 13) {
                this.start = false;
            }
            if (event.keyCode == a) {
                this.a = false;
            }
        });
    }
}