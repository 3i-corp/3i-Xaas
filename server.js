const WebSocket = require("ws");

const wss = new WebSocket.Server({
  port: 8080,
});

let state = {
  room: "Singapore VIP",
  users: [],
};
let config = {
  drawInterval: 60,
  payoutRate: 95,
  roomEnabled: true,
};

wss.on("connection", (ws) => {

  ws.on("message", (message) => {

    const data =
      JSON.parse(message);

    if (
      data.type ===
      "room.join"
    ) {

      state.users.push(
        data.user
      );

      const payload =
        JSON.stringify({
          type:
            "presence.update",
          state,
        });

      wss.clients.forEach(
        (client) => {

          if (
            client.readyState ===
            WebSocket.OPEN
          ) {

            client.send(
              payload
            );

          }

        }
      );

    }

  });

});
if (data.type === "admin.update") {

  config = {
    ...config,
    ...data.config,
  };

  const payload =
    JSON.stringify({
      type: "config.sync",
      config,
    });

  wss.clients.forEach((client) => {

    if (
      client.readyState ===
      WebSocket.OPEN
    ) {

      client.send(payload);

    }

  });

}

console.log(
  "WS running :8080"
);
let config = {
  drawInterval: 60,
  payoutRate: 95,
  roomEnabled: true,
};
if (data.type === "admin.update") {

  config = {
    ...config,
    ...data.config,
  };

  const payload =
    JSON.stringify({
      type: "config.sync",
      config,
    });

  wss.clients.forEach((client) => {

    if (
      client.readyState ===
      WebSocket.OPEN
    ) {

      client.send(payload);

    }

  });

}
if (data.type === "admin.update") {

  config = {
    ...config,
    ...data.config,
  };

  const payload =
    JSON.stringify({
      type: "config.sync",
      config,
    });

  wss.clients.forEach((client) => {

    if (
      client.readyState ===
      WebSocket.OPEN
    ) {

      client.send(payload);

    }

  });

}
