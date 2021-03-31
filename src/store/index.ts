import {
  Card,
  OrderedCard,
  OrderedWord,
  UnorderedWord,
  CardNum,
} from '@mahjong/interfaces/Card';
import { PlayerIndex, PlayerState } from '@mahjong/interfaces/PlayerState';
import {
  createSlice,
  configureStore,
  applyMiddleware,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { clientSyncMiddleware } from './middleware';
import { logger } from 'redux-logger';
import { stepPlayer } from '@mahjong/logic';
const initPlayerHand: (playerIndex: PlayerIndex) => PlayerState = (
  playerIndex
) => {
  return {
    hand: {
      rawCards: [],
    },
    playerIndex,
    junkyard: { rawCards: [] },
  };
};

const initCards: () => Card[] = () => {
  const cards = [];

  Object.keys(UnorderedWord).forEach((key) => {
    for (let i = 0; i < 4; i++) {
      cards.push(new Card(key as UnorderedWord));
    }
  });

  Object.keys(OrderedWord).forEach((key) => {
    for (let i = 1; i <= 9; i++) {
      cards.push(new OrderedCard(key as OrderedWord, i as CardNum));
    }
  });

  return cards;
};

export const spawnSession = () => {
  const handSlice = createSlice({
    name: 'board',
    initialState: {
      playerIndex: 0 as PlayerIndex,
      hands: {
        0: initPlayerHand(0),
        1: initPlayerHand(1),
        2: initPlayerHand(2),
        3: initPlayerHand(3),
      },
      table: initCards(),
    },
    reducers: {
      eat: (state, { type, payload }) => {},
      take: (state, { type, payload }) => {},

      takeFront: (state, { type, payload: playerIndex }) => {
        console.log(playerIndex);

        state.hands[playerIndex];
        state.table.shift();
      },
      takeRear: (state, { type, payload: playerIndex }) => {
        state.table.pop();
      },

      changePlayer: (state, { type, payload }) => {
        if (!payload) {
          state.playerIndex = stepPlayer(state.playerIndex);
        }
        state.playerIndex = payload;
      },
    },
  });

  return {
    actions: handSlice.actions,
    store: configureStore({
      reducer: handSlice.reducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(clientSyncMiddleware),
    }),
  };
};

// applyMiddleware()
