export class SharedStateRuntime {
  private state = {
    room: "Lobby",
    users: 0,
  };

  setRoom(room: string) {
    this.state.room = room;
  }

  getRoom() {
    return this.state.room;
  }

  setUsers(users: number) {
    this.state.users = users;
  }

  getUsers() {
    return this.state.users;
  }

  snapshot() {
    return {
      ...this.state,
    };
  }
}