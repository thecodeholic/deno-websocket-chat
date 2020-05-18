// @ts-nocheck
import { isWebSocketCloseEvent } from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

/**
 * userId: {
 *    name: string,
 *    groupName: string,
 *    ws: WebSocket
 * }
 */
const usersMap = new Map();
/**
 * groupName: [user1, user2]
 * 
 * user  --- {
 *    userId: string,
 *    name: string,
 *    ws: WebSocket
 * }
 */
const groupsMap = new Map();

// This is called when user is connected
export default async function chat(ws) {
  // Generate unique userId
  const userId = v4.generate();

  // Listening of WebSocket events
  for await (let data of ws) {
    data = typeof data === "string" ? JSON.parse(data) : data;

    // If event is close,
    if (isWebSocketCloseEvent(data)) {
      // Take out user from usersMap
      const userObj = usersMap.get(userId);
      if (!userObj) {
        break;
      }
      console.log(`User left`);
      // Take out users from groupsMap
      let users = groupsMap.get(userObj.groupName);
      console.log(`Users in group ${userObj.groupName}. ${users.length}`);
      // If users exist remove current user from users and write users back into groupsMap
      if (users) {
        console.log("Removing user");
        users = users.filter(u => u.userId !== userId);
        console.log(`After remove ${users.length}`);
        groupsMap.set(userObj.groupName, users);
      }
      // Remove userId from usersMap
      usersMap.delete(userId);
      console.log(`User left. emitting...`);
      // Emit to remaining users updated list of users
      emitUsers(userObj.groupName);
      break;
    }

    // Check received data.event
    switch (data.event) {
      // If it is join
      case "join":
        // Create userObj with ws, groupName and name
        const userObj = {
          userId,
          ws,
          groupName: data.groupName,
          name: data.name,
        };
        // Put userObj inside usersMap
        usersMap.set(userId, userObj);

        // Take out users from groupsMap
        const users = groupsMap.get(data.groupName) || [];
        users.push(userObj);
        groupsMap.set(data.groupName, users);
        console.log(`User joined. emitting...`);
        // Emit to all users in this group that new user joined.
        emitUsers(data.groupName);
        break;
    }
  }
}

function emitUsers(groupName) {
  // Get users from groupsMap
  const users = groupsMap.get(groupName);
  // Iterate over users and send list of users to every user in the group
  for (const user of users) {
    user.ws.send(
      JSON.stringify({ event: "users", data: getDisplayUsers(groupName) }),
    );
  }
}

function getDisplayUsers(groupName) {
  const users = groupsMap.get(groupName) || [];
  return users
    .map(u => {
      return {
        userId: u.id,
        name: u.name,
      };
    });
}
