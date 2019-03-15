import { AudioGraphNode } from "./audioGraphNode";

export class AudioGraphNodeDestination extends AudioGraphNode<AudioDestinationNode> {
    public getAudioNode = (): AudioDestinationNode => {
        return this.audioCtx.destination;
    }
}