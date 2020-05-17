let ws;
let elOnlineUsers = document.querySelector('#onlineUserCount');
let btnNickname = document.querySelector('#sendNickName');
let inputNickname = document.querySelector('#inputNickname');

btnNickname.onclick = (ev) => {
  const data = {event: 'join', nickname: inputNickname.value};
  ws.send(JSON.stringify(data));
  inputNickname.value = '';
}

const onMessageReceive = (ev) => {
  console.log("Event received ", ev);
  const data = JSON.parse(ev.data);
  if (data.event === 'onlineUsers'){
    elOnlineUsers.innerHTML = data.count;
  }
}
window.addEventListener('DOMContentLoaded', () => {
  ws = new WebSocket(`ws://localhost:3000/ws`);
  ws.addEventListener('message', onMessageReceive);
})