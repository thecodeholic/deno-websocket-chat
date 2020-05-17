// @ts-nocheck
import {
  isWebSocketCloseEvent,
} from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const users = new Map();
const userNames = new Map();
const availableUsers = new Map();

// This is called when user is connected
export default async function chat(ws) {
  const userId = v4.generate();

  // Give number of online users to the currently connected user
  ws.send(JSON.stringify({ event: "onlineUsers", count: users.size }));

  // Listening of WebSocket events
  for await (let data of ws) {
    data = typeof data === 'string' ? JSON.parse(data) : data;

    // If event is close,
    if (isWebSocketCloseEvent(data)) {
      users.delete(userId);
      userNames.delete(userId);
      availableUsers.delete(userId);
      broadcast({ event: "onlineUsers", count: users.size });
      break;
    }

    if (data.event === "join") {
      users.set(userId, ws);
      userNames.set(userId, data.nickname);
      availableUsers.set(userId, ws);
      broadcast({ event: "onlineUsers", count: users.size });
    }
  }
}

function broadcast(message) {
  for (const ws of users.values()) {
    ws.send(JSON.stringify(message));
  }
}
function sendExcept(message, exceptUserId) {
  for (const [id, ws] of users.entries()) {
    if (exceptUserId && exceptUserId === id) {
      continue;
    }
    ws.send(JSON.stringify(message));
  }
}
function sendUser(message, userId) {
  for (const [id, ws] of users.entries()) {
    console.log(id);
    if (userId === id) {
      ws.send(JSON.stringify(message));
    }
  }
}
