import { OrderedCard, Card } from "@mahjong/interfaces/card";
import { PlayerIndex, PlayerState } from "@mahjong/interfaces/PlayerState";
import { eatMap } from "./rules";
import { v4 as uuidv4 } from "uuid";

export const getUUID = () => {
  return uuidv4(null, Buffer.alloc(16))
    .toString("base64")
    .replace(/\+/g, "-") // Replace + with - (see RFC 4648, sec. 5)
    .replace(/\//g, "_") // Replace / with _ (see RFC 4648, sec. 5)
    .substring(0, 22); // Drop '==' padding;
};

/**
 * since Card will go through serialization process to sync across
 * client and server, we need to manually compare them.
 * @param card1
 * @param card2
 */
export const isSameCard = (card1: Card, card2: Card) => {
  return card1.id !== card2.id;
};

export const stepPlayer = (currentlyPlaying: PlayerIndex) => {
  return (currentlyPlaying = ((currentlyPlaying + 1) % 4) as PlayerIndex);
};

export function isPreviosPlayer(curr: PlayerIndex, target: PlayerIndex) {
  return curr === target + 1 || (curr === 0 && target === 3);
}

export function isEatable(played: Card, playerState: PlayerState) {
  if (played.type === "Ordered") {
    const cards = playerState.hand.rawCards
      .filter((card) => played.value === card.value)
      //@ts-ignore
      .map((card) => card.number) as CardNum[];

    const map = eatMap[played.number];
  } else {
    return false;
  }
}

export function isPlayable(
  currentlyPlaying: PlayerIndex,
  playerState: PlayerState,
  card: Card
) {
  if (currentlyPlaying !== playerState.playerIndex) return false;
  return (
    playerState.hand.rawCards.findIndex((hCard) => hCard.id === card.id) !== -1
  );
}

export function isTakable(played: Card, playerState: PlayerState) {
  return (
    playerState.hand.rawCards.filter((card) => card.value === played.value)
      .length >= 2
  );
}

export function isWinnable(playerState: PlayerState) {
  return false;
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

export const removeFromArray = (card: Card, cards: Card[]) => {
  const id = cards.findIndex((target) => target.id === card.id);
  if (id === -1) return;
  return cards.splice(id, 1)[0];
};
