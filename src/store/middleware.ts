import container from '@mahjong/server/container';
import { IStoreService } from '@mahjong/server/StoreService';
import tokens from '@mahjong/server/tokens';
import { PayloadAction } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { ActionInitiator } from '.';

let paused = false;
export const pauseClientSync = () => (paused = true);
export const resumeClientSync = () => (paused = false);

export const clientSyncMiddleware: Middleware = ({ dispatch, getState }) => {
  return (next) => (event: PayloadAction<ActionInitiator>) => {
    next(event);

    if (!paused) {
      const storeService = container.get<IStoreService>(tokens.StoreService);
      !paused && storeService.dispatchAction({ event });
    }

    //dispatch action给客户端
  };
};
