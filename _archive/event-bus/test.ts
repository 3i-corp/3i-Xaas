import { EventBus } from "./index";

const bus = new EventBus();

bus.emit("room.join", payload.room);
bus.on("test", () => {
  console.log("EVENT WORKING");
});

bus.emit("test");
bus.on("room.join", (roomName) => {
  sharedState.setRoom(roomName as string);

  console.log(
    "[STATE]",
    sharedState.snapshot()
  );
});