"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [room, setRoom] =
    useState("Connecting...");

  const [users, setUsers] =
    useState<string[]>([]);

  useEffect(() => {

    const ws =
      new WebSocket(
        "ws://localhost:8080"
      );

    ws.onopen = () => {

      console.log(
        "[WEB] Connected"
      );

      ws.send(
        JSON.stringify({
          type: "room.join",
          room: "Singapore VIP",
          user: "web-user",
        })
      );

    };

    ws.onmessage = (event) => {

      const payload =
        JSON.parse(
          event.data
        );

      console.log(
        "[WEB]",
        payload
      );

      if (
        payload.type ===
          "state.sync" ||
        payload.type ===
          "presence.update"
      ) {
      if (
  payload.type ===
  "config.sync"
) {

  setConfig(
    payload.config
  );

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

        setRoom(
          payload.state.room
        );

        setUsers(
          payload.state.users
        );

      }

    };

    return () => {
      ws.close();
    };

  }, []);

  return (
    <main
      style={{
        padding: 24,
      }}
    >
      <h1>
        Realtime Executable
        Platform
      </h1>

      <h2>
        Room:
        {" "}
        {room}
      </h2>

      <h3>
        Users:
        {" "}
        {users.length}
      </h3>

      <ul>
        {users.map((u) => (
          <li key={u}>
            {u}
          </li>
        ))}
      </ul>
    </main>
  );
}
<button
  onClick={() => {
    document.body.classList.toggle(
      "dark"
    );
  }}
>
  Toggle Theme
</button>
const [config, setConfig] =
  useState({
    drawInterval: 60,
    payoutRate: 95,
    roomEnabled: true,
  });