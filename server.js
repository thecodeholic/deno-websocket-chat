import { listenAndServe } from "https://deno.land/std@0.58.0/http/server.ts";
import { acceptWebSocket, acceptable } from "https://deno.land/std@0.58.0/ws/mod.ts";
import chat from "./chat.js";

listenAndServe({ port: 3000 }, async (req) => {
  if (req.method === "GET" && req.url === "/ws") {
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers,
      }).then(chat);
    }
  }
});
console.log("Server started on port 3000");
