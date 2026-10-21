ws.send(
  JSON.stringify({
    type: "room.leave",
    user: "user-1",
  })
);