import { Card } from "@mahjong/interfaces/Card";
import { PlayerIndex } from "@mahjong/interfaces/PlayerState";
import { isTakable } from "@mahjong/logic";
import { ActionInitiator } from "@mahjong/store";
import Server from "./decorators/Server.decorator";
import { BaseAction } from "./baseAction";

export class TakeAction extends BaseAction<
  ActionInitiator & {
    actioner: [Card, Card];
    actionee: Card;
    played: PlayerIndex;
  }
> {
  @Server
  tt() {
    const { state, action } = this;
    const { actioner, actionee, played, player } = action.payload;
    if (isTakable(actionee, state.hands[player])) {
      state.hands[played].junkyard.rawCards = state.hands[
        played
      ].junkyard.rawCards.filter((jCard) => jCard.id !== actionee.id);

      state.hands[player].junkyard.rawCards.push(actionee, ...actioner);
      state.hands[player].hand.rawCards = state.hands[
        player
      ].hand.rawCards.filter(
        (hCard) => hCard.id !== actioner[0].id && hCard.id !== actioner[0].id
      );
    }
  }
}
