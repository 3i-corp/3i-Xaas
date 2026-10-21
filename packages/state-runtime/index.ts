import { loadState } from "./store";

export class StateRuntime {
  private room = "Lobby";

  constructor() {
    const state = loadState();

    this.room = state.room;
  }

  setRoom(room: string) {
    this.room = room;
  }

  getRoom() {
    return this.room;
  }
}