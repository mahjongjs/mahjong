import {
  Card,
  UnorderedWord,
  OrderedWord,
  CardNum,
} from "@mahjong/interfaces/Card";
import { PlayerIndex, PlayerState } from "@mahjong/interfaces/PlayerState";
import { getUUID } from "@mahjong/logic";
import { shuffle } from "lodash";

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
  const cards: Array<Card> = [];

  Object.keys(UnorderedWord).forEach((key) => {
    for (let i = 0; i < 4; i++) {
      cards.push({
        value: key as UnorderedWord,
        type: "Unordered",
        id: getUUID(),
      });
    }
  });

  Object.keys(OrderedWord).forEach((key) => {
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 4; j++) {
        cards.push({
          value: key as OrderedWord,
          number: i as CardNum,
          type: "Ordered",
          id: getUUID(),
        });
      }
    }
  });

  return shuffle(cards);
};

export const initializeServerStore = () => {
  return {
    playerIndex: 0 as PlayerIndex,
    hands: {
      0: initPlayerHand(0),
      1: initPlayerHand(1),
      2: initPlayerHand(2),
      3: initPlayerHand(3),
    },
    table: initCards(),
    played: [] as Card[],
  };
};

export type ServerStoreData = ReturnType<typeof initializeServerStore>;
