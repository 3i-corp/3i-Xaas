import { EventBus } from "../event-bus";
import { StateRuntime } from "../state-runtime";
import { DigitalTwinRuntime } from "../digital-twin";
import { WebSocketRuntime } from "../websocket-runtime";

const bus = new EventBus();

const state = new StateRuntime();

const twin = new DigitalTwinRuntime();

const ws = new WebSocketRuntime();

bus.on("room.join", (payload) => {
  const roomName = payload as string;

  console.log("[EVENT] room.join");

  state.setRoom(roomName);

  console.log(
    `[ROOM] Joined ${state.getRoom()}`
  );

  console.log(
    `[STATE] ${state.getRoom()}`
  );

  twin.start({
    room: state.getRoom(),
    users: 100,
  });
});

ws.connect(
  "ws://localhost:8080",
  (message) => {
    const data = JSON.parse(message);

    if (data.type === "room.join") {
      bus.emit(
        "room.join",
        data.room
      );
    }
  }
);

setTimeout(() => {
  ws.send(
    JSON.stringify({
      type: "room.join",
      room: "Singapore VIP",
    })
  );
}, 1000);