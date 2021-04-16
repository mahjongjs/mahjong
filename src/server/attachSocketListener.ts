import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import { isPlayable } from '@mahjong/logic';
import { ClientDTO } from '@mahjong/shared/event.dto';

import {
  ACTION_ACK,
  DISPATCH_SERVER_ACTION,
  DUMP_DATA,
  INIT_STORE_DATA,
  SEND_TICKET,
} from '@mahjong/shared/eventDefs';
import { cloneDeep } from 'lodash';
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

  socket.on(DISPATCH_SERVER_ACTION, (action: ClientDTO) => {
    switch (action.type) {
      case 'play': {
        const { playerIndex, hands } = storeService.store.store.getState();

        if (isPlayable(playerIndex, hands[id], action.card)) {
          sessionManager.getSocket(id).emit(ACTION_ACK);
          storeService.store.store.dispatch(
            storeService.store.actions.play({
              player: id,
              card: action.card,
            })
          );
        } else {
          loggingService.error('invalid action.');
        }
      }
      case 'eat': {
        // storeService.store.actions.eat({
        //   actioner: {},
        //   actionee: {},
        //   played: id,
        // });
      }
    }
  });
};
export default attachSocketListener;
