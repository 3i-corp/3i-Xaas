import { WebSocketRuntime } from "../websocket-runtime";

const ws = new WebSocketRuntime();

ws.connect("ws://localhost:8080");

setTimeout(() => {
  console.log("[CLIENT-2] JOIN");

  ws.send(
    JSON.stringify({
      type: "room.join",
      room: "Singapore VIP",
      user: "user-2",
    })
  );
}, 1000);