import { EAnimation } from "./enc/eAnimation";
import { AudioGraph } from "./enc/audio/audioGraph";
import TrailerOgg from "./assets/Trailer_Constellation.ogg"
import { ECanvas } from "./enc/eCanvas";
import { InspiertyAudioVisualization } from "./inspiertyAudioVisualization";

export class App {
    audioGraph: AudioGraph;
    canvas: ECanvas;
    animation: EAnimation;

    public run() {
        document.body.style.backgroundColor = "black";
        this.canvas = ECanvas.createFullScreen();
        this.animation = new EAnimation();
        this.animation.addUpdateFunction(this.canvas.draw);

        this.audioGraph = new AudioGraph();
        if (window.location.search.substr(1).split("&").indexOf("mic") !== -1) {
            console.log("using microphone");
            this.audioGraph.playStream();
        } else {
            console.log("using audio");
            this.audioGraph.playUrl(TrailerOgg);
        }

        this.canvas.addDrawFunction(this.preAnimation);

        var inspiertyAnimation = new InspiertyAudioVisualization(this.audioGraph, this.canvas, this.animation);
    }

    private preAnimation = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        ctx.clearRect(0, 0, width, height);
    }
}