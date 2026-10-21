import { StateRuntime } from "./index";

const state = new StateRuntime();

state.setRoom("Singapore VIP");

console.log(state.getRoom());