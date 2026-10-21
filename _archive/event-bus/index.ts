type EventHandler = (payload?: unknown) => void;

export class EventBus {
  private listeners: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    this.listeners[event] ??= [];
    this.listeners[event].push(handler);
  }

  emit(event: string, payload?: unknown) {
    this.listeners[event]?.forEach((handler) => {
      handler(payload);
    });
  }
}