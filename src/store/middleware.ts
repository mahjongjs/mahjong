/* SERVER-START */
import container from '@mahjong/server/container';
import { IStoreService } from '@mahjong/server/StoreService';
import tokens from '@mahjong/server/tokens';
/* SERVER-END */
import { PayloadAction } from '@reduxjs/toolkit';
import { Middleware } from 'redux';

let paused = false;
export const pauseClientSync = () => (paused = true);
export const resumeClientSync = () => (paused = false);

export const clientSyncMiddleware: Middleware = ({ dispatch, getState }) => {
  return (next) => (event: PayloadAction<any>) => {
    next(event);

    /* SERVER-START */
    if (!paused) {
      //dispatch action给客户端
      const storeService = container.get<IStoreService>(tokens.StoreService);
      !paused && storeService.dispatchAction({ event });
    }
    /* SERVER-END */
  };
};
