import { ActionInitiator } from "@mahjong/store";
import Server from "./decorators/Server.decorator";
import { BaseAction } from "./baseAction";

export class TakeRearAction extends BaseAction<ActionInitiator> {
  @Server
  tt() {
    const { state, action } = this;
    const { player } = action.payload;
    state.hands[player].hand.rawCards.push(state.table.pop());
  }
}
