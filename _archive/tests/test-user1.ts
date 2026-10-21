import { EventBus } from "../event-bus";
import { StateRuntime } from "../state-runtime";
import { RoomRuntime } from "../room-runtime";
import { DigitalTwinRuntime } from "../digital-twin";
import { WebSocketRuntime } from "../websocket-runtime";

const bus = new EventBus();
const state = new StateRuntime();
const room = new RoomRuntime();
const twin = new DigitalTwinRuntime();
const ws = new WebSocketRuntime();

bus.on("presence.update", (payload: any) => {
  state.setRoom(payload.room);
  state.setUsers(payload.users);

  console.log("[STATE] Room =", state.getRoom());
  console.log("[STATE] Users =", state.getUsers().length);

  room.join(state.getRoom());

  twin.start({
    room: state.getRoom(),
    users: state.getUsers().length,
  });
});

ws.connect(
  "ws://localhost:8080",
  (message) => {
    const data = JSON.parse(message);

    if (
      data.type === "presence.update" ||
      data.type === "state.sync"
    ) {
      bus.emit(
        "presence.update",
        data.state
      );
    }
  }
);

setTimeout(() => {
  ws.send({
    type: "room.join",
    room: "Singapore VIP",
    user: "user-1",
  });
}, 1000);