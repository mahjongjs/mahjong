import { CardStack } from "./CardStack";

export type PlayerIndex = 0 | 1 | 2 | 3;
export interface PlayerState {
  playerIndex: PlayerIndex;
  hand: CardStack;
  junkyard: CardStack;
}
