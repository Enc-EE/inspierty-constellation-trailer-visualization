import { AudioGraphNode } from "./audioGraphNode";
import { AudioGraphNodeAnalyser } from "./audioGraphNodeAnalyser";
import { AudioGraphNodeDestination } from "./audioGraphNodeDestination";
import { AudioGraphNodeElementSource } from "./audioGraphNodeElementSource";
import { AudioGraphNodeStreamSource } from "./audioGraphNodeStreamSource";

export class AudioGraph {
    private audioCtx: AudioContext;

    private sourceNode: AudioGraphNode<AudioNode>;
    private analyzerNode: AudioGraphNodeAnalyser;
    private destinationNode: AudioGraphNode<AudioDestinationNode>;

    constructor() {
        this.audioCtx = new AudioContext();
        this.audioCtx.addEventListener("statechange", this.audioContextStateChanged);
        if (this.audioCtx.state === "suspended") {
            document.addEventListener("click", this.documentClick);
            console.log("Audio context is suspended. Click the dom to make it running.");
        }
        this.analyzerNode = new AudioGraphNodeAnalyser(this.audioCtx);
        this.destinationNode = new AudioGraphNodeDestination(this.audioCtx);
    }

    public playUrl = (url: string) => {
        this.sourceNode = new AudioGraphNodeElementSource(this.audioCtx, url);
        if (this.audioCtx.state === "running") {
            this.buildGraph();
        }
    }

    public playStream = () => {
        this.sourceNode = new AudioGraphNodeStreamSource(this.audioCtx);
        if (this.audioCtx.state === "running") {
            this.buildGraph();
        }
    }

    private documentClick = () => {
        if (this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
            document.removeEventListener("click", this.documentClick);
        }
    }

    private audioContextStateChanged = () => {
        if (this.audioCtx.state === "running") {
            this.audioCtx.removeEventListener("statechange", this.audioContextStateChanged);
            this.buildGraph();
        }
    }

    private buildGraph() {
        console.log("Building audio graph.");

        if (this.sourceNode.getAudioNode()) {
            this.sourceNode.getAudioNode().disconnect();
            this.analyzerNode.getAudioNode().disconnect();
            this.destinationNode.getAudioNode().disconnect();
            this.sourceNode.getAudioNode().connect(this.analyzerNode.getAudioNode());
            this.analyzerNode.getAudioNode().connect(this.destinationNode.getAudioNode());
        } else {
            console.log("Audio source not available. Waiting some time.");
            setTimeout(() => {
                this.buildGraph();
            }, 1000);
        }
    }

    public getSpectrum() {
        return this.analyzerNode.getSpectrum();
    }

    public getWave() {
        return this.analyzerNode.getWave();
    }
}