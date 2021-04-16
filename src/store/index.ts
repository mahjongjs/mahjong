import { Card } from '@mahjong/interfaces/Card';
import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import {
  clientSyncMiddleware,
  pauseClientSync,
  resumeClientSync,
} from './middleware';
import { logger } from 'redux-logger';
import {
  isEatable,
  isPlayable,
  isTakable,
  removeFromArray,
  stepPlayer,
} from '@mahjong/logic';

export type ActionInitiator = {
  player: PlayerIndex;
};

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
        action: PayloadAction<
          ActionInitiator & {
            actioner: [Card, Card];

            actionee: Card;
            played: PlayerIndex;
          }
        >
      ) => {
        const { actioner, actionee, played, player } = action.payload;

        if (isTakable(actionee, state.hands[player])) {
          state.hands[played].junkyard.rawCards = state.hands[
            played
          ].junkyard.rawCards.filter((jCard) => jCard.id !== actionee.id);

          state.hands[player].junkyard.rawCards.push(actionee, ...actioner);
          state.hands[player].hand.rawCards = state.hands[
            player
          ].hand.rawCards.filter(
            (hCard) =>
              hCard.id !== actioner[0].id && hCard.id !== actioner[0].id
          );
        }
      },
      play: (
        state,
        action: PayloadAction<ActionInitiator & { card: Card }>
      ) => {
        // already sanitized!
        const { player, card } = action.payload;
        const removed = removeFromArray(
          card,
          state.hands[player].hand.rawCards
        );
        if (removed) state.hands[player].junkyard.rawCards.push(removed);
      },
      takeFront: (state, action: PayloadAction<ActionInitiator>) => {
        const { player } = action.payload;
        state.hands[player].hand.rawCards.push(state.table.shift());
      },
      takeRear: (state, action: PayloadAction<ActionInitiator>) => {
        const { player } = action.payload;
        state.hands[player].hand.rawCards.push(state.table.pop());
      },

      changePlayer: (state, action: PayloadAction<ActionInitiator>) => {
        if (!action.payload) {
          state.playerIndex = stepPlayer(state.playerIndex);
        }
        state.playerIndex = action.payload.player;
      },
    },
  });

  const store = configureStore({
    reducer: handSlice.reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(clientSyncMiddleware),
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

// applyMiddleware()
