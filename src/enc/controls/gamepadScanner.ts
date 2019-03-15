import { EEventT } from "../eEvent";

export class GamepadScanner {
    private gamepadScanner: number;
    private gamepads: Gamepad[] = [];

    constructor() {
        this.scannedGamepad = new EEventT<Gamepad>();
        this.reset();
    }

    public start() {
        this.gamepadScanner = setInterval(this.scangamepads, 500);
    }

    public stop() {
        clearInterval(this.gamepadScanner);
    }

    public reset() {
        this.gamepads = [];
    }

    private scangamepads = () => {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (!(gamepads[i].index in this.gamepads) && gamepads[i].buttons.length >= 16) {
                    this.gamepads[gamepads[i].index] = gamepads[i];
                    this.scannedGamepad.dispatchEvent(gamepads[i]);
                }
            }
        }
    }

    public scannedGamepad: EEventT<Gamepad>;
}