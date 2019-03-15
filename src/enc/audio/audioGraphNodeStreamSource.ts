import { AudioGraphNode } from "./audioGraphNode";

export class AudioGraphNodeStreamSource extends AudioGraphNode<MediaStreamAudioSourceNode> {
    source: MediaStreamAudioSourceNode;

    public getAudioNode = (): MediaStreamAudioSourceNode => {
        // async!!!
        if (!this.source) {
            this.initialize();
        }
        return this.source;
    }

    private initialize() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                this.source = this.audioCtx.createMediaStreamSource(stream)
            })
            .catch(function (err) {
                alert("error1923012258")
                /* handle the error */
            });
    }
}