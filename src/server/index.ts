import 'tsconfig-paths/register';
import 'reflect-metadata';
import './container';
import { Server } from 'socket.io';
import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import attachSocketListener from './attachSocketListener';
import container from './container';
import { ISessionService } from './SessionService';
import tokens from './tokens';
import { ILoggingService } from './LoggingService';
const socketServer = new Server({ cors: { origin: '*' } });

let playerCount = 0;

socketServer.listen(3555);
const sessionManager = container.get<ISessionService>(tokens.SessionService);
const loggerService = container.get<ILoggingService>(tokens.LoggingService);

socketServer.on('connection', (socket) => {
  const sessionId = socket.handshake.auth.sessionId as string;

  if (playerCount >= 4 && !sessionId) {
    if (sessionManager.getCount() === 0) {
      playerCount = 0;
      // sessionManager.empty();
      loggerService.info('restarted');
    } else {
      loggerService.warn('player full');
      return socket.disconnect(true);
    }
  }

  if (sessionId) {
    const loaded = sessionManager.getSocket(sessionId);
    if (!loaded) {
      socket.disconnect(true);
    } else {
      loaded.disconnect();
      sessionManager.setSocket(sessionId, socket);
      attachSocketListener(
        socket,
        sessionManager,
        sessionManager.getIndexFromId(sessionId)
      );
    }
  } else {
    const id: PlayerIndex = playerCount++ as PlayerIndex;
    sessionManager.setSocket(id, socket);
    attachSocketListener(socket, sessionManager, id);
    loggerService.info(`player ${id} connected!`);
  }
});
