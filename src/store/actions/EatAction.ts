import { Card } from "@mahjong/interfaces/Card";
import { PlayerIndex } from "@mahjong/interfaces/PlayerState";
import { isEatable } from "@mahjong/logic";
import Server from "./decorators/Server.decorator";
import { BaseAction } from "./baseAction";

export class EatAction extends BaseAction<{
  actioner: [Card, Card];
  you: PlayerIndex;
  actionee: Card;
  played: PlayerIndex;
}> {
  @Server
  wear() {
    const { state, action } = this;
    const { actionee, played, you, actioner } = action.payload;
    if (isEatable(actionee, state.hands[you])) {
    }
  }
}
