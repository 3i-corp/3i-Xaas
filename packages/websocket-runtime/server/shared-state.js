 sharedState.room =
    payload.room;

  sharedState.users =
    membership.usersInRoom(
      payload.room
    );
    if (payload.type === "heartbeat") {

  membership.heartbeat(
    socket
  );
}
if (payload.type === "room.join") {

  membership.join(
    socket,
    payload.user,
    payload.room
  );
if (!member) return;

  console.log(
    "[SERVER] Disconnected",
    member.user
  );

  sharedState.users =
    membership.usersInRoom(
      member.room
    );

  saveState(sharedState);

  broadcast({
    type: "presence.update",
    state: sharedState,
  });
}
if (payload.type === "room.leave") {

  membership.leave(socket);

  sharedState.users =
    membership.usersInRoom(
      sharedState.room
    );

  saveState(sharedState);

  broadcast({
    type: "presence.update",
    state: sharedState,
  });
}
this.socket.on("open", () => {

  console.log(
    "[WS] Connected"
  );

  this.heartbeatTimer =
    setInterval(() => {

      this.send(
        JSON.stringify({
          type: "heartbeat",
        })
      );

    }, 5000);

});
disconnect() {

  clearInterval(
    this.heartbeatTimer
  );

  this.socket?.close();
}
ws.send(
  JSON.stringify({
    type: "room.join",
    room: "Singapore VIP",
    user: "user-1",
  })
);
