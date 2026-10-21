import WebSocket from "ws";

export class WebSocketRuntime {
  private socket?: WebSocket;

  private messageHandler?:
    (message: string) => void;

  onMessage(
    callback: (message: string) => void
  ) {
    this.messageHandler = callback;
  }

  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.on("open", () => {
      console.log("[WS] Connected");
    });

    this.socket.on("message", (data) => {
      const message = data.toString();

      console.log(
        "[WS] Message",
        message
      );

      this.messageHandler?.(message);
    });
  }

  send(data: string) {
    this.socket?.send(data);
  }
bus.on("room.join", (roomName) => {
  sharedState.setRoom(roomName as string);

  console.log(
    "[STATE]",
    sharedState.snapshot()
  );
});