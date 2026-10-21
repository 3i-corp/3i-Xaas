"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import AdminPanel
from "./components/AdminPanel";

export default function Home() {

  const wsRef =
    useRef<WebSocket | null>(
      null
    );

  const [room, setRoom] =
    useState(
      "Connecting..."
    );

  const [users, setUsers] =
    useState<string[]>([]);

  const [result, setResult] =
    useState("Waiting...");

  useEffect(() => {

    wsRef.current =
      new WebSocket(
        "ws://localhost:8080"
      );

    const ws =
      wsRef.current;

    ws.onopen = () => {

      ws.send(
        JSON.stringify({
          type: "room.join",
          room:
            "Singapore VIP",
          user: "web-user",
        })
      );

    };

    ws.onmessage =
      (event) => {

      const payload =
        JSON.parse(
          event.data
        );

      if (
        payload.type ===
        "presence.update"
      ) {

        setRoom(
          payload.state.room
        );

        setUsers(
          payload.state.users
        );

      }

      if (
        payload.type ===
        "lottery.result"
      ) {

        setResult(
          payload.result.number
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
        Singapore VIP
      </h1>

      <button
        onClick={() => {

          document.body
            .classList
            .toggle("dark");

        }}
      >
        Toggle Theme
      </button>

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

      <h1>
        Result:
        {" "}
        {result}
      </h1>

      <AdminPanel
        wsRef={wsRef}
      />

    </main>

  );

}