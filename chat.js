import {
  isWebSocketCloseEvent,
} from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const users = new Map();
const userNames = new Map();
const availableUsers = new Map();

export default async function chat(ws) {
  const userId = v4.generate();

  // Listening of WebSocket events
  for await (const data of ws) {
    console.log(data);

    if (isWebSocketCloseEvent(data)) {
      users.delete(userId);
      broadcast({ event: "onlineUsers", count: users.size });
      break;
    }

    if (data.event === "join") {
      users.set(userId, ws);
      availableUsers.set(userId, ws);
      broadcast({ event: "onlineUsers", count: users.size });
    }
  }
}

function broadcast(message) {
  for (const user of users.values()) {
    user.send(JSON.stringify(message));
  }
}
