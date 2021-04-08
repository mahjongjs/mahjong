import { io } from "socket.io-client";

io("ws://localhost:3555", {
  auth: { token: "123" },
});
console.log("object");
