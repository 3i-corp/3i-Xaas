const {
  WebSocketServer,
} = require("ws");

const {
  loadState,
  saveState,
} = require("../../state-runtime/store");

const {
  MembershipManager,
} = require("./membership-manager");

const membership =
  new MembershipManager();

const wss =
  new WebSocketServer({
    port: 8080,
  });

let sharedState =
  loadState();

console.log(
  "WS Server Running"
);

function broadcast(payload) {
  wss.clients.forEach(
    (client) => {

      if (
        client.readyState === 1
      ) {
        client.send(
          JSON.stringify(
            payload
          )
        );
      }

    }
  );
}

wss.on(
  "connection",
  (socket) => {

    console.log(
      "[SERVER] Client Connected"
    );

    socket.send(
      JSON.stringify({
        type:
          "state.sync",
        state:
          sharedState,
      })
    );

    socket.on(
      "message",
      (msg) => {

        const payload =
          JSON.parse(
            msg.toString()
          );

        console.log(
          "[SERVER] Received",
          payload
        );

        if (
          payload.type ===
          "room.join"
        ) {

          membership.join(
            socket,
            payload.user,
            payload.room
          );

          sharedState.room =
            payload.room;

          sharedState.users =
            membership.usersInRoom(
              payload.room
            );

          saveState(
            sharedState
          );

          broadcast({
            type:
              "presence.update",
            state:
              sharedState,
          });
        }

        if (
          payload.type ===
          "room.leave"
        ) {

          membership.leave(
            socket
          );

          sharedState.users =
            membership.usersInRoom(
              sharedState.room
            );

          saveState(
            sharedState
          );

          broadcast({
            type:
              "presence.update",
            state:
              sharedState,
          });
        }

        if (
          payload.type ===
          "heartbeat"
        ) {
          membership.heartbeat(
            socket
          );
        }

      }
    );

    socket.on(
      "close",
      () => {

        const member =
          membership.leave(
            socket
          );

        if (!member)
          return;

        console.log(
          "[SERVER] Disconnected",
          member.user
        );

        sharedState.users =
          membership.usersInRoom(
            member.room
          );

        saveState(
          sharedState
        );

        broadcast({
          type:
            "presence.update",
          state:
            sharedState,
        });
      }
    );
  }
);
