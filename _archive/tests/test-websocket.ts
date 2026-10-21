import { EventBus } from "../event-bus";
import { WebSocketRuntime } from "../websocket-runtime";

const bus = new EventBus();

const ws = new WebSocketRuntime();

ws.connect("ws://localhost:8080");

setTimeout(() => {
  ws.onMessage((message) => {
    bus.emit("ws.message", message);
  });

  bus.on("ws.message", (payload) => {
    console.log("[EVENT]", payload);
  });

  ws.send("HELLO RUNTIME");
}, 1000);