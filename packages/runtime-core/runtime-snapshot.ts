room.join("Singapore VIP");
room.sync();
const snapshot = {
  room: state.getRoom(),
  fps: metrics.get("fps"),
  memory: metrics.get("memory"),
  eventCount: metrics.get("eventCount"),
};
console.table(snapshot);
const snapshot: RuntimeSnapshot = {
  room: state.getRoom(),
  fps: metrics.get("fps") ?? 0,
  users: 100,
};

console.log(snapshot);
