import { Card } from "@mahjong/interfaces/Card";
import { removeFromArray } from "@mahjong/logic";
import { ActionInitiator } from "@mahjong/store";
import Server from "./decorators/Server.decorator";
import { BaseAction } from "./baseAction";
import Client from "./decorators/Client.decorator";

export class PlayAction extends BaseAction<ActionInitiator & { card: Card }> {
  @Server
  wear() {
    const { state, action } = this;
    const { player, card } = action.payload;
    const removed = removeFromArray(card, state.hands[player].hand.rawCards);
    if (removed) state.hands[player].junkyard.rawCards.push(removed);
  }

  @Client
  tt() {
    const { state, action } = this;
    const { player, card } = action.payload;
    const removed = removeFromArray(card, state.hands[player].hand.rawCards);
    if (removed) state.hands[player].junkyard.rawCards.push(removed);
  }
}
