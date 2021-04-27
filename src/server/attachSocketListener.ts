import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import {
  DISPATCH_SERVER_ACTION,
  DUMP_DATA,
  INIT_STORE_DATA,
  SEND_TICKET,
} from '@mahjong/shared/eventDefs';
import { ActionInitiator } from '@mahjong/store';
import { PayloadAction } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
import { Socket } from 'socket.io';
import container from './container';
import { ILoggingService, LoggerService } from './LoggingService';
import { ISessionService } from './SessionService';
import { IStoreService } from './StoreService';
import tokens from './tokens';

const storeService = container.get<IStoreService>(tokens.StoreService);
const loggingService = container.get<ILoggingService>(tokens.LoggingService);

const exportClientDatafor = (playerIndex: PlayerIndex) => {
  const serverData = cloneDeep(storeService.store.store.getState());

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

const attachSocketListener = (
  socket: Socket,
  sessionManager: ISessionService,
  id: PlayerIndex
) => {
  socket.on('disconnect', () => {
    console.log(`${id} disconnected!`);
    sessionManager.deleteSocket(id);
  });

  socket.join('all');
  socket.join(id.toString());
  socket.on(DUMP_DATA, () =>
    socket.emit(INIT_STORE_DATA, exportClientDatafor(id))
  );
  socket.emit(SEND_TICKET, sessionManager.getIdFromIndex(id));

  socket.on(
    DISPATCH_SERVER_ACTION,
    (action: PayloadAction<ActionInitiator>, callback) => {
      if (action.payload.player !== id)
        return callback({ status: 'unauthorized' });
      storeService.store.store.dispatch(action);
      callback({ status: 'ok' });
    }
  );
};
export default attachSocketListener;
