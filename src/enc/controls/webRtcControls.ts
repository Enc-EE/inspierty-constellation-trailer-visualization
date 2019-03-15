import { Controller, ControllerType } from "./controller";
import { EEventTT } from "../eEvent";

export class WebRtcControls implements Controller {
    xAxes: number = 0;
    yAxes: number = 0;
    name: string;
    start: boolean;
    a: boolean = false;
    signal: EEventTT<Controller, string>;
    type: ControllerType;

    constructor(dataChannel: RTCDataChannel) {
        this.type = ControllerType.webRtc;
        dataChannel.onmessage = (e) => {
            const key = e.data.split(":")[0];
            const value = e.data.split(":")[1];

            switch (key) {
                case "x":
                    this.xAxes = value;
                    break;
                case "y":
                    this.yAxes = value;
                    break;
                case "a":
                    this.a = value === "true";
                    break;
            }
        };
    }
}