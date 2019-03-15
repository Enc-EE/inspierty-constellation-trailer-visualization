export abstract class AudioGraphNode<T> {
    constructor(protected audioCtx: AudioContext) { }

    public abstract getAudioNode(): T;
}