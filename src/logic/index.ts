import { OrderedCard, Card } from '@mahjong/interfaces/card';
import { PlayerIndex, PlayerState } from '@mahjong/interfaces/PlayerState';
import { eatMap } from './rules';

export const stepPlayer = (currentlyPlaying: PlayerIndex) => {
  return (currentlyPlaying = ((currentlyPlaying + 1) % 4) as PlayerIndex);
};

export function isPreviosPlayer(curr: PlayerIndex, target: PlayerIndex) {
  return curr === target + 1 || (curr === 0 && target === 3);
}

export function isEatable(played: Card, playerState: PlayerState) {
  if (played.type === 'Ordered') {
    const cards = playerState.hand.rawCards
      .filter((card) => played.value === card.value)
      //@ts-ignore
      .map((card) => card.number) as CardNum[];

    const map = eatMap[played.number];
  } else {
    return false;
  }
}

export function isTakable(played: Card, playerState: PlayerState) {
  return (
    playerState.hand.rawCards.filter((card) => card.value === played.value)
      .length >= 2
  );
}

export const isInterceptable = (
  played: Card,
  playerState: PlayerState,
  playedIndex: PlayerIndex
) => {
  if (isPreviosPlayer(playerState.playerIndex, playedIndex)) {
    return isEatable(played, playerState) || isTakable(played, playerState);
  } else {
    return isTakable(played, playerState);
  }
};
