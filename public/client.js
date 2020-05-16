let ws;
let elOnlineUsers = document.querySelector('#onlineUserCount');
let btnNickname = document.querySelector('#sendNickName');
let inputNickname = document.querySelector('#inputNickname');

btnNickname.onclick = (ev) => {
  const data = {event: 'join', nickname: inputNickname.value};
  ws.send(JSON.stringify(data));
}

const onMessageReceive = (ev) => {
  const data = JSON.parse(ev.data);
  if (data.event === 'onlineUsers'){
    elOnlineUsers.innerHTML = data.count;
  }
}
window.addEventListener('DOMContentLoaded', () => {
  ws = new WebSocket(`ws://127.0.0.1:3000/ws`);
  ws.addEventListener('message', onMessageReceive);
})