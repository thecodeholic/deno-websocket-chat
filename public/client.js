// @ts-nocheck
let ws;
let chatUsersCtr = document.querySelector("#chatUsers");

window.addEventListener("DOMContentLoaded", () => {
  ws = new WebSocket(`ws://localhost:3000/ws`);
  ws.addEventListener("open", onConnectionOpen);
  ws.addEventListener("message", onMessageReceive);
});

function onConnectionOpen() {
  const queryParams = getQueryParams();
  console.log(queryParams);
  if (!queryParams.group || !queryParams.name) {
    window.location.href = 'chat.html';
  }
  emitEvent(
    { event: "join", groupName: queryParams.group, name: queryParams.name },
    ws,
  );
}

function onMessageReceive(event) {
  console.log(event);
  const data = JSON.parse(event.data);
  switch (data.event) {
    case "users":
      const users = data.data;
      chatUsersCtr.innerHTML = '';
      users.forEach((u) => {
        const userEl = document.createElement("div");
        userEl.className = "chat-user";
        userEl.innerHTML = u.name;
        chatUsersCtr.appendChild(userEl);
      });
      break;
  }
}

function getQueryParams() {
  const queryStr = window.location.search.substring(1);
  const pairs = queryStr.split("&");
  const obj = {};
  for (let p of pairs) {
    const parts = p.split("=");
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }
  return obj;
}

function emitEvent(obj, ws) {
  ws.send(JSON.stringify(obj));
}
