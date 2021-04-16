import { ClientDTO, EatDTO } from "@mahjong/shared/event.dto";
import { DISPATCH_SERVER_ACTION } from "@mahjong/shared/eventDefs";
import { Socket } from "socket.io-client";

export default (action: ClientDTO, socket: Socket): ClientDTO is EatDTO => {
  socket.emit(DISPATCH_SERVER_ACTION, action);
};
