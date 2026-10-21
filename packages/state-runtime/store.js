const fs = require("fs");
const path = require("path");

const FILE = path.join(
  __dirname,
  "state.json"
);

function loadState() {
  try {
    return JSON.parse(
      fs.readFileSync(
        FILE,
        "utf8"
      )
    );
  } catch {
    return {
      room: "Lobby",
      users: [],
    };
  }
}

function saveState(state) {
  fs.writeFileSync(
    FILE,
    JSON.stringify(
      state,
      null,
      2
    )
  );
}

module.exports = {
  loadState,
  saveState,
};