import { SharedStateRuntime } from "./index";

const state = new SharedStateRuntime();

state.setRoom("Singapore VIP");
state.setUsers(100);

console.log(state.snapshot());