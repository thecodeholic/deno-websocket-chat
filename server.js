import { acceptWebSocket, acceptable } from "https://deno.land/std@0.63.0/ws/mod.ts";
import { Application } from 'https://deno.land/x/abc@v1/mod.ts'
import chat from "./chat.js";

const app = new Application()

const websocket = async (c) => {
  if (acceptable(c.request)) {
    if (c.request.method === "GET" && c.request.url === "/ws") {
      const { conn, headers, r: bufReader, w: bufWriter } = c.request;
    
      const ws = await acceptWebSocket({
        conn,
        headers,
        bufReader,
        bufWriter,
      });
    
      await chat(ws);
    }
  }
};

app
  .get('/ws', websocket)
  .static('/', 'public')
  .file('/', 'public/chat.html')
  .start({ port: 3000 })

console.log("Server started on port 3000");
