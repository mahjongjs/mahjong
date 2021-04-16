import { Card } from "@mahjong/interfaces/Card";
import { PlayerIndex } from "@mahjong/interfaces/PlayerState";
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

import { logger } from "redux-logger";
import {
  isEatable,
  isPlayable,
  isTakable,
  removeFromArray,
  stepPlayer,
} from "@mahjong/logic";
import { ServerStoreData } from "@mahjong/store/initializeStoreData";

export type ActionInitiator = {
  player: PlayerIndex;
};

export const spawnSession = (data: ServerStoreData) => {
  const handSlice = createSlice({
    name: "board",
    initialState: data,
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
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  });

  return {
    actions: handSlice.actions,
    store,
  };
};
