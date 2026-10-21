import { EventBus } from "../event-bus";
import { StateRuntime } from "../state-runtime";
import { RoomStateRuntime } from "../room-runtime";
import { DigitalTwinRuntime } from "../digital-twin";
import { WebSocketRuntime } from "../websocket-runtime";

const bus = new EventBus();

const state = new StateRuntime();

const room = new RoomStateRuntime();

const twin = new DigitalTwinRuntime();

const ws = new WebSocketRuntime();

ws.onMessage((message) => {
  const data = JSON.parse(message);

  if (data.type === "room.join") {
    bus.emit("room.join", data.room);
  }
});

bus.on("room.join", (roomName) => {
  room.join(roomName as string);

  state.setRoom(roomName as string);

  console.log("[STATE]", state.getRoom());

  twin.start({
    room: state.getRoom(),
    users: 100,
  });
});

ws.connect("ws://localhost:8080");

setTimeout(() => {
  ws.send(
    JSON.stringify({
      type: "room.join",
      room: "Singapore VIP",
    })
  );
}, 1000);