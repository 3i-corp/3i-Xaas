import {
  loadState,
  saveState,
} from "./store";

const state = loadState();

console.log(
  "[BEFORE]",
  state
);

state.room = "Singapore VIP";

state.users.push("user-1");

saveState(state);

const next = loadState();

console.log(
  "[AFTER]",
  next
);