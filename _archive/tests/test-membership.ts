import { WebSocketRuntime }
from "../websocket-runtime";

const ws =
  new WebSocketRuntime();

ws.connect(
  "ws://localhost:8080"
);

setTimeout(() => {

  ws.send(
    JSON.stringify({
      type:
        "room.join",
      room:
        "Singapore VIP",
      user:
        "user-1",
    })
  );

}, 1000);

setTimeout(() => {

  ws.disconnect();

}, 15000);