ws.send(
  JSON.stringify({
    type: "room.join",
    room: "Singapore VIP",
    user: "user-1",
  })
);