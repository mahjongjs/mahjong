import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import { ActionInitiator, spawnSession } from '@mahjong/store';
import { PayloadAction } from '@reduxjs/toolkit';
import { inject, injectable } from 'inversify';
import { ISessionService } from './SessionService';
import tokens from './tokens';

export interface IStoreService {
  store: ReturnType<typeof spawnSession>;
  dispatchAction(action: {
    recipients?: PlayerIndex[];
    event: PayloadAction<any>;
  }): void;
}
@injectable()
export class StoreService {
  public store = spawnSession();
  @inject(tokens.SessionService) sessionService: ISessionService;

  dispatchAction = (action: {
    recipients?: PlayerIndex[];
    event: PayloadAction<ActionInitiator & {}>;
  }) => {
    // action.recipients.map((recipient) => {
    this.sessionService
      .getSocket(action.event.payload.player)
      .to('all')
      .emit('eee', action.event);
    // });
  };
}
