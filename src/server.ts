import mongoose from "mongoose";
import { createApp } from "./app";
import http from "node:http";
const app = createApp();
const server = http.createServer(app);

server.listen(3000, () => console.log("Server is eunning on port 3000"));
async function shutdown() {
  mongoose.disconnect();
  server.close();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
