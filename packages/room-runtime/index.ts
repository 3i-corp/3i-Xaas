export class RoomRuntime {
  private room = "Lobby";

  join(room: string) {
    this.room = room;

    console.log(`[ROOM] Joined ${room}`);
  }

  getRoom() {
    return this.room;
  }
}