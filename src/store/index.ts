import { Card } from '@mahjong/interfaces/Card';
import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import {
  createSlice,
  configureStore,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {
  clientSyncMiddleware,
  pauseClientSync,
  resumeClientSync,
} from './middleware';
import { logger } from 'redux-logger';

export type ActionInitiator = {
  player: PlayerIndex;
};

import { initializeServerStore, ServerStoreData } from './initializeStoreData';
import getAction, { ChangePlayerAction, TakeAction } from './actions';
import {
  PlayAction,
  TakeFrontAction,
  TakeRearAction,
  EatAction,
} from './actions';
import isServer from '@mahjong/shared/isServer';
import { sortedIndex } from 'lodash';

export const isSpecialAndInterestingThunk = createAsyncThunk(
  'isSpecialAndInterestingThunk',
  () => {
    return {
      isSpecial: true,
      isInteresting: true,
    };
  }
);

export const spawnSession = (data?: ServerStoreData) => {
  const handSlice = createSlice({
    name: 'board',
    initialState: data || initializeServerStore(),

    reducers: {
      eat: getAction(EatAction).execute,
      take: getAction(TakeAction).execute,
      play: getAction(PlayAction).execute,
      takeFront: getAction(TakeFrontAction).execute,
      takeRear: getAction(TakeRearAction).execute,
      changePlayer: getAction(ChangePlayerAction).execute,
    },
    extraReducers: (builder) => {
      builder.addCase(
        isSpecialAndInterestingThunk.fulfilled,
        getAction(EatAction).execute
      );
    },
  });

  const store = configureStore({
    reducer: handSlice.reducer,
    middleware: (getDefaultMiddleware) => {
      const attachedMiddlewares = [];

      if (isServer()) {
        attachedMiddlewares.push(clientSyncMiddleware);
      } else {
        attachedMiddlewares.push();
      }

      return getDefaultMiddleware().concat(attachedMiddlewares);
    },
  });

  pauseClientSync();

  // 初始摸牌
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 4; j++) {
      store.dispatch(handSlice.actions.takeFront({ player: j as PlayerIndex }));
    }
  }

  store.dispatch(handSlice.actions.takeFront({ player: 0 as PlayerIndex }));

  resumeClientSync();

  return {
    actions: handSlice.actions,
    store,
  };
};
