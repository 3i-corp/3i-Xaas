import { EventBus } from "../event-bus";
import { StateRuntime } from "../state-runtime";
import { MetricsRuntime } from "../metrics-runtime";
import { RoomStateRuntime } from "../room-runtime";
import { DigitalTwinRuntime } from "../digital-twin";
import { EventBus } from "../event-bus";
import { WebSocketRuntime } from "../websocket-runtime";
import { SharedStateRuntime } from "./index";

const bus = new EventBus();
const state = new StateRuntime();
const metrics = new MetricsRuntime();
const room = new RoomStateRuntime();
const twin = new DigitalTwinRuntime();
const bus = new EventBus();
const ws = new WebSocketRuntime();
const state = new SharedStateRuntime();

ws.onMessage((message) => {
  bus.emit(
    "ws.message",
    message
  );
});

bus.on("room.join", (roomName) => {
  state.setRoom(roomName as string);

  console.log("[ROOM] Joined", roomName);
  console.log("[STATE]", state.getRoom());
});

bus.on("room.sync", () => {
  console.log("[ROOM] Sync State");
  console.log("[ROOM] Active =", state.getRoom());
});
;
bus.emit("room.join", "Singapore VIP");
bus.emit("room.sync");

state.setRoom("Singapore VIP");
state.setUsers(100);

twin.start({
  room: state.getRoom(),
  users: 100,
});
bus.on(
  "ws.message",
  (payload) => {
    console.log(
      "[EVENT]",
      payload
    );
  }
)
metrics.track("fps", 60);

console.log("[METRIC STORED]", metrics.get("fps"));
room.join("Singapore VIP");
console.log(state.snapshot());

ws.send(
  JSON.stringify({
    type: "room.join",
    room: "Singapore VIP",
  })
);