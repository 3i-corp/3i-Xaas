class MembershipManager {
  constructor() {
    this.connections = new Map();
  }

  join(socket, user, room) {
    this.connections.set(socket, {
      user,
      room,
      lastSeen: Date.now(),
    });
  }

  leave(socket) {
    const member =
      this.connections.get(socket);

    this.connections.delete(socket);

    return member;
  }

  heartbeat(socket) {
    const member =
      this.connections.get(socket);

    if (!member) return;

    member.lastSeen = Date.now();
  }

  users() {
    return [
      ...this.connections.values(),
    ];
  }

  usersInRoom(room) {
    return this.users()
      .filter(
        (u) => u.room === room
      )
      .map(
        (u) => u.user
      );
  }
}

module.exports = {
  MembershipManager,
};