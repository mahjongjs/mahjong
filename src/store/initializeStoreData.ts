import { Card, UnorderedWord, OrderedWord } from '@mahjong/interfaces/Card';
import { PlayerIndex, PlayerState } from '@mahjong/interfaces/PlayerState';
import { shuffle } from 'lodash';

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
      //@ts-ignore
      cards.push({ value: key });
    }
  });

  Object.keys(OrderedWord).forEach((key) => {
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 4; j++) {
        //@ts-ignore
        cards.push({ value: key, number: i });
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
