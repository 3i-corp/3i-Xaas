import WebSocket from "ws";

export class WebSocketRuntime {
  private socket?: WebSocket;

  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.on("open", () => {
      console.log("[WS] Connected");
    });

    this.socket.on("message", (data) => {
      console.log("[WS] Message");
      console.log(data.toString());

      if (this.messageHandler) {
        this.messageHandler(
          data.toString()
        );
      }
    });
  }

  send(message: string) {
    this.socket?.send(message);
  }

  private messageHandler?:
    (msg: string) => void;

  onMessage(
    handler: (msg: string) => void
  ) {
    this.messageHandler =
      handler;
  }
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
if (
  payload.type ===
  "config.sync"
) {

  setConfig(
    payload.config
  );

}