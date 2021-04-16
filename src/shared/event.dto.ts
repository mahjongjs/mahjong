import { Card } from "@mahjong/interfaces/Card";

export interface PlayDTO {
  type: "play";
  card: Card;
}

export interface EatDTO {
  type: "eat";
  card: Card;
}
export type ClientDTO = EatDTO | PlayDTO;
