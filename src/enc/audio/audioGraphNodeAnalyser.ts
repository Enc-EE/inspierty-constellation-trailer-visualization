import { AudioGraphNode } from "./audioGraphNode";

export class AudioGraphNodeAnalyser extends AudioGraphNode<AnalyserNode> {
    analyserNode: AnalyserNode;
    bufferLength: number;
    dataArray: Uint8Array;

    public getAudioNode = (): AnalyserNode => {
        if (!this.analyserNode) {
            this.initialize();
        }
        return this.analyserNode;
    }

    private initialize() {
        this.analyserNode = this.audioCtx.createAnalyser();
        this.analyserNode.fftSize = 32;
        this.analyserNode.smoothingTimeConstant = 0.9;
        this.bufferLength = this.analyserNode.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }

    public getSpectrum() {
        if (this.analyserNode) {
            this.analyserNode.getByteFrequencyData(this.dataArray);
            return this.dataArray;
        }
        return new Uint8Array(0);
    }

    public getWave() {
        if (this.analyserNode) {
            this.analyserNode.getByteTimeDomainData(this.dataArray);
            return this.dataArray;
        }
        return new Uint8Array(0);
    }
}