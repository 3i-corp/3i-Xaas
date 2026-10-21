disconnect() {

  clearInterval(
    this.heartbeatTimer
  );

  this.socket?.close();
}