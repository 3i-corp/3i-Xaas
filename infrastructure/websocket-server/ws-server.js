const { WebSocketServer } = require("ws");
const { sharedState } = require("./shared-state");

const wss = new WebSocketServer({
  port: 8080,
});

console.log("WS Server Running");

wss.on("connection", (socket) => {
  console.log("[SERVER] Client Connected");

  socket.send(
    JSON.stringify({
      type: "state.sync",
      state: sharedState,
    })
  );

  socket.on("message", (msg) => {
    const data = JSON.parse(msg.toString());

    console.log("[SERVER] Received");
    console.log(data);

    if (data.type === "room.join") {
      sharedState.room = data.room;

      const payload = JSON.stringify({
        type: "room.join",
        room: data.room,
      });

      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(payload);
        }
      });
    }
  });
});