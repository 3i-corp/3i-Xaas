import WebSocket, {
  WebSocketServer,
} from "ws";

const wss =
  new WebSocketServer({
    port: 8080,
  });

let users: string[] = [];

let config = {
  payoutRate: 95,
};

function broadcast(
  data: unknown
) {

  const payload =
    JSON.stringify(data);

  wss.clients.forEach(
    (client) => {

      if (
        client.readyState ===
        WebSocket.OPEN
      ) {

        client.send(payload);

      }

    }
  );

}

wss.on(
  "connection",
  (ws) => {

    console.log(
      "[WS] connected"
    );

    ws.on(
      "message",
      (message) => {

        const data =
          JSON.parse(
            message.toString()
          );

        if (
          data.type ===
          "room.join"
        ) {

          if (
            !users.includes(
              data.user
            )
          ) {

            users.push(
              data.user
            );

          }

          broadcast({
            type:
              "presence.update",

            state: {
              room:
                data.room,

              users,
            },
          });

        }

        if (
          data.type ===
          "admin.update"
        ) {

          config = {
            ...config,
            ...data.config,
          };

          broadcast({
            type:
              "config.sync",

            config,
          });

        }

      }
    );

  }
);

console.log(
  "[WS-RUNTIME] running :8080"
);