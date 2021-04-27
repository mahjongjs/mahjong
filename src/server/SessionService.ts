import { PlayerIndex } from "@mahjong/interfaces/PlayerState";
import { getUUID } from "@mahjong/logic";
import { inject, injectable } from "inversify";
import { Socket } from "socket.io";
import { ILoggingService } from "./LoggingService";
import tokens from "./tokens";

export interface ISessionService {
  setSocket(key: PlayerIndex | string, socket: Socket): void;
  getSocket(key: PlayerIndex | string): Socket;
  getIndexFromId(id: string): PlayerIndex;
  getIdFromIndex(index: PlayerIndex): string;
  deleteSocket(key: PlayerIndex | string): void;
  getCount(): number;
  empty(): void;
}

@injectable()
export class SessionService implements ISessionService {
  private map: Map<PlayerIndex, Socket> = new Map();
  private indexToId: Map<PlayerIndex, string> = new Map();
  private idToIndex: Map<string, PlayerIndex> = new Map();

  @inject(tokens.LoggingService) logger: ILoggingService;

  public empty() {
    this.map.clear();
    this.indexToId.clear();
    this.idToIndex.clear();
  }

  public setSocket(key: PlayerIndex | string, socket: Socket) {
    if (typeof key === "string") {
      const index = this.idToIndex.get(key);
      this.map.set(index, socket);
    } else {
      this.map.set(key, socket);
      const uuid = getUUID();
      this.indexToId.set(key, uuid);
      this.idToIndex.set(uuid, key);
    }
  }

  public getSocket(key: PlayerIndex | string) {
    if (typeof key === "string") {
      return this.map.get(this.idToIndex.get(key));
    } else {
      return this.map.get(key);
    }
  }

  public getIndexFromId(id: string) {
    return this.idToIndex.get(id);
  }

  public getIdFromIndex(index: PlayerIndex) {
    return this.indexToId.get(index);
  }
  public deleteSocket(key: PlayerIndex | string) {
    this.logger.warn("socket deleted");
    if (typeof key === "string") {
      const index = this.idToIndex.get(key);
      this.map.delete(index);
    } else {
      this.map.delete(key);
    }
  }

  public getCount() {
    return this.map.entries.length;
  }
}
