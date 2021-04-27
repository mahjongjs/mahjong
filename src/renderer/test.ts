import { PlayerIndex } from "@mahjong/interfaces/PlayerState";
import {
  DISPATCH_CLIENT_ACTION,
  DISPATCH_SERVER_ACTION,
  DUMP_DATA,
  INIT_STORE_DATA,
  SEND_TICKET,
} from "@mahjong/shared/eventDefs";
import { ServerStoreData } from "@mahjong/store/initializeStoreData";
import { io } from "socket.io-client";
import { ActionInitiator, spawnSession } from "@mahjong/store";
import { PayloadAction } from "@reduxjs/toolkit";

const p0 = io("ws://localhost:3555", {
  auth: {
    // sessionId: localStorage.getItem(`player${0}`) || "",
  },
});
const p1 = io("ws://localhost:3555", {
  auth: {
    // sessionId: localStorage.getItem(`player${1}`) || "",
  },
});

const p2 = io("ws://localhost:3555", {
  auth: {
    // sessionId: localStorage.getItem(`player${2}`) || "",
  },
});
const p3 = io("ws://localhost:3555", {
  auth: {
    // sessionId: localStorage.getItem(`player${3}`) || "",
  },
});

const arr = [p0, p1, p2, p3];

arr.map((socket, index: PlayerIndex) => {
  socket.on(SEND_TICKET, (ticket) => {
    console.log(`player ${index} ticket: ${ticket}`);
    // localStorage.setItem(`player${index}`, ticket);
  });

  socket.emit(DUMP_DATA);

  socket.on(INIT_STORE_DATA, (data: ServerStoreData) => {
    const store = spawnSession(data);

    socket.on(
      DISPATCH_CLIENT_ACTION,
      (action: PayloadAction<ActionInitiator>) => {
        store.store.dispatch(action);
      }
    );

    const btn = document.createElement("button");

    btn.textContent = "play " + index.toString();

    document.body.appendChild(btn);
    btn.addEventListener("click", () => {
      const action = store.actions.play({
        card: store.store.getState().hands[index].hand.rawCards[0],
        player: index as PlayerIndex,
      });

      socket.emit(DISPATCH_SERVER_ACTION, action, (response) => {
        response.status === "ok" && store.store.dispatch(action);
      });
    });
  });
});
