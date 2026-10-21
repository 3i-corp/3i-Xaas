import { WebSocketRuntime } from "./index";

const ws = new WebSocketRuntime();

ws.connect("ws://localhost:8080");

setTimeout(() => {
  ws.send("HELLO SERVER");
}, 1000););