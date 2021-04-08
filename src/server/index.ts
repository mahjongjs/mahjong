import 'tsconfig-paths/register';

import { spawnSession } from '@mahjong/store';
import { Server, Socket } from 'socket.io';
import { PayloadAction } from '@reduxjs/toolkit';
import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import { cloneDeep } from 'lodash';
const socketServer = new Server({ cors: { origin: '*' } });

const socketsMap: Map<PlayerIndex, Socket> = new Map();
let playerCount = 0;

socketServer.listen(3555);

socketServer.on('connection', (socket) => {
  if (playerCount >= 4) {
    return socket.disconnect(true);
  }

  playerCount++;

  const clientData = exportClientDatafor(playerCount as PlayerIndex);
  socket.send(clientData);
  socketsMap.set(playerCount as PlayerIndex, socket);
});

export const dispatchAction = (action: {
  recipients: PlayerIndex[];
  event: PayloadAction<any>;
}) => {
  action.recipients.map((recipient) => {});
  console.log(action);
};

const { actions, store } = spawnSession();

const exportClientDatafor = (playerIndex: PlayerIndex) => {
  const serverData = cloneDeep(store.getState());

  const hands = serverData.hands;

  for (let i = 0; i < 4; i++) {
    if (i !== playerIndex) {
      delete hands[i as PlayerIndex].hand;
    }
  }

  return {
    played: serverData.played,
    playerIndex,
    hands,
    table: serverData.table.length,
  };
};

export type ClientStoreType = ReturnType<typeof exportClientDatafor>;
