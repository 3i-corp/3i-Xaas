export class DigitalTwinRuntime {
  start(config: {
    room: string;
    users: number;
  }) {
    console.log(
      "[DT] Digital Twin Started"
    );

    console.log(
      `[DT] Room ${config.room}`
    );

    console.log(
      `[DT] Simulating ${config.users} users`
    );
  }
}