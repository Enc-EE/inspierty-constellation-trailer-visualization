export class EEvent {
    private listeners: (() => void)[] = [];

    public addEventListener = (listener: () => void) => {
        // validation
        if (!listener || this.listeners.indexOf(listener) >= 0) {
            throw "listener already added";
        }

        this.listeners.push(listener);
    }

    public dispatchEvent = () => {
        for (let i = 0; i < this.listeners.length; i++) {
            const event = this.listeners[i];
            event();
        }
    }

    public removeEventListener = (listener: () => void) => {
        // validation
        if (!listener || this.listeners.indexOf(listener) < 0) {
            throw "listener not found";
        }

        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}

export class EEventT<T> {
    private listeners: ((arg: T) => void)[] = [];

    public addEventListener = (listener: (arg: T) => void) => {
        // validation
        if (!listener || this.listeners.indexOf(listener) >= 0) {
            throw "listener already added";
        }

        this.listeners.push(listener);
    }

    public dispatchEvent = (arg: T) => {
        for (let i = 0; i < this.listeners.length; i++) {
            const event = this.listeners[i];
            event(arg);
        }
    }

    public removeEventListener = (listener: (arg: T) => void) => {
        // validation
        if (!listener || this.listeners.indexOf(listener) < 0) {
            throw "listener not found";
        }

        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}

export class EEventTT<T1, T2> {
    private listeners: ((arg1: T1, arg2: T2) => void)[] = [];

    public addEventListener = (listener: (arg1: T1, arg2: T2) => void) => {
        // validation
        if (!listener || this.listeners.indexOf(listener) >= 0) {
            throw "listener already added";
        }

        this.listeners.push(listener);
    }

    public dispatchEvent = (arg1: T1, arg2: T2) => {
        for (let i = 0; i < this.listeners.length; i++) {
            const event = this.listeners[i];
            event(arg1, arg2);
        }
    }

    public removeEventListener = (listener: (arg1: T1, arg2: T2) => void) => {
        // validation
        if (!listener || this.listeners.indexOf(listener) < 0) {
            throw "listener not found";
        }

        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}