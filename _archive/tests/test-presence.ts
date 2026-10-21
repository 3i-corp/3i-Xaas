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

ws.connect("ws://localhost:8080");

ws.onMessage((message) => {
  bus.emit("ws.message", message);
});

bus.on("ws.message", (raw: any) => {
  const payload = JSON.parse(raw);

  if (
    payload.type === "presence.update" ||
    payload.type === "state.sync"
  ) {
    state.setRoom(payload.state.room);

    console.log(
      `[STATE] Room = ${payload.state.room}`
    );

    console.log(
      `[STATE] Users = ${payload.state.users.length}`
    );

    room.join(payload.state.room);

    twin.start({
      room: payload.state.room,
      users: payload.state.users.length,
    });
  }
});

setTimeout(() => {
  ws.send(
    JSON.stringify({
      type: "room.join",
      room: "Singapore VIP",
      user: "user-1",
    })
  );
}, 1000);