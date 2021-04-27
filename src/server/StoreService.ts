import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import { DISPATCH_CLIENT_ACTION } from '@mahjong/shared/eventDefs';
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

  dispatchAction = (action: PayloadAction<ActionInitiator & {}>) => {
    // action.recipients.map((recipient) => {
    const { payload } = action;

    this.sessionService
      .getSocket(payload.player)
      // since the action initiator will get an ACK package to initiate change
      // for itself, we only broadcast for others.
      .to('all')
      .emit(DISPATCH_CLIENT_ACTION, action);
    // });
  };
}
