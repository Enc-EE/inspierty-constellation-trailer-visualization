import { AudioGraphNode } from "./audioGraphNode";

export class AudioGraphNodeElementSource extends AudioGraphNode<MediaElementAudioSourceNode> {
    url: string;
    source: MediaElementAudioSourceNode;

    constructor(audioCtx: AudioContext, url: string) {
        super(audioCtx);
        this.url = url;
    }

    public getAudioNode = (): MediaElementAudioSourceNode => {
        if (!this.source) {
            this.initialize();
        }
        return this.source;
    }
    audio: HTMLAudioElement;

    private initialize() {
        this.audio = document.createElement('audio');
        // document.body.appendChild(this.audio);
        this.audio.controls = true;
        this.audio.src = this.url;
        this.source = this.audioCtx.createMediaElementSource(this.audio);
        setTimeout(() => {
            this.audio.play();
        }, 5000);
    }
}