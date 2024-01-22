export default class EventManager {
    private static instance: EventManager;

    private listeners: Map<string, Function[]> = new Map<string, Function[]>();

    private constructor() {}

    static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }

        return EventManager.instance;
    }

    public subscribe(eventName: string, callback: Function): void {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }

        this.listeners.get(eventName)?.push(callback);
    }

    public unsubscribe(eventName: string, callback: Function): void {
        if (!this.listeners.has(eventName)) {
            return;
        }

        const callbacks: Function[] | undefined = this.listeners.get(eventName);

        if (!callbacks) {
            return;
        }

        const index: number = callbacks.indexOf(callback);

        if (index === -1) {
            return;
        }

        callbacks.splice(index, 1);
    }

    public notify(eventName: string, ...args: any[]): void {
        if (!this.listeners.has(eventName)) {
            return;
        }

        const callbacks: Function[] | undefined = this.listeners.get(eventName);

        if (!callbacks) {
            return;
        }

        callbacks.forEach((callback: Function): void => {
            callback(...args);
        });
    }

    public deleteAllListeners(): void {
        this.listeners = new Map<string, Function[]>();
    }
}