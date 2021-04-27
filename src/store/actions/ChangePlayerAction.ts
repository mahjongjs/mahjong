import { stepPlayer } from "@mahjong/logic";
import { ActionInitiator } from "@mahjong/store";
import Server from "./decorators/Server.decorator";
import { BaseAction } from "./baseAction";

export class ChangePlayerAction extends BaseAction<ActionInitiator> {
  @Server
  tt() {
    const { state, action } = this;
    if (!action.payload) {
      state.playerIndex = stepPlayer(state.playerIndex);
    }
    state.playerIndex = action.payload.player;
  }
}
