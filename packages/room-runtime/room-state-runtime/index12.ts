bus.on("room.join", (Joined Singapore VIP) => {
  state.setRoom(roomName as string);

  console.log("[Joined Joined Singapore VIP] Joined", roomName);
  console.log("[STATE] Current Room =", state.getRoom());
});