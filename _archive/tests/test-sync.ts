import { EventBus } from "../event-bus";
import { StateRuntime } from "../state-runtime";

const bus = new EventBus();
const state = new StateRuntime();

bus.on("room.join", (roomName) => {
  state.setRoom(roomName as string);

  console.log("[ROOM] Joined", roomName);
});

bus.on("room.sync", () => {
  console.log("[ROOM] Sync State");
  console.log("[ROOM] Active =", state.getRoom());
});

bus.emit("room.join", "Singapore VIP");
bus.emit("room.sync");