import { Card } from '@mahjong/interfaces/Card';
import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { clientSyncMiddleware } from './middleware';
import { logger } from 'redux-logger';
import { isEatable, isTakable, stepPlayer } from '@mahjong/logic';

import { initializeServerStore } from './initializeStoreData';

export const spawnSession = () => {
  const handSlice = createSlice({
    name: 'board',
    initialState: initializeServerStore(),
    reducers: {
      eat: (
        state,
        action: PayloadAction<{
          actioner: [Card, Card];
          you: PlayerIndex;
          actionee: Card;
          played: PlayerIndex;
        }>
      ) => {
        const { actionee, played, you, actioner } = action.payload;

        if (isEatable(actionee, state.hands[you])) {
        }
      },
      take: (
        state,
        action: PayloadAction<{
          actioner: [Card, Card];
          you: PlayerIndex;
          actionee: Card;
          played: PlayerIndex;
        }>
      ) => {
        const { actioner, actionee, played, you } = action.payload;

        if (isTakable(actionee, state.hands[you])) {
          state.hands[played].junkyard.rawCards = state.hands[
            played
          ].junkyard.rawCards.filter((jCard) => jCard.id !== actionee.id);

          state.hands[you].junkyard.rawCards.push(actionee, ...actioner);
          state.hands[you].hand.rawCards = state.hands[
            you
          ].hand.rawCards.filter(
            (hCard) =>
              hCard.id !== actioner[0].id && hCard.id !== actioner[0].id
          );
        }
      },
      play: (
        state,
        action: PayloadAction<{ player: PlayerIndex; card: Card }>
      ) => {},
      takeFront: (state, action: PayloadAction<PlayerIndex>) => {
        state.hands[action.payload].hand.rawCards.push(state.table.shift());
      },
      takeRear: (state, action: PayloadAction<PlayerIndex>) => {
        state.hands[action.payload].hand.rawCards.push(state.table.pop());
      },

      changePlayer: (state, action: PayloadAction<PlayerIndex>) => {
        if (!action.payload) {
          state.playerIndex = stepPlayer(state.playerIndex);
        }
        state.playerIndex = action.payload;
      },
    },
  });

  const store = configureStore({
    reducer: handSlice.reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(clientSyncMiddleware, logger),
  });

  // 初始摸牌
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 4; j++) {
      store.dispatch(handSlice.actions.takeFront(j as PlayerIndex));
    }
  }

  store.dispatch(handSlice.actions.takeFront(0 as PlayerIndex));

  return {
    actions: handSlice.actions,
    store,
  };
};

// applyMiddleware()
